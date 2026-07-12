# Git Risk Analyzer — Repository Intelligence MCP

An offline MCP server that analyzes local Git repositories and identifies risky commits. Provides maintainers and engineering managers with deep insights into repository health, contributor patterns, and risk metrics.

## What This Project Includes

### Core Modules

- **Scanner Module**: Fetches recent commits and calculates risk scores (0-100)
- **Reporter Module**: Generates comprehensive risk reports and lists risky commits
- **Repository Module**: Analyzes individual commits and generates repository summaries
- **Contributors Module**: Provides contributor-level insights and risk ranking

### Features

- **Offline Analysis**: Works entirely with local Git data (no external APIs, no authentication required)
- **Risk Dashboard Widget**: Visual display of repository risk metrics and top risky commits
- **Commit Analysis**: Detailed breakdown of individual commits with risk assessment
- **Repository Overview**: Aggregate metrics including contributor count, average risk, and most modified files
- **Contributor Insights**: Per-author statistics, high-risk commits, and contributor ranking
- **TypeScript + Zod**: Full type safety and validation
- **Production-ready**: Optimized for deployment

## Risk Scoring Algorithm

Each commit receives a risk score (0-100) based on:

- **Message Quality** (0-20 pts): Penalizes short or unclear commit messages
- **Diff Size** (0-40 pts): Penalizes large changes (additions + deletions)
- **Sensitive Files** (0-40 pts): Penalizes changes to `.env`, `package.json`, migrations, config files, etc.

## Available Tools

### Scanner Tools
- `fetch-recent-commits`: Fetch recent commits with diff statistics
- `score-commit`: Calculate risk score for a specific commit

### Reporter Tools
- `list-risky-commits`: List commits exceeding a risk threshold, ranked by score
- `generate-risk-report`: Generate comprehensive report with top 10 risky commits

### Repository Tools
- `analyze-commit`: Analyze a specific commit with human-readable summary and risk assessment
- `repository-summary`: Generate repository overview (commits, contributors, average risk, most modified files)

### Contributors Tools
- `contributor-stats`: Get contributor-level insights (commit count, average risk, high-risk commits, modified files)
- `top-risk-contributors`: Rank contributors by average repository risk score

## Usage Examples

### Analyze a Specific Commit
```
User: "Analyze commit a3f7e2c1"
Assistant: Returns commit summary, changed files, risk score, and reasoning
```

### Get Repository Overview
```
User: "Give me a repository summary for /home/user/my-project"
Assistant: Returns total commits, contributors, average risk, most modified files, and recent activity
```

### Contributor Insights
```
User: "Show contributor stats for alice@example.com"
Assistant: Returns commit count, average risk score, high-risk commits, and frequently modified files
```

### Risk Ranking
```
User: "Who are the top 5 risky contributors?"
Assistant: Returns ranked list of contributors by average risk score
```

## Architecture

### Offline-First Design

The project is designed to work entirely offline:
- **No GitHub APIs**: Uses only local Git repositories
- **No Authentication**: No credentials or tokens required
- **Fixture-Based**: Currently uses `fixtures/commits.json` for demo data
- **Future-Ready**: Git service abstraction allows easy migration to real `git` commands

### Service Layer

- **GitService**: Unified interface for Git operations (fixture-based, easily extensible)
- **RiskScorerService**: Centralized risk scoring logic used across all modules
- **RepositoryService**: Repository-level analysis and aggregation
- **ContributorsService**: Contributor-level insights and ranking

### Module Structure

```
src/
├── modules/
│   ├── scanner/          # Fetch commits, score individual commits
│   ├── reporter/         # Generate reports, list risky commits
│   ├── repository/       # Analyze commits, repository summaries
│   └── contributors/     # Contributor stats, risk ranking
├── services/
│   ├── git.service.ts    # Git operations (fixture-based)
│   └── risk-scorer.service.ts  # Risk scoring logic
└── app.module.ts         # Root module registration
```

## Quick Start

```bash
npm run dev
```

## Common Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Build and start
npm run start:prod   # Start production build
```

## NitroStudio

NitroStudio is the recommended way to test and debug this project during development.

- Download: <https://nitrostack.ai/studio>
- Studio: <https://nitrostack.ai/studio>

## Future Enhancements

- **Real Git Integration**: Replace fixture data with actual `git log` parsing
- **Repository Cloning**: Support for analyzing remote repositories
- **Custom Risk Rules**: Configurable risk scoring based on team preferences
- **Historical Trends**: Track risk metrics over time
- **Team Dashboards**: Multi-repository analysis and team-level insights

## Links

- Docs: <https://docs.nitrostack.ai>
- Main repository: <https://github.com/nitrocloudofficial/nitrostack>

## Community

- Discord: <https://discord.gg/uVWey6UhuD>
- X: <https://x.com/nitrostackai>
- YouTube: <https://www.youtube.com/@nitrostackai>
- LinkedIn: <https://linkedin.com/company/nitrostack-ai/>
- GitHub: <https://github.com/nitrostackai>
