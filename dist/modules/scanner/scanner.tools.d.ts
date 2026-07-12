import { ExecutionContext } from '@nitrostack/core';
import { ScannerService } from './scanner.service.js';
export declare class ScannerTools {
    private scannerService;
    constructor(scannerService: ScannerService);
    fetchRecentCommits(input: any, ctx: ExecutionContext): Promise<{
        repo_path: any;
        count: number;
        commits: import("./scanner.service.js").Commit[];
        success: boolean;
    }>;
    scoreCommit(input: any, ctx: ExecutionContext): Promise<{
        commit_hash: any;
        message: string;
        author: string;
        date: string;
        risk_score: number;
        reasoning: string[];
        diff_stats: {
            additions: number;
            deletions: number;
            filesChanged: number;
        };
        sensitive_files: string[];
    }>;
}
//# sourceMappingURL=scanner.tools.d.ts.map