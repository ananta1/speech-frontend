import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, User, ArrowLeft, Loader2, Sparkles, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGoogleLogin } from '@react-oauth/google';
import { API_BASE_URL } from '../config';

const AuthForm = ({ onLoginSuccess }) => {
    const [authMethod, setAuthMethod] = useState('initial'); // 'initial', 'signup', 'signin', 'forgot', 'reset'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [resetToken, setResetToken] = useState('');

    // Detect reset link in URL
    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const action = params.get('action');
        const token = params.get('token');
        const emailParam = params.get('email');

        if (action === 'reset-password' && token && emailParam) {
            setAuthMethod('reset');
            setResetToken(token);
            setEmail(emailParam);
        }
    }, []);

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setIsLoading(true);
            setError('');
            try {
                const res = await fetch(`${API_BASE_URL}/google-signup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ accessToken: tokenResponse.access_token })
                });
                const data = await res.json();
                if (res.ok && onLoginSuccess) {
                    onLoginSuccess(data.user);
                } else {
                    setError(data.message || 'Google login failed');
                }
            } catch (err) {
                setError("Connection failed. Please try again.");
            } finally {
                setIsLoading(false);
            }
        },
        onError: () => setError("Google Login Failed"),
    });

    const handleEmailSignup = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_BASE_URL}/sign-up`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, name })
            });
            const data = await res.json();
            if (res.ok) {
                setAuthMethod('signin');
                setError('');
                alert("Account created! Please sign in with your new credentials.");
            } else {
                setError(data.message || 'Signup failed');
            }
        } catch (err) {
            setError("Connection failed. Please check your network.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailSignin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_BASE_URL}/sign-in`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (res.ok && onLoginSuccess) {
                onLoginSuccess(data.user);
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError("Connection failed. Please check your network.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRequestReset = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_BASE_URL}/request-password-reset`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (res.ok) {
                setSuccessMessage("Check your email for a reset link.");
            } else {
                setError(data.message || 'Reset request failed');
            }
        } catch (err) {
            setError("Connection failed.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleActualReset = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_BASE_URL}/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, token: resetToken, newPassword })
            });
            const data = await res.json();
            if (res.ok) {
                alert("Password reset successfully! Redirecting to login...");
                setAuthMethod('signin');
            } else {
                setError(data.message || 'Reset failed');
            }
        } catch (err) {
            setError("Connection failed.");
        } finally {
            setIsLoading(false);
        }
    };

    const containerVariants = {
        initial: { opacity: 0, scale: 0.9, y: 20 },
        animate: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 300 } },
        exit: { opacity: 0, scale: 0.95, y: -20, transition: { duration: 0.2 } }
    };

    return (
        <div style={{ position: 'relative', width: '100%', maxWidth: '460px' }}>
            {/* Decorative Background Elements */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0],
                    x: [0, 20, 0]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                style={{
                    position: 'absolute', top: '-100px', right: '-120px',
                    width: '250px', height: '250px',
                    background: 'radial-gradient(circle, var(--accent-primary) 0%, transparent 70%)',
                    opacity: 0.15, filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none'
                }}
            />
            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    rotate: [0, -90, 0],
                    x: [0, -30, 0]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                style={{
                    position: 'absolute', bottom: '-80px', left: '-100px',
                    width: '220px', height: '220px',
                    background: 'radial-gradient(circle, var(--accent-secondary) 0%, transparent 70%)',
                    opacity: 0.15, filter: 'blur(50px)', zIndex: 0, pointerEvents: 'none'
                }}
            />

            <motion.div
                variants={containerVariants}
                initial="initial"
                animate="animate"
                className="glass-panel"
                style={{
                    padding: '3rem 2.5rem',
                    borderRadius: '2.5rem',
                    position: 'relative',
                    zIndex: 1,
                    boxShadow: '0 20px 50px rgba(0,0,0,0.3), inset 0 0 20px rgba(255,255,255,0.02)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid var(--glass-border)'
                }}
            >
                <AnimatePresence mode="wait">
                    {authMethod === 'initial' && (
                        <motion.div
                            key="initial"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
                        >
                            <div style={{ textAlign: 'center' }}>
                                <motion.div
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    style={{
                                        display: 'inline-flex', padding: '1rem', borderRadius: '1.5rem',
                                        background: 'var(--accent-gradient)', marginBottom: '1.5rem',
                                        boxShadow: 'var(--shadow-glow)'
                                    }}
                                >
                                    <Sparkles color="white" size={32} />
                                </motion.div>
                                <h1 className="gradient-text" style={{ fontSize: '2.6rem', margin: '0 0 0.5rem 0', fontWeight: '900', letterSpacing: '-0.02em' }}>
                                    Welcome
                                </h1>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', fontWeight: '500' }}>
                                    Elevate your speaking skills with "Practice Your Speech using AI"
                                </p>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <button
                                    onClick={() => googleLogin()}
                                    disabled={isLoading}
                                    className="interactive-card"
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem',
                                        width: '80%', padding: '1.1rem', borderRadius: '1.2rem',
                                        background: 'white', color: '#1a1a1b', border: 'none',
                                        fontSize: '1.05rem', fontWeight: '700', cursor: 'pointer',
                                        boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                                        alignSelf: 'center'
                                    }}
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335" />
                                    </svg>
                                    Continue with Google
                                </button>

                                <div style={{ display: 'flex', alignItems: 'center', padding: '0 1rem', margin: '0.5rem 0' }}>
                                    <div style={{ flex: 1, height: '1.5px', background: 'var(--glass-border)' }} />
                                    <span style={{ padding: '0 1rem', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: '700' }}>OR</span>
                                    <div style={{ flex: 1, height: '1.5px', background: 'var(--glass-border)' }} />
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                    <button
                                        onClick={() => setAuthMethod('signin')}
                                        style={{
                                            width: '80%', padding: '1rem', borderRadius: '1.2rem',
                                            background: 'rgba(129, 140, 248, 0.1)', color: '#818cf8',
                                            border: '1.5px solid rgba(129, 140, 248, 0.3)', fontSize: '1rem',
                                            fontWeight: '700', cursor: 'pointer', transition: 'all 0.3s',
                                            alignSelf: 'center',
                                            boxShadow: '0 4px 15px rgba(129, 140, 248, 0.1)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'rgba(129, 140, 248, 0.2)';
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'rgba(129, 140, 248, 0.1)';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                        }}
                                    >
                                        Log In with Email
                                    </button>
                                    <button
                                        onClick={() => setAuthMethod('signup')}
                                        style={{
                                            width: '80%', padding: '1rem', borderRadius: '1.2rem',
                                            background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
                                            color: 'white',
                                            border: 'none', fontSize: '1rem',
                                            fontWeight: '800', cursor: 'pointer', transition: 'all 0.3s',
                                            alignSelf: 'center',
                                            boxShadow: '0 8px 25px rgba(37, 99, 235, 0.3)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.boxShadow = '0 12px 30px rgba(37, 99, 235, 0.4)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(37, 99, 235, 0.3)';
                                        }}
                                    >
                                        Create New Account
                                    </button>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                <ShieldCheck size={16} />
                                Secure & Private
                            </div>
                        </motion.div>
                    )}

                    {(authMethod === 'signin' || authMethod === 'signup') && (
                        <motion.div
                            key={authMethod}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <button
                                onClick={() => setAuthMethod('initial')}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    color: 'var(--text-secondary)', border: 'none',
                                    background: 'none', cursor: 'pointer', marginBottom: '2rem',
                                    fontSize: '0.95rem', fontWeight: '600'
                                }}
                            >
                                <ArrowLeft size={18} /> Exit to Menu
                            </button>

                            <div style={{ marginBottom: '2.5rem' }}>
                                <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem', fontWeight: '800' }} className="gradient-text">
                                    {authMethod === 'signin' ? 'Welcome Back' : 'Get Started'}
                                </h2>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.5' }}>
                                    {authMethod === 'signin'
                                        ? 'Enter your credentials to continue your journey.'
                                        : 'Join thousands of speakers mastering their craft.'}
                                </p>
                            </div>

                            <form onSubmit={authMethod === 'signin' ? handleEmailSignin : handleEmailSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
                                <AnimatePresence mode="popLayout">
                                    {authMethod === 'signup' && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ position: 'relative' }}>
                                            <User style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-primary)' }} size={20} />
                                            <input
                                                type="text"
                                                placeholder="Full Name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="modern-input"
                                                style={{
                                                    width: '100%', padding: '1.1rem 1rem 1.1rem 3.5rem',
                                                    borderRadius: '1.2rem', background: 'var(--bg-secondary)',
                                                    border: '2px solid var(--glass-border)', color: 'var(--text-primary)',
                                                    fontSize: '1rem', outline: 'none', transition: 'all 0.3s'
                                                }}
                                                required
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div style={{ position: 'relative' }}>
                                    <Mail style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-primary)' }} size={20} />
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="modern-input"
                                        style={{
                                            width: '100%', padding: '1.1rem 1rem 1.1rem 3.5rem',
                                            borderRadius: '1.2rem', background: 'var(--bg-secondary)',
                                            border: '2px solid var(--glass-border)', color: 'var(--text-primary)',
                                            fontSize: '1rem', outline: 'none', transition: 'all 0.3s'
                                        }}
                                        required
                                    />
                                </div>

                                <div style={{ position: 'relative' }}>
                                    <Lock style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-primary)' }} size={20} />
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="modern-input"
                                        style={{
                                            width: '100%', padding: '1.1rem 1rem 1.1rem 3.5rem',
                                            borderRadius: '1.2rem', background: 'var(--bg-secondary)',
                                            border: '2px solid var(--glass-border)', color: 'var(--text-primary)',
                                            fontSize: '1rem', outline: 'none', transition: 'all 0.3s'
                                        }}
                                        required
                                    />
                                </div>

                                {authMethod === 'signin' && (
                                    <div style={{ textAlign: 'right', marginTop: '-0.5rem' }}>
                                        <button
                                            type="button"
                                            onClick={() => setAuthMethod('forgot')}
                                            style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '0.9rem', cursor: 'pointer', fontWeight: '500' }}
                                        >
                                            Forgot Password?
                                        </button>
                                    </div>
                                )}

                                {error && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{
                                        color: 'var(--danger)', fontSize: '0.9rem', textAlign: 'center',
                                        padding: '0.8rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '0.8rem'
                                    }}>
                                        {error}
                                    </motion.div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    style={{
                                        width: '80%', padding: '1.2rem', borderRadius: '1.2rem',
                                        background: 'var(--accent-gradient)', color: 'white',
                                        border: 'none', fontWeight: '800', fontSize: '1.1rem',
                                        cursor: isLoading ? 'wait' : 'pointer', marginTop: '1rem',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem',
                                        boxShadow: '0 10px 30px rgba(56, 189, 248, 0.4)',
                                        transition: 'transform 0.2s',
                                        alignSelf: 'center'
                                    }}
                                    onMouseEnter={(e) => !isLoading && (e.currentTarget.style.transform = 'scale(1.02)')}
                                    onMouseLeave={(e) => !isLoading && (e.currentTarget.style.transform = 'scale(1)')}
                                >
                                    {isLoading ? <Loader2 size={24} className="spinner" /> : (
                                        <>
                                            {authMethod === 'signin' ? 'Sign In Now' : 'Create My Account'}
                                            <ArrowRight size={22} />
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    )}

                    {authMethod === 'forgot' && (
                        <motion.div key="forgot" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <button onClick={() => setAuthMethod('signin')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', border: 'none', background: 'none', cursor: 'pointer', marginBottom: '2rem', fontSize: '0.95rem', fontWeight: '600' }}>
                                <ArrowLeft size={18} /> Back to Sign In
                            </button>
                            <div style={{ marginBottom: '2.5rem' }}>
                                <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem', fontWeight: '800' }} className="gradient-text">Reset Password</h2>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.5' }}>Enter your email and we'll send you a link to reset your password.</p>
                            </div>
                            {successMessage ? (
                                <div style={{ textAlign: 'center', padding: '2rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '1.5rem', border: '1px solid var(--accent-primary)' }}>
                                    <Sparkles style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }} size={40} />
                                    <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Email Sent!</h3>
                                    <p style={{ color: 'var(--text-secondary)' }}>{successMessage}</p>
                                    <button onClick={() => setAuthMethod('signin')} style={{ marginTop: '1.5rem', padding: '0.8rem 1.5rem', borderRadius: '1rem', background: 'white', color: 'black', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Okay</button>
                                </div>
                            ) : (
                                <form onSubmit={handleRequestReset} style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
                                    <div style={{ position: 'relative' }}>
                                        <Mail style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-primary)' }} size={20} />
                                        <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="modern-input" style={{ width: '100%', padding: '1.1rem 1rem 1.1rem 3.5rem', borderRadius: '1.2rem', background: 'var(--bg-secondary)', border: '2px solid var(--glass-border)', color: 'var(--text-primary)', fontSize: '1rem', outline: 'none' }} required />
                                    </div>
                                    {error && <div style={{ color: 'var(--danger)', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}
                                    <button type="submit" disabled={isLoading} style={{ width: '80%', padding: '1.2rem', borderRadius: '1.2rem', background: 'var(--accent-gradient)', color: 'white', border: 'none', fontWeight: '800', alignSelf: 'center', cursor: 'pointer' }}>
                                        {isLoading ? <Loader2 size={24} className="spinner" /> : 'Send Reset Link'}
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    )}

                    {authMethod === 'reset' && (
                        <motion.div key="reset" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <div style={{ marginBottom: '2.5rem' }}>
                                <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem', fontWeight: '800' }} className="gradient-text">New Password</h2>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.5' }}>Set a secure new password for <strong>{email}</strong></p>
                            </div>
                            <form onSubmit={handleActualReset} style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
                                <div style={{ position: 'relative' }}>
                                    <Lock style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-primary)' }} size={20} />
                                    <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="modern-input" style={{ width: '100%', padding: '1.1rem 1rem 1.1rem 3.5rem', borderRadius: '1.2rem', background: 'var(--bg-secondary)', border: '2px solid var(--glass-border)', color: 'var(--text-primary)', fontSize: '1rem', outline: 'none' }} required />
                                </div>
                                {error && <div style={{ color: 'var(--danger)', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}
                                <button type="submit" disabled={isLoading} style={{ width: '80%', padding: '1.2rem', borderRadius: '1.2rem', background: 'var(--accent-gradient)', color: 'white', border: 'none', fontWeight: '800', alignSelf: 'center', cursor: 'pointer' }}>
                                    {isLoading ? <Loader2 size={24} className="spinner" /> : 'Confirm New Password'}
                                </button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            <style>{`
                .modern-input:focus {
                    border-color: var(--accent-primary) !important;
                    background: rgba(255, 255, 255, 0.05) !important;
                    box-shadow: 0 0 15px rgba(56, 189, 248, 0.2);
                }
                .spinner {
                    animation: rotate 2s linear infinite;
                }
                @keyframes rotate {
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default AuthForm;
