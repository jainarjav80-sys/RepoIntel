import { ExecutionContext } from '@nitrostack/core';
import { RepositoryService } from './repository.service.js';
import { GitService } from '../../services/git.service.js';
export declare class RepositoryTools {
    private repositoryService;
    private gitService;
    constructor(repositoryService: RepositoryService, gitService: GitService);
    connectRepository(input: any, ctx: ExecutionContext): Promise<{
        repository_name: string;
        current_branch: string;
        connected: boolean;
        commit_count: number;
        last_commit_date: string | undefined;
        error: string | undefined;
    }>;
    compareBranches(input: any, ctx: ExecutionContext): Promise<{
        base_branch: string;
        target_branch: string;
        files_changed: string[];
        lines_added: number;
        lines_removed: number;
        files_count: number;
        risk_score: number;
        risk_factors: string[];
        summary: string;
    }>;
    repositoryHealthScore(input: any, ctx: ExecutionContext): Promise<{
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
    }>;
}
//# sourceMappingURL=repository.tools.d.ts.map