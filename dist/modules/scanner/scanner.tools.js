var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ToolDecorator as Tool, Injectable, z } from '@nitrostack/core';
import { ScannerService } from './scanner.service.js';
let ScannerTools = class ScannerTools {
    scannerService;
    constructor(scannerService) {
        this.scannerService = scannerService;
    }
    async fetchRecentCommits(input, ctx) {
        try {
            // Validate input
            if (!input.repo_path || typeof input.repo_path !== 'string') {
                throw new Error('repo_path is required and must be a string');
            }
            const limit = Math.max(1, Math.min(input.limit || 10, 100)); // Cap at 100
            ctx.logger.info('Fetching recent commits', {
                repo_path: input.repo_path,
                limit
            });
            const commits = this.scannerService.getRecentCommits(input.repo_path, limit);
            if (!commits || commits.length === 0) {
                ctx.logger.warn('No commits found', { repo_path: input.repo_path });
            }
            return {
                repo_path: input.repo_path,
                count: commits.length,
                commits,
                success: true
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            ctx.logger.error('Failed to fetch recent commits', {
                repo_path: input.repo_path,
                error: errorMessage
            });
            throw new Error(`Failed to fetch commits: ${errorMessage}`);
        }
    }
    async scoreCommit(input, ctx) {
        try {
            // Validate input
            if (!input.commit_hash || typeof input.commit_hash !== 'string') {
                throw new Error('commit_hash is required and must be a string');
            }
            ctx.logger.info('Scoring commit', {
                commit_hash: input.commit_hash,
                repo_path: input.repo_path
            });
            const commit = this.scannerService.findCommitByHash(input.commit_hash, input.repo_path);
            if (!commit) {
                ctx.logger.warn('Commit not found', {
                    commit_hash: input.commit_hash,
                    repo_path: input.repo_path
                });
                throw new Error(`Commit ${input.commit_hash} not found`);
            }
            const riskScore = this.scannerService.calculateRiskScore(commit);
            const reasoning = this.scannerService.getRiskReasoning(commit, riskScore);
            ctx.logger.info('Commit scored', {
                commit_hash: input.commit_hash,
                risk_score: riskScore
            });
            return {
                commit_hash: input.commit_hash,
                message: commit.message,
                author: commit.author,
                date: commit.date,
                risk_score: riskScore,
                reasoning,
                diff_stats: commit.diffStats,
                sensitive_files: commit.sensitiveFiles
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            ctx.logger.error('Failed to score commit', {
                commit_hash: input.commit_hash,
                error: errorMessage
            });
            throw new Error(`Failed to score commit: ${errorMessage}`);
        }
    }
};
__decorate([
    Tool({
        name: 'fetch-recent-commits',
        description: 'Fetch recent commits from a Git repository with diff statistics',
        inputSchema: z.object({
            repo_path: z.string().min(1).describe('Path to the Git repository'),
            limit: z.number().optional().default(10).describe('Maximum number of commits to fetch (default: 10)')
        }),
        examples: {
            request: {
                repo_path: '/home/user/my-project',
                limit: 5
            },
            response: {
                commits: [
                    {
                        hash: 'a3f7e2c1',
                        message: 'Update .env with new API keys',
                        author: 'alice@example.com',
                        date: '2026-06-25T14:30:00Z',
                        diffStats: {
                            additions: 5,
                            deletions: 2,
                            filesChanged: 1
                        },
                        sensitiveFiles: ['.env'],
                        imageUrl: 'https://images.unsplash.com/...'
                    }
                ]
            }
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ScannerTools.prototype, "fetchRecentCommits", null);
__decorate([
    Tool({
        name: 'score-commit',
        description: 'Calculate risk score for a specific commit based on message quality, diff size, and sensitive file changes',
        inputSchema: z.object({
            commit_hash: z.string().min(1).describe('The commit hash to score'),
            repo_path: z.string().optional().describe('Path to the Git repository (optional, uses fixtures if not provided)')
        }),
        examples: {
            request: {
                commit_hash: 'a3f7e2c1'
            },
            response: {
                commit_hash: 'a3f7e2c1',
                risk_score: 75,
                reasoning: [
                    'Modifies sensitive files: .env',
                    'Poor commit message (31 chars)'
                ]
            }
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ScannerTools.prototype, "scoreCommit", null);
ScannerTools = __decorate([
    Injectable({ deps: [ScannerService] }),
    __metadata("design:paramtypes", [ScannerService])
], ScannerTools);
export { ScannerTools };
//# sourceMappingURL=scanner.tools.js.map