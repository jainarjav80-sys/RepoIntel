import { Injectable, Inject } from '@nitrostack/core';
import { GitService } from '../../services/git.service.js';
import { RiskScorerService } from '../../services/risk-scorer.service.js';

@Injectable({ deps: [GitService, RiskScorerService] })
export class ContributorsService {
  constructor(
    private gitService: GitService,
    private riskScorerService: RiskScorerService
  ) {}

  /**
   * Get contributor statistics
   */
  getContributorStats(author: string, repoPath?: string) {
    const commits = this.gitService.getCommitsByAuthor(author, repoPath);
    
    if (commits.length === 0) {
      throw new Error(`No commits found for author: ${author}`);
    }

    const averageRiskScore = this.riskScorerService.calculateAverageRiskScore(commits);
    const highRiskCommits = this.riskScorerService.getHighRiskCommits(commits, 60);
    
    // Get most modified files by this author
    const fileMap = new Map<string, number>();
    commits.forEach(commit => {
      commit.sensitiveFiles.forEach(file => {
        fileMap.set(file, (fileMap.get(file) || 0) + 1);
      });
    });

    const mostModifiedFiles = Array.from(fileMap.entries())
      .map(([file, count]) => ({ file, change_count: count }))
      .sort((a, b) => b.change_count - a.change_count)
      .slice(0, 10);

    return {
      author,
      total_commits: commits.length,
      average_risk_score: averageRiskScore,
      high_risk_commits: highRiskCommits.map(c => ({
        hash: c.hash,
        message: c.message,
        risk_score: c.riskScore
      })),
      most_modified_files: mostModifiedFiles
    };
  }

  /**
   * Get top risk contributors
   */
  getTopRiskContributors(limit: number = 10, repoPath?: string) {
    const allCommits = this.gitService.getAllCommits(repoPath);
    const authors = this.gitService.getAuthors(repoPath);

    const contributorRisks = authors.map(author => {
      const authorCommits = allCommits.filter(c => c.author === author);
      const averageRisk = this.riskScorerService.calculateAverageRiskScore(authorCommits);
      
      return {
        author,
        average_risk: averageRisk,
        total_commits: authorCommits.length
      };
    });

    // Sort by average risk (descending)
    return contributorRisks
      .sort((a, b) => b.average_risk - a.average_risk)
      .slice(0, limit);
  }

  /**
   * Analyze bus factor - identify key contributors whose absence would impact the project
   */
  getBusFactorAnalysis(repoPath?: string) {
    const allCommits = this.gitService.getAllCommits(repoPath);
    const authors = this.gitService.getAuthors(repoPath);

    if (authors.length === 0) {
      return {
        bus_factor_score: 0,
        critical_contributors: [],
        risk_level: 'unknown',
        total_contributors: 0,
        total_commits: 0
      };
    }

    // Calculate commit distribution
    const contributorStats = authors.map(author => {
      const authorCommits = allCommits.filter(c => c.author === author);
      const pct_total = (authorCommits.length / allCommits.length) * 100;
      
      // Identify areas of expertise (most modified files)
      const fileMap = new Map<string, number>();
      authorCommits.forEach(commit => {
        commit.sensitiveFiles.forEach(file => {
          fileMap.set(file, (fileMap.get(file) || 0) + 1);
        });
      });
      
      const areas = Array.from(fileMap.entries())
        .map(([file, count]) => ({ file, change_count: count }))
        .sort((a, b) => b.change_count - a.change_count)
        .slice(0, 5);

      return {
        name: author,
        commit_count: authorCommits.length,
        pct_total,
        areas
      };
    });

    // Sort by commit count (descending)
    contributorStats.sort((a, b) => b.commit_count - a.commit_count);

    // Identify critical contributors (top 20% or at least 1)
    const criticalCount = Math.max(1, Math.ceil(authors.length * 0.2));
    const critical_contributors = contributorStats.slice(0, criticalCount);

    // Calculate bus factor score (0-100)
    // Higher score = more distributed (lower risk)
    // Lower score = more concentrated (higher risk)
    const topThreePercent = critical_contributors.slice(0, 3).reduce((sum, c) => sum + c.pct_total, 0);
    const bus_factor_score = Math.max(0, 100 - topThreePercent);

    // Determine risk level
    let risk_level = 'low';
    if (bus_factor_score < 30) {
      risk_level = 'critical';
    } else if (bus_factor_score < 50) {
      risk_level = 'high';
    } else if (bus_factor_score < 70) {
      risk_level = 'medium';
    }

    return {
      bus_factor_score,
      critical_contributors,
      risk_level,
      total_contributors: authors.length,
      total_commits: allCommits.length
    };
  }
}
