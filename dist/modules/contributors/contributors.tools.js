var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ToolDecorator as Tool, Injectable } from '@nitrostack/core';
import { ContributorsService } from './contributors.service.js';
import { ContributorStatsInputSchema } from './schemas/contributor.schema.js';
let ContributorsTools = class ContributorsTools {
    contributorsService;
    constructor(contributorsService) {
        this.contributorsService = contributorsService;
    }
    async contributorStats(input, ctx) {
        try {
            ctx.logger.info('Getting contributor stats', {
                author: input.author,
                sortBy: input.sortBy,
                limit: input.limit,
                repo_path: input.repo_path
            });
            const result = this.contributorsService.getContributorStats({
                author: input.author,
                repoPath: input.repo_path,
                sortBy: input.sortBy,
                limit: input.limit
            });
            if (!result || result.contributors.length === 0) {
                ctx.logger.warn('No stats found for contributor request');
            }
            ctx.logger.info('Contributor stats retrieved', {
                count: result.contributors.length
            });
            return result;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            ctx.logger.error('Failed to get contributor stats', {
                error: errorMessage
            });
            throw new Error(`Failed to get contributor stats: ${errorMessage}`);
        }
    }
};
__decorate([
    Tool({
        name: 'contributor-stats',
        description: 'Provide contributor-level repository insights including commit count, average risk score, and riskiest commits',
        inputSchema: ContributorStatsInputSchema,
        examples: {
            request: {
                author: 'alice@example.com'
            },
            response: {
                author: 'alice@example.com',
                total_commits: 5,
                average_risk_score: 52.0,
                high_risk_commits: [
                    {
                        hash: 'a3f7e2c1',
                        message: 'Update .env with new API keys',
                        risk_score: 75
                    }
                ],
                most_modified_files: [
                    { file: '.env', change_count: 2 }
                ]
            }
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ContributorsTools.prototype, "contributorStats", null);
ContributorsTools = __decorate([
    Injectable({ deps: [ContributorsService] }),
    __metadata("design:paramtypes", [ContributorsService])
], ContributorsTools);
export { ContributorsTools };
//# sourceMappingURL=contributors.tools.js.map