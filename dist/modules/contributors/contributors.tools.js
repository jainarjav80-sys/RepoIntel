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
import { ContributorStatsInputSchema, TopRiskContributorsInputSchema } from './schemas/contributor.schema.js';
let ContributorsTools = class ContributorsTools {
    contributorsService;
    constructor(contributorsService) {
        this.contributorsService = contributorsService;
    }
    async contributorStats(input, ctx) {
        try {
            // Validate input
            if (!input.author || typeof input.author !== 'string') {
                throw new Error('author is required and must be a string');
            }
            ctx.logger.info('Getting contributor stats', {
                author: input.author,
                repo_path: input.repo_path
            });
            const result = this.contributorsService.getContributorStats(input.author, input.repo_path);
            if (!result) {
                ctx.logger.warn('No stats found for contributor', { author: input.author });
                throw new Error(`No commits found for contributor: ${input.author}`);
            }
            ctx.logger.info('Contributor stats retrieved', {
                author: input.author,
                total_commits: result.total_commits,
                average_risk_score: result.average_risk_score
            });
            return result;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            ctx.logger.error('Failed to get contributor stats', {
                author: input.author,
                error: errorMessage
            });
            throw new Error(`Failed to get contributor stats: ${errorMessage}`);
        }
    }
    async topRiskContributors(input, ctx) {
        try {
            // Validate and sanitize limit
            let limit = input.limit || 10;
            if (typeof limit !== 'number' || limit < 1 || limit > 100) {
                limit = 10;
            }
            ctx.logger.info('Getting top risk contributors', {
                limit,
                repo_path: input.repo_path
            });
            const result = this.contributorsService.getTopRiskContributors(limit, input.repo_path);
            if (!result || result.length === 0) {
                ctx.logger.info('No contributors found', { repo_path: input.repo_path });
            }
            else {
                ctx.logger.info('Top risk contributors retrieved', {
                    count: result.length,
                    topAuthor: result[0]?.author
                });
            }
            return {
                contributors: result
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            ctx.logger.error('Failed to get top risk contributors', {
                limit: input.limit,
                error: errorMessage
            });
            throw new Error(`Failed to get top risk contributors: ${errorMessage}`);
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
__decorate([
    Tool({
        name: 'top-risk-contributors',
        description: 'Rank contributors by average repository risk score',
        inputSchema: TopRiskContributorsInputSchema,
        examples: {
            request: {
                limit: 5
            },
            response: {
                contributors: [
                    {
                        author: 'grace@example.com',
                        average_risk: 68.5,
                        total_commits: 3
                    },
                    {
                        author: 'leo@example.com',
                        average_risk: 55.2,
                        total_commits: 2
                    }
                ]
            }
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ContributorsTools.prototype, "topRiskContributors", null);
ContributorsTools = __decorate([
    Injectable({ deps: [ContributorsService] }),
    __metadata("design:paramtypes", [ContributorsService])
], ContributorsTools);
export { ContributorsTools };
//# sourceMappingURL=contributors.tools.js.map