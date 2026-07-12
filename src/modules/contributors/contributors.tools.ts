import { ToolDecorator as Tool, Injectable, ExecutionContext } from '@nitrostack/core';
import { ContributorsService } from './contributors.service.js';
import { ContributorStatsInputSchema, ContributorStatsOutputSchema, TopRiskContributorsInputSchema, TopRiskContributorsOutputSchema } from './schemas/contributor.schema.js';

@Injectable({ deps: [ContributorsService] })
export class ContributorsTools {
  constructor(private contributorsService: ContributorsService) {}

  @Tool({
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
  })
  async contributorStats(input: any, ctx: ExecutionContext) {
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
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      ctx.logger.error('Failed to get contributor stats', {
        author: input.author,
        error: errorMessage
      });
      throw new Error(`Failed to get contributor stats: ${errorMessage}`);
    }
  }

  @Tool({
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
  })
  async topRiskContributors(input: any, ctx: ExecutionContext) {
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
      } else {
        ctx.logger.info('Top risk contributors retrieved', {
          count: result.length,
          topAuthor: result[0]?.author
        });
      }

      return {
        contributors: result
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      ctx.logger.error('Failed to get top risk contributors', {
        limit: input.limit,
        error: errorMessage
      });
      throw new Error(`Failed to get top risk contributors: ${errorMessage}`);
    }
  }
}
