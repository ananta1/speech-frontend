import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Copy, CheckCircle, Users, Settings, BookOpen, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../config';

const ClassSetup = ({ user }) => {
    const [classes, setClasses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Form State
    const [className, setClassName] = useState('');
    const [criteria, setCriteria] = useState(Array(10).fill(''));

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/list-classes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id || user.userId })
            });
            const data = await res.json();
            if (res.ok) {
                setClasses(data.classes || []);
            } else {
                setError(data.message || 'Failed to fetch classes');
            }
        } catch (err) {
            setError('Connection error. Could not load classes.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateClass = async (e) => {
        e.preventDefault();
        if (!className.strip()) {
            setError('Class name is required');
            return;
        }

        setIsLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_BASE_URL}/create-class`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id || user.userId,
                    className,
                    criteria: criteria.filter(c => c.trim() !== '')
                })
            });
            const data = await res.json();
            if (res.ok) {
                setSuccessMessage('Class created successfully!');
                setClassName('');
                setCriteria(Array(10).fill(''));
                setIsCreating(false);
                fetchClasses();
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                setError(data.message || 'Failed to create class');
            }
        } catch (err) {
            setError('Failed to connect to server');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteClass = async (classId) => {
        if (!window.confirm('Are you sure you want to delete this class? All student settings will revert to default.')) return;

        try {
            const res = await fetch(`${API_BASE_URL}/delete-class`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ classId })
            });
            if (res.ok) {
                setClasses(classes.filter(c => c.classId !== classId));
            }
        } catch (err) {
            console.error('Delete error:', err);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('Class ID copied! Share this with your students.');
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h2 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Class Management</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Configure custom evaluation criteria for your student groups.</p>
                </div>
                {!isCreating && (
                    <button
                        onClick={() => setIsCreating(true)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                            padding: '1rem 1.5rem', background: 'var(--accent-gradient)',
                            color: 'var(--text-primary)', border: 'none', borderRadius: '1rem',
                            fontWeight: '700', cursor: 'pointer', boxShadow: 'var(--shadow-glow)'
                        }}
                    >
                        <Plus size={20} /> Create New Class
                    </button>
                )}
            </div>

            {error && (
                <div style={{
                    padding: '1.25rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444',
                    borderRadius: '1rem', border: '1px solid rgba(239, 68, 68, 0.2)',
                    marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem'
                }}>
                    <AlertCircle size={20} /> {error}
                </div>
            )}

            {successMessage && (
                <div style={{
                    padding: '1.25rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981',
                    borderRadius: '1rem', border: '1px solid rgba(16, 185, 129, 0.2)',
                    marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem'
                }}>
                    <CheckCircle size={20} /> {successMessage}
                </div>
            )}

            <AnimatePresence mode="wait">
                {isCreating ? (
                    <motion.div
                        key="create-form"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="glass-panel"
                        style={{ padding: '2.5rem', borderRadius: '2rem' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: '700' }}>New Class Setup</h3>
                            <button
                                onClick={() => setIsCreating(false)}
                                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                            >
                                <Plus size={24} style={{ transform: 'rotate(45deg)' }} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateClass}>
                            <div style={{ marginBottom: '2.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Class Name</label>
                                <input
                                    type="text"
                                    value={className}
                                    onChange={(e) => setClassName(e.target.value)}
                                    placeholder="e.g. Public Speaking 101 - Spring 2026"
                                    className="modern-input"
                                    style={{
                                        width: '100%', padding: '1.2rem', borderRadius: '1rem',
                                        background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)',
                                        color: 'var(--text-primary)', fontSize: '1.1rem'
                                    }}
                                    required
                                />
                            </div>

                            <div style={{ marginBottom: '2.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                                    Speech Evaluation Criteria (Up to 10)
                                    <span style={{ fontSize: '0.85rem', fontWeight: '400', marginLeft: '0.5rem', opacity: 0.7 }}>
                                        - These will be given to the AI as specific focus areas.
                                    </span>
                                </label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                                    {criteria.map((val, idx) => (
                                        <div key={idx} style={{ position: 'relative' }}>
                                            <span style={{
                                                position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)',
                                                color: 'var(--accent-primary)', fontWeight: '700', fontSize: '0.9rem'
                                            }}>{idx + 1}</span>
                                            <input
                                                type="text"
                                                value={val}
                                                onChange={(e) => {
                                                    const newCrit = [...criteria];
                                                    newCrit[idx] = e.target.value;
                                                    setCriteria(newCrit);
                                                }}
                                                placeholder={`Criteria item ${idx + 1}...`}
                                                style={{
                                                    width: '100%', padding: '1rem 1rem 1rem 2.5rem', borderRadius: '0.8rem',
                                                    background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)',
                                                    color: 'var(--text-primary)', outline: 'none'
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'flex-end' }}>
                                <button
                                    type="button"
                                    onClick={() => setIsCreating(false)}
                                    style={{
                                        padding: '1rem 2rem', background: 'transparent',
                                        color: 'var(--text-primary)', border: '1px solid var(--glass-border)',
                                        borderRadius: '1rem', fontWeight: '600', cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    style={{
                                        padding: '1rem 3rem', background: 'var(--accent-gradient)',
                                        color: 'var(--text-primary)', border: 'none', borderRadius: '1rem',
                                        fontWeight: '800', cursor: 'pointer', boxShadow: 'var(--shadow-glow)',
                                        display: 'flex', alignItems: 'center', gap: '0.75rem'
                                    }}
                                >
                                    {isLoading ? <Loader2 className="spinner" size={20} /> : 'Save Class Setup'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                ) : (
                    <motion.div
                        key="class-list"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid-container"
                        style={{
                            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))',
                            gap: '2rem'
                        }}
                    >
                        {isLoading ? (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem' }}>
                                <Loader2 className="spinner" size={48} color="var(--accent-primary)" />
                            </div>
                        ) : classes.length === 0 ? (
                            <div className="glass-panel" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem', borderRadius: '2rem' }}>
                                <BookOpen size={64} style={{ marginBottom: '1.5rem', opacity: 0.3 }} />
                                <h3 style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}>No classes setup yet</h3>
                                <p style={{ marginBottom: '2rem', opacity: 0.7 }}>Create your first class to start customizing evaluations for your students.</p>
                                <button
                                    onClick={() => setIsCreating(true)}
                                    style={{
                                        padding: '1rem 2rem', background: 'var(--accent-gradient)',
                                        color: 'var(--text-primary)', border: 'none', borderRadius: '1rem',
                                        fontWeight: '700', cursor: 'pointer'
                                    }}
                                >
                                    Setup First Class
                                </button>
                            </div>
                        ) : (
                            classes.map((cls) => (
                                <motion.div
                                    key={cls.classId}
                                    whileHover={{ y: -5 }}
                                    className="glass-panel"
                                    style={{
                                        padding: '2rem', borderRadius: '2rem', background: 'var(--glass)',
                                        position: 'relative', overflow: 'hidden'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                        <div>
                                            <h4 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{cls.className}</h4>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Created: {new Date(cls.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => handleDeleteClass(cls.classId)}
                                                style={{ padding: '0.75rem', borderRadius: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', cursor: 'pointer' }}
                                                title="Delete Class"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <div style={{
                                        padding: '1.25rem', background: 'rgba(255,255,255,0.03)',
                                        borderRadius: '1.25rem', border: '1px solid var(--glass-border)',
                                        marginBottom: '1.5rem'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                            <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <Users size={16} /> Student Join Code
                                            </span>
                                            <button
                                                onClick={() => copyToClipboard(cls.classId)}
                                                style={{
                                                    background: 'none', border: 'none', color: 'var(--text-secondary)',
                                                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem'
                                                }}
                                            >
                                                <Copy size={14} /> Copy ID
                                            </button>
                                        </div>
                                        <div style={{
                                            background: 'rgba(0,0,0,0.2)', padding: '0.75rem 1rem',
                                            borderRadius: '0.75rem', fontSize: '1rem', fontFamily: 'monospace',
                                            color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.05)',
                                            textAlign: 'center'
                                        }}>
                                            {cls.classId}
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                                        {cls.criteria.map((crit, i) => (
                                            <span key={i} style={{
                                                padding: '0.4rem 0.8rem', background: 'rgba(56, 189, 248, 0.1)',
                                                border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '0.6rem',
                                                fontSize: '0.85rem', color: '#38bdf8'
                                            }}>
                                                {crit}
                                            </span>
                                        ))}
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                .spinner { animation: rotate 2s linear infinite; }
                @keyframes rotate { 100% { transform: rotate(360deg); } }
                .grid-container { display: grid; }
            `}</style>
        </div>
    );
};

export default ClassSetup;
