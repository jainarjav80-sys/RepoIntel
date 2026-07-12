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
    imageUrl?: string;
}
/**
 * Risk Scorer Service
 *
 * Centralized risk scoring logic used across all modules.
 * Factors:
 * - Message quality (length, clarity)
 * - Diff size (additions + deletions)
 * - Sensitive file changes
 */
export declare class RiskScorerService {
    /**
     * Calculate risk score for a commit (0-100)
     */
    calculateRiskScore(commit: Commit): number;
    /**
     * Get reasoning for a risk score
     */
    getRiskReasoning(commit: Commit, score: number): string[];
    /**
     * Calculate average risk score for a set of commits
     */
    calculateAverageRiskScore(commits: Commit[]): number;
    /**
     * Get high-risk commits above a threshold
     */
    getHighRiskCommits(commits: Commit[], threshold?: number): Array<Commit & {
        riskScore: number;
    }>;
}
//# sourceMappingURL=risk-scorer.service.d.ts.map