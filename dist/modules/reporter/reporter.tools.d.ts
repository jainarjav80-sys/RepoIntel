import { ExecutionContext } from '@nitrostack/core';
import { ReporterService } from './reporter.service.js';
export declare class ReporterTools {
    private reporterService;
    constructor(reporterService: ReporterService);
    listRiskyCommits(input: any, ctx: ExecutionContext): Promise<{
        repo_path: any;
        threshold: any;
        count: number;
        commits: {
            hash: string;
            message: string;
            author: string;
            date: string;
            diff_stats: {
                additions: number;
                deletions: number;
                filesChanged: number;
            };
            sensitive_files: string[];
            risk_score: number;
            reasoning: string[];
            imageUrl: string;
        }[];
    }>;
    generateRiskReport(input: any, ctx: ExecutionContext): Promise<{
        repo_path: string;
        total_commits: number;
        high_risk_count: number;
        average_risk_score: number;
        top_risky_commits: {
            hash: string;
            message: string;
            author: string;
            date: string;
            diff_stats: {
                additions: number;
                deletions: number;
                filesChanged: number;
            };
            sensitive_files: string[];
            risk_score: number;
            reasoning: string[];
            imageUrl: string;
        }[];
    }>;
}
//# sourceMappingURL=reporter.tools.d.ts.map