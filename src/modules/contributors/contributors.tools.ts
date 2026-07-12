import { ToolDecorator as Tool, Injectable, ExecutionContext } from '@nitrostack/core';
import { ContributorsService } from './contributors.service.js';
import { ContributorStatsInputSchema, ContributorStatsOutputSchema } from './schemas/contributor.schema.js';

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
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      ctx.logger.error('Failed to get contributor stats', {
        error: errorMessage
      });
      throw new Error(`Failed to get contributor stats: ${errorMessage}`);
    }
  }


}
