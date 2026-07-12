var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nitrostack/core';
import { ScannerService } from '../scanner/scanner.service.js';
let ReporterService = class ReporterService {
    scannerService;
    constructor(scannerService) {
        this.scannerService = scannerService;
    }
    /**
     * Get risky commits above a threshold, ranked by risk score
     */
    listRiskyCommits(repoPath, threshold = 60) {
        return this.scannerService.getRiskyCommits(repoPath, threshold).map(commit => ({
            ...commit,
            reasoning: this.scannerService.getRiskReasoning(commit, commit.riskScore)
        }));
    }
    /**
     * Generate a comprehensive risk report for a repository
     */
    generateRiskReport(repoPath) {
        return this.scannerService.generateRiskReport(repoPath);
    }
};
ReporterService = __decorate([
    Injectable({ deps: [ScannerService] }),
    __metadata("design:paramtypes", [ScannerService])
], ReporterService);
export { ReporterService };
//# sourceMappingURL=reporter.service.js.map