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
import { RepositoryService } from './repository.service.js';
import { AnalyzeCommitInputSchema, RepositorySummaryInputSchema, ConnectRepositoryInputSchema, CompareBranchesInputSchema, RepositoryHealthScoreInputSchema } from './schemas/commit.schema.js';
import { GitService } from '../../services/git.service.js';
let RepositoryTools = class RepositoryTools {
    repositoryService;
    gitService;
    constructor(repositoryService, gitService) {
        this.repositoryService = repositoryService;
        this.gitService = gitService;
    }
    async connectRepository(input, ctx) {
        try {
            if (!input.repo_path || typeof input.repo_path !== 'string') {
                throw new Error('repo_path is required and must be a string');
            }
            ctx.logger.info('Connecting to repository', { repo_path: input.repo_path });
            const result = this.gitService.validateRepository(input.repo_path);
            if (!result.connected) {
                ctx.logger.warn('Repository connection failed', {
                    repo_path: input.repo_path,
                    error: result.error
                });
            }
            return {
                repository_name: result.repository_name,
                current_branch: result.current_branch,
                connected: result.connected,
                commit_count: result.total_commits,
                last_commit_date: result.last_commit_date,
                error: result.error
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            ctx.logger.error('Repository connection error', {
                repo_path: input.repo_path,
                error: errorMessage
            });
            throw new Error(`Repository connection failed: ${errorMessage}`);
        }
    }
    async analyzeCommit(input, ctx) {
        try {
            if (!input.commit_hash || typeof input.commit_hash !== 'string') {
                throw new Error('commit_hash is required and must be a string');
            }
            ctx.logger.info('Analyzing commit', { commit_hash: input.commit_hash });
            const result = this.repositoryService.analyzeCommit(input.commit_hash);
            if (!result) {
                throw new Error(`Commit ${input.commit_hash} not found`);
            }
            ctx.logger.info('Commit analyzed', {
                commit_hash: input.commit_hash,
                risk_score: result.risk_score
            });
            return result;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            ctx.logger.error('Failed to analyze commit', {
                commit_hash: input.commit_hash,
                error: errorMessage
            });
            throw new Error(`Failed to analyze commit: ${errorMessage}`);
        }
    }
    async repositorySummary(input, ctx) {
        try {
            const repo_path = input.repo_path || undefined;
            ctx.logger.info('Generating repository summary', { repo_path });
            const result = this.repositoryService.generateRepositorySummary(repo_path);
            if (!result) {
                throw new Error('Failed to generate repository summary');
            }
            ctx.logger.info('Repository summary generated', {
                total_commits: result.total_commits,
                total_contributors: result.total_contributors
            });
            return result;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            ctx.logger.error('Failed to generate repository summary', {
                repo_path: input.repo_path,
                error: errorMessage
            });
            throw new Error(`Failed to generate repository summary: ${errorMessage}`);
        }
    }
    async compareBranches(input, ctx) {
        try {
            if (!input.repo_path || typeof input.repo_path !== 'string') {
                throw new Error('repo_path is required and must be a string');
            }
            if (!input.base_branch || typeof input.base_branch !== 'string') {
                throw new Error('base_branch is required and must be a string');
            }
            if (!input.target_branch || typeof input.target_branch !== 'string') {
                throw new Error('target_branch is required and must be a string');
            }
            ctx.logger.info('Comparing branches', {
                repo_path: input.repo_path,
                base_branch: input.base_branch,
                target_branch: input.target_branch
            });
            const result = this.repositoryService.compareBranches(input.repo_path, input.base_branch, input.target_branch);
            if (!result) {
                throw new Error('Failed to compare branches');
            }
            ctx.logger.info('Branches compared', {
                files_changed: result.files_count,
                risk_score: result.risk_score
            });
            return result;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            ctx.logger.error('Failed to compare branches', {
                repo_path: input.repo_path,
                base_branch: input.base_branch,
                target_branch: input.target_branch,
                error: errorMessage
            });
            throw new Error(`Failed to compare branches: ${errorMessage}`);
        }
    }
    async repositoryHealthScore(input, ctx) {
        try {
            const repo_path = input.repo_path || undefined;
            ctx.logger.info('Calculating repository health score', { repo_path });
            const result = this.repositoryService.getRepositoryHealthScore(repo_path);
            if (!result) {
                throw new Error('Failed to calculate repository health score');
            }
            ctx.logger.info('Repository health score calculated', {
                overall_health_score: result.overall_health_score,
                health_status: result.health_status
            });
            return result;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            ctx.logger.error('Failed to calculate repository health score', {
                repo_path: input.repo_path,
                error: errorMessage
            });
            throw new Error(`Failed to calculate repository health score: ${errorMessage}`);
        }
    }
};
__decorate([
    Tool({
        name: 'connect-repository',
        description: 'Connect to a Git repository and validate it. Returns repository metadata including name, current branch, and connection status.',
        inputSchema: ConnectRepositoryInputSchema,
        examples: {
            request: {
                repo_path: '/home/user/my-project'
            },
            response: {
                repository_name: 'my-project',
                current_branch: 'main',
                connected: true,
                commit_count: 42,
                last_commit_date: '2026-06-25T14:30:00Z'
            }
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RepositoryTools.prototype, "connectRepository", null);
__decorate([
    Tool({
        name: 'analyze-commit',
        description: 'Analyze a specific commit and provide a human-readable summary with risk assessment',
        inputSchema: AnalyzeCommitInputSchema,
        examples: {
            request: {
                commit_hash: 'a3f7e2c1'
            },
            response: {
                commit_hash: 'a3f7e2c1',
                summary: 'Update .env with new API keys (HIGH risk: 75/100). Author: alice@example.com. Changes: +5/-2 across 1 file(s).',
                files_changed: ['.env'],
                lines_added: 5,
                lines_removed: 2,
                risk_score: 75,
                risk_reasons: [
                    'Modifies sensitive files: .env',
                    'Poor commit message (31 chars)'
                ]
            }
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RepositoryTools.prototype, "analyzeCommit", null);
__decorate([
    Tool({
        name: 'repository-summary',
        description: 'Generate an overview of the repository including commit count, contributors, and risk metrics',
        inputSchema: RepositorySummaryInputSchema,
        examples: {
            request: {
                repo_path: '/home/user/my-project'
            },
            response: {
                total_commits: 15,
                total_contributors: 10,
                average_risk_score: 45.5,
                most_modified_files: [
                    { file: '.env', change_count: 3 },
                    { file: 'config/config.yml', change_count: 2 }
                ],
                recent_activity: [
                    {
                        hash: 'a3f7e2c1',
                        message: 'Update .env with new API keys',
                        author: 'alice@example.com',
                        date: '2026-06-25T14:30:00Z'
                    }
                ]
            }
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RepositoryTools.prototype, "repositorySummary", null);
__decorate([
    Tool({
        name: 'compare-branches',
        description: 'Compare two branches in a Git repository and provide diff analysis with risk scoring',
        inputSchema: CompareBranchesInputSchema,
        examples: {
            request: {
                repo_path: '/home/user/my-project',
                base_branch: 'main',
                target_branch: 'feature-branch'
            },
            response: {
                base_branch: 'main',
                target_branch: 'feature-branch',
                files_changed: ['src/config.ts', '.env.example'],
                lines_added: 45,
                lines_removed: 12,
                files_count: 2,
                risk_score: 65,
                risk_factors: [
                    'Modifies configuration files',
                    'Changes to .env files detected'
                ],
                summary: 'Branch feature-branch has 2 files changed (+45/-12). Risk score: 65/100 due to config file modifications.'
            }
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RepositoryTools.prototype, "compareBranches", null);
__decorate([
    Tool({
        name: 'repository-health-score',
        description: 'Calculate an overall health score for a repository based on commit frequency, code quality, contributor diversity, and risk metrics',
        inputSchema: RepositoryHealthScoreInputSchema,
        examples: {
            request: {
                repo_path: '/home/user/my-project'
            },
            response: {
                repository_name: 'my-project',
                overall_health_score: 72,
                commit_frequency_score: 65,
                code_quality_score: 78,
                contributor_diversity_score: 80,
                risk_score: 45,
                total_commits: 150,
                total_contributors: 8,
                last_commit_date: '2026-06-25T14:30:00Z',
                health_status: 'good',
                recommendations: [
                    'Increase commit frequency to maintain active development',
                    'Review and reduce high-risk commits'
                ],
                summary: 'Repository "my-project" has an overall health score of 72/100 (good). 150 commits from 8 contributors. Average risk score: 45/100.'
            }
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RepositoryTools.prototype, "repositoryHealthScore", null);
RepositoryTools = __decorate([
    Injectable({ deps: [RepositoryService, GitService] }),
    __metadata("design:paramtypes", [RepositoryService,
        GitService])
], RepositoryTools);
export { RepositoryTools };
//# sourceMappingURL=repository.tools.js.map