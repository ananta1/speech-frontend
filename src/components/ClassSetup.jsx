import React, { useState, useEffect } from 'react';
import {
    Plus, Trash2, CheckCircle, Users, BookOpen,
    AlertCircle, Loader2, X, UserPlus, Mail, ClipboardList, PlusCircle, UserMinus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../config';

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
const ManageCriteriaModal = ({ cls, user, masterCriteria = [], onSave, onClose }) => {
    const [items, setItems] = useState([...(cls.criteria || [])]);
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
            const res = await fetch(`${API_BASE_URL}/update-class-criteria`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id || user.userId, classId: cls.classId, criteria: items })
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
                            Class: <span style={{ color: '#2563eb', fontWeight: '700' }}>{cls.className}</span>
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
                        Select the areas you want the AI to analyze for this class. These criteria directly influence the feedback students receive.
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
                                        background: isSelected ? 'rgba(37,99,235,0.06)' : '#f8fafc',
                                        border: `1px solid ${isSelected ? '#2563eb' : '#e2e8f0'}`,
                                        cursor: 'pointer',
                                        transition: 'all 0.15s ease'
                                    }}
                                >
                                    <div style={{
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '5px',
                                        border: `2px solid ${isSelected ? '#2563eb' : '#cbd5e1'}`,
                                        background: isSelected ? '#2563eb' : 'transparent',
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
                                        color: isSelected ? '#1e3a8a' : '#475569'
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
                        padding: '0.8rem 2rem', background: '#2563eb', border: 'none',
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

// ── Manage Students Modal ─────────────────────────────────────────────────────
const ManageStudentsModal = ({ cls, user, onClose }) => {
    const [emailInput, setEmailInput] = useState('');
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => { fetchStudents(); }, []);

    const fetchStudents = async () => {
        setIsLoading(true); setError('');
        try {
            const res = await fetch(`${API_BASE_URL}/get-class-students`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ classId: cls.classId, userId: user.id || user.userId })
            });
            const data = await res.json();
            if (res.ok) setStudents(data.students || []);
            else setError(data.message || 'Failed to load students');
        } catch { setError('Connection error.'); }
        finally { setIsLoading(false); }
    };

    const handleAddStudents = async () => {
        const emails = emailInput.split(/[\n,]+/).map(e => e.trim()).filter(e => e && e.includes('@'));
        if (!emails.length) { setError('Please enter at least one valid email address.'); return; }
        setIsSaving(true); setError(''); setSuccess('');
        try {
            const res = await fetch(`${API_BASE_URL}/add-students-to-class`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ instructorId: user.id || user.userId, classId: cls.classId, emails })
            });
            const data = await res.json();
            if (res.ok) {
                const results = data.results || [];
                const created = results.filter(r => r.status === 'created').length;
                const linked = results.filter(r => r.status === 'linked').length;
                const parts = [];
                if (created) parts.push(`${created} new account(s) created & email sent`);
                if (linked) parts.push(`${linked} existing account(s) linked`);
                setSuccess(parts.join(' · ') || `${results.length} student(s) processed.`);
                setEmailInput('');
                setTimeout(() => setSuccess(''), 6000);
                fetchStudents();
            } else { setError(data.message || 'Failed to add students.'); }
        } catch { setError('Connection error.'); }
        finally { setIsSaving(false); }
    };

    const handleRemoveStudent = async (student) => {
        if (!window.confirm(`Remove ${student.name || student.email} from this class?\n\nThis will also permanently delete their account.`)) return;
        setError(''); setSuccess('');
        try {
            const res = await fetch(`${API_BASE_URL}/remove-student-from-class`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    instructorId: user.id || user.userId,
                    classId: cls.classId,
                    studentEmail: student.email,
                    studentUserId: student.userId || ''
                })
            });
            const data = await res.json();
            if (res.ok) {
                setSuccess(`${student.email} removed successfully.`);
                setTimeout(() => setSuccess(''), 4000);
                fetchStudents();
            } else { setError(data.message || 'Failed to remove student.'); }
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
                            Manage Students
                        </h3>
                        <p style={{ color: '#64748b', fontSize: '1rem' }}>
                            <span style={{ color: '#16a34a', fontWeight: '700' }}>{cls.className}</span>
                            {' '}— enroll students or link existing accounts
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
                            Add Students by Email
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={15} style={{ position: 'absolute', left: '0.9rem', top: '1rem', color: '#16a34a', pointerEvents: 'none' }} />
                            <textarea
                                value={emailInput}
                                onChange={e => setEmailInput(e.target.value)}
                                placeholder={'student1@school.edu\nstudent2@school.edu\n(one per line or comma-separated)'}
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
                            background: '#f0f9ff', borderRadius: '0.7rem', border: '1px solid #bae6fd',
                            fontSize: '0.95rem', color: '#0369a1', lineHeight: '1.6'
                        }}>
                            🔐 <strong>New students</strong> get a temp password via email.
                            &nbsp;<strong>Existing users</strong> are simply linked to this class.
                        </div>

                        <button
                            onClick={handleAddStudents} disabled={isSaving}
                            style={{
                                marginTop: '0.9rem', width: '100%', padding: '0.9rem',
                                background: 'linear-gradient(135deg,#16a34a,#15803d)', color: '#fff',
                                border: 'none', borderRadius: '0.9rem', fontWeight: '800',
                                cursor: isSaving ? 'not-allowed' : 'pointer', opacity: isSaving ? 0.7 : 1,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', fontSize: '1.05rem'
                            }}
                        >
                            {isSaving ? <Loader2 className="spinner" size={19} /> : <UserPlus size={19} />}
                            {isSaving ? 'Enrolling…' : 'Enroll Students & Send Invites'}
                        </button>
                    </div>

                    {/* Messages */}
                    {error && <div style={{ padding: '0.8rem 1rem', background: '#fef2f2', color: '#dc2626', borderRadius: '0.75rem', border: '1px solid #fecaca', display: 'flex', gap: '0.6rem', alignItems: 'center', marginBottom: '1.25rem', fontSize: '1rem' }}><AlertCircle size={17} /> {error}</div>}
                    {success && <div style={{ padding: '0.8rem 1rem', background: '#f0fdf4', color: '#16a34a', borderRadius: '0.75rem', border: '1px solid #bbf7d0', display: 'flex', gap: '0.6rem', alignItems: 'center', marginBottom: '1.25rem', fontSize: '1rem' }}><CheckCircle size={17} /> {success}</div>}

                    {/* Roster */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.9rem' }}>
                            <h4 style={{ fontWeight: '700', fontSize: '1.15rem', color: '#0f172a' }}>Student Roster</h4>
                            <span style={{ padding: '0.25rem 0.8rem', borderRadius: '999px', background: '#e0f2fe', color: '#0369a1', fontSize: '0.95rem', fontWeight: '700', border: '1px solid #bae6fd' }}>
                                {students.length} student{students.length !== 1 ? 's' : ''}
                            </span>
                        </div>

                        {isLoading ? (
                            <div style={{ textAlign: 'center', padding: '3rem' }}><Loader2 className="spinner" size={38} color="#2563eb" /></div>
                        ) : students.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '2.5rem', color: '#94a3b8' }}>
                                <Users size={38} style={{ marginBottom: '0.75rem' }} />
                                <p style={{ fontSize: '1rem' }}>No students yet. Use the field above to get started.</p>
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
                                                background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', flexShrink: 0,
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
                                                onClick={() => handleRemoveStudent(s)}
                                                title="Remove student & delete account"
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
                    &nbsp;🔗 <strong>Linked</strong> = existing account connected to this class.
                </div>
            </motion.div>
        </ModalOverlay>
    );
};

