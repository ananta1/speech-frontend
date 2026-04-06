import React, { useState, useEffect } from 'react';
import {
    ArrowLeft, Users, FileText, Loader2, AlertCircle, CheckCircle,
    BarChart2, ChevronDown, ChevronRight, Clock, FileVideo, Star, PlayCircle, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../config';

const getScoreColor = (score) => {
    if (!score && score !== 0) return 'var(--accent-primary)';
    if (score >= 8) return '#22c55e';
    if (score <= 5) return '#ef4444';
    return '#eab308';
};

const formatDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString(undefined, {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
};

// ── Individual Speech Report Card ──────────────────────────────────────────
const SpeechReportCard = ({ speech, studentId, onReevaluate }) => {
    const [expanded, setExpanded] = useState(false);
    const report = speech.report;
    const analysis = report?.speechAnalysis;

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--glass-border)',
                borderRadius: '1rem',
                overflow: 'hidden',
                marginBottom: '0.6rem'
            }}
        >
            {/* Speech header row */}
            <div
                onClick={() => setExpanded(!expanded)}
                style={{
                    padding: '1rem 1.25rem',
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    cursor: 'pointer', transition: 'background 0.2s',
                    background: expanded ? 'rgba(56,189,248,0.05)' : 'transparent'
                }}
            >
                <div style={{
                    width: '40px', height: '40px', borderRadius: '0.6rem',
                    background: speech.status === 'COMPLETED'
                        ? 'rgba(34,197,94,0.12)' : 'rgba(148,163,184,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0
                }}>
                    {speech.status === 'COMPLETED'
                        ? <FileText size={18} color="#22c55e" />
                        : speech.status === 'IN_PROGRESS'
                            ? <Clock size={18} color="#f59e0b" />
                            : <FileVideo size={18} color="#94a3b8" />
                    }
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: '600', fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {speech.filename || 'Untitled Speech'}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        {formatDate(speech.updatedAt)}
                        {speech.status === 'COMPLETED' && report?.wordCount && (
                            <> · {report.wordCount} words</>
                        )}
                    </div>
                </div>

                {/* Status badge */}
                <span style={{
                    padding: '0.25rem 0.65rem', borderRadius: '999px', fontSize: '0.78rem',
                    fontWeight: '700', whiteSpace: 'nowrap',
                    ...(speech.status === 'COMPLETED'
                        ? { color: '#22c55e', background: 'rgba(34,197,94,0.10)', border: '1px solid rgba(34,197,94,0.3)' }
                        : speech.status === 'IN_PROGRESS'
                            ? { color: '#f59e0b', background: 'rgba(245,158,11,0.10)', border: '1px solid rgba(245,158,11,0.3)' }
                            : { color: '#94a3b8', background: 'rgba(148,163,184,0.1)', border: '1px solid rgba(148,163,184,0.3)' }
                    )
                }}>
                    {speech.status === 'COMPLETED' ? 'Evaluated' : speech.status === 'IN_PROGRESS' ? 'Processing' : 'Not Analyzed'}
                </span>

                {/* Watch Video link */}
                {speech.videoUrl && (
                    <a
                        href={speech.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        style={{
                            padding: '0.35rem 0.75rem', borderRadius: '0.5rem',
                            background: 'rgba(14,165,233,0.1)', color: '#0ea5e9',
                            textDecoration: 'none', fontSize: '0.82rem', fontWeight: '700',
                            display: 'flex', alignItems: 'center', gap: '0.35rem',
                            border: '1px solid rgba(14,165,233,0.25)',
                            transition: 'all 0.2s', whiteSpace: 'nowrap'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#0ea5e9'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(14,165,233,0.1)'; e.currentTarget.style.color = '#0ea5e9'; }}
                    >
                        <PlayCircle size={14} /> Watch
                    </a>
                )}

                {(speech.status === 'IN_PROGRESS' || speech.status === 'FAILED') && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onReevaluate(speech.videoKey, studentId);
                        }}
                        style={{
                            padding: '0.35rem 0.75rem', borderRadius: '0.5rem',
                            background: 'rgba(245,158,11,0.1)', color: '#f59e0b',
                            border: '1px solid rgba(245,158,11,0.25)',
                            display: 'flex', alignItems: 'center', gap: '0.35rem',
                            cursor: 'pointer', fontSize: '0.82rem', fontWeight: '700',
                            transition: 'all 0.2s', whiteSpace: 'nowrap'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#f59e0b'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(245,158,11,0.1)'; e.currentTarget.style.color = '#f59e0b'; }}
                        title="Force reprocess the evaluation if it is stuck"
                    >
                        <RefreshCw size={14} /> Re-evaluate
                    </button>
                )}

                {speech.status === 'COMPLETED' && (
                    expanded ? <ChevronDown size={18} color="var(--text-secondary)" /> : <ChevronRight size={18} color="var(--text-secondary)" />
                )}
            </div>

            {/* Expanded report details */}
            <AnimatePresence>
                {expanded && speech.status === 'COMPLETED' && report && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: 'hidden' }}
                    >
                        <div style={{ padding: '0 1.25rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {/* Key Metrics Row */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
                                <div style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.04)', borderRadius: '0.75rem', textAlign: 'center', border: '1px solid var(--glass-border)' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem', fontWeight: '600' }}>Word Count</div>
                                    <div style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--accent-primary)' }}>{report.wordCount || 0}</div>
                                </div>
                                <div style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.04)', borderRadius: '0.75rem', textAlign: 'center', border: '1px solid var(--glass-border)' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem', fontWeight: '600' }}>Primary Emotion</div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--accent-primary)', textTransform: 'capitalize' }}>{report.primaryEmotion || '—'}</div>
                                </div>
                                <div style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.04)', borderRadius: '0.75rem', textAlign: 'center', border: '1px solid var(--glass-border)' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem', fontWeight: '600' }}>Clarity</div>
                                    <div style={{
                                        fontSize: '1.3rem', fontWeight: '800',
                                        color: report.pronunciationClarity >= 90 ? '#22c55e' : report.pronunciationClarity >= 75 ? '#eab308' : '#ef4444'
                                    }}>{report.pronunciationClarity || 0}%</div>
                                </div>
                                {analysis?.delivery_metrics?.wpm && (
                                    <div style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.04)', borderRadius: '0.75rem', textAlign: 'center', border: '1px solid var(--glass-border)' }}>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem', fontWeight: '600' }}>WPM</div>
                                        <div style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--accent-primary)' }}>{analysis.delivery_metrics.wpm}</div>
                                    </div>
                                )}
                            </div>

                            {/* Summary */}
                            {analysis?.summary && (
                                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.04)', borderRadius: '0.75rem', border: '1px solid var(--glass-border)' }}>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '700', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Executive Summary</div>
                                    <div style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--text-primary)', opacity: 0.9 }}>{analysis.summary}</div>
                                </div>
                            )}

                            {/* Glows & Grows */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                {analysis?.glows?.length > 0 && (
                                    <div style={{ padding: '1rem', background: 'rgba(34,197,94,0.05)', borderRadius: '0.75rem', borderLeft: '3px solid #22c55e' }}>
                                        <div style={{ fontSize: '0.8rem', color: '#22c55e', fontWeight: '700', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <CheckCircle size={14} /> Strengths
                                        </div>
                                        <ul style={{ paddingLeft: '1rem', margin: 0, fontSize: '0.9rem', lineHeight: '1.5', color: 'var(--text-primary)', opacity: 0.9 }}>
                                            {analysis.glows.map((g, i) => <li key={i}>{g}</li>)}
                                        </ul>
                                    </div>
                                )}
                                {analysis?.grows?.length > 0 && (
                                    <div style={{ padding: '1rem', background: 'rgba(245,158,11,0.05)', borderRadius: '0.75rem', borderLeft: '3px solid #f59e0b' }}>
                                        <div style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: '700', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <BarChart2 size={14} /> Areas to Grow
                                        </div>
                                        <ul style={{ paddingLeft: '1rem', margin: 0, fontSize: '0.9rem', lineHeight: '1.5', color: 'var(--text-primary)', opacity: 0.9 }}>
                                            {analysis.grows.map((g, i) => <li key={i}>{g}</li>)}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Dynamic analysis sections */}
                            {analysis && (() => {
                                const specialKeys = new Set([
                                    'summary', 'central_message', 'glows', 'grows',
                                    'recommendation', 'overall_recommendation', 'overall_score',
                                    'performance_summary', 'delivery_metrics'
                                ]);
                                const sections = Object.entries(analysis)
                                    .filter(([key, val]) => !specialKeys.has(key) && val !== null && val !== undefined);
                                if (sections.length === 0) return null;
                                return (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
                                        {sections.map(([key, val]) => {
                                            const label = key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                                            return (
                                                <div key={key} style={{ padding: '0.9rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.75rem', border: '1px solid var(--glass-border)' }}>
                                                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: '700', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
                                                    {typeof val === 'object' && val?.score !== undefined && (
                                                        <div style={{ fontSize: '1.2rem', fontWeight: '800', color: getScoreColor(val.score), marginBottom: '0.3rem' }}>{val.score}/10</div>
                                                    )}
                                                    {typeof val === 'string' && <div style={{ fontSize: '0.9rem', lineHeight: '1.5', opacity: 0.9 }}>{val}</div>}
                                                    {typeof val === 'object' && val?.comment && <div style={{ fontSize: '0.88rem', lineHeight: '1.5', opacity: 0.9 }}>{val.comment}</div>}
                                                    {Array.isArray(val) && (
                                                        <ul style={{ paddingLeft: '1rem', margin: 0, fontSize: '0.88rem', lineHeight: '1.5', opacity: 0.9 }}>
                                                            {val.map((item, i) => <li key={i}>{typeof item === 'string' ? item : JSON.stringify(item)}</li>)}
                                                        </ul>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })()}

                            {/* Recommendation */}
                            {report.recommendation && (
                                <div style={{ padding: '1rem', background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.08))', borderRadius: '0.75rem', border: '1px solid rgba(99,102,241,0.2)' }}>
                                    <div style={{ fontSize: '0.8rem', color: '#a78bfa', fontWeight: '700', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <Star size={14} /> AI Recommendation
                                    </div>
                                    <div style={{ fontSize: '0.92rem', lineHeight: '1.6', color: 'var(--text-primary)', opacity: 0.9 }}>{report.recommendation}</div>
                                </div>
                            )}

                            {/* Transcript */}
                            {report.transcript && (
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '700', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Transcript</div>
                                    <div style={{
                                        padding: '0.9rem', background: 'rgba(0,0,0,0.15)', borderRadius: '0.6rem',
                                        maxHeight: '150px', overflowY: 'auto', fontSize: '0.9rem',
                                        lineHeight: '1.7', color: 'var(--text-primary)', opacity: 0.85,
                                        whiteSpace: 'pre-wrap'
                                    }}>
                                        {report.transcript}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};


// ── Student Card with speeches ────────────────────────────────────────────
const StudentCard = ({ student, index, onReevaluate }) => {
    const [expanded, setExpanded] = useState(false);
    const completedCount = student.speeches.filter(s => s.status === 'COMPLETED').length;
    const totalSpeeches = student.speeches.length;
    const initials = (student.name || student.email || '?').substring(0, 2).toUpperCase();

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            style={{
                background: 'var(--glass)',
                border: '1px solid var(--glass-border)',
                borderRadius: '1.25rem',
                overflow: 'hidden'
            }}
        >
            {/* Student header */}
            <div
                onClick={() => setExpanded(!expanded)}
                style={{
                    padding: '1.25rem 1.5rem',
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    cursor: 'pointer', transition: 'background 0.2s',
                    background: expanded ? 'rgba(56,189,248,0.04)' : 'transparent'
                }}
            >
                {/* Avatar */}
                <div style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1rem', fontWeight: '800', color: '#fff', flexShrink: 0,
                    boxShadow: '0 4px 12px rgba(99,102,241,0.25)'
                }}>
                    {initials}
                </div>

                {/* Name & Email */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '0.15rem' }}>
                        {student.name || <span style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No name</span>}
                    </div>
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {student.email}
                    </div>
                </div>

                {/* Stats summary */}
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{
                        padding: '0.35rem 0.8rem', borderRadius: '999px', fontSize: '0.82rem', fontWeight: '700',
                        background: totalSpeeches > 0 ? 'rgba(56,189,248,0.1)' : 'rgba(148,163,184,0.1)',
                        color: totalSpeeches > 0 ? '#0ea5e9' : '#94a3b8',
                        border: `1px solid ${totalSpeeches > 0 ? 'rgba(56,189,248,0.25)' : 'rgba(148,163,184,0.25)'}`
                    }}>
                        {totalSpeeches} speech{totalSpeeches !== 1 ? 'es' : ''}
                    </div>
                    {completedCount > 0 && (
                        <div style={{
                            padding: '0.35rem 0.8rem', borderRadius: '999px', fontSize: '0.82rem', fontWeight: '700',
                            background: 'rgba(34,197,94,0.1)', color: '#22c55e',
                            border: '1px solid rgba(34,197,94,0.25)'
                        }}>
                            {completedCount} evaluated
                        </div>
                    )}
                    {expanded ? <ChevronDown size={20} color="var(--text-secondary)" /> : <ChevronRight size={20} color="var(--text-secondary)" />}
                </div>
            </div>

            {/* Expanded speeches */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: 'hidden' }}
                    >
                        <div style={{ padding: '0 1.25rem 1.25rem', borderTop: '1px solid var(--glass-border)' }}>
                            {student.speeches.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                                    <FileVideo size={32} style={{ opacity: 0.4, marginBottom: '0.5rem' }} />
                                    <p style={{ fontSize: '0.95rem' }}>No speeches uploaded yet</p>
                                </div>
                            ) : (
                                <div style={{ paddingTop: '1rem' }}>
                                    {student.speeches.map((speech, i) => (
                                        <SpeechReportCard key={speech.videoKey || i} speech={speech} studentId={student.userId} onReevaluate={onReevaluate} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};


// ════════════════════════════════════════════════════════════════════════════
// Main Component
// ════════════════════════════════════════════════════════════════════════════
const StudentEvaluations = ({ user, cls, onBack }) => {
    const [students, setStudents] = useState([]);
    const [className, setClassName] = useState(cls?.className || '');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchEvaluations();
    }, []);

    const fetchEvaluations = async () => {
        setIsLoading(true);
        setError('');
        try {
            const isCompetition = cls._isCompetition;
            const endpoint = isCompetition ? '/get-competition-evaluations' : '/get-student-evaluations';
            const payload = {
                instructorId: user.id || user.userId,
                ...(isCompetition ? { competitionId: cls.classId } : { classId: cls.classId })
            };
            const res = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (res.ok) {
                setStudents(data.students || []);
                setClassName(data.className || cls.className);
            } else {
                setError(data.message || 'Failed to load evaluations');
            }
        } catch {
            setError('Connection error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleReevaluate = async (videoKey, studentUserId) => {
        setIsLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/get-video-analysis`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: videoKey, userId: studentUserId })
            });
            const data = await res.json();

            if (res.ok) {
                if (data.status === 'COMPLETED') {
                    alert('Re-evaluation successful! Report is now generated.');
                } else if (data.status === 'IN_PROGRESS') {
                    alert('Re-evaluation triggered, but it is still processing. Please check back later.');
                } else if (data.status === 'FAILED') {
                    alert('Re-evaluation failed. The video might need to be re-uploaded.');
                }
            } else {
                alert(data.message || 'Failed to trigger re-evaluation');
            }

            // Refresh to get updated data
            fetchEvaluations();
        } catch (err) {
            console.error('Re-evaluate error:', err);
            alert('Failed to trigger re-evaluation. Check network connection.');
            setIsLoading(false);
        }
    };

    const totalSpeeches = students.reduce((sum, s) => sum + s.speeches.length, 0);
    const totalEvaluated = students.reduce((sum, s) => sum + s.speeches.filter(sp => sp.status === 'COMPLETED').length, 0);

    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%', padding: '2rem' }}>

            {/* Back button + Page header */}
            <div style={{ marginBottom: '2rem' }}>
                <button
                    onClick={onBack}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        background: 'none', border: 'none', color: 'var(--text-secondary)',
                        cursor: 'pointer', fontSize: '0.95rem', fontWeight: '600',
                        padding: '0.5rem 0', marginBottom: '1rem',
                        transition: 'color 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-primary)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                >
                    <ArrowLeft size={18} /> Back to {cls._isCompetition ? 'Competition' : 'Class'} Management
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h2 className="gradient-text" style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.3rem', letterSpacing: '-0.5px' }}>
                            Student Evaluations
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
                            {cls._isCompetition ? 'Competition' : 'Class'}: <span style={{ color: 'var(--accent-primary)', fontWeight: '700' }}>{className}</span>
                        </p>
                    </div>

                    {/* Summary stats */}
                    {!isLoading && !error && (
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{
                                padding: '0.6rem 1.2rem', borderRadius: '1rem',
                                background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
                                display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem'
                            }}>
                                <Users size={16} color="#6366f1" />
                                <span style={{ fontWeight: '800', color: '#6366f1' }}>{students.length}</span>
                                <span style={{ color: 'var(--text-secondary)' }}>students</span>
                            </div>
                            <div style={{
                                padding: '0.6rem 1.2rem', borderRadius: '1rem',
                                background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.2)',
                                display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem'
                            }}>
                                <FileVideo size={16} color="#0ea5e9" />
                                <span style={{ fontWeight: '800', color: '#0ea5e9' }}>{totalSpeeches}</span>
                                <span style={{ color: 'var(--text-secondary)' }}>speeches</span>
                            </div>
                            <div style={{
                                padding: '0.6rem 1.2rem', borderRadius: '1rem',
                                background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)',
                                display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem'
                            }}>
                                <CheckCircle size={16} color="#22c55e" />
                                <span style={{ fontWeight: '800', color: '#22c55e' }}>{totalEvaluated}</span>
                                <span style={{ color: 'var(--text-secondary)' }}>evaluated</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Error */}
            {error && (
                <div style={{
                    padding: '1.25rem', background: 'rgba(239,68,68,0.1)', color: '#ef4444',
                    borderRadius: '1rem', border: '1px solid rgba(239,68,68,0.2)',
                    marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem'
                }}>
                    <AlertCircle size={20} />
                    <span style={{ fontWeight: '600' }}>{error}</span>
                    <button onClick={fetchEvaluations} style={{
                        marginLeft: 'auto', padding: '0.5rem 1rem', background: 'rgba(239,68,68,0.2)',
                        border: 'none', borderRadius: '0.5rem', color: '#ef4444', cursor: 'pointer', fontWeight: '600'
                    }}>Retry</button>
                </div>
            )}

            {/* Loading */}
            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '5rem' }}>
                    <Loader2 className="spinner" size={48} color="var(--accent-primary)" style={{ marginBottom: '1rem' }} />
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Loading student evaluations…</p>
                </div>
            ) : students.length === 0 && !error ? (
                <div className="glass-panel" style={{ textAlign: 'center', padding: '5rem', borderRadius: '2rem' }}>
                    <Users size={56} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                    <h3 style={{ fontSize: '1.4rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>No Students Enrolled</h3>
                    <p style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>Add students to this class to see their evaluations here.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {students.map((student, i) => (
                        <StudentCard key={student.email} student={student} index={i} onReevaluate={handleReevaluate} />
                    ))}
                </div>
            )}

            <style>{`
                .spinner { animation: spin 1.4s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default StudentEvaluations;
