import { GitService } from '../../services/git.service.js';
import { RiskScorerService } from '../../services/risk-scorer.service.js';
export declare class ContributorsService {
    private gitService;
    private riskScorerService;
    constructor(gitService: GitService, riskScorerService: RiskScorerService);
    /**
     * Get contributor statistics
     */
    getContributorStats(options: {
        author?: string;
        repoPath?: string;
        sortBy?: 'risk' | 'commits';
        limit?: number;
    }): {
        contributors: any[];
    };
    /**
     * Analyze bus factor - identify key contributors whose absence would impact the project
     */
    getBusFactorAnalysis(repoPath?: string): {
        bus_factor_score: number;
        critical_contributors: {
            name: string;
            commit_count: number;
            pct_total: number;
            areas: {
                file: string;
                change_count: number;
            }[];
        }[];
        risk_level: string;
        total_contributors: number;
        total_commits: number;
    };
}
//# sourceMappingURL=contributors.service.d.ts.map