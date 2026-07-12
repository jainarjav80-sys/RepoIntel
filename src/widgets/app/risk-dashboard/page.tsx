'use client';

import { useTheme, useWidgetSDK } from '@nitrostack/widgets';

export const dynamic = 'force-dynamic';

interface RiskCommit {
  hash: string;
  message: string;
  author: string;
  date: string;
  diff_stats: {
    additions: number;
    deletions: number;
    filesChanged: number;
  };
  sensitive_files: string[];
  risk_score: number;
  reasoning: string[];
  imageUrl: string;
}

interface RiskReportData {
  repo_path: string;
  total_commits: number;
  high_risk_count: number;
  average_risk_score: number;
  top_risky_commits: RiskCommit[];
}

export default function RiskDashboard() {
  const theme = useTheme();
  const { isReady, getToolOutput } = useWidgetSDK();

  const data = getToolOutput<RiskReportData>();

  if (!isReady || !data) {
    return (
      <div style={{
        padding: '24px',
        textAlign: 'center',
        color: theme === 'dark' ? '#fff' : '#000',
      }}>
        Loading…
      </div>
    );
  }

  const isDark = theme === 'dark';
  const bgColor = isDark ? '#1a1a1a' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#000000';
  const borderColor = isDark ? '#333333' : '#e5e7eb';
  const mutedColor = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)';
  const accentColor = '#64748B';

  const getRiskColor = (score: number) => {
    if (score >= 80) return '#dc2626'; // Red
    if (score >= 60) return '#f59e0b'; // Amber
    if (score >= 40) return '#eab308'; // Yellow
    return '#10b981'; // Green
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const commits = data.top_risky_commits ?? [];

  return (
    <div style={{
      padding: '24px',
      background: isDark
        ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
        : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      borderRadius: '16px',
      color: textColor,
      maxWidth: '900px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      {/* Header */}
      <div style={{
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: `1px solid ${borderColor}`,
      }}>
        <h2 style={{
          margin: '0 0 8px 0',
          fontSize: '24px',
          fontWeight: 'bold',
          color: textColor,
        }}>
          🔍 Git Risk Dashboard
        </h2>
        <p style={{
          margin: '0',
          fontSize: '14px',
          color: mutedColor,
        }}>
          Repository: <code style={{ color: accentColor }}>{data.repo_path}</code>
        </p>
      </div>

      {/* Summary Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
      }}>
        <div style={{
          padding: '16px',
          background: isDark ? '#2d2d2d' : '#ffffff',
          border: `1px solid ${borderColor}`,
          borderRadius: '12px',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '12px',
            color: mutedColor,
            marginBottom: '8px',
          }}>
            Total Commits
          </div>
          <div style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: accentColor,
          }}>
            {data.total_commits}
          </div>
        </div>

        <div style={{
          padding: '16px',
          background: isDark ? '#2d2d2d' : '#ffffff',
          border: `1px solid ${borderColor}`,
          borderRadius: '12px',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '12px',
            color: mutedColor,
            marginBottom: '8px',
          }}>
            High Risk
          </div>
          <div style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#dc2626',
          }}>
            {data.high_risk_count}
          </div>
        </div>

        <div style={{
          padding: '16px',
          background: isDark ? '#2d2d2d' : '#ffffff',
          border: `1px solid ${borderColor}`,
          borderRadius: '12px',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '12px',
            color: mutedColor,
            marginBottom: '8px',
          }}>
            Avg Risk Score
          </div>
          <div style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: getRiskColor(data.average_risk_score),
          }}>
            {data.average_risk_score.toFixed(1)}
          </div>
        </div>
      </div>

      {/* Top Risky Commits */}
      <div>
        <h3 style={{
          margin: '0 0 16px 0',
          fontSize: '18px',
          fontWeight: 'bold',
          color: textColor,
        }}>
          Top {Math.min(10, commits.length)} Risky Commits
        </h3>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
          {commits.length === 0 ? (
            <div style={{
              padding: '24px',
              textAlign: 'center',
              color: mutedColor,
              background: isDark ? '#2d2d2d' : '#ffffff',
              borderRadius: '12px',
              border: `1px solid ${borderColor}`,
            }}>
              No risky commits found
            </div>
          ) : (
            commits.map((commit, idx) => (
              <div
                key={commit.hash}
                style={{
                  padding: '16px',
                  background: isDark ? '#2d2d2d' : '#ffffff',
                  border: `2px solid ${getRiskColor(commit.risk_score)}`,
                  borderRadius: '12px',
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'flex-start',
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  flexShrink: 0,
                  background: isDark ? '#3d3d3d' : '#e5e7eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {commit.imageUrl ? (
                    <img
                      src={commit.imageUrl}
                      alt={commit.author}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <div style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: accentColor,
                    }}>
                      {commit.author.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '8px',
                  }}>
                    <div style={{
                      fontSize: '12px',
                      fontFamily: 'monospace',
                      color: accentColor,
                      fontWeight: 'bold',
                    }}>
                      {commit.hash}
                    </div>
                    <div style={{
                      padding: '4px 8px',
                      background: getRiskColor(commit.risk_score),
                      color: '#ffffff',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                    }}>
                      Risk: {commit.risk_score}
                    </div>
                  </div>

                  <p style={{
                    margin: '0 0 8px 0',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: textColor,
                    wordBreak: 'break-word',
                  }}>
                    {commit.message}
                  </p>

                  <div style={{
                    display: 'flex',
                    gap: '16px',
                    fontSize: '12px',
                    color: mutedColor,
                    marginBottom: '8px',
                  }}>
                    <span>👤 {commit.author}</span>
                    <span>📅 {formatDate(commit.date)}</span>
                  </div>

                  <div style={{
                    display: 'flex',
                    gap: '12px',
                    fontSize: '12px',
                    marginBottom: '8px',
                  }}>
                    <span style={{ color: '#10b981' }}>
                      +{commit.diff_stats.additions}
                    </span>
                    <span style={{ color: '#dc2626' }}>
                      -{commit.diff_stats.deletions}
                    </span>
                    <span style={{ color: mutedColor }}>
                      {commit.diff_stats.filesChanged} files
                    </span>
                  </div>

                  {commit.sensitive_files && commit.sensitive_files.length > 0 && (
                    <div style={{
                      padding: '8px',
                      background: isDark ? '#3d3d3d' : '#fef2f2',
                      borderRadius: '6px',
                      marginBottom: '8px',
                    }}>
                      <div style={{
                        fontSize: '11px',
                        fontWeight: 'bold',
                        color: '#dc2626',
                        marginBottom: '4px',
                      }}>
                        ⚠️ Sensitive Files:
                      </div>
                      <div style={{
                        fontSize: '11px',
                        color: mutedColor,
                      }}>
                        {commit.sensitive_files.join(', ')}
                      </div>
                    </div>
                  )}

                  {commit.reasoning && commit.reasoning.length > 0 && (
                    <div style={{
                      padding: '8px',
                      background: isDark ? '#3d3d3d' : '#f0f9ff',
                      borderRadius: '6px',
                    }}>
                      <div style={{
                        fontSize: '11px',
                        fontWeight: 'bold',
                        color: accentColor,
                        marginBottom: '4px',
                      }}>
                        📋 Risk Factors:
                      </div>
                      <ul style={{
                        margin: '0',
                        paddingLeft: '16px',
                        fontSize: '11px',
                        color: mutedColor,
                      }}>
                        {commit.reasoning.map((reason, i) => (
                          <li key={i}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        marginTop: '24px',
        paddingTop: '16px',
        borderTop: `1px solid ${borderColor}`,
        fontSize: '12px',
        textAlign: 'center',
        color: mutedColor,
      }}>
        ✨ Git Risk Analyzer | Theme: {theme || 'light'}
      </div>
    </div>
  );
}
