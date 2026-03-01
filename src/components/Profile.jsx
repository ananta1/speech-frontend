import React, { useState, useEffect } from 'react';
import { User, CreditCard, CheckCircle, AlertCircle, Loader, Users, Lock } from 'lucide-react';
import { API_BASE_URL } from '../config';

const Profile = ({ user, refreshAppProfile }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [joinCode, setJoinCode] = useState('');
    const [showChangePw, setShowChangePw] = useState(false);
    const [currentPw, setCurrentPw] = useState('');
    const [newPw, setNewPw] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const [pwMessage, setPwMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user?.id) return;
            try {
                setLoading(true);
                const res = await fetch(`${API_BASE_URL}/get-profile`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: user.id })
                });

                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(`Server error: ${res.status} ${errorText}`);
                }

                const data = await res.json();
                setProfile(data);
            } catch (err) {
                console.error("Profile fetch error:", err);
                setError(err.message || 'Failed to load profile. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user?.id]);

    const handleSubscribe = async () => {
        setProcessing(true);
        try {
            const res = await fetch(`${API_BASE_URL}/create-checkout-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: user.id, email: user.email })
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert('Failed to start checkout');
                setProcessing(false);
            }
        } finally {
            setProcessing(false);
        }
    };

    const handleCancelSubscription = async () => {
        if (!window.confirm("Are you sure you want to cancel your Pro subscription?")) return;
        setProcessing(true);
        try {
            const res = await fetch(`${API_BASE_URL}/cancel-subscription`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id || user.userId })
            });
            const data = await res.json();
            if (res.ok) {
                alert(data.message || "Subscription cancelled.");
                const profileRes = await fetch(`${API_BASE_URL}/get-profile`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: user.id || user.userId })
                });
                const newData = await profileRes.json();
                setProfile(newData);
                if (refreshAppProfile) refreshAppProfile();
            } else {
                alert(data.message || "Failed to cancel.");
            }
        } catch (err) {
            console.error(err);
            alert("Error cancelling subscription.");
        } finally {
            setProcessing(false);
        }
    };

    const handleReactivateSubscription = async () => {
        setProcessing(true);
        try {
            const res = await fetch(`${API_BASE_URL}/reactivate-subscription`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id || user.userId })
            });
            const data = await res.json();
            if (res.ok) {
                alert(data.message || "Subscription reactivated!");
                const profileRes = await fetch(`${API_BASE_URL}/get-profile`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: user.id || user.userId })
                });
                const newData = await profileRes.json();
                setProfile(newData);
                if (refreshAppProfile) refreshAppProfile();
            } else {
                alert(data.message || "Failed to reactivate.");
            }
        } catch (err) {
            console.error(err);
            alert("Error reactivating subscription.");
        } finally {
            setProcessing(false);
        }
    };

    const handleJoinClass = async () => {
        if (!joinCode.trim()) return;
        setProcessing(true);
        try {
            const res = await fetch(`${API_BASE_URL}/join-class`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id || user.userId, classId: joinCode.trim() })
            });
            const data = await res.json();
            if (res.ok) {
                alert("Joined class successfully!");
                const profileRes = await fetch(`${API_BASE_URL}/get-profile`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: user.id || user.userId })
                });
                const newData = await profileRes.json();
                setProfile(newData);

                const updatedUser = { ...user, classId: joinCode.trim() };
                localStorage.setItem('speechUser', JSON.stringify(updatedUser));
                if (refreshAppProfile) refreshAppProfile();
            } else {
                alert(data.message || "Failed to join class.");
            }
        } catch (err) {
            alert("Error joining class.");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <Loader className="spinner" /> Loading profile...
        </div>
    );

    if (error) return (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
            <AlertCircle size={32} />
            <p>{error}</p>
        </div>
    );

    const subscription = profile?.subscription || {};
    const isPro = (subscription.subscription_plan === 'Pro' || subscription.plan === 'pro') &&
        (!subscription.sub_end_date || new Date(subscription.sub_end_date) > new Date());
    const isActive = isPro; // Alias for backward compatibility in the render block

    return (
        <div style={{ maxWidth: '600px', width: '100%', margin: '0 auto' }}>
            <h2 className="gradient-text" style={{ marginBottom: '2rem' }}>User Profile</h2>

            {/* User Details */}
            <div className="glass-panel" style={{ padding: '2rem', borderRadius: '1rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{
                    width: '80px', height: '80px', borderRadius: '50%',
                    background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '2rem', fontWeight: 'bold', color: 'white'
                }}>
                    {user.picture ? <img src={user.picture} style={{ width: '100%', height: '100%', borderRadius: '50%' }} /> : user.name?.charAt(0)}
                </div>
                <div>
                    <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{user.name}</h3>
                    <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {user.email}
                    </p>
                </div>
            </div>

            {/* Change Password — only for native (non-Google) users */}
            {(profile?.user?.authProvider || user.authProvider) !== 'google' && (
                <div className="glass-panel" style={{ padding: '2rem', borderRadius: '1rem', marginBottom: '2rem' }}>
                    <div
                        onClick={() => { setShowChangePw(!showChangePw); setPwMessage({ text: '', type: '' }); }}
                        style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            cursor: 'pointer', userSelect: 'none'
                        }}
                    >
                        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Lock size={20} /> Change Password
                        </h3>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>{showChangePw ? '▲' : '▼'}</span>
                    </div>

                    {showChangePw && (
                        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input
                                type="password" placeholder="Current Password" value={currentPw}
                                onChange={e => setCurrentPw(e.target.value)}
                                style={{
                                    padding: '0.9rem 1rem', borderRadius: '0.75rem',
                                    background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)',
                                    color: 'var(--text-primary)', outline: 'none', fontSize: '1rem'
                                }}
                            />
                            <input
                                type="password" placeholder="New Password (min 6 characters)" value={newPw}
                                onChange={e => setNewPw(e.target.value)}
                                style={{
                                    padding: '0.9rem 1rem', borderRadius: '0.75rem',
                                    background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)',
                                    color: 'var(--text-primary)', outline: 'none', fontSize: '1rem'
                                }}
                            />
                            <input
                                type="password" placeholder="Confirm New Password" value={confirmPw}
                                onChange={e => setConfirmPw(e.target.value)}
                                style={{
                                    padding: '0.9rem 1rem', borderRadius: '0.75rem',
                                    background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)',
                                    color: 'var(--text-primary)', outline: 'none', fontSize: '1rem'
                                }}
                            />

                            {pwMessage.text && (
                                <div style={{
                                    padding: '0.7rem 1rem', borderRadius: '0.6rem', fontSize: '0.95rem',
                                    background: pwMessage.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                                    color: pwMessage.type === 'success' ? '#10b981' : '#ef4444',
                                    border: `1px solid ${pwMessage.type === 'success' ? '#10b98133' : '#ef444433'}`,
                                    display: 'flex', alignItems: 'center', gap: '0.5rem'
                                }}>
                                    {pwMessage.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                                    {pwMessage.text}
                                </div>
                            )}

                            <button
                                disabled={processing}
                                onClick={async () => {
                                    setPwMessage({ text: '', type: '' });
                                    if (!currentPw || !newPw || !confirmPw) {
                                        setPwMessage({ text: 'Please fill in all fields.', type: 'error' }); return;
                                    }
                                    if (newPw.length < 6) {
                                        setPwMessage({ text: 'New password must be at least 6 characters.', type: 'error' }); return;
                                    }
                                    if (newPw !== confirmPw) {
                                        setPwMessage({ text: 'New passwords do not match.', type: 'error' }); return;
                                    }
                                    setProcessing(true);
                                    try {
                                        const res = await fetch(`${API_BASE_URL}/change-password`, {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ userId: user.id || user.userId, currentPassword: currentPw, newPassword: newPw })
                                        });
                                        const data = await res.json();
                                        if (res.ok) {
                                            setPwMessage({ text: 'Password changed successfully!', type: 'success' });
                                            setCurrentPw(''); setNewPw(''); setConfirmPw('');
                                            setTimeout(() => setShowChangePw(false), 2000);
                                        } else {
                                            setPwMessage({ text: data.message || 'Failed to change password.', type: 'error' });
                                        }
                                    } catch {
                                        setPwMessage({ text: 'Connection error.', type: 'error' });
                                    } finally {
                                        setProcessing(false);
                                    }
                                }}
                                style={{
                                    padding: '0.9rem', background: 'var(--accent-gradient)',
                                    color: 'white', border: 'none', borderRadius: '0.75rem',
                                    fontWeight: '700', fontSize: '1rem', cursor: processing ? 'wait' : 'pointer',
                                    opacity: processing ? 0.6 : 1, transition: 'all 0.3s'
                                }}
                            >
                                {processing ? 'Changing...' : 'Update Password'}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Subscription Details — hidden for class-enrolled students */}
            {!(user.role === 'student' && (profile?.user?.classId || user.classId)) && (
                <div className="glass-panel" style={{ padding: '2rem', borderRadius: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <CreditCard size={20} /> Subscription
                        </h3>
                        <div style={{
                            padding: '0.4rem 1rem', borderRadius: '2rem',
                            background: isActive ? (subscription.renewal === false ? 'rgba(245, 158, 11, 0.2)' : 'rgba(34, 197, 94, 0.2)') : 'rgba(239, 68, 68, 0.2)',
                            color: isActive ? (subscription.renewal === false ? '#f59e0b' : '#22c55e') : '#ef4444',
                            fontWeight: '600', fontSize: '0.9rem',
                            border: `1px solid ${isActive ? (subscription.renewal === false ? '#f59e0b' : '#22c55e') : '#ef4444'}`
                        }}>
                            {isActive ? (subscription.renewal === false ? 'PRO (ENDING)' : 'PRO PLAN') : 'FREE PLAN'}
                        </div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        {isActive ? (
                            <div style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <CheckCircle size={16} color="var(--success)" /> You have access to all Pro features.
                                </p>
                                <p>{subscription.renewal === false ? 'Subscription ending on: ' : 'Next billing date: '} {subscription.sub_end_date ? new Date(subscription.sub_end_date).toLocaleDateString() : (subscription.currentPeriodEnd ? new Date(subscription.currentPeriodEnd * 1000).toLocaleDateString() : 'N/A')}</p>
                                {subscription.renewal === false && <p style={{ color: '#ef4444', fontSize: '0.9rem' }}>Renewal is turned off. You will lose access after this date.</p>}
                            </div>
                        ) : (
                            <div style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                <p>Upgrade to Pro to unlock:</p>
                                <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                                    <li>Unlimited Speech Analysis</li>
                                    <li>Advanced AI Feedback</li>
                                    <li>Improvisation Suggestions</li>
                                    <li>Detailed Delivery Metrics</li>
                                </ul>
                            </div>
                        )}
                    </div>

                    {!isActive && (
                        <button
                            onClick={handleSubscribe}
                            disabled={true}
                            style={{
                                width: 'auto', margin: '0 auto', display: 'block',
                                padding: '0.8rem 3rem',
                                background: 'var(--accent-gradient)',
                                color: 'white', border: 'none', borderRadius: '0.5rem',
                                fontWeight: '600', fontSize: '1.1rem', cursor: 'not-allowed',
                                opacity: 0.6,
                                boxShadow: 'none'
                            }}
                        >
                            {processing ? 'Redirecting to Stripe...' : 'Subscribe - $7/month'}
                        </button>
                    )}

                    {isActive && subscription.renewal !== false && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', alignItems: 'center' }}>
                            <div style={{
                                width: '100%', padding: '1rem',
                                background: 'var(--bg-secondary)',
                                color: 'var(--text-secondary)', border: 'none', borderRadius: '0.5rem',
                                fontWeight: '600', textAlign: 'center'
                            }}>
                                Subscription Active
                            </div>
                            <button
                                onClick={handleCancelSubscription}
                                disabled={processing}
                                style={{
                                    background: 'none',
                                    border: '1px solid #ef4444',
                                    color: '#ef4444',
                                    padding: '0.6rem 2rem',
                                    borderRadius: '2rem',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    fontSize: '0.9rem',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.background = '#ef4444';
                                    e.currentTarget.style.color = 'white';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.background = 'none';
                                    e.currentTarget.style.color = '#ef4444';
                                }}
                            >
                                {processing ? 'Processing...' : 'Cancel Subscription'}
                            </button>
                        </div>
                    )}

                    {isActive && subscription.renewal === false && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', alignItems: 'center' }}>
                            <button
                                onClick={handleReactivateSubscription}
                                disabled={processing}
                                style={{
                                    width: 'auto', padding: '1rem 3rem',
                                    background: 'var(--accent-gradient)',
                                    color: 'white', border: 'none', borderRadius: '0.5rem',
                                    fontWeight: '600', fontSize: '1.1rem',
                                    cursor: processing ? 'wait' : 'pointer',
                                    boxShadow: 'var(--shadow-glow)',
                                    opacity: processing ? 0.6 : 1,
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseOver={(e) => !processing && (e.currentTarget.style.transform = 'scale(1.05)')}
                                onMouseOut={(e) => !processing && (e.currentTarget.style.transform = 'scale(1)')}
                            >
                                {processing ? 'Processing...' : 'Renew Subscription'}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Class Details for Students */}
            {user.role === 'student' && (
                <div className="glass-panel" style={{ padding: '2rem', borderRadius: '1rem', marginTop: '2rem' }}>
                    <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <Users size={20} /> Class Enrollment
                    </h3>
                    {profile?.user?.classId ? (
                        <div style={{ color: 'var(--text-secondary)' }}>
                            <p>You are currently enrolled in a class.</p>
                            <div style={{
                                background: 'rgba(255,255,255,0.05)', padding: '0.75rem 1rem',
                                borderRadius: '0.75rem', fontFamily: 'monospace', color: 'var(--accent-primary)',
                                border: '1px solid var(--glass-border)', marginTop: '0.5rem'
                            }}>
                                {profile.user.classId}
                            </div>
                            <p style={{ fontSize: '0.9rem', marginTop: '1.2rem', lineHeight: '1.5' }}>
                                Your speech evaluations now automatically follow the specialized criteria set by your instructor.
                            </p>
                        </div>
                    ) : (
                        <div>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.95rem' }}>
                                If you are part of a class, enter the Class ID provided by your instructor to get tailored evaluations.
                            </p>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <input
                                    type="text"
                                    placeholder="Enter Class ID (e.g. 8af80376...)"
                                    value={joinCode}
                                    onChange={(e) => setJoinCode(e.target.value)}
                                    style={{
                                        flex: 1, padding: '0.8rem 1rem', borderRadius: '0.8rem',
                                        background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)',
                                        color: 'white', outline: 'none'
                                    }}
                                />
                                <button
                                    onClick={handleJoinClass}
                                    disabled={processing || !joinCode}
                                    style={{
                                        padding: '0.8rem 1.5rem', background: 'var(--accent-gradient)',
                                        color: 'white', border: 'none', borderRadius: '0.8rem',
                                        fontWeight: '700', cursor: processing ? 'wait' : 'pointer',
                                        opacity: (!joinCode || processing) ? 0.5 : 1, transition: 'all 0.3s'
                                    }}
                                >
                                    {processing ? '...' : 'Join Class'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Profile;
