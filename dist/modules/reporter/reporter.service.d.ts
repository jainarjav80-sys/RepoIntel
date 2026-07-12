import { ScannerService } from '../scanner/scanner.service.js';
import type { Commit } from '../scanner/scanner.service.js';
export declare class ReporterService {
    private scannerService;
    constructor(scannerService: ScannerService);
    /**
     * Get risky commits above a threshold, ranked by risk score
     */
    listRiskyCommits(repoPath?: string, threshold?: number): Array<Commit & {
        riskScore: number;
        reasoning: string[];
    }>;
    /**
     * Generate a comprehensive risk report for a repository
     */
    generateRiskReport(repoPath?: string): {
        repoPath: string;
        totalCommits: number;
        highRiskCount: number;
        averageRiskScore: number;
        topRiskyCommits: Array<Commit & {
            riskScore: number;
            reasoning: string[];
        }>;
    };
}
//# sourceMappingURL=reporter.service.d.ts.map