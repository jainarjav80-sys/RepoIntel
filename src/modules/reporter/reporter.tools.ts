import { ToolDecorator as Tool, Injectable, Inject, Widget, ExecutionContext, z } from '@nitrostack/core';
import { ReporterService } from './reporter.service.js';

@Injectable({ deps: [ReporterService] })
export class ReporterTools {
  constructor(private reporterService: ReporterService) {}

  @Tool({
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
  })
  async listRiskyCommits(input: any, ctx: ExecutionContext) {
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
      } else {
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
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      ctx.logger.error('Failed to list risky commits', {
        repo_path: input.repo_path,
        threshold: input.threshold,
        error: errorMessage
      });
      throw new Error(`Failed to list risky commits: ${errorMessage}`);
    }
  }

  @Tool({
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
  })
  @Widget('risk-dashboard')
  async generateRiskReport(input: any, ctx: ExecutionContext) {
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
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      ctx.logger.error('Failed to generate risk report', {
        repo_path: input.repo_path,
        error: errorMessage
      });
      throw new Error(`Failed to generate risk report: ${errorMessage}`);
    }
  }
}
