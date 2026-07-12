var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nitrostack/core';
import { RepositoryTools } from './repository.tools.js';
import { RepositoryService } from './repository.service.js';
import { GitService } from '../../services/git.service.js';
import { RiskScorerService } from '../../services/risk-scorer.service.js';
let RepositoryModule = class RepositoryModule {
};
RepositoryModule = __decorate([
    Module({
        name: 'repository',
        description: 'Repository analysis module for commit and repository-level insights',
        controllers: [RepositoryTools],
        providers: [RepositoryService, GitService, RiskScorerService]
    })
], RepositoryModule);
export { RepositoryModule };
//# sourceMappingURL=repository.module.js.map