import { z } from '@nitrostack/core';
export const ContributorStatsInputSchema = z.object({
    author: z.string().describe('Author email address'),
    repo_path: z.string().optional().describe('Path to the Git repository (optional; uses fixture data if omitted)')
});
export const ContributorStatsOutputSchema = z.object({
    author: z.string(),
    total_commits: z.number(),
    average_risk_score: z.number(),
    high_risk_commits: z.array(z.object({
        hash: z.string(),
        message: z.string(),
        risk_score: z.number()
    })),
    most_modified_files: z.array(z.object({
        file: z.string(),
        change_count: z.number()
    }))
});
export const TopRiskContributorsInputSchema = z.object({
    limit: z.number().optional().default(10).describe('Maximum number of contributors to return'),
    repo_path: z.string().optional().describe('Path to the Git repository (optional; uses fixture data if omitted)')
});
export const TopRiskContributorsOutputSchema = z.object({
    contributors: z.array(z.object({
        author: z.string(),
        average_risk: z.number(),
        total_commits: z.number()
    }))
});
//# sourceMappingURL=contributor.schema.js.map