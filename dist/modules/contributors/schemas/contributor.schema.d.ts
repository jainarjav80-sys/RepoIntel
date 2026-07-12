import { z } from '@nitrostack/core';
export declare const ContributorStatsInputSchema: z.ZodObject<{
    author: z.ZodOptional<z.ZodString>;
    repo_path: z.ZodOptional<z.ZodString>;
    sortBy: z.ZodOptional<z.ZodEnum<["risk", "commits"]>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    repo_path?: string | undefined;
    author?: string | undefined;
    sortBy?: "commits" | "risk" | undefined;
}, {
    repo_path?: string | undefined;
    limit?: number | undefined;
    author?: string | undefined;
    sortBy?: "commits" | "risk" | undefined;
}>;
export declare const ContributorStatsOutputSchema: z.ZodObject<{
    contributors: z.ZodArray<z.ZodObject<{
        author: z.ZodString;
        total_commits: z.ZodNumber;
        average_risk_score: z.ZodNumber;
        high_risk_commits: z.ZodOptional<z.ZodArray<z.ZodObject<{
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
        }>, "many">>;
        most_modified_files: z.ZodOptional<z.ZodArray<z.ZodObject<{
            file: z.ZodString;
            change_count: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            file: string;
            change_count: number;
        }, {
            file: string;
            change_count: number;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        author: string;
        total_commits: number;
        average_risk_score: number;
        most_modified_files?: {
            file: string;
            change_count: number;
        }[] | undefined;
        high_risk_commits?: {
            hash: string;
            message: string;
            risk_score: number;
        }[] | undefined;
    }, {
        author: string;
        total_commits: number;
        average_risk_score: number;
        most_modified_files?: {
            file: string;
            change_count: number;
        }[] | undefined;
        high_risk_commits?: {
            hash: string;
            message: string;
            risk_score: number;
        }[] | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    contributors: {
        author: string;
        total_commits: number;
        average_risk_score: number;
        most_modified_files?: {
            file: string;
            change_count: number;
        }[] | undefined;
        high_risk_commits?: {
            hash: string;
            message: string;
            risk_score: number;
        }[] | undefined;
    }[];
}, {
    contributors: {
        author: string;
        total_commits: number;
        average_risk_score: number;
        most_modified_files?: {
            file: string;
            change_count: number;
        }[] | undefined;
        high_risk_commits?: {
            hash: string;
            message: string;
            risk_score: number;
        }[] | undefined;
    }[];
}>;
export type ContributorStatsInput = z.infer<typeof ContributorStatsInputSchema>;
export type ContributorStatsOutput = z.infer<typeof ContributorStatsOutputSchema>;
//# sourceMappingURL=contributor.schema.d.ts.map