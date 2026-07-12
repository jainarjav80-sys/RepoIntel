# RepoIntel

**Your repository's right hand — know what's risky before it merges.**

[![NitroStack](https://img.shields.io/badge/NitroStack-TypeScript-blue)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-green)]()
[![MCP](https://img.shields.io/badge/MCP-Offline-orange)]()
[![Zero API Keys](https://img.shields.io/badge/API%20Keys-None-brightgreen)]()

> "Know your repository's health before a bad commit breaks it."

RepoIntel is an MCP (Model Context Protocol) server that scans local Git repositories and surfaces risky commits, contributor patterns, and repo-wide health metrics — entirely offline, with zero setup.

It's built for two moments that matter most: **reviewing a PR before you merge it**, and **inheriting a codebase you didn't write**. Built on NitroStack, it exposes all findings as MCP tools so any AI assistant can query your repo's risk profile directly.

---

## Why RepoIntel?

Most code analysis tools force you to upload source to the cloud, pay for a SaaS subscription, or wait minutes for a scan. Git Risk Analyzer does none of that.

- ✅ **100% offline** — your code and git history never leave your machine
- ✅ **Deep Git integration** — analyzes real commit history and diff statistics, not just metadata
- ✅ **Instant results** — processes thousands of commits in seconds
- ✅ **AI-native** — designed for MCP, works with any AI assistant

---

## Who is it for?

**🏢 Maintainers — your right hand for triage and review**
This is where the tool earns its keep. Maintainers can't manually review every incoming PR line by line — Git Risk Analyzer tells you *where to look first*.
- Score incoming PRs before reviewing them, so you know which ones need a close read
- Run `compare-branches` as a pre-merge gate — catch a risky feature branch before it lands on `main`
- Spot bus-factor risk: who's the only person touching a critical file
- Decide who gets merge rights based on real contribution history, not gut feel

**💼 Professional developers**
- Pre-commit health checks before opening a PR yourself
- Onboard faster on an unfamiliar codebase by seeing contributor patterns and hotspots
- Catch hardcoded secrets or risky file changes (`.env`, config, migrations) before they ship

**🎓 Students & learners**
- Understand how commit habits affect repository health
- Catch risky changes before submitting an assignment

---

## Project Features

### 1. Repository Health Score
**Tool:** `repository-health-score`

Scans the full repository history and returns:
- Overall health status (excellent / good / fair / poor)
- Total commits and contributors
- Most modified files (hotspots)
- Recent activity and actionable recommendations

### 2. Commit Risk Scoring
**Tool:** `score-commit`

Analyzes a single commit and returns a risk score (0–100) based on:
- **Message quality** — penalizes short or unclear commit messages
- **Diff size** — penalizes unusually large changesets
- **Sensitive files** — penalizes changes to `.env`, `package.json`, migrations, and config files

Pass `verbose: true` for a human-readable summary with reasoning behind the score.

### 3. Contributor Statistics
**Tool:** `contributor-stats`

Deep insight into individual contributors, or a full team ranking:
- Total commits and average risk score per author
- High-risk commits authored
- Most frequently modified files by author
- `sortBy: risk` ranks all contributors by average risk score

### 4. Risky Commits List
**Tool:** `list-risky-commits`

Filters repository history down to the commits that matter:
- Configurable risk threshold
- Returns matching commits ranked by score

### 5. Comprehensive Risk Report
**Tool:** `generate-risk-report`

One-shot aggregate report across the whole repository:
- Highlights the top 10 highest-risk commits
- Built for sprint retrospectives and hand-off documentation

### 6. Branch Comparison
**Tool:** `compare-branches`

The pre-merge gate. Compares risk metrics between two branches (e.g. `feature/x` vs `main`):
- Flags whether a branch is introducing excessive risk before you approve the merge

### 7. Pull Request Analysis
**Tool:** `analyze-pr`

Instantly analyze any public GitHub Pull Request without needing GitHub API keys:
- Pass a GitHub PR URL (e.g., `https://github.com/owner/repo/pull/123`)
- Automatically clones the repository and fetches the PR branch natively
- Compares against the default branch and generates a risk score and summary

---

## Example Use Cases

**"Should I merge this PR right now?"**
Run `compare-branches` on the PR branch vs `main` before approving — see the risk delta at a glance.

**"I'm inheriting a legacy codebase — where do I start?"**
Run `repository-health-score` — see hotspots and overall health in one call.

**"Who are my riskiest contributors this quarter?"**
Run `contributor-stats` with `sortBy: risk` — get a ranked list to guide review priorities, not blame.

**"Did this commit introduce something dangerous?"**
Run `score-commit` with `verbose: true` — catch hardcoded keys or oversized refactors in sensitive files.

**"My team needs a risk report for the sprint."**
Run `generate-risk-report` — a clean, professional summary of the riskiest changes.

---

## Tools Summary

| Tool | Module | Input | Output |
|---|---|---|---|
| `connect-repository` | repository | `{ repo_path }` | Connection status and basic repo info |
| `repository-health-score` | repository | `{ repo_path? }` | Full health score, hotspots, recommendations |
| `score-commit` | scanner | `{ commit_hash, repo_path?, verbose? }` | Detailed risk score and summary |
| `fetch-recent-commits` | scanner | `{ limit?, repo_path? }` | Array of recent commits with diff stats |
| `list-risky-commits` | reporter | `{ threshold?, repo_path? }` | Commits exceeding the risk threshold |
| `generate-risk-report` | reporter | `{ repo_path? }` | Comprehensive risk report |
| `contributor-stats` | contributors | `{ author?, repo_path?, sortBy?, limit? }` | Ranked contributor stats and high-risk commits |
| `compare-branches` | repository | `{ base_branch, target_branch, repo_path? }` | Risk comparison between two branches |
| `analyze-pr` | repository | `{ pr_url }` | Risk analysis of a remote GitHub Pull Request |

> **Note:** All tools that accept a `repo_path` can now seamlessly accept remote **GitHub URLs** as well. The server will transparently clone and cache the repository locally to perform the analysis!

---

## Accuracy

RepoIntel uses native local Git execution (`spawnSync`) to interface directly with your repository:

- No external API calls — entirely local and fast
- Accurate diffing — uses raw `git log` output for precise addition/deletion counts
- Fixture fallback — falls back to mock data (`fixtures/commits.json`) for testing when no repository path is provided

---

## Quick Start

```bash
# Install dependencies
npm install

# Development mode (STDIO transport)
npm run dev

# Production build
npm run build

# Production start
npm start
```

---

## Configuration

Transport is selected automatically based on `NODE_ENV`:

- **Development** (`NODE_ENV=development`): STDIO only
- **Production** (`NODE_ENV=production`): Dual transport (STDIO + HTTP SSE)

Environment variables are loaded from `.env` via `dotenv`.

---

## Project Structure

```
src/
├── index.ts                       # Entry point
├── app.module.ts                  # Root MCP module
├── modules/
│   ├── scanner/                   # Fetch commits, score individual commits
│   ├── reporter/                  # Generate reports, list risky commits
│   ├── repository/                # Repository health, connection, branch comparison
│   └── contributors/              # Contributor stats and risk ranking
├── services/
│   ├── git.service.ts             # Git operations & CLI execution
│   └── risk-scorer.service.ts     # Core risk scoring logic
└── health/
    └── system.health.ts           # System health check
```

---

## Dependencies

- `@nitrostack/core` — MCP framework with decorators and DI
- `@nitrostack/cli` — Build tooling
- `typescript` — Strong typing
- `zod` — Input schema validation
- `@nitrostack/widgets` — Widget SDK for interactive views

---

## Privacy & Security

- **Zero network calls** — everything runs locally
- **No code upload** — your repository never leaves your machine
- **No API keys** — no external services, no rate limits
- **No telemetry** — we don't track what you analyze

---

## 🔗 Links
- [NitroStack Documentation](https://docs.nitrostack.ai)
- [NitroStudio](https://nitrostack.ai/studio)
- [GitHub](https://github.com/nitrocloudofficial/nitrostack)

---

<p align="center">Built for maintainers who'd rather catch risk before it merges.</p>
