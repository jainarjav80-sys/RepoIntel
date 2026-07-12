export interface Commit {
    hash: string;
    message: string;
    author: string;
    date: string;
    diffStats: {
        additions: number;
        deletions: number;
        filesChanged: number;
    };
    sensitiveFiles: string[];
    imageUrl: string;
}
export interface RepositoryInfo {
    connected: boolean;
    repository_name: string;
    repo_path: string;
    current_branch: string;
    total_commits: number;
    remote_url: string;
    branch?: string;
    commit_count?: number;
    last_commit_date?: string;
    error?: string;
}
/**
 * Repository metadata extracted from a connected Git repository
 */
export interface RepositoryMetadata {
    repository_name: string;
    repo_path: string;
    connected: boolean;
    current_branch: string;
    total_commits: number;
    remote_url: string;
}
export interface BranchDiff {
    files_changed: string[];
    lines_added: number;
    lines_removed: number;
    files_count: number;
}
export interface ContributorStat {
    author: string;
    email: string;
    commit_count: number;
}
/**
 * Git Service
 *
 * Provides unified interface for Git operations.
 * Supports both real local git repositories and fixture-based fallback.
 *
 * Real Git Mode:
 * - Validates .git directory exists
 * - Executes git commands via child_process
 * - Parses git output into structured data
 *
 * Fixture Mode (Fallback):
 * - Loads fixtures/commits.json when repo_path is missing or invalid
 * - Ensures offline-first operation
 */
export declare class GitService {
    /**
     * Extract the remote URL from git config
     * Parses 'git remote -v' output to get the first remote URL
     */
    private getRemoteUrl;
    /**
     * Validate that a repository exists and git commands can be executed
     */
    validateRepository(repoPath: string): RepositoryInfo;
    /**
     * Execute a git command in a repository
     * Returns stdout as string, or null on error
     */
    executeGitCommand(repoPath: string, args: string[]): string | null;
    /**
     * Get current branch name
     */
    getCurrentBranch(repoPath: string): string;
    /**
     * Get total commit count
     */
    getCommitCount(repoPath: string): number;
    /**
     * Get last commit date
     */
    getLastCommitDate(repoPath: string): string | undefined;
    /**
     * Get recent commits from a real repository or fixtures
     */
    getRecentCommits(repoPath?: string, limit?: number): Commit[];
    /**
     * Parse git log output into Commit objects.
     *
     * IMPORTANT: This uses a SINGLE `git log --numstat` invocation to retrieve
     * commit metadata, diff stats, AND changed file names for ALL commits at once.
     * Earlier revisions spawned two additional `git show` subprocesses PER COMMIT
     * (one for --stat, one for --name-only), which is fine for a handful of
     * commits but becomes prohibitively slow (2 * limit subprocess spawns) on
     * large repositories (e.g. thousands of commits), causing timeouts and
     * silent fallback to fixture data. Do not reintroduce per-commit git calls
     * here.
     */
    private parseGitLog;
    /**
     * Get diff statistics for a specific commit
     */
    private getCommitDiffStats;
    /**
     * Detect sensitive files in a commit
     */
    private detectSensitiveFiles;
    /**
     * Get details for a specific commit
     */
    getCommitDetails(repoPath: string, hash: string): Commit | null;
    /**
     * Get contributor statistics
     */
    getContributorStats(repoPath?: string): ContributorStat[];
    /**
     * Compare two branches
     */
    compareBranches(repoPath: string, baseBranch: string, targetBranch: string): BranchDiff;
    /**
     * Load commits from fixtures/commits.json
     */
    private loadCommitsFromFixtures;
    /**
     * Find commit by hash in fixtures
     */
    private findCommitByHashInFixtures;
    /**
     * Get contributor stats from fixtures
     */
    private getContributorStatsFromFixtures;
    /**
     * Find a commit by hash (fixture-based)
     */
    findCommitByHash(hash: string, repoPath?: string): Commit | null;
    /**
     * Get all commits (fixture-based)
     */
    getAllCommits(repoPath?: string): Commit[];
    /**
     * Get commits by author (fixture-based)
     */
    getCommitsByAuthor(author: string, repoPath?: string): Commit[];
    /**
     * Get unique authors
     */
    getAuthors(repoPath?: string): string[];
    /**
     * Get all modified files across commits
     */
    getAllModifiedFiles(commits: Commit[]): Map<string, number>;
    /**
     * Get top modified files
     */
    getTopModifiedFiles(commits: Commit[], limit?: number): Array<{
        file: string;
        change_count: number;
    }>;
}
//# sourceMappingURL=git.service.d.ts.map