import React, { useState } from 'react';
import { UserPlus, Search, Shield, CheckCircle, AlertCircle, Loader2, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../config';

const AdminTools = ({ user, activeSubTab = 'setup-instructor' }) => {
    const [targetEmail, setTargetEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

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
            } else {
                setMessage({ text: data.message || 'Failed to update user role.', type: 'error' });
            }
        } catch (err) {
            setMessage({ text: 'Connection error. Please try again.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', padding: '2rem' }}>

            <div style={{ width: '100%' }}>
                <AnimatePresence mode="wait">
                    {activeSubTab === 'setup-instructor' && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="glass-panel"
                            style={{ padding: '2.5rem', borderRadius: '1.5rem', color: 'var(--text-primary)' }}
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
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>Setup Instructor</h3>
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Promote a student account to instructor privileges.</p>
                                </div>
                            </div>

                            {message.text && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{
                                        padding: '1rem',
                                        borderRadius: '0.8rem',
                                        marginBottom: '1.5rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
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
                                            type="email"
                                            value={targetEmail}
                                            onChange={(e) => setTargetEmail(e.target.value)}
                                            placeholder="Enter user's registered email..."
                                            required
                                            style={{
                                                padding: '1.2rem 1.2rem 1.2rem 3.5rem',
                                                background: 'rgba(255,255,255,0.05)',
                                                border: '1px solid var(--glass-border)',
                                                borderRadius: '1rem',
                                                color: 'var(--text-primary)',
                                                fontSize: '1.1rem',
                                                outline: 'none',
                                                width: '100%'
                                            }}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <button
                                        type="submit"
                                        disabled={isLoading || !targetEmail}
                                        style={{
                                            width: '50%',
                                            padding: '1.2rem',
                                            background: 'var(--accent-gradient)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '1.2rem',
                                            fontWeight: '800',
                                            fontSize: '1.1rem',
                                            cursor: (isLoading || !targetEmail) ? 'not-allowed' : 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.75rem',
                                            boxShadow: 'var(--shadow-glow)',
                                            transition: 'all 0.3s'
                                        }}
                                    >
                                        {isLoading ? (
                                            <Loader2 className="spinner" size={20} />
                                        ) : (
                                            <>
                                                <UserPlus size={20} /> Update Role to Instructor
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>

                            <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: 'rgba(245, 158, 11, 0.05)', borderRadius: '1.2rem', border: '1px solid rgba(245, 158, 11, 0.1)' }}>
                                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', color: '#f59e0b', marginBottom: '0.5rem' }}>
                                    <AlertCircle size={18} />
                                    <span style={{ fontWeight: '700', fontSize: '1rem' }}>Admin Notice</span>
                                </div>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(245, 158, 11, 0.8)', lineHeight: '1.5' }}>
                                    Updating a user's role to Instructor grants them permission to create classes and define custom criteria. The user will need to refresh their session or re-login to see the changes.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <style>{`
                .spinner { animation: rotate 2s linear infinite; }
                @keyframes rotate { 100% { transform: rotate(360deg); } }
            `}</style>
        </div >
    );
};

export default AdminTools;
