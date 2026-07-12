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
export declare class ScannerService {
    private gitService;
    constructor(gitService: GitService);
    /**
     * Load mock commits from fixtures/commits.json
     */
    loadMockCommits(): Commit[];
    /**
     * Validate a repository connection
     */
    validateRepository(repoPath: string): RepositoryInfo;
    /**
     * Get recent commits from a repository (real git or fixtures)
     */
    getRecentCommits(repoPath?: string, limit?: number): Commit[];
    /**
     * Calculate risk score for a commit (0-100)
     * Factors:
     * - Message quality (length, clarity)
     * - Diff size (additions + deletions)
     * - Sensitive file changes
     */
    calculateRiskScore(commit: Commit): number;
    /**
     * Get reasoning for a risk score
     */
    getRiskReasoning(commit: Commit, score: number): string[];
    /**
     * Find commits by hash
     */
    findCommitByHash(hash: string, repoPath?: string): Commit | null;
    /**
     * Get risky commits above a threshold
     */
    getRiskyCommits(repoPath?: string, threshold?: number): Array<Commit & {
        riskScore: number;
    }>;
    /**
     * Generate a risk report for a repository
     */
    generateRiskReport(repoPath?: string): {
        repoPath: string;
        totalCommits: number;
        highRiskCount: number;
        topRiskyCommits: Array<Commit & {
            riskScore: number;
            reasoning: string[];
        }>;
        averageRiskScore: number;
    };
}
//# sourceMappingURL=scanner.service.d.ts.map