// ── Main ClassSetup Component ─────────────────────────────────────────────────
const ClassSetup = ({ user }) => {
    const [classes, setClasses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [managingClass, setManagingClass] = useState(null);
    const [criteriaClass, setCriteriaClass] = useState(null);

    const [className, setClassName] = useState('');
    const [criteria, setCriteria] = useState([]);
    const [masterCriteria, setMasterCriteria] = useState([]);

    useEffect(() => {
        fetchClasses();
        fetchMasterCriteria();
    }, []);

    const fetchMasterCriteria = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/get-master-criteria`, {
                method: 'POST', // Backend expects POST as per deploy.py setup
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            });
            const data = await res.json();
            if (res.ok) setMasterCriteria(data.criteria || []);
        } catch (err) {
            console.error('Failed to fetch master criteria:', err);
        }
    };

    const fetchClasses = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/list-classes`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id || user.userId })
            });
            const data = await res.json();
            if (res.ok) setClasses(data.classes || []);
            else setError(data.message || 'Failed to fetch classes');
        } catch { setError('Connection error.'); }
        finally { setIsLoading(false); }
    };

    const handleCreateClass = async (e) => {
        e.preventDefault();
        if (!className.trim()) { setError('Class name is required'); return; }
        setIsLoading(true); setError('');
        try {
            const res = await fetch(`${API_BASE_URL}/create-class`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id || user.userId, className, criteria: criteria.filter(c => c.trim()) })
            });
            const data = await res.json();
            if (res.ok) {
                setSuccessMessage('Class created!');
                setClassName(''); setCriteria([]);
                setIsCreating(false); fetchClasses();
                setTimeout(() => setSuccessMessage(''), 3000);
            } else { setError(data.message || 'Failed to create class'); }
        } catch { setError('Failed to connect to server'); }
        finally { setIsLoading(false); }
    };

    const handleDeleteClass = async (classId) => {
        if (!window.confirm('Delete this class? All student links will be removed.')) return;
        try {
            const res = await fetch(`${API_BASE_URL}/delete-class`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ classId })
            });
            if (res.ok) setClasses(prev => prev.filter(c => c.classId !== classId));
        } catch (err) { console.error('Delete error:', err); }
    };

    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%', padding: '2rem' }}>

            {/* Modals */}
            <AnimatePresence>
                {managingClass && (
                    <ManageStudentsModal
                        cls={managingClass} user={user}
                        onClose={() => { setManagingClass(null); fetchClasses(); }}
                    />
                )}
            </AnimatePresence>
            <AnimatePresence>
                {criteriaClass && (
                    <ManageCriteriaModal
                        cls={criteriaClass} user={user}
                        masterCriteria={masterCriteria}
                        onSave={newCriteria => setClasses(prev => prev.map(c =>
                            c.classId === criteriaClass.classId ? { ...c, criteria: newCriteria } : c
                        ))}
                        onClose={() => setCriteriaClass(null)}
                    />
                )}
            </AnimatePresence>

            {/* Page header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h2 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                        Class Management
                    </h2>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Create classes, set evaluation criteria, and enroll students automatically via email.
                    </p>
                </div>
                {!isCreating && (
                    <button onClick={() => setIsCreating(true)} style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        padding: '1rem 1.5rem', background: 'var(--accent-gradient)',
                        color: 'var(--text-primary)', border: 'none', borderRadius: '1rem',
                        fontWeight: '700', cursor: 'pointer', boxShadow: 'var(--shadow-glow)'
                    }}>
                        <Plus size={20} /> Create New Class
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
                    /* ── Create class form ── */
                    <motion.div key="create-form"
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                        className="glass-panel" style={{ padding: '2.5rem', borderRadius: '2rem' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: '700' }}>New Class Setup</h3>
                            <button onClick={() => setIsCreating(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                <Plus size={24} style={{ transform: 'rotate(45deg)' }} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateClass}>
                            <div style={{ marginBottom: '2.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Class Name</label>
                                <input
                                    type="text" value={className} onChange={e => setClassName(e.target.value)}
                                    placeholder="e.g. Public Speaking 101 — Spring 2026"
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
                                                        background: isSelected ? 'rgba(56,189,248,0.15)' : 'rgba(255,255,255,0.03)',
                                                        border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--glass-border)'}`,
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                                        boxShadow: isSelected ? '0 4px 12px rgba(56,189,248,0.1)' : 'none'
                                                    }}
                                                >
                                                    <div style={{
                                                        width: '22px',
                                                        height: '22px',
                                                        borderRadius: '6px',
                                                        border: `2px solid ${isSelected ? 'var(--accent-primary)' : 'rgba(255,255,255,0.2)'}`,
                                                        background: isSelected ? 'var(--accent-primary)' : 'transparent',
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
                                    {isLoading ? <Loader2 className="spinner" size={20} /> : 'Save Class Setup'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                ) : (
                    /* ── Class cards ── */
                    <motion.div key="class-list" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(440px, 1fr))', gap: '2rem' }}
                    >
                        {isLoading ? (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem' }}>
                                <Loader2 className="spinner" size={48} color="var(--accent-primary)" />
                            </div>
                        ) : classes.length === 0 ? (
                            <div className="glass-panel" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem', borderRadius: '2rem' }}>
                                <BookOpen size={64} style={{ marginBottom: '1.5rem', opacity: 0.3 }} />
                                <h3 style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}>No classes yet</h3>
                                <p style={{ marginBottom: '2rem', opacity: 0.7 }}>Create your first class to start managing student cohorts.</p>
                                <button onClick={() => setIsCreating(true)} style={{ padding: '1rem 2rem', background: 'var(--accent-gradient)', color: 'var(--text-primary)', border: 'none', borderRadius: '1rem', fontWeight: '700', cursor: 'pointer' }}>
                                    Setup First Class
                                </button>
                            </div>
                        ) : (
                            classes.map(cls => (
                                <motion.div key={cls.classId} whileHover={{ y: -4 }}
                                    className="glass-panel" style={{ padding: '2rem', borderRadius: '2rem', overflow: 'hidden' }}
                                >
                                    {/* Card header */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                                        <div>
                                            <h4 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.2rem' }}>{cls.className}</h4>
                                            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>Created {new Date(cls.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <button onClick={() => handleDeleteClass(cls.classId)} style={{ padding: '0.6rem', borderRadius: '0.7rem', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', cursor: 'pointer' }} title="Delete Class">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    {/* Student count */}
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.95rem', borderRadius: '999px', background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)', color: '#111', fontSize: '1rem', fontWeight: '700', marginBottom: '1.1rem' }}>
                                        <Users size={15} />
                                        {(cls.studentEmails || []).length} student{(cls.studentEmails || []).length !== 1 ? 's' : ''}
                                    </div>

                                    {/* Criteria tags */}
                                    {cls.criteria?.length > 0 && (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '1.25rem' }}>
                                            {cls.criteria.map((crit, i) => (
                                                <span key={i} style={{ padding: '0.35rem 0.8rem', background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: '0.5rem', fontSize: '0.95rem', color: '#111' }}>
                                                    {crit}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Action buttons */}
                                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                                        {/* Green — Students */}
                                        <button onClick={() => setManagingClass(cls)}
                                            style={{ flex: 1, maxWidth: '48%', padding: '0.85rem', background: '#16a34a', border: '1px solid #15803d', borderRadius: '0.9rem', color: '#fff', fontWeight: '700', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'background 0.2s' }}
                                            onMouseEnter={e => { e.currentTarget.style.background = '#15803d'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = '#16a34a'; }}
                                        >
                                            <Users size={18} /> Students
                                        </button>
                                        {/* Blue — Criteria */}
                                        <button onClick={() => setCriteriaClass(cls)}
                                            style={{ flex: 1, maxWidth: '48%', padding: '0.85rem', background: '#2563eb', border: '1px solid #1d4ed8', borderRadius: '0.9rem', color: '#fff', fontWeight: '700', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'background 0.2s' }}
                                            onMouseEnter={e => { e.currentTarget.style.background = '#1d4ed8'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = '#2563eb'; }}
                                        >
                                            <ClipboardList size={18} /> Criteria
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

export default ClassSetup;
