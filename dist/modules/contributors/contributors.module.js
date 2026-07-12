var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nitrostack/core';
import { ContributorsTools } from './contributors.tools.js';
import { ContributorsService } from './contributors.service.js';
import { GitService } from '../../services/git.service.js';
import { RiskScorerService } from '../../services/risk-scorer.service.js';
let ContributorsModule = class ContributorsModule {
};
ContributorsModule = __decorate([
    Module({
        name: 'contributors',
        description: 'Contributor analysis module for author-level insights and risk ranking',
        controllers: [ContributorsTools],
        providers: [ContributorsService, GitService, RiskScorerService]
    })
], ContributorsModule);
export { ContributorsModule };
//# sourceMappingURL=contributors.module.js.map