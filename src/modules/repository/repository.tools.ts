import { ToolDecorator as Tool, Injectable, ExecutionContext } from '@nitrostack/core';
import { RepositoryService } from './repository.service.js';
import { ConnectRepositoryInputSchema, ConnectRepositoryOutputSchema, CompareBranchesInputSchema, CompareBranchesOutputSchema, RepositoryHealthScoreInputSchema, RepositoryHealthScoreOutputSchema } from './schemas/commit.schema.js';
import { GitService } from '../../services/git.service.js';

@Injectable({ deps: [RepositoryService, GitService] })
export class RepositoryTools {
  constructor(
    private repositoryService: RepositoryService,
    private gitService: GitService
  ) {}

  @Tool({
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
  })
  async connectRepository(input: any, ctx: ExecutionContext) {
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
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      ctx.logger.error('Repository connection error', {
        repo_path: input.repo_path,
        error: errorMessage
      });
      throw new Error(`Repository connection failed: ${errorMessage}`);
    }
  }


  @Tool({
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
  })
  async compareBranches(input: any, ctx: ExecutionContext) {
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

      const result = this.repositoryService.compareBranches(
        input.repo_path,
        input.base_branch,
        input.target_branch
      );

      if (!result) {
        throw new Error('Failed to compare branches');
      }

      ctx.logger.info('Branches compared', {
        files_changed: result.files_count,
        risk_score: result.risk_score
      });

      return result;
    } catch (error) {
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

  @Tool({
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
  })
  async repositoryHealthScore(input: any, ctx: ExecutionContext) {
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
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      ctx.logger.error('Failed to calculate repository health score', {
        repo_path: input.repo_path,
        error: errorMessage
      });
      throw new Error(`Failed to calculate repository health score: ${errorMessage}`);
    }
  }
}
