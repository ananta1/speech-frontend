import React, { useState, useEffect } from 'react';
import { PlayCircle, BarChart2, Calendar, FileVideo, AlertCircle, FileText, X, CheckCircle, Clock, RefreshCcw, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../config';

const AnalyzeVideo = ({ user }) => {
    const [videos, setVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [analyzingId, setAnalyzingId] = useState(null);
    const [selectedReport, setSelectedReport] = useState(null);
    const [isReportLoading, setIsReportLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);

    useEffect(() => {
        if (user) {
            fetchVideos();
        }
    }, [user]);

    // Auto-polling for IN_PROGRESS videos
    useEffect(() => {
        const inProgressVideos = videos.filter(v => v.analysisStatus === 'IN_PROGRESS');

        if (inProgressVideos.length > 0) {
            const intervalId = setInterval(() => {
                // Check all in-progress videos silently
                inProgressVideos.forEach(video => {
                    handleCheckStatus(video.key, true);
                });
            }, 15000); // Check every 15 seconds

            return () => clearInterval(intervalId);
        }
    }, [videos]);

    const fetchVideos = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE_URL}/list-videos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, email: user.email })
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();
            setVideos(data.videos || []);
            setLastUpdated(new Date().toLocaleTimeString());
        } catch (err) {
            console.error(err);
            setError(`Error loading videos: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnalyze = async (videoKey) => {
        setAnalyzingId(videoKey);
        try {
            const res = await fetch(`${API_BASE_URL}/analyze-video`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: videoKey, userId: user.id })
            });

            if (!res.ok) throw new Error("Failed to start analysis");

            alert("Analysis started! This may take a few minutes. Check back later.");
            fetchVideos(); // Refresh list to see IN_PROGRESS state
        } catch (err) {
            console.error(err);
            alert("Failed to start analysis: " + err.message);
        } finally {
            setAnalyzingId(null);
        }
    };

    const handleCheckStatus = async (videoKey, silent = false) => {
        if (!silent) setAnalyzingId(videoKey);
        try {
            const res = await fetch(`${API_BASE_URL}/get-video-analysis`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: videoKey, userId: user.id })
            });
            const data = await res.json();

            if (data.status === 'COMPLETED') {
                if (!silent) setSelectedReport(data.report);
                fetchVideos(); // Update UI to show 'Ready' and 'View Report'
            } else if (data.status === 'FAILED') {
                if (!silent) alert("Analysis failed. Please try again.");
                fetchVideos();
            } else {
                if (!silent) alert("Analysis is still in progress. Please check again in a moment.");
            }
        } catch (err) {
            console.error(err);
            if (!silent) alert("Failed to check status.");
        } finally {
            if (!silent) setAnalyzingId(null);
        }
    };

    const handleViewReport = async (reportUrl) => {
        if (!reportUrl) return;
        setIsReportLoading(true);
        try {
            const res = await fetch(reportUrl);
            const data = await res.json();
            setSelectedReport(data);
        } catch (err) {
            console.error(err);
            alert("Failed to load report. Please try again.");
        } finally {
            setIsReportLoading(false);
        }
    };

    const handleDelete = async (key) => {
        if (!window.confirm("Are you sure you want to delete this speech? This action cannot be undone.")) return;

        try {
            const res = await fetch(`${API_BASE_URL}/delete-video`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, key })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Delete failed');
            }

            // Optimistic update
            setVideos(prev => prev.filter(v => v.key !== key));
            // alert("Speech deleted."); // Optional, maybe too intrusive
        } catch (err) {
            console.error(err);
            alert("Failed to delete speech: " + err.message);
        }
    };

    const formatDate = (isoString) => {
        return new Date(isoString).toLocaleDateString(undefined, {
            month: 'short', day: 'numeric', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const getStatusIndicator = (status) => {
        switch (status) {
            case 'COMPLETED':
                return <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', background: 'rgba(34, 197, 94, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '0.3rem' }}><CheckCircle size={12} /> Ready</span>;
            case 'IN_PROGRESS':
                return <span style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', background: 'rgba(245, 158, 11, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '0.3rem' }}><Clock size={12} /> Processing</span>;
            case 'FAILED':
                return <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '0.3rem' }}><AlertCircle size={12} /> Failed</span>;
            default:
                return null;
        }
    };

    const getScoreColor = (score) => {
        if (!score && score !== 0) return 'var(--accent-primary)';
        if (score >= 8) return '#22c55e'; // Green
        if (score <= 5) return '#ef4444'; // Red
        return '#eab308'; // Yellow (6-7)
    };

    // Helper to support both new and legacy report formats
    const analysisData = selectedReport?.speechAnalysis || selectedReport?.toastmasterAnalysis;

    if (selectedReport) {
        console.log("Debug - Selected Report:", selectedReport);
        console.log("Debug - Analysis Data:", analysisData);
    }

    return (
        <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', paddingBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 className="gradient-text" style={{ fontSize: '2rem', margin: 0 }}>Your Speeches</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {lastUpdated && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            Updated: {lastUpdated}
                        </span>
                    )}
                    <button
                        onClick={fetchVideos}
                        style={{
                            background: 'transparent', border: '1px solid var(--glass-border)',
                            color: 'var(--text-secondary)', padding: '0.5rem 1rem', borderRadius: '0.5rem',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem'
                        }}
                    >
                        <RefreshCcw size={16} /> Refresh
                    </button>
                    {user?.email && <span style={{ fontSize: '0.7rem', opacity: 0.3 }} title={user.email}>{user.email}</span>}
                </div>
            </div>

            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                    <div className="spinner" style={{ marginBottom: '1rem' }} />
                    <p>Loading your speeches...</p>
                </div>
            ) : error ? (
                <div style={{ textAlign: 'center', padding: '2rem', background: 'rgba(239,68,68,0.1)', borderRadius: '1rem', color: '#ef4444' }}>
                    <AlertCircle size={32} style={{ marginBottom: '0.5rem' }} />
                    <p style={{ fontWeight: 'bold' }}>Failed to load speeches</p>
                    <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>{error}</p>
                    <button onClick={fetchVideos} style={{ marginTop: '0.5rem', background: 'var(--glass-border)', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', color: 'inherit', cursor: 'pointer' }}>Try Again</button>
                </div>
            ) : videos.length === 0 ? (
                <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem', borderRadius: '1.5rem', color: 'var(--text-secondary)' }}>
                    <FileVideo size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
                    <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No videos yet</p>
                    <p>Record or upload a video to get started with analysis.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {videos.map((video) => (
                        <motion.div
                            key={video.key}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-panel"
                            style={{
                                padding: '1rem 1.5rem', borderRadius: '1rem',
                                display: 'flex', alignItems: 'center', gap: '1.5rem',
                                border: '1px solid var(--glass-border)'
                            }}
                        >
                            <div style={{
                                width: '48px', height: '48px', borderRadius: '0.75rem',
                                background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0
                            }}>
                                <FileVideo size={24} color="var(--accent-primary)" />
                            </div>

                            <div style={{ flex: 1, overflow: 'hidden' }}>
                                <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={video.filename}>
                                    {video.filename}
                                </h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <Calendar size={14} />
                                        <span>{formatDate(video.lastModified)}</span>
                                    </div>
                                    <span>•</span>
                                    <div>{(video.size / (1024 * 1024)).toFixed(1)} MB</div>
                                    {video.analysisStatus && video.analysisStatus !== 'NONE' && (
                                        <>
                                            <span style={{ opacity: 0.5 }}>|</span>
                                            {getStatusIndicator(video.analysisStatus)}
                                        </>
                                    )}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <a
                                    href={video.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        padding: '0.6rem 1.2rem', borderRadius: '0.5rem',
                                        background: 'var(--bg-secondary)', color: 'var(--text-primary)',
                                        textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500',
                                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    <PlayCircle size={18} /> Watch
                                </a>

                                {video.analysisStatus === 'COMPLETED' ? (
                                    <button
                                        onClick={() => handleViewReport(video.analysisUrl)}
                                        style={{
                                            padding: '0.6rem 1.2rem', borderRadius: '0.5rem',
                                            background: 'var(--success)', color: 'white',
                                            border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600',
                                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        <FileText size={18} /> View Report
                                    </button>
                                ) : video.analysisStatus === 'IN_PROGRESS' ? (
                                    <button
                                        onClick={() => handleCheckStatus(video.key)}
                                        disabled={analyzingId === video.key}
                                        style={{
                                            padding: '0.6rem 1.2rem', borderRadius: '0.5rem',
                                            background: 'var(--glass-border)', color: 'var(--text-secondary)',
                                            border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600',
                                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        <div className="spinner-small" style={{ marginRight: '0.5rem' }} /> Check Status
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleAnalyze(video.key)}
                                        disabled={analyzingId === video.key || video.analysisStatus === 'FAILED'}
                                        style={{
                                            padding: '0.6rem 1.2rem', borderRadius: '0.5rem',
                                            background: 'var(--accent-gradient)', color: 'white',
                                            border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600',
                                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                                            opacity: analyzingId === video.key ? 0.7 : 1,
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {analyzingId === video.key ? (
                                            <span>Starting...</span>
                                        ) : (
                                            <>
                                                <BarChart2 size={18} /> Analyze
                                            </>
                                        )}
                                    </button>
                                )}

                                <button
                                    onClick={() => handleDelete(video.key)}
                                    className="delete-btn"
                                    style={{
                                        padding: '0.6rem', borderRadius: '0.6rem',
                                        background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444',
                                        border: '1px solid rgba(239, 68, 68, 0.3)', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = '#ef4444';
                                        e.currentTarget.style.color = 'white';
                                        e.currentTarget.style.boxShadow = '0 0 15px rgba(239, 68, 68, 0.4)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
                                        e.currentTarget.style.color = '#ef4444';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                    title="Delete Video"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Analysis Report Modal */}
            <AnimatePresence>
                {(selectedReport || isReportLoading) && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
                            padding: '2rem'
                        }}
                        onClick={() => setSelectedReport(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            style={{
                                background: 'var(--bg-primary)', padding: '2rem', borderRadius: '1.5rem',
                                maxWidth: '1092px', width: '100%', maxHeight: '80vh', overflowY: 'auto',
                                position: 'relative', border: '1px solid var(--glass-border)'
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedReport(null)}
                                style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                            >
                                <X size={24} />
                            </button>

                            {isReportLoading ? (
                                <div style={{ padding: '3rem', textAlign: 'center' }}>
                                    <div className="spinner" />
                                </div>
                            ) : (
                                <>
                                    <h2 className="gradient-text" style={{ marginTop: 0, marginBottom: '1.5rem' }}>Analysis Report</h2>

                                    {analysisData && (
                                        <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: 'var(--accent-primary)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Speech evaluation insights</h3>

                                            {/* Summary & Central Message */}
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                                <div className="glass-panel" style={{ padding: '1rem', borderRadius: '0.8rem' }}>
                                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 'bold', marginBottom: '0.5rem' }}>Executive Summary</div>
                                                    <div style={{ fontSize: '1rem', lineHeight: '1.6', opacity: 0.9 }}>{analysisData.summary || "Summary not available."}</div>
                                                </div>
                                                <div className="glass-panel" style={{ padding: '1rem', borderRadius: '0.8rem' }}>
                                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 'bold', marginBottom: '0.5rem' }}>Central Message / Thesis</div>
                                                    <div style={{ fontSize: '1rem', lineHeight: '1.6', opacity: 0.9 }}>{analysisData.central_message || "N/A"}</div>
                                                </div>
                                            </div>

                                            {/* Glows & Grows */}
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                                <div className="glass-panel" style={{ padding: '1.2rem', borderRadius: '0.8rem', borderLeft: '4px solid var(--success)' }}>
                                                    <div style={{ fontSize: '0.9rem', color: 'var(--success)', fontWeight: 'bold', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <CheckCircle size={16} /> Strengths (Glows)
                                                    </div>
                                                    <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '1rem', lineHeight: '1.6', opacity: 0.9 }}>
                                                        {analysisData.glows?.length > 0 ? analysisData.glows.map((glow, i) => <li key={i}>{glow}</li>) : <li>Your energy and pacing are effective.</li>}
                                                    </ul>
                                                </div>
                                                <div className="glass-panel" style={{ padding: '1.2rem', borderRadius: '0.8rem', borderLeft: '4px solid #f59e0b' }}>
                                                    <div style={{ fontSize: '0.9rem', color: '#f59e0b', fontWeight: 'bold', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <BarChart2 size={16} /> Areas to Grow
                                                    </div>
                                                    <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '1rem', lineHeight: '1.6', opacity: 0.9 }}>
                                                        {analysisData.grows?.length > 0 ? analysisData.grows.map((grow, i) => <li key={i}>{grow}</li>) : <li>Consider adding more storytelling elements.</li>}
                                                    </ul>
                                                </div>
                                            </div>

                                            {/* Core Mechanics: Intro, Organization, Conclusion */}
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                                                <div className="glass-panel" style={{ padding: '1.2rem', borderRadius: '0.8rem' }}>
                                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 'bold', marginBottom: '0.5rem' }}>Introduction</div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: getScoreColor(analysisData.introduction?.score) }}>{analysisData.introduction?.score || '-'}/10</div>
                                                    </div>
                                                    <div style={{ fontSize: '1rem', lineHeight: '1.5', opacity: 0.9 }}>{analysisData.introduction?.comment || "Analysis not available."}</div>
                                                </div>
                                                <div className="glass-panel" style={{ padding: '1.2rem', borderRadius: '0.8rem' }}>
                                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 'bold', marginBottom: '0.5rem' }}>Organization</div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: getScoreColor(analysisData.organization?.score) }}>{analysisData.organization?.score || '-'}/10</div>
                                                    </div>
                                                    <div style={{ fontSize: '1rem', lineHeight: '1.5', opacity: 0.9 }}>{analysisData.organization?.comment || "Focus on smooth transitions."}</div>
                                                </div>
                                                <div className="glass-panel" style={{ padding: '1.2rem', borderRadius: '0.8rem' }}>
                                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 'bold', marginBottom: '0.5rem' }}>Conclusion</div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: getScoreColor(analysisData.conclusion?.score) }}>{analysisData.conclusion?.score || '-'}/10</div>
                                                    </div>
                                                    <div style={{ fontSize: '1rem', lineHeight: '1.5', opacity: 0.9 }}>{analysisData.conclusion?.comment || "Analysis not available."}</div>
                                                </div>
                                            </div>

                                            {/* Advanced Engagement: Storytelling, Audience, Rhetoric */}
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                                                <div className="glass-panel" style={{ padding: '1.2rem', borderRadius: '0.8rem' }}>
                                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 'bold', marginBottom: '0.5rem' }}>Storytelling</div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: getScoreColor(analysisData.storytelling?.score) }}>{analysisData.storytelling?.score || '-'}/10</div>
                                                    </div>
                                                    <div style={{ fontSize: '1rem', lineHeight: '1.5', opacity: 0.9 }}>{analysisData.storytelling?.comment || "Use stories for impact."}</div>
                                                </div>
                                                <div className="glass-panel" style={{ padding: '1.2rem', borderRadius: '0.8rem' }}>
                                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 'bold', marginBottom: '0.5rem' }}>Audience Connection</div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: getScoreColor(analysisData.audience_connection?.score) }}>{analysisData.audience_connection?.score || '-'}/10</div>
                                                    </div>
                                                    <div style={{ fontSize: '1rem', lineHeight: '1.5', opacity: 0.9 }}>{analysisData.audience_connection?.comment || "Inclusive rapport strategies."}</div>
                                                </div>
                                                <div className="glass-panel" style={{ padding: '1.2rem', borderRadius: '0.8rem' }}>
                                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 'bold', marginBottom: '0.5rem' }}>Rhetorical Devices</div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: getScoreColor(analysisData.rhetorical_devices?.score) }}>{analysisData.rhetorical_devices?.score || '-'}/10</div>
                                                    </div>
                                                    <div style={{ fontSize: '1rem', lineHeight: '1.5', opacity: 0.9 }}>{analysisData.rhetorical_devices?.comment || "Metaphors, humor, repetition."}</div>
                                                </div>
                                            </div>

                                            {/* Body Structure */}
                                            <div className="glass-panel" style={{ padding: '1.2rem', borderRadius: '0.8rem' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
                                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Body & Structure Analysis</div>
                                                    <div style={{ fontWeight: 'bold', color: getScoreColor(analysisData.body_structure?.score) }}>Score: {analysisData.body_structure?.score || '-'}/10</div>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                                    <div>
                                                        <div style={{ fontWeight: '700', color: 'var(--accent-primary)', marginBottom: '0.4rem', fontSize: '1rem' }}>Sentence Variety:</div>
                                                        <div style={{ color: 'var(--text-primary)', opacity: 0.9, lineHeight: '1.6', fontSize: '1rem' }}>{analysisData.body_structure?.sentence_variety || "N/A"}</div>
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: '700', color: 'var(--accent-primary)', marginBottom: '0.4rem', fontSize: '1rem' }}>Word Choice:</div>
                                                        <div style={{ color: 'var(--text-primary)', opacity: 0.9, lineHeight: '1.6', fontSize: '1rem' }}>{analysisData.body_structure?.word_choice || "N/A"}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Filler Words & Grammar */}
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                                <div className="glass-panel" style={{ padding: '1.2rem', borderRadius: '0.8rem' }}>
                                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Filler Words Analysis</div>
                                                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: '0 0 1rem 0', color: 'var(--accent-primary)' }}>{analysisData.filler_words.total} <span style={{ fontSize: '1rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>fillers detected</span></div>
                                                    <div style={{ fontSize: '1rem', color: 'var(--text-primary)', opacity: 0.9, lineHeight: '1.6' }}>{analysisData.filler_words.comment}</div>
                                                </div>
                                                <div className="glass-panel" style={{ padding: '1.2rem', borderRadius: '0.8rem' }}>
                                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Grammar & Complexity</div>
                                                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: '0 0 1rem 0', color: 'var(--accent-primary)' }}>{analysisData.grammar_metrics.long_sentences_count} <span style={{ fontSize: '1rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>long sentences</span></div>
                                                    <div style={{ fontSize: '1rem', color: 'var(--text-primary)', opacity: 0.9, lineHeight: '1.6' }}>{analysisData.grammar_metrics.suggestion}</div>
                                                </div>
                                            </div>

                                            {/* Body Language */}
                                            <div className="glass-panel" style={{ padding: '1rem', borderRadius: '0.8rem', marginTop: '1rem' }}>
                                                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                                                    Body Language <span style={{ fontWeight: 'normal', opacity: 0.7 }}>({analysisData.body_language?.primary_emotion || "Unknown"})</span>
                                                </div>
                                                <div style={{ fontSize: '1rem', lineHeight: '1.6', opacity: 0.9, marginBottom: '0.8rem' }}>
                                                    {analysisData.body_language?.summary || "Body language analysis not available."}
                                                </div>

                                                {/* Emotions Breakdown */}
                                                {selectedReport.emotionsDetected && (
                                                    <div style={{ marginTop: '0.5rem' }}>
                                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: '600' }}>Detected Expressions:</div>
                                                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                            {Object.entries(selectedReport.emotionsDetected)
                                                                .sort(([, a], [, b]) => b - a)
                                                                .slice(0, 5)
                                                                .map(([emotion, count]) => (
                                                                    <div key={emotion} style={{
                                                                        fontSize: '0.75rem',
                                                                        padding: '0.3rem 0.6rem',
                                                                        background: 'rgba(255,255,255,0.05)',
                                                                        borderRadius: '1rem',
                                                                        border: '1px solid var(--glass-border)',
                                                                        display: 'flex', alignItems: 'center', gap: '0.3rem'
                                                                    }}>
                                                                        <span style={{ textTransform: 'capitalize' }}>{emotion.toLowerCase()}</span>
                                                                        <span style={{ fontWeight: 'bold', color: 'var(--accent-primary)' }}>{count}</span>
                                                                    </div>
                                                                ))
                                                            }
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Delivery Metrics */}
                                            {analysisData.delivery_metrics && (
                                                <div className="glass-panel" style={{ padding: '1.2rem', borderRadius: '0.8rem', marginTop: '1rem' }}>
                                                    <h4 style={{ fontSize: '1rem', color: 'var(--accent-primary)', marginTop: 0, marginBottom: '1.2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
                                                        Delivery & Pacing
                                                    </h4>
                                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                                                        <div>
                                                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '0.4rem' }}>
                                                                Pace (WPM): <span style={{ color: 'var(--text-primary)', fontSize: '1.1rem' }}>{analysisData.delivery_metrics.wpm || 0}</span>
                                                            </div>
                                                            <div style={{ fontSize: '1rem', opacity: 0.8, lineHeight: '1.6' }}>
                                                                {analysisData.delivery_metrics.wpm_evaluation}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '0.4rem' }}>
                                                                Pauses:
                                                            </div>
                                                            <div style={{ fontSize: '1rem', opacity: 0.8, lineHeight: '1.6' }}>
                                                                {analysisData.delivery_metrics.pause_evaluation}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--accent-primary)' }}>Performance Summary</h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                            <div className="glass-panel" style={{ padding: '1rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                                                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Word Count</div>
                                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{selectedReport.wordCount}</div>
                                            </div>
                                            <div className="glass-panel" style={{ padding: '1rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                                                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Primary Emotion</div>
                                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{selectedReport.primaryEmotion}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--accent-primary)' }}>AI Recommendations</h3>
                                        <div className="glass-panel" style={{ padding: '1.2rem', borderRadius: '0.5rem', lineHeight: '1.6', fontSize: '1rem' }}>
                                            {selectedReport.recommendation}
                                        </div>
                                    </div>

                                    {/* Improvisation Suggestions */}
                                    {analysisData?.improvisation && (
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--accent-primary)' }}>Improvisation & Rewrite</h3>

                                            {/* General Tips */}
                                            {analysisData.improvisation.general_tips?.length > 0 && (
                                                <div className="glass-panel" style={{ padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
                                                    <h4 style={{ fontSize: '0.9rem', marginTop: 0, color: 'var(--text-secondary)' }}>General Tips</h4>
                                                    <ul style={{ paddingLeft: '1.2rem', margin: '0.5rem 0', fontSize: '1rem', lineHeight: '1.6' }}>
                                                        {analysisData.improvisation.general_tips.map((tip, idx) => (
                                                            <li key={idx} style={{ marginBottom: '0.3rem' }}>{tip}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Rewritten Passages */}
                                            {analysisData.improvisation.rewritten_passages?.length > 0 && (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                                    {analysisData.improvisation.rewritten_passages.map((item, idx) => (
                                                        <div key={idx} className="glass-panel" style={{ padding: '1rem', borderRadius: '0.5rem', borderLeft: '3px solid var(--accent-primary)' }}>
                                                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.3rem', fontWeight: 'bold' }}>Original:</div>
                                                            <div style={{ fontSize: '1rem', fontStyle: 'italic', marginBottom: '0.8rem', opacity: 0.8 }}>"{item.original}"</div>

                                                            <div style={{ fontSize: '0.9rem', color: 'var(--success)', marginBottom: '0.3rem', fontWeight: 'bold' }}>Try saying:</div>
                                                            <div style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.8rem' }}>"{item.better_version}"</div>

                                                            <div style={{ fontSize: '1rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '0.3rem', lineHeight: '1.5' }}>
                                                                <span style={{ fontWeight: 'bold' }}>Why: </span> {item.reason}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div>
                                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Transcript</h3>
                                        <p style={{
                                            padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '0.5rem',
                                            maxHeight: '200px', overflowY: 'auto', fontSize: '1rem', lineHeight: '1.6',
                                            whiteSpace: 'pre-wrap'
                                        }}>
                                            {selectedReport.transcript}
                                        </p>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AnalyzeVideo;
