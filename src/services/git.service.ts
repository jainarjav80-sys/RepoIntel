import { Injectable, createLogger } from '@nitrostack/core';
import * as fs from 'fs';
import * as path from 'path';
import { execSync, spawnSync } from 'child_process';

const logger = createLogger({ serviceName: 'GitService' });

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
  branch?: string; // Deprecated: use current_branch
  commit_count?: number; // Deprecated: use total_commits
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
@Injectable()
export class GitService {
  /**
   * Extract the remote URL from git config
   * Parses 'git remote -v' output to get the first remote URL
   */
  private getRemoteUrl(repoPath: string): string {
    try {
      const result = this.executeGitCommand(repoPath, ['remote', '-v']);
      if (!result) {
        return '';
      }

      // Parse output like:
      // origin  https://github.com/user/repo.git (fetch)
      // origin  https://github.com/user/repo.git (push)
      const lines = result.split('\n').filter(line => line.trim());
      if (lines.length === 0) {
        return '';
      }

      // Extract URL from first line (typically 'origin')
      const match = lines[0].match(/^\S+\s+(\S+)/);
      if (match && match[1]) {
        return match[1];
      }

      return '';
    } catch {
      return '';
    }
  }

  /**
   * Validate that a repository exists and git commands can be executed
   */
  validateRepository(repoPath: string): RepositoryInfo {
    try {
      // Normalize path
      const normalizedPath = path.resolve(repoPath);

      // Check if directory exists
      if (!fs.existsSync(normalizedPath)) {
        return {
          connected: false,
          repository_name: '',
          repo_path: normalizedPath,
          current_branch: '',
          total_commits: 0,
          remote_url: '',
          error: `Directory does not exist: ${normalizedPath}`
        };
      }

      // Check if .git directory exists
      const gitDir = path.join(normalizedPath, '.git');
      if (!fs.existsSync(gitDir)) {
        return {
          connected: false,
          repository_name: '',
          repo_path: normalizedPath,
          current_branch: '',
          total_commits: 0,
          remote_url: '',
          error: `Not a git repository: ${normalizedPath} (.git directory not found)`
        };
      }

      // Try to execute a simple git command
      try {
        const result = this.executeGitCommand(normalizedPath, ['rev-parse', '--show-toplevel']);
        if (!result) {
          return {
            connected: false,
            repository_name: '',
            repo_path: normalizedPath,
            current_branch: '',
            total_commits: 0,
            remote_url: '',
            error: 'Failed to execute git commands'
          };
        }

        // Get repository name from path
        const repoName = path.basename(normalizedPath);

        // Get current branch
        const currentBranch = this.getCurrentBranch(normalizedPath);

        // Get commit count
        const totalCommits = this.getCommitCount(normalizedPath);

        // Get remote URL
        const remoteUrl = this.getRemoteUrl(normalizedPath);

        // Get last commit date
        const lastCommitDate = this.getLastCommitDate(normalizedPath);

        return {
          connected: true,
          repository_name: repoName,
          repo_path: normalizedPath,
          current_branch: currentBranch,
          total_commits: totalCommits,
          remote_url: remoteUrl,
          last_commit_date: lastCommitDate
        };
      } catch (error) {
        return {
          connected: false,
          repository_name: '',
          repo_path: normalizedPath,
          current_branch: '',
          total_commits: 0,
          remote_url: '',
          error: `Git command failed: ${error instanceof Error ? error.message : String(error)}`
        };
      }
    } catch (error) {
      return {
        connected: false,
        repository_name: '',
        repo_path: repoPath,
        current_branch: '',
        total_commits: 0,
        remote_url: '',
        error: `Validation error: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  /**
   * Execute a git command in a repository
   * Returns stdout as string, or null on error
   */
  executeGitCommand(repoPath: string, args: string[]): string | null {
    try {
      const normalizedPath = path.resolve(repoPath);
      const result = spawnSync('git', ['-C', normalizedPath, ...args], {
        encoding: 'utf-8',
        maxBuffer: 64 * 1024 * 1024
      });

      if (result.error) {
        throw result.error;
      }
      
      if (result.status !== 0) {
        const stderr = result.stderr ? result.stderr.toString() : '';
        throw new Error(stderr || `Git command failed with status ${result.status}`);
      }

      return result.stdout ? result.stdout.toString().trim() : '';
    } catch (error) {
      // Log git command failures for debugging
      const errorMsg = error instanceof Error ? error.message : String(error);
      const stderr = error instanceof Error && 'stderr' in error ? (error as any).stderr : '';
      logger.error('Git command failed', {
        args,
        error: errorMsg,
        stderr: stderr ? stderr.toString().substring(0, 200) : 'N/A'
      });
      return null;
    }
  }

  /**
   * Get current branch name
   */
  getCurrentBranch(repoPath: string): string {
    try {
      const result = this.executeGitCommand(repoPath, ['rev-parse', '--abbrev-ref', 'HEAD']);
      return result || 'unknown';
    } catch {
      return 'unknown';
    }
  }

  /**
   * Get total commit count
   */
  getCommitCount(repoPath: string): number {
    try {
      const result = this.executeGitCommand(repoPath, ['rev-list', '--count', 'HEAD']);
      return result ? parseInt(result, 10) : 0;
    } catch {
      return 0;
    }
  }

  /**
   * Get last commit date
   */
  getLastCommitDate(repoPath: string): string | undefined {
    try {
      const result = this.executeGitCommand(repoPath, ['log', '-1', '--format=%ai']);
      return result || undefined;
    } catch {
      return undefined;
    }
  }

  /**
   * Get recent commits from a real repository or fixtures
   */
  getRecentCommits(repoPath?: string, limit: number = 10): Commit[] {
    // If no repo path provided, use fixtures
    if (!repoPath) {
      return this.loadCommitsFromFixtures().slice(0, limit);
    }

    // Validate repository
    const validation = this.validateRepository(repoPath);
    if (!validation.connected) {
      // Fallback to fixtures
      return this.loadCommitsFromFixtures().slice(0, limit);
    }

    // Get commits from real repository
    try {
      const commits = this.parseGitLog(repoPath, limit);
      return commits;
    } catch {
      // Fallback to fixtures on error
      return this.loadCommitsFromFixtures().slice(0, limit);
    }
  }

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
  private parseGitLog(repoPath: string, limit: number): Commit[] {
    try {
      const RECORD_START = '@@COMMIT_START@@';
      // Format: RECORD_START|hash|message|author|email|date
      const format = `${RECORD_START}%H|%s|%an|%ae|%ai`;
      const result = this.executeGitCommand(repoPath, [
        'log',
        `--max-count=${limit}`,
        `--format=${format}`,
        '--numstat'
      ]);

      if (!result) {
        return [];
      }

      const sensitivePatterns = [
        /\.env/,
        /\.env\./,
        /secrets/,
        /password/,
        /config\.yml/,
        /config\.yaml/,
        /database\.yml/,
        /database\.yaml/,
        /migrations\//,
        /package\.json/,
        /package-lock\.json/,
        /yarn\.lock/,
        /\.aws/,
        /\.ssh/,
        /credentials/
      ];

      const commits: Commit[] = [];
      const rawRecords = result.split(RECORD_START).filter(r => r.trim());

      for (const record of rawRecords) {
        const lines = record.split('\n');
        const headerLine = lines[0];
        const parts = headerLine.split('|');
        if (parts.length < 5) {
          continue;
        }

        const hash = parts[0];
        const message = parts[1];
        const author = parts[2];
        const email = parts[3];
        const date = parts[4];

        let additions = 0;
        let deletions = 0;
        let filesChanged = 0;
        const sensitiveFiles: string[] = [];

        // Remaining lines are numstat rows: "<additions>\t<deletions>\t<file>"
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          const numstatMatch = line.match(/^(\d+|-)\s+(\d+|-)\s+(.+)$/);
          if (!numstatMatch) continue;

          const [, addStr, delStr, file] = numstatMatch;
          if (addStr !== '-') additions += parseInt(addStr, 10);
          if (delStr !== '-') deletions += parseInt(delStr, 10);
          filesChanged++;

          for (const pattern of sensitivePatterns) {
            if (pattern.test(file)) {
              sensitiveFiles.push(file);
              break;
            }
          }
        }

        commits.push({
          hash,
          message,
          author: email || author,
          date,
          diffStats: { additions, deletions, filesChanged },
          sensitiveFiles,
          imageUrl: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop`
        });
      }

