import { z } from '@nitrostack/core';

export const ContributorStatsInputSchema = z.object({
  author: z.string().optional().describe('Author email address (optional for ranking all)'),
  repo_path: z.string().optional().describe('Path to the Git repository (optional; uses fixture data if omitted)'),
  sortBy: z.enum(['risk', 'commits']).optional().describe('Sort order when ranking all contributors'),
  limit: z.number().optional().default(10).describe('Maximum number of contributors to return when ranking')
});

export const ContributorStatsOutputSchema = z.object({
  contributors: z.array(
    z.object({
      author: z.string(),
      total_commits: z.number(),
      average_risk_score: z.number(),
      high_risk_commits: z.array(
        z.object({
          hash: z.string(),
          message: z.string(),
          risk_score: z.number()
        })
      ).optional(),
      most_modified_files: z.array(
        z.object({
          file: z.string(),
          change_count: z.number()
        })
      ).optional()
    })
  )
});

export type ContributorStatsInput = z.infer<typeof ContributorStatsInputSchema>;
export type ContributorStatsOutput = z.infer<typeof ContributorStatsOutputSchema>;
