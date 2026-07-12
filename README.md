# 🔍 Git Risk Analyzer
Automated Git repository analysis and risk scoring.

NitroStack TypeScript License: MIT MCP Offline Zero API Keys

"Know your repository's health before a bad commit breaks it."

Git Risk Analyzer is an MCP (Model Context Protocol) server that analyzes local Git repositories and identifies risky commits. It provides maintainers and engineering managers with deep insights into repository health, contributor patterns, and risk metrics.

Built on NitroStack, Git Risk Analyzer exposes its findings as MCP tools and renders interactive visualizations via built-in widgets.

## ✨ Why Git Risk Analyzer?
Most code analysis tools force you to upload source to the cloud, pay for SaaS subscriptions, or wait minutes for scans. Git Risk Analyzer does none of that.

✅ **100% offline** — your code and git history never leave your machine
✅ **Deep Git Integration** — analyzes actual commit history and diff statistics
✅ **Instant results** — processes thousands of commits in seconds
✅ **AI-native** — designed for MCP, works with any AI assistant

## 🎯 Who Is It For?
**🎓 Students & Learners**
- Understand how your commit habits impact repository health
- Catch risky changes before pushing assignments

**💼 Professional Developers**
- Pre-commit health checks before opening PRs
- Onboard faster on unfamiliar codebases by understanding contributor patterns
- Identify hardcoded secrets and risky file changes (like `.env` or config modifications)

**🏢 Engineering Teams**
- Track health scores across releases
- Automated code review guidance for junior developers
- Bus factor analysis to ensure knowledge isn't locked up with one developer

## 🚀 Project Features

### 1. Repository Health Score
**Tool:** `repository-health-score`

Scans the entire repository history and returns a comprehensive health status:
- Overall health score (excellent, good, fair, poor)
- Total commits and contributors
- Most modified files (hotspots)
- Recent activity and actionable recommendations

### 2. Commit Risk Scoring
**Tool:** `score-commit`

Analyzes a specific commit and calculates a precise risk score (0-100) based on:
- **Message Quality:** Penalizes short or unclear commit messages
- **Diff Size:** Penalizes massive changes (additions + deletions)
- **Sensitive Files:** Penalizes changes to `.env`, `package.json`, migrations, and configs
- Includes a human-readable summary and reasoning with the `verbose` flag.

### 3. Contributor Statistics
**Tool:** `contributor-stats`

Provides deep insights into individual contributors or ranks all contributors by risk:
- Total commits and average risk score
- High-risk commits authored
- Most frequently modified files by author
- Rank all contributors by average risk score or commit count

### 4. Risky Commits List
**Tool:** `list-risky-commits`

Filters the repository history to find the most dangerous commits:
- Configurable risk threshold
- Returns commits exceeding the threshold, ranked by score

### 5. Comprehensive Risk Report
**Tool:** `generate-risk-report`

Generates an aggregated report of the repository's risk profile:
- Analyzes the entire repository
- Highlights the top 10 most risky commits
- Perfect for sprint retrospectives

### 6. Branch Comparison
**Tool:** `compare-branches`

Compares risk metrics between two branches (e.g., `feature-branch` vs `main`):
- Helps identify if a new branch is introducing excessive risk before merging

## 💡 Example Use Cases

**"I'm inheriting a legacy codebase. Where do I start?"**
Run `repository-health-score` → see the most modified files and overall health to know exactly where the hotspots are.

**"Who are the top 5 riskiest contributors?"**
Run `contributor-stats` with `sortBy: risk` → returns a ranked list of contributors based on their commit risk scores.

**"Did this commit introduce something dangerous?"**
Run `score-commit` with `verbose: true` → catch hardcoded keys or massive refactors in sensitive files.

**"My team needs a risk report for the sprint."**
Run `generate-risk-report` → professional output summarizing the riskiest changes.

## 📝 Tools Summary

| Tool | Module | Input | Output |
|------|--------|-------|--------|
| `connect-repository` | repository | `{ repo_path }` | Connection status and basic info |
| `repository-health-score` | repository | `{ repo_path? }` | Full health score, hotspots, recommendations |
| `score-commit` | scanner | `{ commit_hash, repo_path?, verbose? }` | Detailed risk score and summary |
| `fetch-recent-commits` | scanner | `{ limit?, repo_path? }` | Array of recent commits with stats |
| `list-risky-commits` | reporter | `{ threshold?, repo_path? }` | Commits exceeding risk threshold |
| `generate-risk-report` | reporter | `{ repo_path? }` | Comprehensive risk report |
| `contributor-stats` | contributors | `{ author?, repo_path?, sortBy?, limit? }` | Ranked stats and high-risk commits |
| `compare-branches` | repository | `{ base_branch, target_branch, repo_path? }` | Comparison of risk metrics |

## 🎯 Accuracy
Git Risk Analyzer uses native local Git execution (`spawnSync`) to directly interface with your local repository. This means:
- **No external API calls** — entirely local and fast
- **Accurate Diffing** — uses raw git log outputs for precise addition/deletion counts
- **Fixture Fallback** — smoothly falls back to mock data (`fixtures/commits.json`) for testing if no repository path is provided

## 📦 Quick Start
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

## ⚙️ Configuration
Transport is configured automatically based on `NODE_ENV`:
- Development (`NODE_ENV=development`): STDIO only
- Production (`NODE_ENV=production`): Dual transport (STDIO + HTTP SSE)
Environment variables are loaded from `.env` via `dotenv`.

## 🏗️ Project Structure
```text
src/
├── index.ts                       # Entry point
├── app.module.ts                  # Root MCP module
├── modules/
│   ├── scanner/                   # Fetch commits, score individual commits
│   ├── reporter/                  # Generate reports, list risky commits
│   ├── repository/                # Analyze commits, repository summaries
│   └── contributors/              # Contributor stats, risk ranking
├── services/
│   ├── git.service.ts             # Git operations & CLI execution
│   └── risk-scorer.service.ts     # Core risk scoring logic
└── health/
    └── system.health.ts           # System health check
```

## 🛠️ Dependencies
- **@nitrostack/core** — MCP framework with decorators and DI
- **@nitrostack/cli** — Build tooling
- **typescript** — Strong typing
- **zod** — Input schema validation
- **@nitrostack/widgets** — Widget SDK for interactive views

## 🔒 Privacy & Security
- **Zero network calls** — everything runs locally
- **No code upload** — your repository stays on your machine
- **No API keys** — no external services, no rate limits
- **No telemetry** — we don't track what you analyze

## 🔗 Links
- [NitroStack Documentation](https://docs.nitrostack.ai)
- [NitroStudio](https://nitrostack.ai/studio)
- [GitHub](https://github.com/nitrocloudofficial/nitrostack)

## Community
- Discord: <https://discord.gg/uVWey6UhuD>
- X: <https://x.com/nitrostackai>
- YouTube: <https://www.youtube.com/@nitrostackai>
- LinkedIn: <https://linkedin.com/company/nitrostack-ai/>
- GitHub: <https://github.com/nitrostackai>
