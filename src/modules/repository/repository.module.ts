import { Module } from '@nitrostack/core';
import { RepositoryTools } from './repository.tools.js';
import { RepositoryService } from './repository.service.js';
import { GitService } from '../../services/git.service.js';
import { RiskScorerService } from '../../services/risk-scorer.service.js';

@Module({
  name: 'repository',
  description: 'Repository analysis module for commit and repository-level insights',
  controllers: [RepositoryTools],
  providers: [RepositoryService, GitService, RiskScorerService]
})
export class RepositoryModule {}