      return commits;
    } catch {
      return [];
    }
  }

  /**
   * Get diff statistics for a specific commit
   */
  private getCommitDiffStats(repoPath: string, hash: string): { additions: number; deletions: number; filesChanged: number } {
    try {
      const result = this.executeGitCommand(repoPath, ['show', '--stat', hash]);
      if (!result) {
        return { additions: 0, deletions: 0, filesChanged: 0 };
      }

      let additions = 0;
      let deletions = 0;
      let filesChanged = 0;

      const lines = result.split('\n');
      for (const line of lines) {
        // Parse lines like: "src/file.ts | 10 ++"
        const match = line.match(/(\d+)\s+\+{2,}|(\d+)\s+-{2,}/);
        if (match) {
          if (match[1]) additions += parseInt(match[1], 10);
          if (match[2]) deletions += parseInt(match[2], 10);
          filesChanged++;
        }
      }

      return { additions, deletions, filesChanged };
    } catch {
      return { additions: 0, deletions: 0, filesChanged: 0 };
    }
  }

  /**
   * Detect sensitive files in a commit
   */
  private detectSensitiveFiles(repoPath: string, hash: string): string[] {
    try {
      const result = this.executeGitCommand(repoPath, ['show', '--name-only', hash]);
      if (!result) {
        return [];
      }

      const sensitivePatterns = [
        /\.env/,
        /\.env\./,
        /secrets/,
        /password/,
        /config\.yml/,
        /config\.yaml/,
        /database\.yml/,
        /database\.yaml/,
        /migrations\//,
        /package\.json/,
        /package-lock\.json/,
        /yarn\.lock/,
        /\.aws/,
        /\.ssh/,
        /credentials/
      ];

      const files = result.split('\n').filter(line => line.trim() && !line.includes('|'));
      const sensitive: string[] = [];

      for (const file of files) {
        for (const pattern of sensitivePatterns) {
          if (pattern.test(file)) {
            sensitive.push(file);
            break;
          }
        }
      }

      return sensitive;
    } catch {
      return [];
    }
  }

  /**
   * Get details for a specific commit
   */
  getCommitDetails(repoPath: string, hash: string): Commit | null {
    try {
      const validation = this.validateRepository(repoPath);
      if (!validation.connected) {
        // Try fixtures
        return this.findCommitByHashInFixtures(hash);
      }

      const format = '%H|%s|%an|%ae|%ai';
      const result = this.executeGitCommand(repoPath, ['log', '-1', `--format=${format}`, hash]);

      if (!result) {
        return null;
      }

      const parts = result.split('|');
      if (parts.length < 5) {
        return null;
      }

      const commitHash = parts[0];
      const message = parts[1];
      const author = parts[2];
      const email = parts[3];
      const date = parts[4];

      const diffStats = this.getCommitDiffStats(repoPath, commitHash);
      const sensitiveFiles = this.detectSensitiveFiles(repoPath, commitHash);

      return {
        hash: commitHash,
        message,
        author: email || author,
        date,
        diffStats,
        sensitiveFiles,
        imageUrl: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop`
      };
    } catch {
      return this.findCommitByHashInFixtures(hash);
    }
  }

  /**
   * Get contributor statistics
   */
  getContributorStats(repoPath?: string): ContributorStat[] {
    try {
      if (!repoPath) {
        return this.getContributorStatsFromFixtures();
      }

      const validation = this.validateRepository(repoPath);
      if (!validation.connected) {
        return this.getContributorStatsFromFixtures();
      }

      const result = this.executeGitCommand(repoPath, ['shortlog', '-sne']);
      if (!result) {
        return this.getContributorStatsFromFixtures();
      }

      const stats: ContributorStat[] = [];
      const lines = result.split('\n').filter(line => line.trim());

      for (const line of lines) {
        // Format: "  123  John Doe <john@example.com>"
        const match = line.match(/^\s*(\d+)\s+(.+?)\s+<(.+?)>$/);
        if (match) {
          stats.push({
            author: match[2],
            email: match[3],
            commit_count: parseInt(match[1], 10)
          });
        }
      }

      return stats;
    } catch {
      return this.getContributorStatsFromFixtures();
    }
  }

  /**
   * Compare two branches
   */
  compareBranches(repoPath: string, baseBranch: string, targetBranch: string): BranchDiff {
    try {
      const validation = this.validateRepository(repoPath);
      if (!validation.connected) {
        return { files_changed: [], lines_added: 0, lines_removed: 0, files_count: 0 };
      }

      // Get diff stat
      const result = this.executeGitCommand(repoPath, [
        'diff',
        '--stat',
        `${baseBranch}...${targetBranch}`
      ]);

      if (!result) {
        return { files_changed: [], lines_added: 0, lines_removed: 0, files_count: 0 };
      }

      const files_changed: string[] = [];
      let lines_added = 0;
      let lines_removed = 0;

      const lines = result.split('\n');
      for (const line of lines) {
        // Parse lines like: "src/file.ts | 10 ++"
        const fileMatch = line.match(/^(.+?)\s+\|/);
        if (fileMatch) {
          files_changed.push(fileMatch[1].trim());
        }

        const addMatch = line.match(/(\d+)\s+\+{2,}/);
        if (addMatch) {
          lines_added += parseInt(addMatch[1], 10);
        }

        const delMatch = line.match(/(\d+)\s+-{2,}/);
        if (delMatch) {
          lines_removed += parseInt(delMatch[1], 10);
        }
      }

      return {
        files_changed,
        lines_added,
        lines_removed,
        files_count: files_changed.length
      };
    } catch {
      return { files_changed: [], lines_added: 0, lines_removed: 0, files_count: 0 };
    }
  }

  /**
   * Load commits from fixtures/commits.json
   */
  private loadCommitsFromFixtures(): Commit[] {
    try {
      const fixturesPath = path.join(process.cwd(), 'fixtures', 'commits.json');
      const data = fs.readFileSync(fixturesPath, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  /**
   * Find commit by hash in fixtures
   */
  private findCommitByHashInFixtures(hash: string): Commit | null {
    const allCommits = this.loadCommitsFromFixtures();
    return allCommits.find(c => c.hash === hash) || null;
  }

  /**
   * Get contributor stats from fixtures
   */
  private getContributorStatsFromFixtures(): ContributorStat[] {
    const commits = this.loadCommitsFromFixtures();
    const statsMap = new Map<string, { author: string; email: string; count: number }>();

    for (const commit of commits) {
      const key = commit.author;
      if (!statsMap.has(key)) {
        statsMap.set(key, { author: commit.author, email: commit.author, count: 0 });
      }
      const stat = statsMap.get(key)!;
      stat.count++;
    }

    return Array.from(statsMap.values())
      .map(s => ({ author: s.author, email: s.email, commit_count: s.count }))
      .sort((a, b) => b.commit_count - a.commit_count);
  }

  /**
   * Find a commit by hash (fixture-based)
   */
  findCommitByHash(hash: string, repoPath?: string): Commit | null {
    if (repoPath) {
      return this.getCommitDetails(repoPath, hash);
    }
    return this.findCommitByHashInFixtures(hash);
  }

  /**
   * Get all commits (fixture-based)
   */
  getAllCommits(repoPath?: string): Commit[] {
    if (repoPath) {
      const validation = this.validateRepository(repoPath);
      if (validation.connected) {
        const commits = this.parseGitLog(repoPath, 1000);
        // If parseGitLog returned empty array for a connected repo, log warning and fall back
        if (commits.length === 0) {
          logger.warn('parseGitLog returned empty array for connected repository', {
            repoPath,
            fallback: 'using fixtures'
          });
          return this.loadCommitsFromFixtures();
        }
        return commits;
      }
    }
    return this.loadCommitsFromFixtures();
  }

  /**
   * Get commits by author (fixture-based)
   */
  getCommitsByAuthor(author: string, repoPath?: string): Commit[] {
    const allCommits = this.getAllCommits(repoPath);
    return allCommits.filter(c => c.author === author);
  }

  /**
   * Get unique authors
   */
  getAuthors(repoPath?: string): string[] {
    const allCommits = this.getAllCommits(repoPath);
    const authors = new Set(allCommits.map(c => c.author));
    return Array.from(authors);
  }

  /**
   * Get all modified files across commits
   */
  getAllModifiedFiles(commits: Commit[]): Map<string, number> {
    const fileMap = new Map<string, number>();

    commits.forEach(commit => {
      commit.sensitiveFiles.forEach(file => {
        fileMap.set(file, (fileMap.get(file) || 0) + 1);
      });
    });

    return fileMap;
  }

  /**
   * Get top modified files
   */
  getTopModifiedFiles(commits: Commit[], limit: number = 10): Array<{ file: string; change_count: number }> {
    const fileMap = this.getAllModifiedFiles(commits);
    return Array.from(fileMap.entries())
      .map(([file, count]) => ({ file, change_count: count }))
      .sort((a, b) => b.change_count - a.change_count)
      .slice(0, limit);
  }
}
