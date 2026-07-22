import React, { useState, useEffect } from 'react';
import { LineChart, BarChart2, TrendingUp, Award, Clock, Calendar, Video, Target, Sparkles, Filter, Search, ChevronRight, Activity, ArrowUpRight, CheckCircle2, Zap, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../config';

const MetricsDashboard = ({ user }) => {
  const [metricsList, setMetricsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMetricDetail, setSelectedMetricDetail] = useState(null);
  const [chartTab, setChartTab] = useState('all');
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [visibleSeries, setVisibleSeries] = useState({ studio: true, impromptu: true, prepared: true });
  const [selectedSubMetric, setSelectedSubMetric] = useState('filler_words');
  const [hoveredSubPoint, setHoveredSubPoint] = useState(null);

  const subMetricsConfig = [
    { id: 'filler_words', label: 'Filler Words', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)' },
    { id: 'introduction', label: 'Introduction (Opening)', color: '#38bdf8', bg: 'rgba(56,189,248,0.08)', border: 'rgba(56,189,248,0.25)' },
    { id: 'conclusion', label: 'Conclusion', color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.25)' },
    { id: 'pronunciation', label: 'Pronunciation', color: '#a855f7', bg: 'rgba(168,85,247,0.08)', border: 'rgba(168,85,247,0.25)' },
    { id: 'fluency', label: 'Fluency & Delivery', color: '#ec4899', bg: 'rgba(236,72,153,0.08)', border: 'rgba(236,72,153,0.25)' },
    { id: 'grammar', label: 'Grammar', color: '#6366f1', bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.25)' },
    { id: 'body_language', label: 'Body Language', color: '#0ea5e9', bg: 'rgba(14,165,233,0.08)', border: 'rgba(14,165,233,0.25)' },
    { id: 'improvisation', label: 'Improvisation', color: '#f43f5e', bg: 'rgba(244,63,94,0.08)', border: 'rgba(244,63,94,0.25)' },
    { id: 'storytelling', label: 'Storytelling', color: '#14b8a6', bg: 'rgba(20,184,166,0.08)', border: 'rgba(20,184,166,0.25)' },
    { id: 'audience_connection', label: 'Audience Connection', color: '#84cc16', bg: 'rgba(132,204,22,0.08)', border: 'rgba(132,204,22,0.25)' }
  ];

  const getSubMetricValue = (item, metricId) => {
    if (!item || !item.metrics) return null;
    const m = item.metrics;
    switch (metricId) {
      case 'filler_words':
        return m.filler_words ?? m.fillerWords ?? null;
      case 'introduction':
        return m.introduction ?? m.introduction_score ?? m.opening ?? null;
      case 'conclusion':
        return m.conclusion ?? m.conclusion_score ?? null;
      case 'pronunciation':
        return m.pronunciation ?? m.pronunciation_score ?? null;
      case 'fluency':
        return m.fluency ?? m.delivery_metrics ?? m.delivery ?? null;
      case 'grammar':
        return m.grammar_metrics ?? m.grammar ?? null;
      case 'body_language':
        return m.body_language ?? m.bodyLanguage ?? null;
      case 'improvisation':
        return m.improvisation ?? null;
      case 'storytelling':
        return m.storytelling ?? null;
      case 'audience_connection':
        return m.audience_connection ?? m.audienceConnection ?? null;
      default:
        return null;
    }
  };

  const getSpeechCategory = (m) => {
    if (!m) return 'prepared';
    const title = (m.speechTitle || m.videoTitle || m.title || '').toLowerCase();
    const key = (m.videoKey || m.key || '').toLowerCase();
    const type = (m.speechType || m.category || '').toLowerCase();

    if (type === 'studio' || title.includes('studio') || key.includes('studio')) return 'studio';
    if (type === 'impromptu' || title.includes('impromptu') || key.includes('impromptu')) return 'impromptu';
    return 'prepared';
  };

  const getUserId = () => {
    if (user?.id) return user.id;
    if (user?.userId) return user.userId;
    if (user?.email) return user.email;
    try {
      const stored = localStorage.getItem('speechUser');
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.id || parsed.userId || parsed.email;
      }
    } catch (e) {}
    return null;
  };

  const formatSpeechTitle = (item) => {
    if (!item) return 'Speech Practice';
    let rawTitle = item.speechTitle || item.videoTitle || item.title;
    if (rawTitle && rawTitle.toLowerCase() !== 'untitled' && rawTitle !== 'Video Speech Evaluation' && !rawTitle.toLowerCase().startsWith('untitled')) {
      return rawTitle;
    }

    // Extract human-readable title from videoKey (e.g., uploads/user_id/1784563-Impromptu_Is_failure_a_prerequisite.mp4)
    const rawKey = item.videoKey || item.key || '';
    if (rawKey) {
      let basename = rawKey.split('/').pop();
      // Remove timestamp or ID numbers at start (e.g. 1784563- or 1784563_)
      basename = basename.replace(/^\d+[-_]?/, '');
      // Strip extensions (.mp4, .webm, .mov, .m4a, .json)
      basename = basename.replace(/\.(mp4|webm|mov|m4a|avi|mkv|json)$/i, '');
      // Replace underscores and hyphens with spaces
      let cleaned = basename.replace(/[-_]/g, ' ').trim();
      if (cleaned) {
        return cleaned.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      }
    }

    return 'Impromptu Speech Practice';
  };

  const [quotaInfo, setQuotaInfo] = useState(null);

  useEffect(() => {
    fetchMetrics();
  }, [user]);

  const fetchMetrics = async () => {
    setLoading(true);
    const userId = getUserId();
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      // 0. Fetch Quota Info
      try {
        const qRes = await fetch(`${API_BASE_URL}/get-speech-quota`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId })
        });
        if (qRes.ok) {
          const qData = await qRes.json();
          setQuotaInfo(qData);
        }
      } catch (qErr) {
        console.warn("Could not fetch speech quota info:", qErr);
      }

      // 1. Fetch from SpeechMetrics table
      const res = await fetch(`${API_BASE_URL}/get-speech-metrics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      const data = await res.json();
      let fetched = data.metrics || [];

      // 2. Also fetch from student evaluations to unify all user speech history
      try {
        const evalRes = await fetch(`${API_BASE_URL}/get-student-evaluations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId })
        });
        const evalData = await evalRes.json();
        const evals = evalData.evaluations || [];
        
        // Merge evaluations into metrics if not already present
        const existingKeys = new Set(fetched.map(m => m.videoKey));
        evals.forEach(ev => {
          if (!existingKeys.has(ev.videoKey)) {
            fetched.push({
              userId: ev.userId,
              videoKey: ev.videoKey,
              speechTitle: ev.videoTitle || ev.title || 'Video Speech Evaluation',
              evaluatedAt: ev.evaluatedAt || ev.createdAt || new Date().toISOString(),
              overallScore: ev.overall_score || ev.overallScore || ev.score || 8.2,
              metrics: ev.metrics || {
                introduction: ev.introduction_score || 8.0,
                delivery: ev.delivery_score || 8.5,
                bodyLanguage: ev.body_language_score || 8.0,
                grammar: ev.grammar_score || 8.8,
                overall: ev.overall_score || 8.2
              },
              deliveryData: ev.deliveryData || { wordCount: 150, totalDuration: 60 }
            });
          }
        });
      } catch (err) {
        console.warn("Could not fetch student evaluations for metrics merge:", err);
      }

      // Normalize all scores to 10.0 scale
      fetched = fetched.map(m => {
        let score = parseFloat(m.overallScore || m.score || 8.0);
        if (score > 10) score = parseFloat((score / 10.0).toFixed(1));
        return {
          ...m,
          overallScore: score.toFixed(1)
        };
      });

      // Sort by evaluatedAt descending
      fetched.sort((a, b) => new Date(b.evaluatedAt || 0) - new Date(a.evaluatedAt || 0));

      setMetricsList(fetched);
    } catch (e) {
      console.error("Failed to load user metrics:", e);
    } finally {
      setLoading(false);
    }
  };

  // Summary Analytics Calculations
  const totalSpeeches = metricsList.length;
  const avgOverall = totalSpeeches > 0
    ? (metricsList.reduce((acc, m) => acc + parseFloat(m.overallScore || 0), 0) / totalSpeeches).toFixed(1)
    : '0.0';

  const avgPronunciation = totalSpeeches > 0
    ? (metricsList.reduce((acc, m) => {
        const p = m.metrics?.pronunciation || m.metrics?.delivery || m.overallScore || 8.0;
        return acc + parseFloat(p);
      }, 0) / totalSpeeches).toFixed(1)
    : '0.0';

  const avgFluency = totalSpeeches > 0
    ? (metricsList.reduce((acc, m) => {
        const f = m.metrics?.fluency || m.metrics?.bodyStructure || m.overallScore || 8.0;
        return acc + parseFloat(f);
      }, 0) / totalSpeeches).toFixed(1)
    : '0.0';

  // Filtered List
  const filteredMetrics = metricsList.filter(m => {
    const titleMatch = (m.speechTitle || m.videoKey || '').toLowerCase().includes(searchQuery.toLowerCase());
    if (selectedCategory === 'all') return titleMatch;
    if (selectedCategory === 'high') return titleMatch && parseFloat(m.overallScore) >= 8.5;
    if (selectedCategory === 'medium') return titleMatch && parseFloat(m.overallScore) >= 7.0 && parseFloat(m.overallScore) < 8.5;
    if (selectedCategory === 'studio') return titleMatch && (m.speechTitle || '').includes('Studio');
    return titleMatch;
  });

  const getScoreBadgeColor = (score) => {
    const val = parseFloat(score);
    if (val >= 8.5) return { bg: 'rgba(34,197,94,0.15)', text: '#22c55e', border: 'rgba(34,197,94,0.4)' };
    if (val >= 7.0) return { bg: 'rgba(56,189,248,0.15)', text: '#38bdf8', border: 'rgba(56,189,248,0.4)' };
    if (val >= 5.0) return { bg: 'rgba(245,158,11,0.15)', text: '#f59e0b', border: 'rgba(245,158,11,0.4)' };
    return { bg: 'rgba(239,68,68,0.15)', text: '#ef4444', border: 'rgba(239,68,68,0.4)' };
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1rem 1rem 4rem' }}>
      {/* Header Banner */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 className="gradient-text" style={{ fontSize: '2.4rem', fontWeight: '800', margin: '0 0 0.5rem 0' }}>Your Speech Performance & Metrics</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '650px', margin: '0 auto' }}>
          Track rating metrics, pronunciation accuracy, delivery progress, and score evolution across all your practice sessions.
        </p>
      </div>

      {/* Top Analytics Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {/* Total Practice Sessions */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '1.25rem', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '1rem', background: 'rgba(56,189,248,0.15)', border: '1px solid rgba(56,189,248,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Video size={28} color="#38bdf8" />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Speeches</div>
            <div style={{ fontSize: '2.2rem', fontWeight: '900', color: 'var(--text-primary)' }}>{totalSpeeches}</div>
          </div>
        </div>

        {/* Average Overall Rating */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '1.25rem', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '1rem', background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Award size={28} color="#22c55e" />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Average Overall Rating</div>
            <div style={{ fontSize: '2.2rem', fontWeight: '900', color: '#22c55e' }}>
              {avgOverall}<span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: '600' }}> / 10</span>
            </div>
          </div>
        </div>

        {/* Pronunciation & Delivery Avg */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '1.25rem', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '1rem', background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={28} color="#a855f7" />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Avg Pronunciation</div>
            <div style={{ fontSize: '2.2rem', fontWeight: '900', color: '#a855f7' }}>
              {avgPronunciation}<span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: '600' }}> / 10</span>
            </div>
          </div>
        </div>

        {/* Fluency & Prosody Avg */}
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '1.25rem', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '1rem', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={28} color="#f59e0b" />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Avg Fluency & Pace</div>
            <div style={{ fontSize: '2.2rem', fontWeight: '900', color: '#f59e0b' }}>
              {avgFluency}<span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: '600' }}> / 10</span>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Practice Quotas Banner (Option 3) */}
      {quotaInfo && (
        <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', borderRadius: '1.25rem', border: '1px solid var(--glass-border)', marginBottom: '2rem', background: 'rgba(0, 0, 0, 0.25)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <ShieldCheck size={22} color="#38bdf8" />
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                  Monthly Practice Quotas ({quotaInfo.tier} Plan)
                </h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Feature-specific monthly practice limits for your account.
                </p>
              </div>
            </div>
            {!quotaInfo.isPro && (
              <a href="#upgrade" onClick={(e) => { e.preventDefault(); alert("Click Upgrade on the top navbar or Profile to upgrade to Pro for increased monthly limits!"); }} style={{ padding: '0.45rem 0.95rem', borderRadius: '0.65rem', background: 'linear-gradient(135deg, #a855f7, #38bdf8)', color: '#fff', fontSize: '0.8rem', fontWeight: '800', textDecoration: 'none', boxShadow: '0 4px 12px rgba(168,85,247,0.3)' }}>
                ⚡ Upgrade to Pro
              </a>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {/* Prepared Speeches */}
            <div style={{ padding: '0.85rem 1rem', borderRadius: '0.85rem', background: 'rgba(34, 197, 94, 0.08)', border: '1px solid rgba(34, 197, 94, 0.25)' }}>
              <div style={{ fontSize: '0.75rem', color: '#22c55e', fontWeight: '800', textTransform: 'uppercase' }}>Prepared Speeches</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#22c55e', marginTop: '0.2rem' }}>
                {quotaInfo.counts.prepared} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>/ {quotaInfo.maxLimits.prepared}</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>evaluations this month</div>
            </div>

            {/* Impromptu Speaking */}
            <div style={{ padding: '0.85rem 1rem', borderRadius: '0.85rem', background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
              <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: '800', textTransform: 'uppercase' }}>Impromptu Speaking</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#38bdf8', marginTop: '0.2rem' }}>
                {quotaInfo.counts.impromptu} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>/ {quotaInfo.maxLimits.impromptu}</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>sessions this month</div>
            </div>

            {/* Speech Studio */}
            <div style={{ padding: '0.85rem 1rem', borderRadius: '0.85rem', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
              <div style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: '800', textTransform: 'uppercase' }}>Speech Studio</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#ef4444', marginTop: '0.2rem' }}>
                {quotaInfo.isPro ? 'Unlimited' : `${quotaInfo.counts.studio} / ${quotaInfo.maxLimits.studio}`}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>drills this month</div>
            </div>
          </div>
        </div>
      )}

      {/* Rating Trends & Multi-Category Line Graph Panel */}
      <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '1.25rem', border: '1px solid var(--glass-border)', marginBottom: '2rem' }}>
        
        {/* Graph Header & Category View Switcher */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800', margin: '0 0 0.25rem 0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={22} color="#38bdf8" /> Speech Score Evolution Trend
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>
              Performance line graph tracking rating trends across Studio, Impromptu, and Prepared speeches.
            </p>
          </div>

          {/* Category View Tabs */}
          <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(0,0,0,0.25)', padding: '0.3rem', borderRadius: '0.75rem', border: '1px solid var(--glass-border)' }}>
            {[
              { id: 'all', label: 'All Combined' },
              { id: 'studio', label: 'Speech Studio', color: '#ef4444' },
              { id: 'impromptu', label: 'Impromptu', color: '#38bdf8' },
              { id: 'prepared', label: 'Prepared', color: '#22c55e' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setChartTab(tab.id)}
                style={{
                  padding: '0.4rem 0.85rem', borderRadius: '0.55rem', border: 'none',
                  fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s',
                  background: chartTab === tab.id ? (tab.color || 'var(--accent-primary)') : 'transparent',
                  color: chartTab === tab.id ? '#ffffff' : 'var(--text-secondary)',
                  boxShadow: chartTab === tab.id ? '0 2px 8px rgba(0,0,0,0.2)' : 'none'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Averages Summary Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { key: 'studio', label: 'Speech Studio', color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.25)' },
            { key: 'impromptu', label: 'Impromptu Speaking', color: '#38bdf8', bg: 'rgba(56,189,248,0.08)', border: 'rgba(56,189,248,0.25)' },
            { key: 'prepared', label: 'Prepared Speeches', color: '#22c55e', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.25)' }
          ].map(cat => {
            const catSpeeches = metricsList.filter(m => getSpeechCategory(m) === cat.key);
            const count = catSpeeches.length;
            const avg = count > 0
              ? (catSpeeches.reduce((acc, m) => acc + parseFloat(m.overallScore || 0), 0) / count).toFixed(1)
              : 'N/A';

            return (
              <div
                key={cat.key}
                onClick={() => setVisibleSeries(prev => ({ ...prev, [cat.key]: !prev[cat.key] }))}
                style={{
                  padding: '0.85rem 1.1rem', borderRadius: '0.85rem',
                  background: cat.bg, border: `1px solid ${cat.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  cursor: 'pointer', opacity: visibleSeries[cat.key] ? 1 : 0.45,
                  transition: 'all 0.2s'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', color: cat.color, fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {cat.label}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>
                    {count} Sessions Evaluated
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: '900', color: cat.color }}>
                    {avg}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
                    avg score
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive SVG Line Graph Canvas */}
        {(() => {
          // Sort chronologically (oldest first for line graph)
          const chronological = [...metricsList].sort((a, b) => new Date(a.evaluatedAt || 0) - new Date(b.evaluatedAt || 0));

          if (chronological.length === 0) {
            return (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <Activity size={36} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
                <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: '600' }}>No evaluation score points logged yet.</p>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.82rem' }}>Practice in Speech Studio or record an Impromptu Speech to build your line graph!</p>
              </div>
            );
          }

          const svgWidth = 800;
          const svgHeight = 260;
          const padding = { top: 30, right: 30, bottom: 40, left: 45 };
          const graphW = svgWidth - padding.left - padding.right;
          const graphH = svgHeight - padding.top - padding.bottom;

          // Categorize series
          const categories = ['studio', 'impromptu', 'prepared'];
          const catColors = { studio: '#ef4444', impromptu: '#38bdf8', prepared: '#22c55e' };

          const seriesData = {};
          categories.forEach(cat => {
            let catItems = chronological.filter(m => getSpeechCategory(m) === cat);
            if (chartTab !== 'all' && chartTab !== cat) {
              catItems = [];
            }
            if (!visibleSeries[cat]) {
              catItems = [];
            }

            seriesData[cat] = catItems.map((item, idx) => {
              const score = parseFloat(item.overallScore || 8.0);
              // Calculate X based on chronological position across all items
              const totalItems = chronological.length;
              const globalIdx = chronological.findIndex(x => x === item);
              const x = padding.left + (totalItems > 1 ? (globalIdx / (totalItems - 1)) * graphW : graphW / 2);
              const y = padding.top + graphH - (score / 10) * graphH;
              return { x, y, score, item, category: cat };
            });
          });

          const buildSvgPath = (points) => {
            if (!points || points.length === 0) return '';
            if (points.length === 1) return `M ${points[0].x},${points[0].y} L ${points[0].x},${points[0].y}`;
            let p = `M ${points[0].x},${points[0].y}`;
            for (let i = 0; i < points.length - 1; i++) {
              const curr = points[i];
              const next = points[i + 1];
              const ctrlX = (curr.x + next.x) / 2;
              p += ` C ${ctrlX},${curr.y} ${ctrlX},${next.y} ${next.x},${next.y}`;
            }
            return p;
          };

          const buildAreaPath = (points) => {
            if (!points || points.length === 0) return '';
            const linePath = buildSvgPath(points);
            const bottomY = padding.top + graphH;
            return `${linePath} L ${points[points.length - 1].x},${bottomY} L ${points[0].x},${bottomY} Z`;
          };

          return (
            <div style={{ position: 'relative', width: '100%', background: 'rgba(0,0,0,0.3)', borderRadius: '1rem', padding: '1rem', border: '1px solid var(--glass-border)' }}>
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
                <defs>
                  <linearGradient id="studioGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="impromptuGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="preparedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Y-Axis Horizontal Gridlines & Labels */}
                {[10, 8, 6, 4, 2, 0].map((val) => {
                  const y = padding.top + graphH - (val / 10) * graphH;
                  return (
                    <g key={val}>
                      <line
                        x1={padding.left}
                        y1={y}
                        x2={svgWidth - padding.right}
                        y2={y}
                        stroke="rgba(255,255,255,0.08)"
                        strokeDasharray={val === 0 || val === 10 ? "none" : "4 4"}
                      />
                      <text
                        x={padding.left - 10}
                        y={y + 4}
                        fill="rgba(255,255,255,0.45)"
                        fontSize="10"
                        fontWeight="600"
                        textAnchor="end"
                      >
                        {val}.0
                      </text>
                    </g>
                  );
                })}

                {/* X-Axis Date Labels */}
                {chronological.map((m, idx) => {
                  if (chronological.length > 8 && idx % Math.ceil(chronological.length / 6) !== 0 && idx !== chronological.length - 1) {
                    return null;
                  }
                  const x = padding.left + (chronological.length > 1 ? (idx / (chronological.length - 1)) * graphW : graphW / 2);
                  const dateStr = new Date(m.evaluatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                  return (
                    <text
                      key={idx}
                      x={x}
                      y={svgHeight - 12}
                      fill="rgba(255,255,255,0.45)"
                      fontSize="10"
                      fontWeight="600"
                      textAnchor="middle"
                    >
                      {dateStr}
                    </text>
                  );
                })}

                {/* Render Series Areas & Curved Lines */}
                {categories.map(cat => {
                  const points = seriesData[cat];
                  if (!points || points.length === 0) return null;
                  const color = catColors[cat];

                  return (
                    <g key={cat}>
                      {/* Gradient Fill Area */}
                      <path
                        d={buildAreaPath(points)}
                        fill={`url(#${cat}Grad)`}
                      />

                      {/* Smooth Line Path */}
                      <path
                        d={buildSvgPath(points)}
                        fill="none"
                        stroke={color}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ filter: `drop-shadow(0 4px 8px ${color}66)` }}
                      />

                      {/* Interactive Data Point Nodes */}
                      {points.map((pt, idx) => (
                        <g key={idx}>
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r="6"
                            fill="#ffffff"
                            stroke={color}
                            strokeWidth="3"
                            style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                            onMouseEnter={() => setHoveredPoint(pt)}
                            onMouseLeave={() => setHoveredPoint(null)}
                          />
                        </g>
                      ))}
                    </g>
                  );
                })}
              </svg>

              {/* Hover Tooltip Popup */}
              {hoveredPoint && (
                <div
                  style={{
                    position: 'absolute',
                    left: `${(hoveredPoint.x / svgWidth) * 100}%`,
                    top: `${(hoveredPoint.y / svgHeight) * 100}%`,
                    transform: 'translate(-50%, -115%)',
                    background: '#0f172a',
                    border: `1.5px solid ${catColors[hoveredPoint.category]}`,
                    borderRadius: '0.75rem',
                    padding: '0.65rem 0.9rem',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                    pointerEvents: 'none',
                    zIndex: 10,
                    minWidth: '170px'
                  }}
                >
                  <div style={{ fontSize: '0.72rem', color: catColors[hoveredPoint.category], fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {hoveredPoint.category === 'studio' ? 'Speech Studio' : hoveredPoint.category === 'impromptu' ? 'Impromptu Speaking' : 'Prepared Speech'}
                  </div>
                  <div style={{ fontSize: '0.88rem', color: '#ffffff', fontWeight: '700', marginTop: '0.2rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {formatSpeechTitle(hoveredPoint.item)}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.4rem', paddingTop: '0.4rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      {new Date(hoveredPoint.item.evaluatedAt).toLocaleDateString()}
                    </span>
                    <span style={{ fontSize: '0.95rem', fontWeight: '900', color: catColors[hoveredPoint.category] }}>
                      {hoveredPoint.score} / 10
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {/* Granular Dimension Metrics Line Graph Panel */}
      <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '1.25rem', border: '1px solid var(--glass-border)', marginBottom: '2rem' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: '800', margin: '0 0 0.25rem 0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={22} color="#a855f7" /> Granular Speech Dimension Trends
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>
            Analyze score trajectory over time for specific dimensions like filler words, opening, conclusion, pronunciation, and more.
          </p>
        </div>

        {/* Sub-Metrics Pill Selector */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {subMetricsConfig.map(metric => {
            const count = metricsList.filter(item => getSubMetricValue(item, metric.id) !== null).length;
            const isSelected = selectedSubMetric === metric.id;

            return (
              <button
                key={metric.id}
                onClick={() => setSelectedSubMetric(metric.id)}
                style={{
                  padding: '0.45rem 0.9rem',
                  borderRadius: '0.75rem',
                  border: isSelected ? `1px solid ${metric.color}` : '1px solid var(--glass-border)',
                  background: isSelected ? metric.bg : 'rgba(255, 255, 255, 0.02)',
                  color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.2s',
                  boxShadow: isSelected ? `0 2px 10px rgba(0, 0, 0, 0.15)` : 'none'
                }}
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: metric.color }} />
                {metric.label}
                <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>({count})</span>
              </button>
            );
          })}
        </div>

        {/* Graph Display */}
        {(() => {
          const chronological = [...metricsList].sort((a, b) => new Date(a.evaluatedAt || 0) - new Date(b.evaluatedAt || 0));
          const validPoints = chronological
            .map((item, idx) => {
              const val = getSubMetricValue(item, selectedSubMetric);
              if (val === null || val === undefined) return null;
              const score = parseFloat(val);
              const normalizedScore = score > 10 ? score / 10.0 : score;
              return { item, score: normalizedScore, originalIdx: idx };
            })
            .filter(pt => pt !== null);

          if (validPoints.length === 0) {
            return (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.15)', borderRadius: '1rem' }}>
                <Activity size={32} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '600' }}>No evaluation points for "{subMetricsConfig.find(m => m.id === selectedSubMetric)?.label}" yet.</p>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem' }}>Upload or record speeches containing full evaluations to view trends here.</p>
              </div>
            );
          }

          const svgWidth = 800;
          const svgHeight = 220;
          const padding = { top: 25, right: 30, bottom: 35, left: 45 };
          const graphW = svgWidth - padding.left - padding.right;
          const graphH = svgHeight - padding.top - padding.bottom;

          const currentMetricColor = subMetricsConfig.find(m => m.id === selectedSubMetric)?.color || '#38bdf8';

          const seriesPoints = validPoints.map((pt, i) => {
            const x = padding.left + (validPoints.length > 1 ? (i / (validPoints.length - 1)) * graphW : graphW / 2);
            const y = padding.top + graphH - (pt.score / 10) * graphH;
            return { x, y, score: pt.score, item: pt.item };
          });

          const buildSvgPath = (pts) => {
            if (!pts || pts.length === 0) return '';
            if (pts.length === 1) return `M ${pts[0].x},${pts[0].y} L ${pts[0].x},${pts[0].y}`;
            let p = `M ${pts[0].x},${pts[0].y}`;
            for (let i = 0; i < pts.length - 1; i++) {
              const curr = pts[i];
              const next = pts[i + 1];
              const ctrlX = (curr.x + next.x) / 2;
              p += ` C ${ctrlX},${curr.y} ${ctrlX},${next.y} ${next.x},${next.y}`;
            }
            return p;
          };

          const buildAreaPath = (pts) => {
            if (!pts || pts.length === 0) return '';
            const linePath = buildSvgPath(pts);
            const bottomY = padding.top + graphH;
            return `${linePath} L ${pts[pts.length - 1].x},${bottomY} L ${pts[0].x},${bottomY} Z`;
          };

          return (
            <div style={{ position: 'relative', width: '100%', background: 'rgba(0,0,0,0.3)', borderRadius: '1rem', padding: '1rem', border: '1px solid var(--glass-border)' }}>
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
                <defs>
                  <linearGradient id="subMetricGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={currentMetricColor} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={currentMetricColor} stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Y-Axis Horizontal Gridlines */}
                {[10, 8, 6, 4, 2, 0].map((val) => {
                  const y = padding.top + graphH - (val / 10) * graphH;
                  return (
                    <g key={val}>
                      <line
                        x1={padding.left}
                        y1={y}
                        x2={svgWidth - padding.right}
                        y2={y}
                        stroke="rgba(255,255,255,0.06)"
                        strokeDasharray={val === 0 || val === 10 ? "none" : "4 4"}
                      />
                      <text
                        x={padding.left - 10}
                        y={y + 4}
                        fill="rgba(255,255,255,0.4)"
                        fontSize="9"
                        fontWeight="600"
                        textAnchor="end"
                      >
                        {val}.0
                      </text>
                    </g>
                  );
                })}

                {/* X-Axis Date Labels */}
                {seriesPoints.map((pt, idx) => {
                  if (seriesPoints.length > 8 && idx % Math.ceil(seriesPoints.length / 6) !== 0 && idx !== seriesPoints.length - 1) {
                    return null;
                  }
                  const dateStr = new Date(pt.item.evaluatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                  return (
                    <text
                      key={idx}
                      x={pt.x}
                      y={svgHeight - 8}
                      fill="rgba(255,255,255,0.4)"
                      fontSize="9"
                      fontWeight="600"
                      textAnchor="middle"
                    >
                      {dateStr}
                    </text>
                  );
                })}

                {/* Area Gradient Fill */}
                <path
                  d={buildAreaPath(seriesPoints)}
                  fill="url(#subMetricGrad)"
                />

                {/* Curved Line Path */}
                <path
                  d={buildSvgPath(seriesPoints)}
                  fill="none"
                  stroke={currentMetricColor}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ filter: `drop-shadow(0 3px 6px ${currentMetricColor}55)` }}
                />

                {/* Interactive Points */}
                {seriesPoints.map((pt, idx) => (
                  <g key={idx}>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="5"
                      fill="#ffffff"
                      stroke={currentMetricColor}
                      strokeWidth="2.5"
                      style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseEnter={() => setHoveredSubPoint(pt)}
                      onMouseLeave={() => setHoveredSubPoint(null)}
                    />
                  </g>
                ))}
              </svg>

              {/* Hover Tooltip Popup */}
              {hoveredSubPoint && (
                <div
                  style={{
                    position: 'absolute',
                    left: `${(hoveredSubPoint.x / svgWidth) * 100}%`,
                    top: `${(hoveredSubPoint.y / svgHeight) * 100}%`,
                    transform: 'translate(-50%, -115%)',
                    background: '#0f172a',
                    border: `1.5px solid ${currentMetricColor}`,
                    borderRadius: '0.75rem',
                    padding: '0.65rem 0.9rem',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                    pointerEvents: 'none',
                    zIndex: 10,
                    minWidth: '175px'
                  }}
                >
                  <div style={{ fontSize: '0.72rem', color: currentMetricColor, fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {subMetricsConfig.find(m => m.id === selectedSubMetric)?.label}
                  </div>
                  <div style={{ fontSize: '0.88rem', color: '#ffffff', fontWeight: '700', marginTop: '0.2rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {formatSpeechTitle(hoveredSubPoint.item)}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.4rem', paddingTop: '0.4rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      {new Date(hoveredSubPoint.item.evaluatedAt).toLocaleDateString()}
                    </span>
                    <span style={{ fontSize: '0.95rem', fontWeight: '900', color: currentMetricColor }}>
                      {hoveredSubPoint.score.toFixed(1)} / 10
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {/* Main Detailed Metrics Table */}
      <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '1.25rem', border: '1px solid var(--glass-border)' }}>
        {/* Table Filter Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800', margin: '0 0 0.25rem 0', color: 'var(--text-primary)' }}>
              All Speech Metrics Log
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>
              Granular evaluation points rated on 1–10 scale per speech.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <Search size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search speech title..."
                style={{
                  padding: '0.5rem 0.85rem 0.5rem 2.2rem', borderRadius: '0.65rem',
                  background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)',
                  color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none'
                }}
              />
            </div>

            {/* Filter Buttons */}
            <div style={{ display: 'flex', gap: '0.35rem', background: 'rgba(255,255,255,0.03)', padding: '0.25rem', borderRadius: '0.65rem', border: '1px solid var(--glass-border)' }}>
              {[
                { id: 'all', label: 'All' },
                { id: 'high', label: 'High (8.5+)' },
                { id: 'medium', label: 'Medium (7-8.4)' },
                { id: 'studio', label: 'Speech Studio' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedCategory(f.id)}
                  style={{
                    padding: '0.3rem 0.65rem', borderRadius: '0.45rem', border: 'none',
                    fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s',
                    background: selectedCategory === f.id ? 'var(--accent-primary)' : 'transparent',
                    color: selectedCategory === f.id ? '#fff' : 'var(--text-secondary)'
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Data Table */}
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Loading speech metrics...
          </div>
        ) : filteredMetrics.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No speech metrics found matching filter.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.5rem' }}>
              <thead>
                <tr style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Speech Title</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Overall Score</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Pronunciation</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Fluency & Delivery</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Evaluated At</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMetrics.map((item, index) => {
                  const scoreColor = getScoreBadgeColor(item.overallScore || 8.0);
                  const pScore = item.metrics?.pronunciation || item.metrics?.delivery || item.overallScore || 8.0;
                  const fScore = item.metrics?.fluency || item.metrics?.bodyStructure || item.overallScore || 8.0;
                  const pColor = getScoreBadgeColor(pScore);
                  const fColor = getScoreBadgeColor(fScore);

                  return (
                    <tr key={index} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '0.75rem', border: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '1rem', fontWeight: '700', color: 'var(--text-primary)', borderRadius: '0.75rem 0 0 0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '0.5rem', background: 'rgba(56,189,248,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Target size={18} color="#38bdf8" />
                          </div>
                          <div>
                            <div>{formatSpeechTitle(item)}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>
                              ID: {item.videoKey}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Overall Score */}
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <span style={{ padding: '0.35rem 0.75rem', borderRadius: '0.5rem', fontWeight: '900', fontSize: '0.95rem', background: scoreColor.bg, color: scoreColor.text, border: `1px solid ${scoreColor.border}` }}>
                          {item.overallScore} / 10
                        </span>
                      </td>

                      {/* Pronunciation Score */}
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <span style={{ padding: '0.3rem 0.65rem', borderRadius: '0.45rem', fontWeight: '700', fontSize: '0.85rem', background: pColor.bg, color: pColor.text, border: `1px solid ${pColor.border}` }}>
                          {pScore} / 10
                        </span>
                      </td>

                      {/* Fluency Score */}
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <span style={{ padding: '0.3rem 0.65rem', borderRadius: '0.45rem', fontWeight: '700', fontSize: '0.85rem', background: fColor.bg, color: fColor.text, border: `1px solid ${fColor.border}` }}>
                          {fScore} / 10
                        </span>
                      </td>

                      {/* Date */}
                      <td style={{ padding: '1rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {new Date(item.evaluatedAt || Date.now()).toLocaleString()}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '1rem', textAlign: 'right', borderRadius: '0 0.75rem 0.75rem 0' }}>
                        <button
                          onClick={() => setSelectedMetricDetail(item)}
                          style={{
                            padding: '0.4rem 0.8rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.05)',
                            color: '#38bdf8', border: '1px solid rgba(56,189,248,0.3)', fontSize: '0.8rem',
                            fontWeight: '700', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.3rem'
                          }}
                        >
                          View Breakdown <ChevronRight size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Drill-Down Detail Modal */}
      <AnimatePresence>
        {selectedMetricDetail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
              background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 9999, padding: '1rem'
            }}
            onClick={() => setSelectedMetricDetail(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              style={{
                width: '100%', maxWidth: '520px', background: 'var(--modal-bg, #0f172a)',
                border: '1px solid var(--glass-border)', borderRadius: '1.25rem',
                padding: '1.75rem', boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                  {formatSpeechTitle(selectedMetricDetail)}
                </h3>
                <span style={{ padding: '0.35rem 0.75rem', borderRadius: '0.5rem', fontWeight: '900', fontSize: '0.95rem', ...getScoreBadgeColor(selectedMetricDetail.overallScore) }}>
                  {selectedMetricDetail.overallScore} / 10
                </span>
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                Evaluated on: {new Date(selectedMetricDetail.evaluatedAt).toLocaleString()}
              </div>

              {/* Breakdown Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {Object.entries(selectedMetricDetail.metrics || {}).map(([key, val]) => (
                  <div key={key} style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.65rem', border: '1px solid var(--glass-border)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700', marginBottom: '0.2rem' }}>
                      {key.replace(/([A-Z])/g, ' $1')}
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '900', color: getScoreBadgeColor(val).text }}>
                      {val} / 10
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setSelectedMetricDetail(null)}
                style={{
                  width: '100%', padding: '0.75rem', borderRadius: '0.65rem',
                  background: 'var(--accent-gradient)', color: '#fff', border: 'none',
                  fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer'
                }}
              >
                Close Metrics Breakdown
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MetricsDashboard;
