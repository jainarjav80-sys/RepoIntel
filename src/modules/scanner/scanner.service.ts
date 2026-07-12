import { Injectable, ExecutionContext, Inject } from '@nitrostack/core';
import * as fs from 'fs';
import * as path from 'path';
import { GitService, RepositoryInfo } from '../../services/git.service.js';

export interface Commit {
  hash: string;
  message: string;
  author: string;
  date: string;
  diffStats: {
    additions: number;
    deletions: number;
    filesChanged: number;
  };
  sensitiveFiles: string[];
  imageUrl: string;
}

const SENSITIVE_FILE_PATTERNS = [
  /\.env/,
  /package\.json/,
  /package-lock\.json/,
  /migrations\//,
  /config\//,
  /secrets/,
  /credentials/,
  /private\.key/,
  /\.pem$/
];

@Injectable({ deps: [GitService] })
export class ScannerService {
  constructor(private gitService: GitService) {}
  /**
   * Load mock commits from fixtures/commits.json
   */
  loadMockCommits(): Commit[] {
    try {
      const fixturesPath = path.join(process.cwd(), 'fixtures', 'commits.json');
      const data = fs.readFileSync(fixturesPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  /**
   * Validate a repository connection
   */
  validateRepository(repoPath: string): RepositoryInfo {
    return this.gitService.validateRepository(repoPath);
  }

  /**
   * Get recent commits from a repository (real git or fixtures)
   */
  getRecentCommits(repoPath?: string, limit: number = 10): Commit[] {
    return this.gitService.getRecentCommits(repoPath, limit);
  }

  /**
   * Calculate risk score for a commit (0-100)
   * Factors:
   * - Message quality (length, clarity)
   * - Diff size (additions + deletions)
   * - Sensitive file changes
   */
  calculateRiskScore(commit: Commit): number {
    let score = 0;

    // Factor 1: Message quality (0-20 points)
    const messageLength = commit.message.length;
    if (messageLength < 10) {
      score += 20; // Very poor message
    } else if (messageLength < 20) {
      score += 15; // Poor message
    } else if (messageLength < 50) {
      score += 5; // Acceptable message
    } else {
      score += 0; // Good message
    }

    // Factor 2: Diff size (0-40 points)
    const totalChanges = commit.diffStats.additions + commit.diffStats.deletions;
    if (totalChanges > 1000) {
      score += 40; // Massive change
    } else if (totalChanges > 500) {
      score += 30; // Large change
    } else if (totalChanges > 200) {
      score += 15; // Medium change
    } else if (totalChanges > 50) {
      score += 5; // Small change
    }

    // Factor 3: Sensitive file changes (0-40 points)
    if (commit.sensitiveFiles.length > 0) {
      const sensitiveCount = commit.sensitiveFiles.length;
      if (sensitiveCount >= 3) {
        score += 40; // Multiple sensitive files
      } else if (sensitiveCount === 2) {
        score += 30; // Two sensitive files
      } else {
        score += 20; // One sensitive file
      }
    }

    return Math.min(score, 100);
  }

  /**
   * Get reasoning for a risk score
   */
  getRiskReasoning(commit: Commit, score: number): string[] {
    const reasons: string[] = [];

    const messageLength = commit.message.length;
    if (messageLength < 20) {
      reasons.push(`Poor commit message (${messageLength} chars)`);
    }

    const totalChanges = commit.diffStats.additions + commit.diffStats.deletions;
    if (totalChanges > 500) {
      reasons.push(`Large diff size (${totalChanges} total changes)`);
    }

    if (commit.sensitiveFiles.length > 0) {
      reasons.push(`Modifies sensitive files: ${commit.sensitiveFiles.join(', ')}`);
    }

    if (reasons.length === 0) {
      reasons.push('Low-risk commit');
    }

    return reasons;
  }

  /**
   * Find commits by hash
   */
  findCommitByHash(hash: string, repoPath?: string): Commit | null {
    return this.gitService.findCommitByHash(hash, repoPath);
  }

  /**
   * Get risky commits above a threshold
   */
  getRiskyCommits(repoPath?: string, threshold: number = 60): Array<Commit & { riskScore: number }> {
    const allCommits = this.gitService.getAllCommits(repoPath);
    return allCommits
      .map(commit => ({
        ...commit,
        riskScore: this.calculateRiskScore(commit)
      }))
      .filter(c => c.riskScore >= threshold)
      .sort((a, b) => b.riskScore - a.riskScore);
  }

  /**
   * Generate a risk report for a repository
   */
  generateRiskReport(repoPath?: string): {
    repoPath: string;
    totalCommits: number;
    highRiskCount: number;
    topRiskyCommits: Array<Commit & { riskScore: number; reasoning: string[] }>;
    averageRiskScore: number;
  } {
    const allCommits = this.gitService.getAllCommits(repoPath);
    const scoredCommits = allCommits.map(commit => ({
      ...commit,
      riskScore: this.calculateRiskScore(commit)
    }));

    const highRiskCount = scoredCommits.filter(c => c.riskScore >= 60).length;
    const averageRiskScore =
      scoredCommits.reduce((sum, c) => sum + c.riskScore, 0) / scoredCommits.length;

    const topRiskyCommits = scoredCommits
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 10)
      .map(commit => ({
        ...commit,
        reasoning: this.getRiskReasoning(commit, commit.riskScore)
      }));

    return {
      repoPath: repoPath || 'fixtures',
      totalCommits: allCommits.length,
      highRiskCount,
      topRiskyCommits,
      averageRiskScore: Math.round(averageRiskScore * 100) / 100
    };
  }
}
