import { ExecutionContext } from '@nitrostack/core';
import { ContributorsService } from './contributors.service.js';
export declare class ContributorsTools {
    private contributorsService;
    constructor(contributorsService: ContributorsService);
    contributorStats(input: any, ctx: ExecutionContext): Promise<{
        author: string;
        total_commits: number;
        average_risk_score: number;
        high_risk_commits: {
            hash: string;
            message: string;
            risk_score: number;
        }[];
        most_modified_files: {
            file: string;
            change_count: number;
        }[];
    }>;
    topRiskContributors(input: any, ctx: ExecutionContext): Promise<{
        contributors: {
            author: string;
            average_risk: number;
            total_commits: number;
        }[];
    }>;
}
//# sourceMappingURL=contributors.tools.d.ts.map