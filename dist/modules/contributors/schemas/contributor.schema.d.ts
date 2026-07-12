import { z } from '@nitrostack/core';
export declare const ContributorStatsInputSchema: z.ZodObject<{
    author: z.ZodString;
    repo_path: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    author: string;
    repo_path?: string | undefined;
}, {
    author: string;
    repo_path?: string | undefined;
}>;
export declare const ContributorStatsOutputSchema: z.ZodObject<{
    author: z.ZodString;
    total_commits: z.ZodNumber;
    average_risk_score: z.ZodNumber;
    high_risk_commits: z.ZodArray<z.ZodObject<{
        hash: z.ZodString;
        message: z.ZodString;
        risk_score: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        hash: string;
        message: string;
        risk_score: number;
    }, {
        hash: string;
        message: string;
        risk_score: number;
    }>, "many">;
    most_modified_files: z.ZodArray<z.ZodObject<{
        file: z.ZodString;
        change_count: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        file: string;
        change_count: number;
    }, {
        file: string;
        change_count: number;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    author: string;
    total_commits: number;
    average_risk_score: number;
    most_modified_files: {
        file: string;
        change_count: number;
    }[];
    high_risk_commits: {
        hash: string;
        message: string;
        risk_score: number;
    }[];
}, {
    author: string;
    total_commits: number;
    average_risk_score: number;
    most_modified_files: {
        file: string;
        change_count: number;
    }[];
    high_risk_commits: {
        hash: string;
        message: string;
        risk_score: number;
    }[];
}>;
export declare const TopRiskContributorsInputSchema: z.ZodObject<{
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    repo_path: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    repo_path?: string | undefined;
}, {
    repo_path?: string | undefined;
    limit?: number | undefined;
}>;
export declare const TopRiskContributorsOutputSchema: z.ZodObject<{
    contributors: z.ZodArray<z.ZodObject<{
        author: z.ZodString;
        average_risk: z.ZodNumber;
        total_commits: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        author: string;
        total_commits: number;
        average_risk: number;
    }, {
        author: string;
        total_commits: number;
        average_risk: number;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    contributors: {
        author: string;
        total_commits: number;
        average_risk: number;
    }[];
}, {
    contributors: {
        author: string;
        total_commits: number;
        average_risk: number;
    }[];
}>;
export type ContributorStatsInput = z.infer<typeof ContributorStatsInputSchema>;
export type ContributorStatsOutput = z.infer<typeof ContributorStatsOutputSchema>;
export type TopRiskContributorsInput = z.infer<typeof TopRiskContributorsInputSchema>;
export type TopRiskContributorsOutput = z.infer<typeof TopRiskContributorsOutputSchema>;
//# sourceMappingURL=contributor.schema.d.ts.map