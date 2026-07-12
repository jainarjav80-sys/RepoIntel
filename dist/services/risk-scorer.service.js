var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@nitrostack/core';
/**
 * Risk Scorer Service
 *
 * Centralized risk scoring logic used across all modules.
 * Factors:
 * - Message quality (length, clarity)
 * - Diff size (additions + deletions)
 * - Sensitive file changes
 */
let RiskScorerService = class RiskScorerService {
    /**
     * Calculate risk score for a commit (0-100)
     */
    calculateRiskScore(commit) {
        let score = 0;
        // Factor 1: Message quality (0-20 points)
        const messageLength = commit.message.length;
        if (messageLength < 10) {
            score += 20; // Very poor message
        }
        else if (messageLength < 20) {
            score += 15; // Poor message
        }
        else if (messageLength < 50) {
            score += 5; // Acceptable message
        }
        else {
            score += 0; // Good message
        }
        // Factor 2: Diff size (0-40 points)
        const totalChanges = commit.diffStats.additions + commit.diffStats.deletions;
        if (totalChanges > 1000) {
            score += 40; // Massive change
        }
        else if (totalChanges > 500) {
            score += 30; // Large change
        }
        else if (totalChanges > 200) {
            score += 15; // Medium change
        }
        else if (totalChanges > 50) {
            score += 5; // Small change
        }
        // Factor 3: Sensitive file changes (0-40 points)
        if (commit.sensitiveFiles.length > 0) {
            const sensitiveCount = commit.sensitiveFiles.length;
            if (sensitiveCount >= 3) {
                score += 40; // Multiple sensitive files
            }
            else if (sensitiveCount === 2) {
                score += 30; // Two sensitive files
            }
            else {
                score += 20; // One sensitive file
            }
        }
        return Math.min(score, 100);
    }
    /**
     * Get reasoning for a risk score
     */
    getRiskReasoning(commit, score) {
        const reasons = [];
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
     * Calculate average risk score for a set of commits
     */
    calculateAverageRiskScore(commits) {
        if (commits.length === 0)
            return 0;
        const total = commits.reduce((sum, commit) => sum + this.calculateRiskScore(commit), 0);
        return Math.round((total / commits.length) * 100) / 100;
    }
    /**
     * Get high-risk commits above a threshold
     */
    getHighRiskCommits(commits, threshold = 60) {
        return commits
            .map(commit => ({
            ...commit,
            riskScore: this.calculateRiskScore(commit)
        }))
            .filter(c => c.riskScore >= threshold)
            .sort((a, b) => b.riskScore - a.riskScore);
    }
};
RiskScorerService = __decorate([
    Injectable()
], RiskScorerService);
export { RiskScorerService };
//# sourceMappingURL=risk-scorer.service.js.map