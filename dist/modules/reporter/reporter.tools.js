var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ToolDecorator as Tool, Injectable, Widget, z } from '@nitrostack/core';
import { ReporterService } from './reporter.service.js';
let ReporterTools = class ReporterTools {
    reporterService;
    constructor(reporterService) {
        this.reporterService = reporterService;
    }
    async listRiskyCommits(input, ctx) {
        try {
            // Validate and sanitize threshold
            let threshold = input.threshold || 60;
            if (typeof threshold !== 'number' || threshold < 0 || threshold > 100) {
                threshold = 60;
            }
            ctx.logger.info('Listing risky commits', {
                repo_path: input.repo_path,
                threshold
            });
            const riskyCommits = this.reporterService.listRiskyCommits(input.repo_path, threshold);
            if (!riskyCommits || riskyCommits.length === 0) {
                ctx.logger.info('No risky commits found', {
                    repo_path: input.repo_path,
                    threshold
                });
            }
            else {
                ctx.logger.info('Risky commits retrieved', {
                    repo_path: input.repo_path,
                    count: riskyCommits.length
                });
            }
            return {
                repo_path: input.repo_path || 'fixtures',
                threshold,
                count: riskyCommits.length,
                commits: riskyCommits.map(commit => ({
                    hash: commit.hash,
                    message: commit.message,
                    author: commit.author,
                    date: commit.date,
                    diff_stats: commit.diffStats,
                    sensitive_files: commit.sensitiveFiles,
                    risk_score: commit.riskScore,
                    reasoning: commit.reasoning,
                    imageUrl: commit.imageUrl
                }))
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            ctx.logger.error('Failed to list risky commits', {
                repo_path: input.repo_path,
                threshold: input.threshold,
                error: errorMessage
            });
            throw new Error(`Failed to list risky commits: ${errorMessage}`);
        }
    }
    async generateRiskReport(input, ctx) {
        try {
            ctx.logger.info('Generating risk report', {
                repo_path: input.repo_path
            });
            const report = this.reporterService.generateRiskReport(input.repo_path);
            if (!report) {
                throw new Error('Failed to generate risk report');
            }
            ctx.logger.info('Risk report generated', {
                total_commits: report.totalCommits,
                high_risk_count: report.highRiskCount,
                average_risk_score: report.averageRiskScore
            });
            return {
                repo_path: report.repoPath,
                total_commits: report.totalCommits,
                high_risk_count: report.highRiskCount,
                average_risk_score: report.averageRiskScore,
                top_risky_commits: report.topRiskyCommits.map(commit => ({
                    hash: commit.hash,
                    message: commit.message,
                    author: commit.author,
                    date: commit.date,
                    diff_stats: commit.diffStats,
                    sensitive_files: commit.sensitiveFiles,
                    risk_score: commit.riskScore,
                    reasoning: commit.reasoning,
                    imageUrl: commit.imageUrl
                }))
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            ctx.logger.error('Failed to generate risk report', {
                repo_path: input.repo_path,
                error: errorMessage
            });
            throw new Error(`Failed to generate risk report: ${errorMessage}`);
        }
    }
};
__decorate([
    Tool({
        name: 'list-risky-commits',
        description: 'List all commits from a repository that exceed a risk threshold, ranked by risk score',
        inputSchema: z.object({
            repo_path: z.string().optional().describe('Path to the Git repository (optional; uses fixture data if omitted)'),
            threshold: z.number().optional().default(60).describe('Risk score threshold (0-100, default: 60)')
        }),
        examples: {
            request: {
                repo_path: '/home/user/my-project',
                threshold: 60
            },
            response: {
                repo_path: '/home/user/my-project',
                threshold: 60,
                count: 5,
                commits: [
                    {
                        hash: 'a3f7e2c1',
                        message: 'Update .env with new API keys',
                        author: 'alice@example.com',
                        date: '2026-06-25T14:30:00Z',
                        risk_score: 75,
                        reasoning: ['Modifies sensitive files: .env']
                    }
                ]
            }
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ReporterTools.prototype, "listRiskyCommits", null);
__decorate([
    Tool({
        name: 'generate-risk-report',
        description: 'Generate a comprehensive risk report for a Git repository, highlighting the top 10 highest-risk commits',
        inputSchema: z.object({
            repo_path: z.string().optional().describe('Path to the Git repository (optional; uses fixture data if omitted)')
        }),
        examples: {
            request: {
                repo_path: '/home/user/my-project'
            },
            response: {
                repo_path: '/home/user/my-project',
                total_commits: 15,
                high_risk_count: 5,
                average_risk_score: 42.5,
                top_risky_commits: [
                    {
                        hash: 'a3f7e2c1',
                        message: 'Update .env with new API keys',
                        author: 'alice@example.com',
                        date: '2026-06-25T14:30:00Z',
                        risk_score: 75,
                        reasoning: ['Modifies sensitive files: .env']
                    }
                ]
            }
        }
    }),
    Widget('risk-dashboard'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ReporterTools.prototype, "generateRiskReport", null);
ReporterTools = __decorate([
    Injectable({ deps: [ReporterService] }),
    __metadata("design:paramtypes", [ReporterService])
], ReporterTools);
export { ReporterTools };
//# sourceMappingURL=reporter.tools.js.map