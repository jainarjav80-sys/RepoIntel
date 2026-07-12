import { GitService } from './src/services/git.service.js';
import { RepositoryService } from './src/modules/repository/repository.service.js';
import { RiskScorerService } from './src/services/risk-scorer.service.js';

async function test() {
  const gitService = new GitService();
  const riskScorer = new RiskScorerService();
  const repoService = new RepositoryService(gitService, riskScorer);

  console.log('Testing remote clone and PR analysis...');
  try {
    const prUrl = 'https://github.com/nitrocloudofficial/nitrostack/pull/1';
    console.log(`Analyzing PR: ${prUrl}`);
    
    const match = prUrl.match(/^(https?:\/\/github\.com\/[^\/]+\/[^\/]+)\/pull\/(\d+)/);
    const repoUrl = match![1];
    const prNumber = match![2];

    const localPath = gitService.resolveRepositoryPath(repoUrl);
    console.log('Cloned to:', localPath);

    const prBranch = gitService.fetchPullRequest(localPath, prNumber);
    console.log('Fetched PR branch:', prBranch);

    const defaultBranch = gitService.getDefaultBranch(localPath);
    console.log('Default branch:', defaultBranch);

    const result = repoService.compareBranches(localPath, defaultBranch, prBranch);
    console.log('Analysis Result:');
    console.log(JSON.stringify(result, null, 2));

  } catch (error) {
    console.error('Test failed:', error);
  }
}

test();
