import { Injectable, Inject } from '@nitrostack/core';
import { GitService, Commit } from '../../services/git.service.js';
import { RiskScorerService } from '../../services/risk-scorer.service.js';

@Injectable({ deps: [GitService, RiskScorerService] })
export class RepositoryService {
  constructor(
    private gitService: GitService,
    private riskScorerService: RiskScorerService
  ) {}

  /**
   * Analyze a specific commit
   */
  analyzeCommit(commitHash: string, repoPath?: string) {
    const commit = this.gitService.findCommitByHash(commitHash, repoPath);
    
    if (!commit) {
      throw new Error(`Commit ${commitHash} not found`);
    }

    const riskScore = this.riskScorerService.calculateRiskScore(commit);
    const riskReasons = this.riskScorerService.getRiskReasoning(commit, riskScore);

    // Generate summary
    const summary = this.generateCommitSummary(commit, riskScore);

    return {
      commit_hash: commit.hash,
      summary,
      files_changed: commit.sensitiveFiles,
      lines_added: commit.diffStats.additions,
      lines_removed: commit.diffStats.deletions,
      risk_score: riskScore,
      risk_reasons: riskReasons
    };
  }

  /**
   * Generate a human-readable summary of a commit
   */
  private generateCommitSummary(commit: Commit, riskScore: number): string {
    const riskLevel = riskScore >= 70 ? 'HIGH' : riskScore >= 40 ? 'MEDIUM' : 'LOW';
    const totalChanges = commit.diffStats.additions + commit.diffStats.deletions;
    
    return `${commit.message} (${riskLevel} risk: ${riskScore}/100). Author: ${commit.author}. Changes: +${commit.diffStats.additions}/-${commit.diffStats.deletions} across ${commit.diffStats.filesChanged} file(s).`;
  }

  /**
   * Generate repository summary
   */
  generateRepositorySummary(repoPath: string) {
    const allCommits = this.gitService.getAllCommits(repoPath);
    const authors = this.gitService.getAuthors(repoPath);
    const averageRiskScore = this.riskScorerService.calculateAverageRiskScore(allCommits);
    const mostModifiedFiles = this.gitService.getTopModifiedFiles(allCommits, 10);
    
    // Recent activity (last 5 commits)
    const recentActivity = allCommits.slice(0, 5).map(c => ({
      hash: c.hash,
      message: c.message,
      author: c.author,
      date: c.date
    }));

    return {
      total_commits: allCommits.length,
      total_contributors: authors.length,
      average_risk_score: averageRiskScore,
      most_modified_files: mostModifiedFiles,
      recent_activity: recentActivity
    };
  }

  /**
   * Connect to a repository and validate it
   */
  connectRepository(repoPath: string) {
    // Validate the path exists
    const fs = require('fs');
    if (!fs.existsSync(repoPath)) {
      throw new Error(`Repository path does not exist: ${repoPath}`);
    }

    // Validate it's a Git repository
    const gitDirPath = `${repoPath}/.git`;
    if (!fs.existsSync(gitDirPath)) {
      throw new Error(`Not a Git repository: ${repoPath}`);
    }

    // Get current branch
    const currentBranch = this.gitService.getCurrentBranch(repoPath);
    const repoName = repoPath.split('/').pop() || repoPath;

    return {
      repository_name: repoName,
      current_branch: currentBranch,
      connected: true
    };
  }

  /**
   * Compare two branches in a repository
   */
  compareBranches(repoPath: string, baseBranch: string, targetBranch: string) {
    // Validate repository exists
    const fs = require('fs');
    if (!fs.existsSync(repoPath)) {
      throw new Error(`Repository path does not exist: ${repoPath}`);
    }

    // Use GitService.compareBranches to get diff stats
    const branchDiff = this.gitService.compareBranches(repoPath, baseBranch, targetBranch);

    // Get all commits to calculate risk
    const allCommits = this.gitService.getAllCommits(repoPath);
    
    // Calculate average risk score from all commits
    let totalRiskScore = 0;
    const riskFactors = new Set<string>();

    allCommits.forEach(commit => {
      const riskScore = this.riskScorerService.calculateRiskScore(commit);
      totalRiskScore += riskScore;
      
      const reasons = this.riskScorerService.getRiskReasoning(commit, riskScore);
      reasons.forEach(r => riskFactors.add(r));
    });

    const avgRiskScore = allCommits.length > 0 
      ? Math.round(totalRiskScore / allCommits.length)
      : 0;

    const summary = `Branch ${targetBranch} has ${branchDiff.files_count} files changed (+${branchDiff.lines_added}/-${branchDiff.lines_removed}) compared to ${baseBranch}. ` +
      `Risk score: ${avgRiskScore}/100.`;

    return {
      base_branch: baseBranch,
      target_branch: targetBranch,
      files_changed: branchDiff.files_changed,
      lines_added: branchDiff.lines_added,
      lines_removed: branchDiff.lines_removed,
      files_count: branchDiff.files_count,
      risk_score: avgRiskScore,
      risk_factors: Array.from(riskFactors),
      summary
    };
  }

