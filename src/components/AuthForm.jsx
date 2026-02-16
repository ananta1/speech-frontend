import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGoogleLogin } from '@react-oauth/google';
import { API_BASE_URL } from '../config';

const AuthForm = ({ onLoginSuccess }) => {
    const [isLogin, setIsLogin] = useState(false); // Default to Sign Up
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const toggleMode = () => setIsLogin(!isLogin);

    // Google Login Hook
    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            console.log("Google Auth Success", tokenResponse);
            // ... (comments)

            setIsLoading(true);
            try {
                // Send access token to backend
                const res = await fetch(`${API_BASE_URL}/google-signup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ accessToken: tokenResponse.access_token })
                });
                const data = await res.json();
                console.log("Authenticated User:", data.user);
                // Call the success callback to redirect
                if (onLoginSuccess) onLoginSuccess(data.user);
            } catch (err) {
                console.error(err);
                alert("Backend authentication failed. Is server.py running?");
            } finally {
                setIsLoading(false);
            }
        },
        onError: () => alert("Google Login Failed"),
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`${isLogin ? 'Login' : 'Sign Up'} with email: ${email} (Not implemented in backend yet)`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel"
            style={{
                padding: '2.5rem',
                borderRadius: '1.5rem',
                width: '100%',
                maxWidth: '420px',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                <h2 className="gradient-text" style={{ fontSize: '2rem', margin: '0 0 0.5rem 0', fontWeight: '700' }}>
                    Get Started
                </h2>
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                    Sign in or create an account to continue
                </p>
            </div>

            {/* Google Button */}
            <button
                onClick={() => googleLogin()}
                disabled={isLoading}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '1rem',
                    width: '100%',
                    padding: '0.875rem',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--glass-border)',
                    color: 'var(--text-primary)',
                    fontSize: '1rem',
                    fontWeight: '500',
                    transition: 'all 0.2s',
                    cursor: isLoading ? 'wait' : 'pointer',
                    opacity: isLoading ? 0.7 : 1
                }}
                onMouseOver={(e) => !isLoading && (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                onMouseOut={(e) => !isLoading && (e.currentTarget.style.background = 'var(--bg-secondary)')}
            >
                {isLoading ? (
                    <span>Connecting...</span>
                ) : (
                    <>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M23.52 12.29C23.52 11.43 23.47 10.73 23.32 10.05H12V14.51H18.51C18.25 15.19 17.89 15.82 17.43 16.37C16.97 16.93 16.42 17.38 15.78 17.71V20.42H19.66C21.94 18.29 23.52 15.53 23.52 12.29Z" fill="#4285F4" />
                            <path d="M12 24C15.24 24 17.96 22.92 19.95 21.09L16.07 18.39C15.01 19.11 13.62 19.52 12 19.52C8.84001 19.52 6.17001 17.38 5.21001 14.5H1.20001V17.6C2.22001 19.64 3.76001 21.33 5.67001 22.51C7.58001 23.69 9.77001 24.16 12 24Z" fill="#34A853" />
                            <path d="M5.21001 14.5C4.72001 13.06 4.72001 11.5 5.21001 9.99998V6.89998H1.20001C0.240011 8.83998 -0.159989 11.02 -0.159989 13.2C-0.159989 15.38 0.240011 17.56 1.20001 19.5L5.21001 14.5Z" fill="#FBBC05" />
                            <path d="M12 4.47998C13.67 4.45998 15.28 5.09998 16.51 6.26998L19.78 3.01998C17.67 1.01998 14.89 -0.0500206 12 -0.0000206264C9.77001 -0.0000206264 7.58001 0.629979 5.67001 1.80998 3.76001 2.98998 2.22001 4.67998 1.20001 6.71998L5.21001 9.81998C6.17001 6.93998 8.84001 4.79998 12 4.47998Z" fill="#EA4335" />
                        </svg>
                        Continue with Google
                    </>
                )}
            </button>

            {/* Standard Form Removed - Only Google Auth */}
            <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <p>Secure login powered by Google</p>
            </div>
        </motion.div>
    );
};

export default AuthForm;
