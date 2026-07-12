import { ExecutionContext } from '@nitrostack/core';
import { ContributorsService } from './contributors.service.js';
export declare class ContributorsTools {
    private contributorsService;
    constructor(contributorsService: ContributorsService);
    contributorStats(input: any, ctx: ExecutionContext): Promise<{
        contributors: any[];
    }>;
}
//# sourceMappingURL=contributors.tools.d.ts.map