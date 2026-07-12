var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nitrostack/core';
import { GitService } from '../../services/git.service.js';
import { RiskScorerService } from '../../services/risk-scorer.service.js';
let ContributorsService = class ContributorsService {
    gitService;
    riskScorerService;
    constructor(gitService, riskScorerService) {
        this.gitService = gitService;
        this.riskScorerService = riskScorerService;
    }
    /**
     * Get contributor statistics
     */
    getContributorStats(author, repoPath) {
        const commits = this.gitService.getCommitsByAuthor(author, repoPath);
        if (commits.length === 0) {
            throw new Error(`No commits found for author: ${author}`);
        }
        const averageRiskScore = this.riskScorerService.calculateAverageRiskScore(commits);
        const highRiskCommits = this.riskScorerService.getHighRiskCommits(commits, 60);
        // Get most modified files by this author
        const fileMap = new Map();
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
    getTopRiskContributors(limit = 10, repoPath) {
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
    getBusFactorAnalysis(repoPath) {
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
            const fileMap = new Map();
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
        }
        else if (bus_factor_score < 50) {
            risk_level = 'high';
        }
        else if (bus_factor_score < 70) {
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
};
ContributorsService = __decorate([
    Injectable({ deps: [GitService, RiskScorerService] }),
    __metadata("design:paramtypes", [GitService,
        RiskScorerService])
], ContributorsService);
export { ContributorsService };
//# sourceMappingURL=contributors.service.js.map