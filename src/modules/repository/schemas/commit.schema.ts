import { z } from '@nitrostack/core';

export const CommitSchema = z.object({
  hash: z.string().describe('Commit hash'),
  message: z.string().describe('Commit message'),
  author: z.string().describe('Author email'),
  date: z.string().describe('Commit date (ISO 8601)'),
  diffStats: z.object({
    additions: z.number(),
    deletions: z.number(),
    filesChanged: z.number()
  }),
  sensitiveFiles: z.array(z.string()),
  imageUrl: z.string().optional()
});

export const ConnectRepositoryInputSchema = z.object({
  repo_path: z.string().describe('Path to the Git repository')
});

export const ConnectRepositoryOutputSchema = z.object({
  repository_name: z.string().describe('Name of the repository'),
  current_branch: z.string().describe('Current branch name'),
  connected: z.boolean().describe('Whether the repository is connected and valid'),
  commit_count: z.number().optional().describe('Total number of commits'),
  last_commit_date: z.string().optional().describe('Date of the last commit'),
  error: z.string().optional().describe('Error message if connection failed')
});

export const CompareBranchesInputSchema = z.object({
  repo_path: z.string().describe('Path to the Git repository'),
  base_branch: z.string().describe('The base branch to compare from (e.g., main)'),
  target_branch: z.string().describe('The target branch to compare to (e.g., feature-branch)')
});

export const CompareBranchesOutputSchema = z.object({
  base_branch: z.string(),
  target_branch: z.string(),
  files_changed: z.array(z.string()).describe('List of modified files'),
  lines_added: z.number(),
  lines_removed: z.number(),
  files_count: z.number(),
  risk_score: z.number().min(0).max(100).describe('Risk score based on changes'),
  risk_factors: z.array(z.string()).describe('Explanation of risk factors'),
  summary: z.string().describe('Human-readable summary of the branch comparison')
});

export const RepositoryHealthScoreInputSchema = z.object({
  repo_path: z.string().describe('Path to the Git repository')
});

export const RepositoryHealthScoreOutputSchema = z.object({
  repository_name: z.string().describe('Name of the repository'),
  overall_health_score: z.number().min(0).max(100).describe('Overall health score (0-100)'),
  commit_frequency_score: z.number().min(0).max(100).describe('Score based on commit frequency'),
  code_quality_score: z.number().min(0).max(100).describe('Score based on code quality metrics'),
  contributor_diversity_score: z.number().min(0).max(100).describe('Score based on number of contributors'),
  risk_score: z.number().min(0).max(100).describe('Average risk score of recent commits'),
  total_commits: z.number().describe('Total number of commits'),
  total_contributors: z.number().describe('Total number of contributors'),
  last_commit_date: z.string().optional().describe('Date of the last commit'),
  health_status: z.enum(['excellent', 'good', 'fair', 'poor']).describe('Overall health status'),
  recommendations: z.array(z.string()).describe('Recommendations for improving repository health'),
  summary: z.string().describe('Human-readable summary of repository health'),
  most_modified_files: z.array(
    z.object({
      file: z.string(),
      change_count: z.number()
    })
  ).describe('List of files most frequently modified'),
  recent_activity: z.array(
    z.object({
      hash: z.string(),
      message: z.string(),
      author: z.string(),
      date: z.string()
    })
  ).describe('Recent commit activity')
});

export type ConnectRepositoryInput = z.infer<typeof ConnectRepositoryInputSchema>;
export type ConnectRepositoryOutput = z.infer<typeof ConnectRepositoryOutputSchema>;
export type CompareBranchesInput = z.infer<typeof CompareBranchesInputSchema>;
export type CompareBranchesOutput = z.infer<typeof CompareBranchesOutputSchema>;
export type RepositoryHealthScoreInput = z.infer<typeof RepositoryHealthScoreInputSchema>;
export type RepositoryHealthScoreOutput = z.infer<typeof RepositoryHealthScoreOutputSchema>;
