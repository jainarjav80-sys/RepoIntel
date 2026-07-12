import { z } from '@nitrostack/core';
export declare const CommitSchema: z.ZodObject<{
    hash: z.ZodString;
    message: z.ZodString;
    author: z.ZodString;
    date: z.ZodString;
    diffStats: z.ZodObject<{
        additions: z.ZodNumber;
        deletions: z.ZodNumber;
        filesChanged: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        additions: number;
        deletions: number;
        filesChanged: number;
    }, {
        additions: number;
        deletions: number;
        filesChanged: number;
    }>;
    sensitiveFiles: z.ZodArray<z.ZodString, "many">;
    imageUrl: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    hash: string;
    message: string;
    date: string;
    diffStats: {
        additions: number;
        deletions: number;
        filesChanged: number;
    };
    sensitiveFiles: string[];
    author: string;
    imageUrl?: string | undefined;
}, {
    hash: string;
    message: string;
    date: string;
    diffStats: {
        additions: number;
        deletions: number;
        filesChanged: number;
    };
    sensitiveFiles: string[];
    author: string;
    imageUrl?: string | undefined;
}>;
export declare const ConnectRepositoryInputSchema: z.ZodObject<{
    repo_path: z.ZodString;
}, "strip", z.ZodTypeAny, {
    repo_path: string;
}, {
    repo_path: string;
}>;
export declare const ConnectRepositoryOutputSchema: z.ZodObject<{
    repository_name: z.ZodString;
    current_branch: z.ZodString;
    connected: z.ZodBoolean;
    commit_count: z.ZodOptional<z.ZodNumber>;
    last_commit_date: z.ZodOptional<z.ZodString>;
    error: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    repository_name: string;
    current_branch: string;
    connected: boolean;
    error?: string | undefined;
    commit_count?: number | undefined;
    last_commit_date?: string | undefined;
}, {
    repository_name: string;
    current_branch: string;
    connected: boolean;
    error?: string | undefined;
    commit_count?: number | undefined;
    last_commit_date?: string | undefined;
}>;
export declare const CompareBranchesInputSchema: z.ZodObject<{
    repo_path: z.ZodString;
    base_branch: z.ZodString;
    target_branch: z.ZodString;
}, "strip", z.ZodTypeAny, {
    repo_path: string;
    base_branch: string;
    target_branch: string;
}, {
    repo_path: string;
    base_branch: string;
    target_branch: string;
}>;
export declare const CompareBranchesOutputSchema: z.ZodObject<{
    base_branch: z.ZodString;
    target_branch: z.ZodString;
    files_changed: z.ZodArray<z.ZodString, "many">;
    lines_added: z.ZodNumber;
    lines_removed: z.ZodNumber;
    files_count: z.ZodNumber;
    risk_score: z.ZodNumber;
    risk_factors: z.ZodArray<z.ZodString, "many">;
    summary: z.ZodString;
}, "strip", z.ZodTypeAny, {
    risk_score: number;
    summary: string;
    files_changed: string[];
    lines_added: number;
    lines_removed: number;
    base_branch: string;
    target_branch: string;
    files_count: number;
    risk_factors: string[];
}, {
    risk_score: number;
    summary: string;
    files_changed: string[];
    lines_added: number;
    lines_removed: number;
    base_branch: string;
    target_branch: string;
    files_count: number;
    risk_factors: string[];
}>;
export declare const RepositoryHealthScoreInputSchema: z.ZodObject<{
    repo_path: z.ZodString;
}, "strip", z.ZodTypeAny, {
    repo_path: string;
}, {
    repo_path: string;
}>;
export declare const RepositoryHealthScoreOutputSchema: z.ZodObject<{
    repository_name: z.ZodString;
    overall_health_score: z.ZodNumber;
    commit_frequency_score: z.ZodNumber;
    code_quality_score: z.ZodNumber;
    contributor_diversity_score: z.ZodNumber;
    risk_score: z.ZodNumber;
    total_commits: z.ZodNumber;
    total_contributors: z.ZodNumber;
    last_commit_date: z.ZodOptional<z.ZodString>;
    health_status: z.ZodEnum<["excellent", "good", "fair", "poor"]>;
    recommendations: z.ZodArray<z.ZodString, "many">;
    summary: z.ZodString;
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
    recent_activity: z.ZodArray<z.ZodObject<{
        hash: z.ZodString;
        message: z.ZodString;
        author: z.ZodString;
        date: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        hash: string;
        message: string;
        date: string;
        author: string;
    }, {
        hash: string;
        message: string;
        date: string;
        author: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    risk_score: number;
    summary: string;
    total_commits: number;
    repository_name: string;
    overall_health_score: number;
    commit_frequency_score: number;
    code_quality_score: number;
    contributor_diversity_score: number;
    total_contributors: number;
    health_status: "excellent" | "good" | "fair" | "poor";
    recommendations: string[];
    most_modified_files: {
        file: string;
        change_count: number;
    }[];
    recent_activity: {
        hash: string;
        message: string;
        date: string;
        author: string;
    }[];
    last_commit_date?: string | undefined;
}, {
    risk_score: number;
    summary: string;
    total_commits: number;
    repository_name: string;
    overall_health_score: number;
    commit_frequency_score: number;
    code_quality_score: number;
    contributor_diversity_score: number;
    total_contributors: number;
    health_status: "excellent" | "good" | "fair" | "poor";
    recommendations: string[];
    most_modified_files: {
        file: string;
        change_count: number;
    }[];
    recent_activity: {
        hash: string;
        message: string;
        date: string;
        author: string;
    }[];
    last_commit_date?: string | undefined;
}>;
export type ConnectRepositoryInput = z.infer<typeof ConnectRepositoryInputSchema>;
export type ConnectRepositoryOutput = z.infer<typeof ConnectRepositoryOutputSchema>;
export type CompareBranchesInput = z.infer<typeof CompareBranchesInputSchema>;
export type CompareBranchesOutput = z.infer<typeof CompareBranchesOutputSchema>;
export type RepositoryHealthScoreInput = z.infer<typeof RepositoryHealthScoreInputSchema>;
export type RepositoryHealthScoreOutput = z.infer<typeof RepositoryHealthScoreOutputSchema>;
//# sourceMappingURL=commit.schema.d.ts.map