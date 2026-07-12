import { Module } from '@nitrostack/core';
import { ContributorsTools } from './contributors.tools.js';
import { ContributorsService } from './contributors.service.js';
import { GitService } from '../../services/git.service.js';
import { RiskScorerService } from '../../services/risk-scorer.service.js';

@Module({
  name: 'contributors',
  description: 'Contributor analysis module for author-level insights and risk ranking',
  controllers: [ContributorsTools],
  providers: [ContributorsService, GitService, RiskScorerService]
})
export class ContributorsModule {}
