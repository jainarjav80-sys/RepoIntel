import { Injectable } from '@nitrostack/core';
import { ScannerService } from '../scanner/scanner.service.js';
import type { Commit } from '../scanner/scanner.service.js';

@Injectable({ deps: [ScannerService] })
export class ReporterService {
  constructor(private scannerService: ScannerService) {}

  /**
   * Get risky commits above a threshold, ranked by risk score
   */
  listRiskyCommits(
    repoPath?: string,
    threshold: number = 60
  ): Array<Commit & { riskScore: number; reasoning: string[] }> {
    return this.scannerService.getRiskyCommits(repoPath, threshold).map(commit => ({
      ...commit,
      reasoning: this.scannerService.getRiskReasoning(commit, commit.riskScore)
    }));
  }

  /**
   * Generate a comprehensive risk report for a repository
   */
  generateRiskReport(repoPath?: string): {
    repoPath: string;
    totalCommits: number;
    highRiskCount: number;
    averageRiskScore: number;
    topRiskyCommits: Array<Commit & { riskScore: number; reasoning: string[] }>;
  } {
    return this.scannerService.generateRiskReport(repoPath);
  }
}
