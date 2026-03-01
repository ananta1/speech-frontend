import React, { useState, useEffect } from 'react';
import { UserPlus, Shield, CheckCircle, AlertCircle, Loader2, Mail, Save, Plus, Trash2, Edit3, ClipboardList, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../config';

const AdminTools = ({ user, activeSubTab = 'setup-instructor' }) => {
    // ── Setup Instructor State ──
    const [targetEmail, setTargetEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    // ── Master Evaluation State ──
    const [criteria, setCriteria] = useState(null);
    const [isCriteriaLoading, setIsCriteriaLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [criteriaMsg, setCriteriaMsg] = useState({ text: '', type: '' });
    const [editingKey, setEditingKey] = useState(null);
    const [editName, setEditName] = useState('');
    const [editValue, setEditValue] = useState('');
    const [newKey, setNewKey] = useState('');
    const [newValue, setNewValue] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);

    // ── User Management State ──
    const [usersList, setUsersList] = useState([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    const [usersMsg, setUsersMsg] = useState({ text: '', type: '' });

    // Fetch data when switching tabs
    useEffect(() => {
        if (activeSubTab === 'master-evaluation' && !criteria) {
            fetchMasterCriteria();
        }
        if (activeSubTab === 'user-management' && usersList.length === 0) {
            fetchUsersList();
        }
    }, [activeSubTab]);

    const fetchUsersList = async () => {
        setIsLoadingUsers(true);
        setUsersMsg({ text: '', type: '' });
        try {
            const res = await fetch(`${API_BASE_URL}/list-all-users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ adminId: user.id || user.userId })
            });
            const data = await res.json();
            if (res.ok) {
                setUsersList(data.users || []);
            } else {
                setUsersMsg({ text: data.message || 'Failed to load users.', type: 'error' });
            }
        } catch (err) {
            setUsersMsg({ text: 'Connection error.', type: 'error' });
        } finally {
            setIsLoadingUsers(false);
        }
    };

    const fetchMasterCriteria = async () => {
        setIsCriteriaLoading(true);
        setCriteriaMsg({ text: '', type: '' });
        try {
            const res = await fetch(`${API_BASE_URL}/get-master-criteria`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ full: true })
            });
            const data = await res.json();
            if (res.ok) {
                setCriteria(data.criteria);
            } else {
                setCriteriaMsg({ text: data.message || 'Failed to load criteria.', type: 'error' });
            }
        } catch (err) {
            setCriteriaMsg({ text: 'Connection error.', type: 'error' });
        } finally {
            setIsCriteriaLoading(false);
        }
    };

    const saveCriteria = async (updatedCriteria) => {
        setIsSaving(true);
        setCriteriaMsg({ text: '', type: '' });
        try {
            const res = await fetch(`${API_BASE_URL}/update-master-criteria`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ criteria: updatedCriteria })
            });
            const data = await res.json();
            if (res.ok) {
                setCriteria(data.criteria);
                setCriteriaMsg({ text: 'Master criteria saved successfully!', type: 'success' });
                setTimeout(() => setCriteriaMsg({ text: '', type: '' }), 3000);
            } else {
                setCriteriaMsg({ text: data.message || 'Save failed.', type: 'error' });
            }
        } catch (err) {
            setCriteriaMsg({ text: 'Connection error.', type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleEditStart = (key) => {
        setEditingKey(key);
        setEditName(key);
        const val = criteria[key];
        setEditValue(typeof val === 'string' ? val : JSON.stringify(val, null, 2));
    };

    const handleEditSave = (key) => {
        let parsedValue;
        try {
            parsedValue = JSON.parse(editValue);
        } catch {
            parsedValue = editValue;
        }
        const newName = editName.trim().toLowerCase().replace(/\s+/g, '_');
        const updated = {};
        // Rebuild the object to preserve order, replacing the old key with the new name
        for (const [k, v] of Object.entries(criteria)) {
            if (k === key) {
                updated[newName || key] = parsedValue;
            } else {
                updated[k] = v;
            }
        }
        setCriteria(updated);
        setEditingKey(null);
        saveCriteria(updated);
    };

    const handleDelete = (key) => {
        if (!window.confirm(`Delete criterion "${formatLabel(key)}"? This cannot be undone.`)) return;
        const updated = { ...criteria };
        delete updated[key];
        setCriteria(updated);
        saveCriteria(updated);
    };

    const handleAddNew = () => {
        if (!newKey.trim()) return;
        const safeKey = newKey.trim().toLowerCase().replace(/\s+/g, '_');
        let parsedValue;
        try {
            parsedValue = JSON.parse(newValue);
        } catch {
            parsedValue = newValue;
        }
        const updated = { ...criteria, [safeKey]: parsedValue };
        setCriteria(updated);
        setNewKey('');
        setNewValue('');
        setShowAddForm(false);
        saveCriteria(updated);
    };

    const formatLabel = (key) => key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    const handlePromote = async (e) => {
        e.preventDefault();
        if (!targetEmail.trim()) return;
        setIsLoading(true);
        setMessage({ text: '', type: '' });
        try {
            const res = await fetch(`${API_BASE_URL}/promote-user`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    adminId: user.id || user.userId,
                    email: targetEmail.trim(),
                    role: 'instructor'
                })
            });
            const data = await res.json();
            if (res.ok) {
                setMessage({ text: `Success: ${targetEmail} is now an Instructor.`, type: 'success' });
                setTargetEmail('');
                // update in user list if loaded
                setUsersList(prev => prev.map(u => u.email === targetEmail.trim() ? { ...u, role: 'instructor' } : u));
            } else {
                setMessage({ text: data.message || 'Failed to update user role.', type: 'error' });
            }
        } catch (err) {
            setMessage({ text: 'Connection error. Please try again.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateUserRoleOption = async (email, newRole) => {
        setIsLoadingUsers(true);
        try {
            const res = await fetch(`${API_BASE_URL}/promote-user`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    adminId: user.id || user.userId,
                    email: email,
                    role: newRole
                })
            });
            if (res.ok) {
                setUsersList(prev => prev.map(u => u.email === email ? { ...u, role: newRole } : u));
                setUsersMsg({ text: `Updated ${email} to ${newRole}`, type: 'success' });
            } else {
                setUsersMsg({ text: 'Failed to update user role.', type: 'error' });
            }
        } catch (err) {
            setUsersMsg({ text: 'Connection error. Please try again.', type: 'error' });
        } finally {
            setIsLoadingUsers(false);
            setTimeout(() => setUsersMsg({ text: '', type: '' }), 3000);
        }
    };

    return (
        <div style={{ maxWidth: activeSubTab === 'user-management' ? '1200px' : '900px', margin: '0 auto', width: '100%', padding: '2rem', transition: 'max-width 0.3s ease' }}>
            <div style={{ width: '100%' }}>
                <AnimatePresence mode="wait">

                    {/* ══════════════ SETUP INSTRUCTOR ══════════════ */}
                    {activeSubTab === 'setup-instructor' && (
                        <motion.div
                            key="setup-instructor"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="glass-panel"
                            style={{ padding: '2.5rem', borderRadius: '1.5rem', color: 'var(--text-primary)', background: '#ffffff' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                                <div style={{
                                    width: '48px', height: '48px', borderRadius: '1rem',
                                    background: 'rgba(56, 189, 248, 0.1)', color: 'var(--accent-primary)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <Shield size={24} />
                                </div>
                                <div>
                                    <h3 className="gradient-text" style={{ fontSize: '2rem', fontWeight: '800', margin: 0 }}>Setup Instructor</h3>
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Promote a student account to instructor privileges.</p>
                                </div>
                            </div>

                            {message.text && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                                    style={{
                                        padding: '1rem', borderRadius: '0.8rem', marginBottom: '1.5rem',
                                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                                        background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                        color: message.type === 'success' ? '#10b981' : '#ef4444',
                                        border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                                    }}
                                >
                                    {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                                    <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>{message.text}</span>
                                </motion.div>
                            )}

                            <form onSubmit={handlePromote}>
                                <div style={{ marginBottom: '2rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>User Email Address</label>
                                    <div style={{ position: 'relative' }}>
                                        <Mail style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={20} />
                                        <input
                                            type="email" value={targetEmail}
                                            onChange={(e) => setTargetEmail(e.target.value)}
                                            placeholder="Enter user's registered email..."
                                            required
                                            style={{
                                                padding: '1.2rem 1.2rem 1.2rem 3.5rem', background: '#ffffff',
                                                border: '1px solid var(--glass-border)', borderRadius: '1rem',
                                                color: 'var(--text-primary)', fontSize: '1.1rem', outline: 'none', width: '100%'
                                            }}
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <button type="submit" disabled={isLoading || !targetEmail}
                                        style={{
                                            width: '50%', padding: '1.2rem', background: 'var(--accent-gradient)', color: 'white',
                                            border: 'none', borderRadius: '1.2rem', fontWeight: '800', fontSize: '1.1rem',
                                            cursor: (isLoading || !targetEmail) ? 'not-allowed' : 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                                            boxShadow: 'var(--shadow-glow)', transition: 'all 0.3s'
                                        }}
                                    >
                                        {isLoading ? <Loader2 className="spinner" size={20} /> : <><UserPlus size={20} /> Update Role to Instructor</>}
                                    </button>
                                </div>
                            </form>

                            <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: '#ffffff', borderRadius: '1.2rem', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', color: '#f59e0b', marginBottom: '0.5rem' }}>
                                    <AlertCircle size={18} />
                                    <span style={{ fontWeight: '700', fontSize: '1.15rem' }}>Admin Notice</span>
                                </div>
                                <p style={{ margin: 0, fontSize: '1rem', color: '#1a1a1a', lineHeight: '1.5' }}>
                                    Updating a user's role to Instructor grants them permission to create classes and define custom criteria. The user will need to refresh their session or re-login to see the changes.
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {/* ══════════════ MASTER EVALUATION ══════════════ */}
                    {activeSubTab === 'master-evaluation' && (
                        <motion.div
                            key="master-evaluation"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="glass-panel"
                            style={{ padding: '2.5rem', borderRadius: '1.5rem', color: 'var(--text-primary)', background: '#ffffff' }}
                        >
                            {/* Header */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                                <div style={{
                                    width: '48px', height: '48px', borderRadius: '1rem',
                                    background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <ClipboardList size={24} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 className="gradient-text" style={{ fontSize: '2rem', fontWeight: '800', margin: 0 }}>Master Evaluation</h3>
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Edit the AI evaluation criteria used for all speech analyses.</p>
                                </div>
                                <button
                                    onClick={() => setShowAddForm(!showAddForm)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                                        padding: '0.75rem 1.25rem', borderRadius: '0.8rem',
                                        background: '#16a34a', color: 'white',
                                        border: 'none', fontWeight: '700', cursor: 'pointer',
                                        fontSize: '0.95rem', transition: 'all 0.2s'
                                    }}
                                >
                                    <Plus size={18} /> Add Criterion
                                </button>
                            </div>

                            {/* Messages */}
                            {criteriaMsg.text && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                                    style={{
                                        padding: '1rem', borderRadius: '0.8rem', marginBottom: '1.5rem',
                                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                                        background: criteriaMsg.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                        color: criteriaMsg.type === 'success' ? '#10b981' : '#ef4444',
                                        border: `1px solid ${criteriaMsg.type === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`
                                    }}
                                >
                                    {criteriaMsg.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                                    <span style={{ fontWeight: '500' }}>{criteriaMsg.text}</span>
                                </motion.div>
                            )}

                            {/* Add New Form */}
                            <AnimatePresence>
                                {showAddForm && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        style={{ overflow: 'hidden', marginBottom: '1.5rem' }}
                                    >
                                        <div style={{
                                            padding: '1.5rem', borderRadius: '1rem',
                                            border: '2px dashed rgba(22, 163, 74, 0.3)',
                                            background: 'rgba(22, 163, 74, 0.03)'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                                <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#16a34a', fontWeight: '700' }}>Add New Criterion</h4>
                                                <button onClick={() => setShowAddForm(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={18} /></button>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                <input
                                                    placeholder="Criterion Name (e.g. eye_contact)"
                                                    value={newKey}
                                                    onChange={(e) => setNewKey(e.target.value)}
                                                    style={{
                                                        padding: '0.9rem 1rem', borderRadius: '0.7rem',
                                                        border: '1px solid var(--glass-border)', background: '#fff',
                                                        fontSize: '1rem', color: '#1a1a1a', outline: 'none'
                                                    }}
                                                />
                                                <textarea
                                                    placeholder="Value / Prompt Template (e.g. Evaluate the speaker's eye contact...)"
                                                    value={newValue}
                                                    onChange={(e) => setNewValue(e.target.value)}
                                                    rows={4}
                                                    style={{
                                                        padding: '0.9rem 1rem', borderRadius: '0.7rem',
                                                        border: '1px solid var(--glass-border)', background: '#fff',
                                                        fontSize: '0.95rem', color: '#1a1a1a', outline: 'none',
                                                        resize: 'vertical', fontFamily: 'inherit', lineHeight: '1.5'
                                                    }}
                                                />
                                                <button
                                                    onClick={handleAddNew}
                                                    disabled={!newKey.trim()}
                                                    style={{
                                                        alignSelf: 'flex-end', padding: '0.75rem 1.5rem',
                                                        borderRadius: '0.7rem', background: '#16a34a', color: 'white',
                                                        border: 'none', fontWeight: '700', cursor: newKey.trim() ? 'pointer' : 'not-allowed',
                                                        display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem'
                                                    }}
                                                >
                                                    <Plus size={16} /> Add
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Loading */}
                            {isCriteriaLoading ? (
                                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                                    <Loader2 className="spinner" size={32} style={{ marginBottom: '1rem' }} />
                                    <p>Loading master criteria...</p>
                                </div>
                            ) : criteria ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {Object.entries(criteria).map(([key, value]) => {
                                        const displayValue = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
                                        const isEditing = editingKey === key;

                                        return (
                                            <motion.div
                                                key={key}
                                                layout
                                                style={{
                                                    padding: '1.25rem 1.5rem', borderRadius: '1rem',
                                                    border: isEditing ? '2px solid rgba(139, 92, 246, 0.3)' : '1px solid var(--glass-border)',
                                                    background: isEditing ? 'rgba(139, 92, 246, 0.03)' : '#fafafa',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                {/* Header: name + action buttons */}
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isEditing ? '1rem' : '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                    {isEditing ? (
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                                                            <span style={{ fontSize: '0.85rem', color: '#8b5cf6', fontWeight: '700' }}>Name:</span>
                                                            <input
                                                                value={editName}
                                                                onChange={(e) => setEditName(e.target.value)}
                                                                style={{
                                                                    padding: '0.5rem 0.75rem', borderRadius: '0.5rem',
                                                                    border: '2px solid rgba(139, 92, 246, 0.3)', background: '#fff',
                                                                    fontSize: '1rem', fontWeight: '700', color: '#1a1a1a',
                                                                    outline: 'none', fontFamily: 'monospace', flex: 1, maxWidth: '400px'
                                                                }}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                            <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1a1a1a' }}>{formatLabel(key)}</span>
                                                            <span style={{
                                                                padding: '0.2rem 0.6rem', borderRadius: '0.4rem',
                                                                background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6',
                                                                fontSize: '0.75rem', fontWeight: '600', fontFamily: 'monospace'
                                                            }}>{key}</span>
                                                        </div>
                                                    )}
                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                        {isEditing ? (
                                                            <>
                                                                <button onClick={() => handleEditSave(key)}
                                                                    style={{
                                                                        padding: '0.4rem 0.9rem', borderRadius: '0.5rem',
                                                                        background: '#16a34a', color: 'white', border: 'none',
                                                                        cursor: 'pointer', fontWeight: '600',
                                                                        display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem'
                                                                    }}
                                                                >
                                                                    <Save size={14} /> Save
                                                                </button>
                                                                <button onClick={() => setEditingKey(null)}
                                                                    style={{
                                                                        padding: '0.4rem 0.9rem', borderRadius: '0.5rem',
                                                                        background: 'rgba(100,100,100,0.1)', color: 'var(--text-secondary)',
                                                                        border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem'
                                                                    }}
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button onClick={() => handleEditStart(key)}
                                                                    style={{
                                                                        padding: '0.4rem 0.8rem', borderRadius: '0.5rem',
                                                                        background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb',
                                                                        border: 'none', cursor: 'pointer', fontWeight: '600',
                                                                        display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem'
                                                                    }}
                                                                >
                                                                    <Edit3 size={14} /> Edit
                                                                </button>
                                                                <button onClick={() => handleDelete(key)}
                                                                    style={{
                                                                        padding: '0.4rem 0.6rem', borderRadius: '0.5rem',
                                                                        background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444',
                                                                        border: 'none', cursor: 'pointer',
                                                                        display: 'flex', alignItems: 'center'
                                                                    }}
                                                                >
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Value: edit mode or display */}
                                                {isEditing ? (
                                                    <div>
                                                        <div style={{ fontSize: '0.85rem', color: '#8b5cf6', fontWeight: '700', marginBottom: '0.5rem' }}>Value:</div>
                                                        <textarea
                                                            value={editValue}
                                                            onChange={(e) => setEditValue(e.target.value)}
                                                            rows={Math.min(15, displayValue.split('\n').length + 2)}
                                                            style={{
                                                                width: '100%', padding: '1rem', borderRadius: '0.7rem',
                                                                border: '2px solid rgba(139, 92, 246, 0.3)', background: '#fff',
                                                                fontSize: '0.9rem', color: '#1a1a1a', outline: 'none',
                                                                resize: 'vertical', fontFamily: 'monospace', lineHeight: '1.5'
                                                            }}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div style={{
                                                        fontSize: '0.9rem', color: '#475569', lineHeight: '1.6',
                                                        whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                                                        maxHeight: '150px', overflow: 'hidden', position: 'relative'
                                                    }}>
                                                        {displayValue}
                                                        {displayValue.length > 300 && (
                                                            <div style={{
                                                                position: 'absolute', bottom: 0, left: 0, right: 0,
                                                                height: '40px', background: 'linear-gradient(transparent, #fafafa)'
                                                            }} />
                                                        )}
                                                    </div>
                                                )}
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                                    <AlertCircle size={32} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                                    <p>No criteria found. Add your first criterion above.</p>
                                </div>
                            )}

                            {/* Saving indicator */}
                            {isSaving && (
                                <div style={{
                                    position: 'fixed', bottom: '2rem', right: '2rem',
                                    padding: '0.8rem 1.5rem', borderRadius: '1rem',
                                    background: '#1e293b', color: 'white',
                                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)', zIndex: 999,
                                    fontSize: '0.95rem', fontWeight: '600'
                                }}>
                                    <Loader2 className="spinner" size={18} /> Saving...
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* ══════════════ USER MANAGEMENT ══════════════ */}
                    {activeSubTab === 'user-management' && (
                        <motion.div
                            key="user-management"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="glass-panel"
                            style={{ padding: '2.5rem', borderRadius: '1.5rem', color: 'var(--text-primary)', background: '#ffffff', overflowX: 'auto' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                                <div style={{
                                    width: '48px', height: '48px', borderRadius: '1rem',
                                    background: 'rgba(56, 189, 248, 0.1)', color: 'var(--accent-primary)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <ClipboardList size={24} />
                                </div>
                                <div>
                                    <h3 className="gradient-text" style={{ fontSize: '2rem', fontWeight: '800', margin: 0 }}>User Management</h3>
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>View users, speeches, and manage roles.</p>
                                </div>
                            </div>

                            {usersMsg.text && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                                    style={{
                                        padding: '1rem', borderRadius: '0.8rem', marginBottom: '1.5rem',
                                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                                        background: usersMsg.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                        color: usersMsg.type === 'success' ? '#10b981' : '#ef4444',
                                        border: `1px solid ${usersMsg.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                                    }}
                                >
                                    {usersMsg.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                                    <span style={{ fontWeight: '500' }}>{usersMsg.text}</span>
                                </motion.div>
                            )}

                            {isLoadingUsers && usersList.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                                    <Loader2 className="spinner" size={32} style={{ marginBottom: '1rem' }} />
                                    <p>Loading users list...</p>
                                </div>
                            ) : (
                                <div style={{ overflowX: 'auto', borderRadius: '0.5rem', border: '1px solid var(--glass-border)' }}>
                                    <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                                        <thead>
                                            <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                                                <th style={{ padding: '1rem' }}>Name</th>
                                                <th style={{ padding: '1rem' }}>Email</th>
                                                <th style={{ padding: '1rem' }}>Role</th>
                                                <th style={{ padding: '1rem' }}>Sub. Plan</th>
                                                <th style={{ padding: '1rem' }}>Joined</th>
                                                <th style={{ padding: '1rem' }}>Speeches (Mo | Tot)</th>
                                                <th style={{ padding: '1rem', textAlign: 'center' }}>Update Role</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {usersList.map((u, i) => (
                                                <tr key={u.userId} style={{ borderBottom: i === usersList.length - 1 ? 'none' : '1px solid var(--glass-border)' }}>
                                                    <td style={{ padding: '1rem', fontWeight: '500' }}>{u.name}</td>
                                                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{u.email}</td>
                                                    <td style={{ padding: '1rem' }}>
                                                        <span style={{
                                                            padding: '0.2rem 0.6rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: '600',
                                                            background: u.role === 'super_admin' ? 'rgba(239, 68, 68, 0.1)' : u.role === 'instructor' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                                            color: u.role === 'super_admin' ? '#ef4444' : u.role === 'instructor' ? '#0ea5e9' : '#10b981'
                                                        }}>
                                                            {u.role.toUpperCase()}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '1rem' }}>{u.plan === 'pro' || u.plan === 'Pro' ? <span style={{ color: '#8b5cf6', fontWeight: '700' }}>PRO</span> : <span style={{ color: 'var(--text-secondary)' }}>FREE</span>}</td>
                                                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}</td>
                                                    <td style={{ padding: '1rem', fontWeight: '600' }}>{u.monthlySpeechCount} <span style={{ color: 'var(--text-secondary)' }}>|</span> {u.totalSpeechCount}</td>
                                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                                        <select
                                                            value={u.role}
                                                            onChange={(e) => handleUpdateUserRoleOption(u.email, e.target.value)}
                                                            disabled={isLoadingUsers || u.role === 'super_admin'}
                                                            style={{
                                                                padding: '0.4rem', borderRadius: '0.4rem', border: '1px solid var(--glass-border)',
                                                                background: u.role === 'super_admin' ? '#f1f5f9' : 'white', cursor: u.role === 'super_admin' ? 'not-allowed' : 'pointer'
                                                            }}
                                                        >
                                                            <option value="student">Student</option>
                                                            <option value="instructor">Instructor</option>
                                                            {u.role === 'super_admin' && <option value="super_admin">Super Admin</option>}
                                                        </select>
                                                    </td>
                                                </tr>
                                            ))}
                                            {usersList.length === 0 && (
                                                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>No users found.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <style>{`
                .spinner { animation: rotate 2s linear infinite; }
                @keyframes rotate { 100% { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default AdminTools;