  /**
   * Calculate repository health score
   */
  getRepositoryHealthScore(repoPath: string) {
    // Validate repository exists
    const fs = require('fs');
    if (!fs.existsSync(repoPath)) {
      throw new Error(`Repository path does not exist: ${repoPath}`);
    }

    const allCommits = this.gitService.getAllCommits(repoPath);
    const authors = this.gitService.getAuthors(repoPath);
    const repoName = repoPath.split('/').pop() || repoPath;

    // Calculate commit frequency score (0-100)
    // More commits = higher score (max 100 at 1000+ commits)
    const commitFrequencyScore = Math.min(100, (allCommits.length / 1000) * 100);

    // Calculate code quality score based on file changes
    // Fewer large changes = higher score
    const avgChangesPerCommit = allCommits.length > 0
      ? allCommits.reduce((sum, c) => sum + c.diffStats.filesChanged, 0) / allCommits.length
      : 0;
    const codeQualityScore = Math.max(0, 100 - (avgChangesPerCommit * 5));

    // Calculate contributor diversity score (0-100)
    // More contributors = higher score (max 100 at 50+ contributors)
    const contributorDiversityScore = Math.min(100, (authors.length / 50) * 100);

    // Calculate average risk score
    let totalRiskScore = 0;
    allCommits.forEach(commit => {
      totalRiskScore += this.riskScorerService.calculateRiskScore(commit);
    });
    const avgRiskScore = allCommits.length > 0
      ? Math.round(totalRiskScore / allCommits.length)
      : 0;

    // Calculate overall health score (weighted average)
    const overallHealthScore = Math.round(
      (commitFrequencyScore * 0.25) +
      (codeQualityScore * 0.25) +
      (contributorDiversityScore * 0.25) +
      ((100 - avgRiskScore) * 0.25)
    );

    // Determine health status
    let healthStatus: 'excellent' | 'good' | 'fair' | 'poor';
    if (overallHealthScore >= 80) {
      healthStatus = 'excellent';
    } else if (overallHealthScore >= 60) {
      healthStatus = 'good';
    } else if (overallHealthScore >= 40) {
      healthStatus = 'fair';
    } else {
      healthStatus = 'poor';
    }

    // Generate recommendations
    const recommendations: string[] = [];
    if (commitFrequencyScore < 50) {
      recommendations.push('Increase commit frequency to maintain active development');
    }
    if (codeQualityScore < 50) {
      recommendations.push('Reduce the scope of changes per commit for better code review');
    }
    if (contributorDiversityScore < 50) {
      recommendations.push('Encourage more contributors to participate in the project');
    }
    if (avgRiskScore > 60) {
      recommendations.push('Review and reduce high-risk commits (sensitive files, large changes)');
    }
    if (recommendations.length === 0) {
      recommendations.push('Repository is in excellent health. Continue current practices.');
    }

    const lastCommitDate = allCommits.length > 0 ? allCommits[0].date : undefined;

    const summary = `Repository "${repoName}" has an overall health score of ${overallHealthScore}/100 (${healthStatus}). ` +
      `${allCommits.length} commits from ${authors.length} contributors. ` +
      `Average risk score: ${avgRiskScore}/100.`;

    return {
      repository_name: repoName,
      overall_health_score: overallHealthScore,
      commit_frequency_score: Math.round(commitFrequencyScore),
      code_quality_score: Math.round(codeQualityScore),
      contributor_diversity_score: Math.round(contributorDiversityScore),
      risk_score: avgRiskScore,
      total_commits: allCommits.length,
      total_contributors: authors.length,
      last_commit_date: lastCommitDate,
      health_status: healthStatus,
      recommendations,
      summary
    };
  }
}
