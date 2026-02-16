import React, { useState, useEffect } from 'react';
import CameraView from './components/CameraView';
import { Mic, Camera, Home, BarChart2, UserPlus, Mail, Palette, Check, UploadCloud } from 'lucide-react';
import AuthForm from './components/AuthForm';
import UploadVideo from './components/UploadVideo';
import AnalyzeVideo from './components/AnalyzeVideo';
import { motion, AnimatePresence } from 'framer-motion';

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [currentTheme, setCurrentTheme] = useState('light'); // Default theme
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const themes = [
    { id: 'midnight', name: 'Midnight', color: '#0f172a' },
    { id: 'light', name: 'Light', color: '#f8fafc' },
    { id: 'forest', name: 'Forest', color: '#052e16' },
    { id: 'cyber', name: 'Cyber', color: '#09090b' },
    { id: 'sunset', name: 'Sunset', color: '#451a03' },
  ];

  useEffect(() => {
    // Apply theme class to body
    document.body.className = ''; // clear existing
    if (currentTheme !== 'midnight') {
      document.body.classList.add(`theme-${currentTheme}`);
    }
  }, [currentTheme]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setActiveTab('home');
    alert("Logged out successfully");
  };

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    ...(isAuthenticated
      ? [
        { id: 'record', label: 'Record Speech', icon: Camera },
        { id: 'upload', label: 'Upload Speech', icon: UploadCloud },
        { id: 'analyze', label: 'Analyze Speech', icon: BarChart2 },
        { id: 'logout', label: 'Logout', icon: UserPlus }
      ]
      : [{ id: 'signup', label: 'Sign Up', icon: UserPlus }]
    ),
    { id: 'contact', label: 'Contact Us', icon: Mail },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'record':
        return <CameraView user={user} onUploadSuccess={() => setActiveTab('analyze')} />;
      case 'upload':
        return <UploadVideo user={user} onUploadSuccess={() => setActiveTab('analyze')} />;
      case 'analyze':
        return <AnalyzeVideo user={user} />;
      case 'signup':
        return <AuthForm onLoginSuccess={(userData) => { setIsAuthenticated(true); setUser(userData); setActiveTab('home'); }} />;
      case 'home':
        return (
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', borderRadius: '1rem', maxWidth: '600px', margin: '0 auto' }}>
            <h2 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
              {isAuthenticated ? 'Ready to Practice?' : 'Welcome to Speech Analyzer'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.6' }}>
              {isAuthenticated
                ? 'Start a new recording session to get instant AI feedback on your speech.'
                : 'Master your communication skills with AI-powered feedback. Sign in to start recording your speech.'}
            </p>
            <button
              onClick={() => setActiveTab(isAuthenticated ? 'record' : 'signup')}
              style={{
                marginTop: '2rem',
                padding: '1rem 2rem',
                background: 'var(--accent-gradient)',
                color: 'white',
                borderRadius: '2rem',
                fontWeight: '600',
                fontSize: '1.1rem',
                boxShadow: 'var(--shadow-glow)'
              }}
            >
              {isAuthenticated ? 'Start New Session' : 'Sign In to Start'}
            </button>
          </div>
        );
      default:
        return (
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', borderRadius: '1rem', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{menuItems.find(item => item.id === activeTab)?.label}</h2>
            <p style={{ color: 'var(--text-secondary)' }}>This feature is coming soon.</p>
          </div>
        );
    }
  };

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Theme Switcher Overlay */}
      <AnimatePresence>
        {showThemeMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowThemeMenu(false)}
              style={{ position: 'fixed', inset: 0, zIndex: 90 }}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              style={{
                position: 'absolute',
                top: '80px',
                right: '2rem',
                zIndex: 100,
                padding: '1rem',
                borderRadius: '1rem',
                minWidth: '200px'
              }}
              className="glass-panel"
            >
              <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Select Theme</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {themes.map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => { setCurrentTheme(theme.id); setShowThemeMenu(false); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.8rem',
                      padding: '0.5rem',
                      borderRadius: '0.5rem',
                      background: currentTheme === theme.id ? 'var(--bg-secondary)' : 'transparent',
                      width: '100%'
                    }}
                  >
                    <div style={{
                      width: '24px', height: '24px', borderRadius: '50%', background: theme.color,
                      border: '2px solid var(--glass-border)', boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                    }} />
                    <span style={{ flex: 1, textAlign: 'left', fontSize: '0.9rem' }}>{theme.name}</span>
                    {currentTheme === theme.id && <Check size={16} color="var(--accent-primary)" />}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Navigation Header */}
      <header style={{
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(15, 23, 42, 0.2)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--glass-border)',
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            padding: '0.5rem',
            background: 'var(--accent-gradient)',
            borderRadius: '0.75rem',
            color: '#fff',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <Mic size={24} strokeWidth={2.5} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h1 style={{
              margin: 0,
              fontSize: '1.5rem',
              fontWeight: 700,
              lineHeight: 1,
              background: 'linear-gradient(to right, var(--text-primary), var(--text-secondary))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Speech<span style={{ color: 'var(--accent-primary)', WebkitTextFillColor: 'initial' }}>Analyzer</span>
            </h1>
            {isAuthenticated && user?.name && (
              <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                Welcome, <span style={{ color: 'var(--accent-primary)' }}>{user.name}</span>
              </span>
            )}
            <span style={{
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              letterSpacing: '0.5px',
              fontWeight: 500
            }}>
              {isAuthenticated ? 'Take your speaking skills to next level' : 'Take your speech to the next level'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <nav style={{ display: 'flex', gap: '0.5rem' }}>
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'logout') {
                    handleLogout();
                  } else {
                    setActiveTab(item.id);
                  }
                }}
                style={{
                  padding: '0.6rem 1.2rem',
                  borderRadius: '0.75rem',
                  color: activeTab === item.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                  background: activeTab === item.id ? 'var(--glass)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: activeTab === item.id ? '600' : '400',
                  transition: 'all 0.3s ease',
                  border: activeTab === item.id ? '1px solid var(--glass-border)' : '1px solid transparent'
                }}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </nav>

          <div style={{ width: '1px', height: '24px', background: 'var(--glass-border)', margin: '0 0.5rem' }}></div>

          {/* Theme Toggle Button */}
          <button
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            style={{
              padding: '0.6rem',
              borderRadius: '0.75rem',
              color: 'var(--text-secondary)',
              background: showThemeMenu ? 'var(--glass)' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
            title="Change Theme"
          >
            <Palette size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        padding: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-primary)'
      }}>
        <AnimatePresence mode='wait'>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;
