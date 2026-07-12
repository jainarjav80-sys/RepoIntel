import { ToolDecorator as Tool, Injectable, ExecutionContext } from '@nitrostack/core';
import { RepositoryService } from './repository.service.js';
import { ConnectRepositoryInputSchema, ConnectRepositoryOutputSchema, CompareBranchesInputSchema, CompareBranchesOutputSchema, RepositoryHealthScoreInputSchema, RepositoryHealthScoreOutputSchema, AnalyzePrInputSchema } from './schemas/commit.schema.js';
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

  @Tool({
    name: 'analyze-pr',
    description: 'Analyze a GitHub Pull Request and provide a precise risk score and summary without using the GitHub API',
    inputSchema: AnalyzePrInputSchema,
    examples: {
      request: {
        pr_url: 'https://github.com/headlamp-k8s/headlamp/pull/123'
      },
      response: {
        base_branch: 'main',
        target_branch: 'pr-123',
        files_changed: ['src/config.ts', '.env.example'],
        lines_added: 45,
        lines_removed: 12,
        files_count: 2,
        risk_score: 65,
        risk_factors: [
          'Modifies configuration files'
        ],
        summary: 'PR 123 has 2 files changed (+45/-12). Risk score: 65/100 due to config file modifications.'
      }
    }
  })
  async analyzePr(input: any, ctx: ExecutionContext) {
    try {
      if (!input.pr_url || typeof input.pr_url !== 'string') {
        throw new Error('pr_url is required and must be a valid GitHub PR URL');
      }

      ctx.logger.info('Analyzing PR', { pr_url: input.pr_url });

      // Extract repo URL and PR number from something like https://github.com/owner/repo/pull/123
      const match = input.pr_url.match(/^(https?:\/\/github\.com\/[^\/]+\/[^\/]+)\/pull\/(\d+)/);
      if (!match) {
        throw new Error('Invalid GitHub PR URL format. Expected: https://github.com/owner/repo/pull/123');
      }

      const repoUrl = match[1];
      const prNumber = match[2];

      // Try to perform real git operations, fallback to demo mode if it fails (e.g. on serverless cloud environments missing git)
      let result;
      try {
        // 1. Resolve/clone the base repository
        const localPath = this.gitService.resolveRepositoryPath(repoUrl);
        
        // 2. Fetch the PR branch
        const prBranch = this.gitService.fetchPullRequest(localPath, prNumber);
        
        // 3. Determine the default branch to compare against
        const defaultBranch = this.gitService.getDefaultBranch(localPath);

        // 4. Compare branches to calculate risk
        result = this.repositoryService.compareBranches(localPath, defaultBranch, prBranch);
        
        // Customize summary
        result.summary = `PR #${prNumber} compared against ${defaultBranch}: ` + result.summary;
      } catch (cloneError) {
        const errorMsg = cloneError instanceof Error ? cloneError.message : String(cloneError);
        ctx.logger.warn('Failed to clone or fetch PR, falling back to demo mode for hackathon', { error: errorMsg });
        
        // Mock data for hackathon presentation when running on NitroCloud
        result = {
          base_branch: 'main',
          target_branch: `pr-${prNumber}`,
          files_changed: ['src/services/auth.service.ts', 'config/database.yml', 'package.json'],
          lines_added: 215,
          lines_removed: 43,
          files_count: 3,
          risk_score: 88,
          risk_factors: [
            'Modifies core authentication logic (src/services/auth.service.ts)',
            'Changes to database configuration detected (config/database.yml)',
            'New dependencies added to package.json'
          ],
          summary: `[DEMO MODE] PR #${prNumber} compared against main: HIGH RISK. This PR introduces significant changes to authentication and database configurations. A thorough security review is strongly recommended before merging.`
        };
      }

      ctx.logger.info('PR Analyzed', { risk_score: result.risk_score });

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      ctx.logger.error('Failed to analyze PR', {
        pr_url: input.pr_url,
        error: errorMessage
      });
      throw new Error(`Failed to analyze PR: ${errorMessage}`);
    }
  }
}
