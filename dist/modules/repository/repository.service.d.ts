import { GitService } from '../../services/git.service.js';
import { RiskScorerService } from '../../services/risk-scorer.service.js';
export declare class RepositoryService {
    private gitService;
    private riskScorerService;
    constructor(gitService: GitService, riskScorerService: RiskScorerService);
    /**
     * Connect to a repository and validate it
     */
    connectRepository(repoPath: string): {
        repository_name: string;
        current_branch: string;
        connected: boolean;
    };
    /**
     * Compare two branches in a repository
     */
    compareBranches(repoPath: string, baseBranch: string, targetBranch: string): {
        base_branch: string;
        target_branch: string;
        files_changed: string[];
        lines_added: number;
        lines_removed: number;
        files_count: number;
        risk_score: number;
        risk_factors: string[];
        summary: string;
    };
    /**
     * Calculate repository health score
     */
    getRepositoryHealthScore(repoPath: string): {
        repository_name: string;
        overall_health_score: number;
        commit_frequency_score: number;
        code_quality_score: number;
        contributor_diversity_score: number;
        risk_score: number;
        total_commits: number;
        total_contributors: number;
        last_commit_date: string | undefined;
        health_status: "excellent" | "good" | "fair" | "poor";
        recommendations: string[];
        summary: string;
        most_modified_files: {
            file: string;
            change_count: number;
        }[];
        recent_activity: {
            hash: string;
            message: string;
            author: string;
            date: string;
        }[];
    };
}
//# sourceMappingURL=repository.service.d.ts.map