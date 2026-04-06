import React, { useState, useEffect } from 'react';
import {
    Plus, Trash2, CheckCircle, Users, Trophy,
    AlertCircle, Loader2, X, UserPlus, Mail, ClipboardList, PlusCircle, UserMinus, FileText, BarChart2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../config';
import StudentEvaluations from './StudentEvaluations';

// ── Status badge ──────────────────────────────────────────────────────────────
const STATUS_MAP = {
    ACTIVE: { label: 'Active', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
    PENDING_SIGNUP: { label: 'Pending Signup', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
    linked: { label: 'Linked ✓', color: '#0ea5e9', bg: 'rgba(14,165,233,0.12)' },
    created: { label: 'Account Created ✉️', color: '#7c3aed', bg: 'rgba(124,58,237,0.10)' },
    created_email_failed: { label: 'Created (No Email)', color: '#d97706', bg: 'rgba(217,119,6,0.10)' },
    already_enrolled: { label: 'Already Enrolled', color: '#64748b', bg: 'rgba(100,116,139,0.10)' },
    NOT_FOUND: { label: 'Not Found', color: '#ef4444', bg: 'rgba(239,68,68,0.10)' },
};
const StatusBadge = ({ status }) => {
    const s = STATUS_MAP[status] || { label: status, color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' };
    return (
        <span style={{
            padding: '0.25rem 0.7rem', borderRadius: '999px', fontSize: '0.78rem',
            fontWeight: '700', color: s.color, background: s.bg,
            border: `1px solid ${s.color}44`, whiteSpace: 'nowrap'
        }}>
            {s.label}
        </span>
    );
};

// shared white-modal overlay wrapper
const ModalOverlay = ({ zIndex = 1000, onClose, children }) => (
    <div
        style={{
            position: 'fixed', inset: 0, zIndex,
            background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}
        onClick={e => e.target === e.currentTarget && onClose()}
    >
        {children}
    </div>
);

// ── Manage Criteria Modal ─────────────────────────────────────────────────────
const ManageCriteriaModal = ({ competition, user, masterCriteria = [], onSave, onClose }) => {
    const [items, setItems] = useState([...(competition.criteria || [])]);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const toggleCriteria = (key) => {
        if (items.includes(key)) {
            setItems(items.filter(i => i !== key));
        } else {
            setItems([...items, key]);
        }
    };

    const handleSave = async () => {
        setIsSaving(true); setError('');
        try {
            const res = await fetch(`${API_BASE_URL}/update-competition-criteria`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id || user.userId, competitionId: competition.competitionId, criteria: items })
            });
            const data = await res.json();
            if (res.ok) {
                setSuccess('Criteria saved!');
                onSave(data.criteria);
                setTimeout(() => { setSuccess(''); onClose(); }, 1200);
            } else { setError(data.message || 'Save failed.'); }
        } catch { setError('Connection error.'); }
        finally { setIsSaving(false); }
    };

    return (
        <ModalOverlay zIndex={1001} onClose={onClose}>
            <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 24 }}
                style={{
                    width: '100%', maxWidth: '720px', maxHeight: '88vh',
                    borderRadius: '1.5rem', display: 'flex', flexDirection: 'column',
                    overflow: 'hidden', background: '#ffffff',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.25)'
                }}
            >
                {/* Header */}
                <div style={{
                    padding: '1.75rem 2rem 1.25rem',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                    borderBottom: '1px solid #e2e8f0'
                }}>
                    <div>
                        <h3 style={{ fontSize: '1.7rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.25rem' }}>
                            Update Evaluation Focus
                        </h3>
                        <p style={{ color: '#64748b', fontSize: '1rem' }}>
                            Competition: <span style={{ color: '#d97706', fontWeight: '700' }}>{competition.competitionName}</span>
                        </p>
                    </div>
                    <button onClick={onClose} style={{
                        background: '#f1f5f9', border: '1px solid #e2e8f0',
                        borderRadius: '0.65rem', padding: '0.45rem', color: '#64748b', cursor: 'pointer'
                    }}><X size={18} /></button>
                </div>

                {/* Body */}
                <div style={{ overflowY: 'auto', flex: 1, padding: '1.75rem 2rem' }}>
                    <p style={{ color: '#64748b', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                        Select the areas you want the AI to evaluate for this competition. These criteria directly influence the feedback participants receive.
                    </p>

                    {/* Checkbox Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                        gap: '0.85rem',
                        marginBottom: '1.5rem'
                    }}>
                        {masterCriteria.map((key) => {
                            const isSelected = items.includes(key);
                            const label = key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

                            return (
                                <label
                                    key={key}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        padding: '0.9rem 1rem',
                                        borderRadius: '0.9rem',
                                        background: isSelected ? 'rgba(245,158,11,0.06)' : '#f8fafc',
                                        border: `1px solid ${isSelected ? '#d97706' : '#e2e8f0'}`,
                                        cursor: 'pointer',
                                        transition: 'all 0.15s ease'
                                    }}
                                >
                                    <div style={{
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '5px',
                                        border: `2px solid ${isSelected ? '#d97706' : '#cbd5e1'}`,
                                        background: isSelected ? '#d97706' : 'transparent',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        {isSelected && <CheckCircle size={12} color="#fff" />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => toggleCriteria(key)}
                                        style={{ display: 'none' }}
                                    />
                                    <span style={{
                                        fontSize: '0.95rem',
                                        fontWeight: isSelected ? '700' : '500',
                                        color: isSelected ? '#92400e' : '#475569'
                                    }}>
                                        {label}
                                    </span>
                                </label>
                            );
                        })}
                    </div>

                    {/* Messages */}
                    {error && <div style={{ padding: '0.7rem 1rem', background: '#fef2f2', color: '#dc2626', borderRadius: '0.7rem', border: '1px solid #fecaca', display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem', fontSize: '1rem' }}><AlertCircle size={16} /> {error}</div>}
                    {success && <div style={{ padding: '0.7rem 1rem', background: '#f0fdf4', color: '#16a34a', borderRadius: '0.7rem', border: '1px solid #bbf7d0', display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem', fontSize: '1rem' }}><CheckCircle size={16} /> {success}</div>}
                </div>

                {/* Footer */}
                <div style={{
                    padding: '1.1rem 2rem', borderTop: '1px solid #e2e8f0', background: '#f8fafc',
                    display: 'flex', gap: '0.75rem', justifyContent: 'flex-end'
                }}>
                    <button onClick={onClose} style={{
                        padding: '0.8rem 1.8rem', background: '#fff', border: '1px solid #cbd5e1',
                        borderRadius: '0.75rem', color: '#374151', fontWeight: '600', cursor: 'pointer', fontSize: '1rem'
                    }}>Cancel</button>
                    <button onClick={handleSave} disabled={isSaving} style={{
                        padding: '0.8rem 2rem', background: 'linear-gradient(135deg, #f59e0b, #d97706)', border: 'none',
                        borderRadius: '0.75rem', color: '#fff', fontWeight: '800', fontSize: '1rem',
                        cursor: isSaving ? 'not-allowed' : 'pointer', opacity: isSaving ? 0.7 : 1,
                        display: 'flex', alignItems: 'center', gap: '0.5rem'
                    }}>
                        {isSaving ? <Loader2 className="spinner" size={18} /> : <CheckCircle size={18} />}
                        {isSaving ? 'Saving…' : 'Save Changes'}
                    </button>
                </div>
            </motion.div>
        </ModalOverlay>
    );
};

// ── Manage Participants Modal ─────────────────────────────────────────────────
const ManageParticipantsModal = ({ competition, user, onClose }) => {
    const [emailInput, setEmailInput] = useState('');
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => { fetchParticipants(); }, []);

    const fetchParticipants = async () => {
        setIsLoading(true); setError('');
        try {
            const res = await fetch(`${API_BASE_URL}/get-competition-participants`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ competitionId: competition.competitionId, userId: user.id || user.userId })
            });
            const data = await res.json();
            if (res.ok) setStudents(data.students || []);
            else setError(data.message || 'Failed to load participants');
        } catch { setError('Connection error.'); }
        finally { setIsLoading(false); }
    };

    const handleAddParticipants = async () => {
        const emails = emailInput.split(/[\n,]+/).map(e => e.trim()).filter(e => e && e.includes('@'));
        if (!emails.length) { setError('Please enter at least one valid email address.'); return; }
        setIsSaving(true); setError(''); setSuccess('');
        try {
            const res = await fetch(`${API_BASE_URL}/add-participants-to-competition`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ instructorId: user.id || user.userId, competitionId: competition.competitionId, emails })
            });
            const data = await res.json();
            if (res.ok) {
                const results = data.results || [];
                const created = results.filter(r => r.status === 'created').length;
                const linked = results.filter(r => r.status === 'linked').length;
                const parts = [];
                if (created) parts.push(`${created} new account(s) created & email sent`);
                if (linked) parts.push(`${linked} existing account(s) linked`);
                setSuccess(parts.join(' · ') || `${results.length} participant(s) processed.`);
                setEmailInput('');
                setTimeout(() => setSuccess(''), 6000);
                fetchParticipants();
            } else { setError(data.message || 'Failed to add participants.'); }
        } catch { setError('Connection error.'); }
        finally { setIsSaving(false); }
    };

    const handleRemoveParticipant = async (student) => {
        if (!window.confirm(`Remove ${student.name || student.email} from this competition?\n\nThis will also permanently delete their account if not enrolled elsewhere.`)) return;
        setError(''); setSuccess('');
        try {
            const res = await fetch(`${API_BASE_URL}/remove-participant-from-competition`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    instructorId: user.id || user.userId,
                    competitionId: competition.competitionId,
                    studentEmail: student.email,
                    studentUserId: student.userId || ''
                })
            });
            const data = await res.json();
            if (res.ok) {
                setSuccess(`${student.email} removed successfully.`);
                setTimeout(() => setSuccess(''), 4000);
                fetchParticipants();
            } else { setError(data.message || 'Failed to remove participant.'); }
        } catch { setError('Connection error.'); }
    };

    return (
        <ModalOverlay zIndex={1000} onClose={onClose}>
            <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 24 }}
                style={{
                    width: '100%', maxWidth: '680px', maxHeight: '90vh',
                    borderRadius: '1.5rem', display: 'flex', flexDirection: 'column',
                    overflow: 'hidden', background: '#ffffff',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.25)'
                }}
            >
                {/* Header */}
                <div style={{
                    padding: '1.75rem 2rem 1.25rem',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                    borderBottom: '1px solid #e2e8f0'
                }}>
                    <div>
                        <h3 style={{ fontSize: '1.7rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.25rem' }}>
                            Manage Participants
                        </h3>
                        <p style={{ color: '#64748b', fontSize: '1rem' }}>
                            <span style={{ color: '#d97706', fontWeight: '700' }}>{competition.competitionName}</span>
                            {' '}— add participants or link existing accounts
                        </p>
                    </div>
                    <button onClick={onClose} style={{
                        background: '#f1f5f9', border: '1px solid #e2e8f0',
                        borderRadius: '0.65rem', padding: '0.45rem', color: '#64748b', cursor: 'pointer'
                    }}><X size={18} /></button>
                </div>

                {/* Body */}
                <div style={{ overflowY: 'auto', flex: 1, padding: '1.75rem 2rem' }}>

                    {/* Email textarea */}
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: '600', color: '#374151', fontSize: '1rem' }}>
                            Add Participants by Email
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={15} style={{ position: 'absolute', left: '0.9rem', top: '1rem', color: '#d97706', pointerEvents: 'none' }} />
                            <textarea
                                value={emailInput}
                                onChange={e => setEmailInput(e.target.value)}
                                placeholder={'participant1@email.com\nparticipant2@email.com\n(one per line or comma-separated)'}
                                rows={5}
                                style={{
                                    width: '100%', padding: '0.9rem 0.9rem 0.9rem 2.4rem',
                                    borderRadius: '0.9rem', resize: 'vertical',
                                    background: '#f8fafc', border: '1px solid #cbd5e1',
                                    color: '#0f172a', fontSize: '1rem',
                                    fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        {/* Info hint */}
                        <div style={{
                            marginTop: '0.65rem', padding: '0.7rem 1rem',
                            background: '#fffbeb', borderRadius: '0.7rem', border: '1px solid #fde68a',
                            fontSize: '0.95rem', color: '#92400e', lineHeight: '1.6'
                        }}>
                            🔐 <strong>New participants</strong> get a temp password via email.
                            &nbsp;<strong>Existing users</strong> are simply linked to this competition.
                        </div>

                        <button
                            onClick={handleAddParticipants} disabled={isSaving}
                            style={{
                                marginTop: '0.9rem', width: '100%', padding: '0.9rem',
                                background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: '#fff',
                                border: 'none', borderRadius: '0.9rem', fontWeight: '800',
                                cursor: isSaving ? 'not-allowed' : 'pointer', opacity: isSaving ? 0.7 : 1,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', fontSize: '1.05rem'
                            }}
                        >
                            {isSaving ? <Loader2 className="spinner" size={19} /> : <UserPlus size={19} />}
                            {isSaving ? 'Adding…' : 'Add Participants & Send Invites'}
                        </button>
                    </div>

                    {/* Messages */}
                    {error && <div style={{ padding: '0.8rem 1rem', background: '#fef2f2', color: '#dc2626', borderRadius: '0.75rem', border: '1px solid #fecaca', display: 'flex', gap: '0.6rem', alignItems: 'center', marginBottom: '1.25rem', fontSize: '1rem' }}><AlertCircle size={17} /> {error}</div>}
                    {success && <div style={{ padding: '0.8rem 1rem', background: '#f0fdf4', color: '#16a34a', borderRadius: '0.75rem', border: '1px solid #bbf7d0', display: 'flex', gap: '0.6rem', alignItems: 'center', marginBottom: '1.25rem', fontSize: '1rem' }}><CheckCircle size={17} /> {success}</div>}

                    {/* Roster */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.9rem' }}>
                            <h4 style={{ fontWeight: '700', fontSize: '1.15rem', color: '#0f172a' }}>Participant Roster</h4>
                            <span style={{ padding: '0.25rem 0.8rem', borderRadius: '999px', background: '#fffbeb', color: '#92400e', fontSize: '0.95rem', fontWeight: '700', border: '1px solid #fde68a' }}>
                                {students.length} participant{students.length !== 1 ? 's' : ''}
                            </span>
                        </div>

                        {isLoading ? (
                            <div style={{ textAlign: 'center', padding: '3rem' }}><Loader2 className="spinner" size={38} color="#f59e0b" /></div>
                        ) : students.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '2.5rem', color: '#94a3b8' }}>
                                <Users size={38} style={{ marginBottom: '0.75rem' }} />
                                <p style={{ fontSize: '1rem' }}>No participants yet. Use the field above to get started.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                {students.map((s, i) => (
                                    <motion.div
                                        key={s.email}
                                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.04 }}
                                        style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            padding: '0.8rem 1rem', background: '#f8fafc',
                                            borderRadius: '0.9rem', border: '1px solid #e2e8f0', gap: '0.75rem'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', minWidth: 0 }}>
                                            <div style={{
                                                width: '36px', height: '36px', borderRadius: '50%',
                                                background: 'linear-gradient(135deg,#f59e0b,#d97706)', flexShrink: 0,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '0.88rem', fontWeight: '800', color: '#fff'
                                            }}>
                                                {(s.name || s.email)[0].toUpperCase()}
                                            </div>
                                            <div style={{ minWidth: 0 }}>
                                                <p style={{ fontWeight: '600', fontSize: '1.05rem', color: '#0f172a', marginBottom: '0.1rem' }}>
                                                    {s.name || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>No name yet</span>}
                                                </p>
                                                <p style={{ fontSize: '0.92rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {s.email}
                                                </p>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                                            <StatusBadge status={s.status} />
                                            <button
                                                onClick={() => handleRemoveParticipant(s)}
                                                title="Remove participant"
                                                style={{
                                                    background: '#fee2e2', border: 'none', color: '#dc2626',
                                                    borderRadius: '0.5rem', padding: '0.4rem', cursor: 'pointer',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    transition: 'background 0.2s'
                                                }}
                                                onMouseEnter={e => { e.currentTarget.style.background = '#fecaca'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = '#fee2e2'; }}
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div style={{ padding: '1rem 2rem', borderTop: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '0.92rem', color: '#64748b' }}>
                    ✉️ <strong>Account Created</strong> = new account + welcome email sent.
                    &nbsp;🔗 <strong>Linked</strong> = existing account connected to this competition.
                </div>
            </motion.div>
        </ModalOverlay>
    );
};

// ── Main CompetitionSetup Component ───────────────────────────────────────────
const CompetitionSetup = ({ user }) => {
    const [competitions, setCompetitions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [managingCompetition, setManagingCompetition] = useState(null);
    const [criteriaCompetition, setCriteriaCompetition] = useState(null);
    const [evaluationsCompetition, setEvaluationsCompetition] = useState(null);

    const [competitionName, setCompetitionName] = useState('');
    const [criteria, setCriteria] = useState([]);
    const [masterCriteria, setMasterCriteria] = useState([]);

    const isSuperAdmin = user?.role === 'super_admin';

    useEffect(() => {
        fetchCompetitions();
        fetchMasterCriteria();
    }, []);

    const fetchMasterCriteria = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/get-master-criteria`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            });
            const data = await res.json();
            if (res.ok) setMasterCriteria(data.criteria || []);
        } catch (err) {
            console.error('Failed to fetch master criteria:', err);
        }
    };

    const fetchCompetitions = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/list-competitions`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id || user.userId })
            });
            const data = await res.json();
            if (res.ok) setCompetitions(data.competitions || []);
            else setError(data.message || 'Failed to fetch competitions');
        } catch { setError('Connection error.'); }
        finally { setIsLoading(false); }
    };

    const handleCreateCompetition = async (e) => {
        e.preventDefault();
        if (!competitionName.trim()) { setError('Competition name is required'); return; }
        setIsLoading(true); setError('');
        try {
            const res = await fetch(`${API_BASE_URL}/create-competition`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id || user.userId, competitionName: competitionName, criteria: criteria.filter(c => c.trim()) })
            });
            const data = await res.json();
            if (res.ok) {
                setSuccessMessage('Competition created!');
                setCompetitionName(''); setCriteria([]);
                setIsCreating(false); fetchCompetitions();
                setTimeout(() => setSuccessMessage(''), 3000);
            } else { setError(data.message || 'Failed to create competition'); }
        } catch { setError('Failed to connect to server'); }
        finally { setIsLoading(false); }
    };

    const handleDeleteCompetition = async (competitionId) => {
        if (!window.confirm('Delete this competition? All participant links will be removed.')) return;
        try {
            const res = await fetch(`${API_BASE_URL}/delete-competition`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ competitionId })
            });
            if (res.ok) setCompetitions(prev => prev.filter(c => c.competitionId !== competitionId));
        } catch (err) { console.error('Delete error:', err); }
    };

    // If viewing evaluations for a competition, render the StudentEvaluations page
    // We pass a "cls" prop shaped for compatibility with the existing StudentEvaluations component
    if (evaluationsCompetition) {
        const clsCompat = {
            classId: evaluationsCompetition.competitionId,
            className: evaluationsCompetition.competitionName,
            // Tell StudentEvaluations to use competition endpoint
            _isCompetition: true
        };
        return (
            <StudentEvaluations
                user={user}
                cls={clsCompat}
                onBack={() => setEvaluationsCompetition(null)}
            />
        );
    }

    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%', padding: '2rem' }}>

            {/* Modals */}
            <AnimatePresence>
                {managingCompetition && (
                    <ManageParticipantsModal
                        competition={managingCompetition} user={user}
                        onClose={() => { setManagingCompetition(null); fetchCompetitions(); }}
                    />
                )}
            </AnimatePresence>
            <AnimatePresence>
                {criteriaCompetition && (
                    <ManageCriteriaModal
                        competition={criteriaCompetition} user={user}
                        masterCriteria={masterCriteria}
                        onSave={newCriteria => setCompetitions(prev => prev.map(c =>
                            c.competitionId === criteriaCompetition.competitionId ? { ...c, criteria: newCriteria } : c
                        ))}
                        onClose={() => setCriteriaCompetition(null)}
                    />
                )}
            </AnimatePresence>

            {/* Page header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h2 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                        {isSuperAdmin ? 'All Competitions (Admin View)' : 'Competition Management'}
                    </h2>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {isSuperAdmin
                            ? `Viewing all competitions across all instructors — ${competitions.length} competition${competitions.length !== 1 ? 's' : ''} total.`
                            : 'Create competitions, set evaluation criteria, and add participants automatically via email.'
                        }
                    </p>
                </div>
                {!isCreating && !isSuperAdmin && (
                    <button onClick={() => setIsCreating(true)} style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        padding: '1rem 1.5rem', background: 'var(--accent-gradient)',
                        color: 'var(--text-primary)', border: 'none', borderRadius: '1rem',
                        fontWeight: '700', cursor: 'pointer', boxShadow: 'var(--shadow-glow)'
                    }}>
                        <Plus size={20} /> Create New Competition
                    </button>
                )}
            </div>

            {/* Banners */}
            {error && (
                <div style={{ padding: '1.25rem', background: 'rgba(239,68,68,0.1)', color: '#ef4444', borderRadius: '1rem', border: '1px solid rgba(239,68,68,0.2)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <AlertCircle size={20} /> {error}
                </div>
            )}
            {successMessage && (
                <div style={{ padding: '1.25rem', background: 'rgba(16,185,129,0.1)', color: '#10b981', borderRadius: '1rem', border: '1px solid rgba(16,185,129,0.2)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <CheckCircle size={20} /> {successMessage}
                </div>
            )}

            <AnimatePresence mode="wait">
                {isCreating ? (
                    /* ── Create competition form ── */
                    <motion.div key="create-form"
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                        className="glass-panel" style={{ padding: '2.5rem', borderRadius: '2rem' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: '700' }}>New Competition Setup</h3>
                            <button onClick={() => setIsCreating(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                <Plus size={24} style={{ transform: 'rotate(45deg)' }} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateCompetition}>
                            <div style={{ marginBottom: '2.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Competition Name</label>
                                <input
                                    type="text" value={competitionName} onChange={e => setCompetitionName(e.target.value)}
                                    placeholder="e.g. Regional Speech Competition — Spring 2026"
                                    style={{ width: '100%', padding: '1.2rem', borderRadius: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', fontSize: '1.1rem', boxSizing: 'border-box', outline: 'none' }}
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: '2.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '1.25rem', fontWeight: '700', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                                    Select Evaluation Focus Areas
                                    <span style={{ fontSize: '0.85rem', fontWeight: '400', marginLeft: '0.75rem', opacity: 0.7 }}>— Choose which areas the AI should evaluate</span>
                                </label>

                                {masterCriteria.length === 0 ? (
                                    <div style={{ padding: '2rem', textAlign: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: '1rem', border: '1px dashed var(--glass-border)' }}>
                                        <Loader2 className="spinner" size={24} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Loading criteria options...</p>
                                    </div>
                                ) : (
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                                        gap: '1rem'
                                    }}>
                                        {masterCriteria.map((key) => {
                                            const isSelected = criteria.includes(key);
                                            const label = key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

                                            return (
                                                <label
                                                    key={key}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.85rem',
                                                        padding: '1.1rem 1.25rem',
                                                        borderRadius: '1.1rem',
                                                        background: isSelected ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.03)',
                                                        border: `1px solid ${isSelected ? '#f59e0b' : 'var(--glass-border)'}`,
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                                        boxShadow: isSelected ? '0 4px 12px rgba(245,158,11,0.1)' : 'none'
                                                    }}
                                                >
                                                    <div style={{
                                                        width: '22px',
                                                        height: '22px',
                                                        borderRadius: '6px',
                                                        border: `2px solid ${isSelected ? '#f59e0b' : 'rgba(255,255,255,0.2)'}`,
                                                        background: isSelected ? '#f59e0b' : 'transparent',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        transition: 'all 0.2s',
                                                        flexShrink: 0
                                                    }}>
                                                        {isSelected && <CheckCircle size={14} color="#fff" />}
                                                    </div>
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => {
                                                            if (isSelected) {
                                                                setCriteria(criteria.filter(c => c !== key));
                                                            } else {
                                                                setCriteria([...criteria, key]);
                                                            }
                                                        }}
                                                        style={{ display: 'none' }}
                                                    />
                                                    <span style={{
                                                        fontSize: '1rem',
                                                        fontWeight: isSelected ? '700' : '500',
                                                        color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)'
                                                    }}>
                                                        {label}
                                                    </span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'flex-end' }}>
                                <button type="button" onClick={() => setIsCreating(false)} style={{ padding: '1rem 2rem', background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--glass-border)', borderRadius: '1rem', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" disabled={isLoading} style={{ padding: '1rem 3rem', background: 'var(--accent-gradient)', color: 'var(--text-primary)', border: 'none', borderRadius: '1rem', fontWeight: '800', cursor: 'pointer', boxShadow: 'var(--shadow-glow)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    {isLoading ? <Loader2 className="spinner" size={20} /> : 'Save Competition'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                ) : (
                    /* ── Competition cards ── */
                    <motion.div key="competition-list" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(440px, 1fr))', gap: '2rem' }}
                    >
                        {isLoading ? (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem' }}>
                                <Loader2 className="spinner" size={48} color="var(--accent-primary)" />
                            </div>
                        ) : competitions.length === 0 ? (
                            <div className="glass-panel" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem', borderRadius: '2rem' }}>
                                <Trophy size={64} style={{ marginBottom: '1.5rem', opacity: 0.3 }} />
                                <h3 style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}>No competitions yet</h3>
                                <p style={{ marginBottom: '2rem', opacity: 0.7 }}>Create your first competition to start managing participants and evaluations.</p>
                                <button onClick={() => setIsCreating(true)} style={{ padding: '1rem 2rem', background: 'var(--accent-gradient)', color: 'var(--text-primary)', border: 'none', borderRadius: '1rem', fontWeight: '700', cursor: 'pointer' }}>
                                    Setup First Competition
                                </button>
                            </div>
                        ) : (
                            competitions.map(comp => (
                                <motion.div key={comp.competitionId} whileHover={{ y: -4 }}
                                    className="glass-panel" style={{ padding: '2rem', borderRadius: '2rem', overflow: 'hidden' }}
                                >
                                    {/* Card header */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
                                                <Trophy size={20} color="#f59e0b" />
                                                <h4 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{comp.competitionName}</h4>
                                            </div>
                                            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>Created {new Date(comp.createdAt).toLocaleDateString()}</p>
                                            {/* Show instructor info for super_admin */}
                                            {isSuperAdmin && comp.instructorName && (
                                                <div style={{
                                                    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                                                    marginTop: '0.5rem', padding: '0.3rem 0.85rem',
                                                    borderRadius: '999px', fontSize: '0.88rem', fontWeight: '600',
                                                    background: 'rgba(124,58,237,0.1)', color: '#7c3aed',
                                                    border: '1px solid rgba(124,58,237,0.2)'
                                                }}>
                                                    👤 {comp.instructorName}
                                                    {comp.instructorEmail && (
                                                        <span style={{ color: 'var(--text-secondary)', fontWeight: '400' }}>
                                                            ({comp.instructorEmail})
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        {(!isSuperAdmin || comp.instructorId === (user.id || user.userId)) && (
                                            <button onClick={() => handleDeleteCompetition(comp.competitionId)} style={{ padding: '0.6rem', borderRadius: '0.7rem', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', cursor: 'pointer' }} title="Delete Competition">
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>

                                    {/* Participant count */}
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.95rem', borderRadius: '999px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: '#111', fontSize: '1rem', fontWeight: '700', marginBottom: '1.1rem' }}>
                                        <Users size={15} />
                                        {(comp.participantEmails || []).length} participant{(comp.participantEmails || []).length !== 1 ? 's' : ''}
                                    </div>

                                    {/* Criteria tags */}
                                    {comp.criteria?.length > 0 && (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '1.25rem' }}>
                                            {comp.criteria.map((crit, i) => (
                                                <span key={i} style={{ padding: '0.35rem 0.8rem', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '0.5rem', fontSize: '0.95rem', color: '#111' }}>
                                                    {crit}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Action buttons */}
                                    <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center' }}>
                                        {/* Amber — Participants */}
                                        <button onClick={() => setManagingCompetition(comp)}
                                            style={{ flex: 1, padding: '0.85rem', background: '#d97706', border: '1px solid #b45309', borderRadius: '0.9rem', color: '#fff', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem', transition: 'background 0.2s' }}
                                            onMouseEnter={e => { e.currentTarget.style.background = '#b45309'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = '#d97706'; }}
                                        >
                                            <Users size={17} /> Participants
                                        </button>
                                        {/* Blue — Criteria */}
                                        <button onClick={() => setCriteriaCompetition(comp)}
                                            style={{ flex: 1, padding: '0.85rem', background: '#2563eb', border: '1px solid #1d4ed8', borderRadius: '0.9rem', color: '#fff', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem', transition: 'background 0.2s' }}
                                            onMouseEnter={e => { e.currentTarget.style.background = '#1d4ed8'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = '#2563eb'; }}
                                        >
                                            <ClipboardList size={17} /> Criteria
                                        </button>
                                        {/* Green — Evaluations */}
                                        <button onClick={() => setEvaluationsCompetition(comp)}
                                            style={{ flex: 1, padding: '0.85rem', background: 'linear-gradient(135deg, #16a34a, #15803d)', border: '1px solid #166534', borderRadius: '0.9rem', color: '#fff', fontWeight: '700', fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem', transition: 'opacity 0.2s', boxShadow: '0 2px 8px rgba(16,163,74,0.25)' }}
                                            onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; }}
                                            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
                                        >
                                            <BarChart2 size={17} /> Evaluations
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                .spinner { animation: spin 1.4s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default CompetitionSetup;
