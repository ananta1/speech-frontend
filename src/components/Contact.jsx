import React, { useState } from 'react';
import { Mail, Send, MessageSquare, User, Info, Loader } from 'lucide-react';
import { API_BASE_URL } from '../config';

const Contact = () => {
    const [formData, setFormData] = useState({
        email: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const res = await fetch(`${API_BASE_URL}/contact-us`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (res.ok) {
                setSuccess(data.message || 'Thank you! Your message has been sent.');
                setFormData({ email: '', subject: '', message: '' });
            } else {
                setError(data.message || 'Something went wrong. Please try again.');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to send message. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Contact Us</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
                    Have questions or feedback? We'd love to hear from you.
                </p>
            </div>

            <div className="glass-panel" style={{
                padding: '2.5rem',
                borderRadius: '1.5rem',
                maxWidth: '600px',
                margin: '0 auto'
            }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Your Email</label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '0.8rem 1rem',
                                background: 'rgba(255,255,255,0.08)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '0.75rem',
                                color: 'var(--text-primary)',
                                fontSize: '1rem',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                            placeholder="name@example.com"
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Subject</label>
                        <input
                            type="text"
                            required
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '0.8rem 1rem',
                                background: 'rgba(255,255,255,0.08)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '0.75rem',
                                color: 'var(--text-primary)',
                                fontSize: '1rem',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                            placeholder="What is this about?"
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Message</label>
                        <textarea
                            required
                            rows={5}
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '0.8rem 1rem',
                                background: 'rgba(255,255,255,0.08)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '0.75rem',
                                color: 'var(--text-primary)',
                                fontSize: '1rem',
                                outline: 'none',
                                resize: 'none',
                                boxSizing: 'border-box'
                            }}
                            placeholder="How can we help you?"
                        />
                    </div>

                    {error && (
                        <div style={{ color: '#ef4444', fontSize: '0.9rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '0.5rem' }}>
                            {error}
                        </div>
                    )}

                    {success && (
                        <div style={{ color: 'var(--success)', fontSize: '1rem', background: 'rgba(34, 197, 94, 0.1)', padding: '1rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                            {success}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || success}
                        style={{
                            width: '50%',
                            marginInline: 'auto',
                            padding: '1rem',
                            background: success ? 'var(--success)' : 'var(--accent-gradient)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.75rem',
                            fontWeight: '700',
                            fontSize: '1.1rem',
                            cursor: (loading || success) ? 'default' : 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            boxShadow: success ? 'none' : 'var(--shadow-glow)',
                            opacity: loading ? 0.8 : 1
                        }}
                    >
                        {loading ? <Loader className="spinner" size={20} /> : (success ? 'Message Sent!' : 'Send Message')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Contact;
