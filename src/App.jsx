import React, { useState, useEffect, useRef } from 'react';
import { Mic, Home, BarChart2, LogIn, Palette, Check, Video, X, HelpCircle, LogOut, Mail, User, Users, Zap, Sparkles, Target, LineChart, Settings, ShieldCheck, UserPlus, ChevronDown } from 'lucide-react';

const GeometricBackground = ({ activeTab }) => {
  const randomizeShape = (shape) => ({
    ...shape,
    top: `${Math.floor(Math.random() * 90)}%`,
    left: `${Math.floor(Math.random() * 80)}%`,
    rotate: Math.floor(Math.random() * 360),
    size: shape.size * (0.6 + Math.random() * 0.8)
  });
  return (
    <>
      {/* Decorative Background - LEFT SIDE */}
      <div style={{ position: 'absolute', top: 0, left: '-200px', width: '350px', height: '100%', pointerEvents: 'none', zIndex: 0, opacity: 0.6, overflow: 'visible' }}>
        {React.useMemo(() => [
          { type: 'circle', color: '#38bdf8', size: 120, top: '2%', left: '10%' },
          { type: 'rectangle', color: '#a855f7', size: 140, top: '7%', left: '45%', rotate: -15 },
          { type: 'star', color: '#fbbf24', size: 100, top: '12%', left: '5%', rotate: 20 },
          { type: 'thick-line', color: '#f43f5e', size: 300, top: '18%', left: '-10%', rotate: 45 },
          { type: 'triangle', color: '#10b981', size: 100, top: '24%', left: '50%', rotate: -10 },
          { type: 'dots', color: '#94a3b8', size: 100, top: '30%', left: '25%' },
          { type: 'rhombus', color: '#6366f1', size: 90, top: '36%', left: '60%', rotate: 15 },
          { type: 'hexagon', color: '#f59e0b', size: 110, top: '42%', left: '15%', rotate: 10 },
          { type: 'trapezoid', color: '#06b6d4', size: 130, top: '48%', left: '40%', rotate: -5 },
          { type: 'diamond', color: '#ec4899', size: 95, top: '54%', left: '5%', rotate: 30 },
          { type: '3d-box', color: '#6366f1', size: 120, top: '60%', left: '55%', rotate: -10 },
          { type: 'ring', color: '#f43f5e', size: 150, top: '66%', left: '10%' },
          { type: 'pentagon', color: '#2563eb', size: 90, top: '72%', left: '45%', rotate: -25 },
          { type: 'star', color: '#10b981', size: 80, top: '78%', left: '15%', rotate: 45 },
          { type: 'thick-line', color: '#a855f7', size: 200, top: '84%', left: '50%', rotate: -30 },
          { type: 'square', color: '#06b6d4', size: 100, top: '90%', left: '10%', rotate: 40 },
          { type: 'circle', color: '#38bdf8', size: 140, top: '96%', left: '40%' },
        ].sort(() => 0.5 - Math.random()).slice(0, 10).map(randomizeShape), [activeTab]).map((shape, i) => (
          <motion.div
            key={`global-left-${i}`} initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0, y: 0, rotate: shape.rotate || 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ position: 'absolute', top: shape.top, left: shape.left, width: shape.size, height: shape.size }}
          >
            {shape.type === 'circle' && <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: shape.color, filter: 'blur(35px)', opacity: 0.2 }} />}
            {shape.type === 'rectangle' && <div style={{ width: '100%', height: '40%', background: `linear-gradient(135deg, ${shape.color}33, ${shape.color}88)`, borderRadius: '0.5rem', border: `1px solid ${shape.color}44` }} />}
            {shape.type === 'square' && <div style={{ width: '100%', height: '100%', background: `linear-gradient(135deg, ${shape.color}44, ${shape.color}aa)`, borderRadius: '1rem', border: `1px solid ${shape.color}44` }} />}
            {shape.type === 'triangle' && <svg width="100%" height="100%" viewBox="0 0 100 100"><path d="M50 0 L100 100 L0 100 Z" fill={shape.color} opacity="0.3" stroke={shape.color} strokeWidth="2" /></svg>}
            {shape.type === 'pentagon' && <svg width="100%" height="100%" viewBox="0 0 100 100"><path d="M50 0 L100 38 L81 100 L19 100 L0 38 Z" fill={shape.color} opacity="0.3" stroke={shape.color} strokeWidth="2" /></svg>}
            {shape.type === 'hexagon' && <svg width="100%" height="100%" viewBox="0 0 100 100"><path d="M25 0 L75 0 L100 50 L75 100 L25 100 L0 50 Z" fill={shape.color} opacity="0.3" stroke={shape.color} strokeWidth="2" /></svg>}
            {shape.type === 'star' && <svg width="100%" height="100%" viewBox="0 0 100 100"><path d="M50 0 L61 35 L98 35 L68 57 L79 91 L50 70 L21 91 L32 57 L2 35 L39 35 Z" fill={shape.color} opacity="0.3" stroke={shape.color} strokeWidth="2" /></svg>}
            {shape.type === 'rhombus' && <div style={{ width: '100%', height: '100%', background: shape.color, opacity: 0.25, clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', border: `1px solid ${shape.color}55` }} />}
            {shape.type === 'diamond' && <div style={{ width: '80%', height: '100%', margin: '0 10%', background: shape.color, opacity: 0.25, clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', border: `1px solid ${shape.color}55` }} />}
            {shape.type === 'trapezoid' && <div style={{ width: '100%', height: '80%', background: shape.color, opacity: 0.25, clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)', border: `1px solid ${shape.color}55` }} />}
            {shape.type === 'dots' && <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>{[...Array(12)].map((_, j) => (<div key={`dots-${i}-${j}`} style={{ width: '10px', height: '10px', borderRadius: '50%', background: shape.color, opacity: 0.4 }} />))}</div>}
            {shape.type === 'line' && <div style={{ width: '100%', height: '2px', background: `linear-gradient(to right, ${shape.color}00, ${shape.color}99, ${shape.color}00)` }} />}
            {shape.type === 'thick-line' && <div style={{ width: '100%', height: '6px', borderRadius: '3px', background: `linear-gradient(to right, ${shape.color}00, ${shape.color}aa, ${shape.color}00)` }} />}
            {shape.type === '3d-box' && <div style={{ width: '100%', height: '100%', background: shape.color, borderRadius: '0.75rem', transform: 'skewY(-10deg) rotate(15deg)', boxShadow: `15px 15px 25px -5px ${shape.color}44`, border: `1px solid ${shape.color}66`, opacity: 0.4 }} />}
            {shape.type === 'ring' && <div style={{ width: '100%', height: '100%', borderRadius: '50%', border: `4px solid ${shape.color}44`, boxSizing: 'border-box' }} />}
          </motion.div>
        ))}
      </div>

      {/* Decorative Background - RIGHT SIDE */}
      <div style={{ position: 'absolute', top: 0, right: '-200px', width: '350px', height: '100%', pointerEvents: 'none', zIndex: 0, opacity: 0.6, overflow: 'visible' }}>
        {React.useMemo(() => [
          { type: 'diamond', color: '#0ea5e9', size: 130, top: '4%', left: '20%', rotate: 15 },
          { type: 'star', color: '#8b5cf6', size: 110, top: '10%', left: '55%', rotate: -10 },
          { type: 'pentagon', color: '#10b981', size: 95, top: '16%', left: '10%', rotate: 25 },
          { type: 'thick-line', color: '#f59e0b', size: 250, top: '22%', left: '40%', rotate: -45 },
          { type: 'ring', color: '#ec4899', size: 140, top: '28%', left: '15%' },
          { type: 'rhombus', color: '#6366f1', size: 105, top: '34%', left: '60%', rotate: 15 },
          { type: 'dots', color: '#38bdf8', size: 120, top: '40%', left: '5%' },
          { type: 'hexagon', color: '#f43f5e', size: 125, top: '46%', left: '45%', rotate: -20 },
          { type: 'trapezoid', color: '#06b6d4', size: 115, top: '52%', left: '10%', rotate: 10 },
          { type: 'circle', color: '#a855f7', size: 150, top: '58%', left: '55%' },
          { type: 'star', color: '#fbbf24', size: 90, top: '64%', left: '25%', rotate: 35 },
          { type: 'thick-line', color: '#10b981', size: 280, top: '70%', left: '0%', rotate: 60 },
          { type: '3d-box', color: '#0ea5e9', size: 130, top: '76%', left: '50%', rotate: -15 },
          { type: 'square', color: '#ec4899', size: 110, top: '82%', left: '15%', rotate: 20 },
          { type: 'diamond', color: '#6366f1', size: 100, top: '88%', left: '60%', rotate: -10 },
          { type: 'ring', color: '#f59e0b', size: 120, top: '94%', left: '30%' },
        ].sort(() => 0.5 - Math.random()).slice(0, 10).map(randomizeShape), [activeTab]).map((shape, i) => (
          <motion.div
            key={`global-right-${i}`} initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0, y: 0, rotate: shape.rotate || 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ position: 'absolute', top: shape.top, left: shape.left, width: shape.size, height: shape.size }}
          >
            {shape.type === 'circle' && <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: shape.color, filter: 'blur(40px)', opacity: 0.2 }} />}
            {shape.type === 'rectangle' && <div style={{ width: '100%', height: '40%', background: `linear-gradient(135deg, ${shape.color}33, ${shape.color}88)`, borderRadius: '0.5rem', border: `1px solid ${shape.color}44` }} />}
            {shape.type === 'square' && <div style={{ width: '100%', height: '100%', background: `linear-gradient(135deg, ${shape.color}44, ${shape.color}aa)`, borderRadius: '1rem', border: `1px solid ${shape.color}44` }} />}
            {shape.type === 'triangle' && <svg width="100%" height="100%" viewBox="0 0 100 100"><path d="M50 0 L100 100 L0 100 Z" fill={shape.color} opacity="0.3" stroke={shape.color} strokeWidth="2" /></svg>}
            {shape.type === 'pentagon' && <svg width="100%" height="100%" viewBox="0 0 100 100"><path d="M50 0 L100 38 L81 100 L19 100 L0 38 Z" fill={shape.color} opacity="0.3" stroke={shape.color} strokeWidth="2" /></svg>}
            {shape.type === 'hexagon' && <svg width="100%" height="100%" viewBox="0 0 100 100"><path d="M25 0 L75 0 L100 50 L75 100 L25 100 L0 50 Z" fill={shape.color} opacity="0.3" stroke={shape.color} strokeWidth="2" /></svg>}
            {shape.type === 'star' && <svg width="100%" height="100%" viewBox="0 0 100 100"><path d="M50 0 L61 35 L98 35 L68 57 L79 91 L50 70 L21 91 L32 57 L2 35 L39 35 Z" fill={shape.color} opacity="0.3" stroke={shape.color} strokeWidth="2" /></svg>}
            {shape.type === 'rhombus' && <div style={{ width: '100%', height: '100%', background: shape.color, opacity: 0.25, clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', border: `1px solid ${shape.color}55` }} />}
            {shape.type === 'diamond' && <div style={{ width: '80%', height: '100%', margin: '0 10%', background: shape.color, opacity: 0.25, clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', border: `1px solid ${shape.color}55` }} />}
            {shape.type === 'trapezoid' && <div style={{ width: '100%', height: '80%', background: shape.color, opacity: 0.25, clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)', border: `1px solid ${shape.color}55` }} />}
            {shape.type === 'dots' && <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>{[...Array(12)].map((_, j) => (<div key={`dots-right-${i}-${j}`} style={{ width: '14px', height: '14px', borderRadius: '50%', background: shape.color, opacity: 0.5 }} />))}</div>}
            {shape.type === 'line' && <div style={{ width: '100%', height: '2px', background: `linear-gradient(to right, ${shape.color}00, ${shape.color}99, ${shape.color}00)` }} />}
            {shape.type === 'thick-line' && <div style={{ width: '100%', height: '8px', borderRadius: '4px', background: `linear-gradient(to right, ${shape.color}00, ${shape.color}bb, ${shape.color}00)` }} />}
            {shape.type === '3d-box' && <div style={{ width: '100%', height: '100%', background: shape.color, borderRadius: '0.75rem', transform: 'skewY(10deg) rotate(-15deg)', boxShadow: `-15px 15px 25px -5px ${shape.color}44`, border: `1px solid ${shape.color}66`, opacity: 0.4 }} />}
            {shape.type === 'ring' && <div style={{ width: '100%', height: '100%', borderRadius: '50%', border: `4px solid ${shape.color}44`, boxSizing: 'border-box' }} />}
          </motion.div>
        ))}
      </div>
    </>
  );
};

import AuthForm from './components/AuthForm';
import AnalyzeVideo from './components/AnalyzeVideo';
import SpeechInputWrapper from './components/SpeechInputWrapper';
import Profile from './components/Profile';
import CheckoutForm from './components/CheckoutForm';
import ClassSetup from './components/ClassSetup';
import AdminTools from './components/AdminTools';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL, STRIPE_PUBLISHABLE_KEY } from './config';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [currentTheme, setCurrentTheme] = useState('light'); // Default theme
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [subscriptionId, setSubscriptionId] = useState('');
  const [subscription, setSubscription] = useState(null);
  const [demoTick, setDemoTick] = useState(0);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const [barColor, setBarColor] = useState('#ef4444');

  useEffect(() => {
    const handleUpdate = () => setDemoTick(t => t + 1);
    window.addEventListener('update-home', handleUpdate);
    return () => window.removeEventListener('update-home', handleUpdate);
  }, []);

  const themes = [
    { id: 'midnight', name: 'Midnight', color: '#0f172a' },
    { id: 'light', name: 'Light', color: '#f8fafc' },
    { id: 'forest', name: 'Forest', color: '#052e16' },
    { id: 'cyber', name: 'Cyber', color: '#09090b' },
    { id: 'sunset', name: 'Sunset', color: '#451a03' },
    { id: 'retro', name: 'Retro', color: '#2e0249' },
    { id: 'lavender', name: 'Lavender', color: '#ede9fe' },
    { id: 'ocean', name: 'Ocean', color: '#0c4a6e' },
    { id: 'mocha', name: 'Mocha', color: '#3f2e3e' },
    { id: 'neon', name: 'Neon', color: '#00ff41' },
  ];

  // Load User from LocalStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('speechUser');
    let isUserLoggedIn = false;
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
      isUserLoggedIn = true;
    }

    // Handle Deep Linking
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    const action = params.get('action');

    if (action === 'reset-password') {
      setActiveTab('signup');
    } else if (path === '/price-plan') {
      setActiveTab('price-plan');
    } else if (path === '/practice') {
      setActiveTab(isUserLoggedIn ? 'practice' : 'signup');
    } else if (path === '/analyze') {
      setActiveTab(isUserLoggedIn ? 'analyze' : 'signup');
    } else if (path === '/profile') {
      setActiveTab(isUserLoggedIn ? 'profile' : 'signup');
    } else if (path === '/faq') {
      setActiveTab('faq');
    } else if (path === '/contact') {
      setActiveTab('contact');
    } else if (path === '/class-setup') {
      setActiveTab(isUserLoggedIn ? 'class-setup' : 'signup');
    } else if (path === '/admin-tools') {
      setActiveTab(isUserLoggedIn ? 'admin-tools' : 'signup');
    } else if (path === '/signup' || path === '/login') {
      setActiveTab('signup');
    }
  }, []);

  const fetchProfile = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`${API_BASE_URL}/get-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });
      const data = await res.json();
      if (res.ok) {
        setSubscription(data.subscription);
        // Sync user role and other data from backend
        if (data.user) {
          const updatedUser = { ...data.user, id: data.user.userId };
          setUser(updatedUser);
          localStorage.setItem('speechUser', JSON.stringify(updatedUser));
        }
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  // Keep a ref to user.id so fetchProfile doesn't re-trigger on user object change
  const userIdRef = useRef(user?.id);
  useEffect(() => { userIdRef.current = user?.id; }, [user?.id]);

  // Fetch Profile on login or when entering practice/profile/price-plan tab
  useEffect(() => {
    if (isAuthenticated && userIdRef.current && (activeTab === 'practice' || activeTab === 'profile' || activeTab === 'price-plan')) {
      fetchProfile();
    }
  }, [isAuthenticated, activeTab]);

  // Sync Tab to URL + Change Bar Color
  useEffect(() => {
    // Select Random Color for Sidebar
    const sideColors = ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#06b6d4', '#f97316', '#a16207', '#6b7280'];
    setBarColor(sideColors[Math.floor(Math.random() * sideColors.length)]);

    if (activeTab === 'home') {
      if (window.location.pathname !== '/' && window.location.pathname !== '/payment-success') {
        window.history.pushState({}, '', '/' + window.location.search);
      }
    } else {
      if (window.location.pathname !== `/${activeTab}`) {
        window.history.pushState({}, '', `/${activeTab}${window.location.search}`);
      }
    }
  }, [activeTab]);

  useEffect(() => {
    // Apply theme class to body
    document.body.className = ''; // clear existing
    if (currentTheme !== 'midnight') {
      document.body.classList.add(`theme-${currentTheme}`);
    }
  }, [currentTheme]);

  // Handle Payment Success Redirect
  useEffect(() => {
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    const subId = params.get('subscription_id');
    const userId = params.get('user_id');

    if (path === '/payment-success' && userId) {
      if (sessionId) verifyPayment({ sessionId, userId });
      else if (subId) verifyPayment({ subscriptionId: subId, userId });
    }
  }, []);

  const verifyPayment = async (payload) => {
    try {
      // Inform user
      // alert('Verifying payment...');
      const res = await fetch(`${API_BASE_URL}/verify-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.status === 'active') {
        alert('Payment Successful! Subscription Active.');
        // Reset URL to clean checks
        window.history.replaceState({}, document.title, '/');
        // Ensure user is set (might be null if reload happened)
        // If user is null, we might need to rely on stored token or re-login.
        // Ideally, we store user in localStorage? 
        // For now, assuming user session persists or we handle it gracefully.
        // If user is null, we can't show profile properly.
        // We should probably redirect to login or show generic message.
        // But let's set active tab to profile if possible.
        if (user) {
          setActiveTab('profile');
        } else {
          // If reloading lost state, maybe redirect to home?
          // Or try to re-hydrate user?
          setActiveTab('signup');
        }
      } else {
        alert('Payment verification failed or pending.');
      }
    } catch (err) {
      console.error(err);
      alert('Error verifying payment.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('speechUser');
    setIsAuthenticated(false);
    setUser(null);
    setActiveTab('home');
    alert("Logged out successfully");
  };

  const handleBuyPlan = async () => {
    if (!user) {
      alert("Please sign in or sign up first to buy a plan.");
      setActiveTab('signup');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id || user.userId,
          email: user.email
        })
      });

      const data = await res.json();
      if (res.ok && data.clientSecret) {
        setClientSecret(data.clientSecret);
        if (data.subscriptionId) setSubscriptionId(data.subscriptionId);
      } else {
        alert('Failed to initiate payment: ' + (data.message || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
      alert('Error initiating payment.');
    }
  };

  const handleCancelSubscription = async () => {
    if (!window.confirm("Are you sure you want to cancel your Pro subscription?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/cancel-subscription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id || user.userId })
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Subscription cancelled successfully.");
        fetchProfile(); // Refresh subscription state
      } else {
        alert("Failed to cancel subscription: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Error cancelling subscription.");
    }
  };

  const handleReactivateSubscription = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/reactivate-subscription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id || user.userId })
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Subscription reactivated successfully!");
        fetchProfile(); // Refresh subscription state
      } else {
        alert("Failed to reactivate: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Error reactivating subscription.");
    }
  };

  const handlePaymentSuccess = (paymentIntent) => {
    // Call Verify Endpoint
    if (user && subscriptionId) {
      verifyPayment({ subscriptionId, userId: user.id || user.userId });
    } else {
      alert("Payment Succeeded but User/Subscription info missing.");
    }
    setClientSecret('');
    // Ideally refresh user profile here
    setActiveTab('profile');
  };

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    ...(isAuthenticated
      ? [
        ...(user?.role === 'instructor' ? [{ id: 'class-setup', label: 'Class Setup', icon: Settings }] : []),
        ...(user?.role === 'super_admin' ? [{
          id: 'admin-tools',
          label: 'Admin Tools',
          icon: ShieldCheck,
          subItems: [
            { id: 'setup-instructor', label: 'Setup Instructor', icon: UserPlus },
            { id: 'master-evaluation', label: 'Master Evaluation', icon: Settings },
            { id: 'user-management', label: 'User Management', icon: Users }
          ]
        }] : []),
        { id: 'practice', label: 'Your Speech', icon: Video },
        { id: 'analyze', label: 'Analyze Speech', icon: BarChart2 },
      ]
      : [{ id: 'signup', label: 'Sign In', icon: LogIn }]
    ),
    ...(user?.role !== 'student' ? [{ id: 'price-plan', label: 'Price Plan', icon: Check }] : []),
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'contact', label: 'Contact Us', icon: Mail },
    ...(isAuthenticated ? [{ id: 'logout', label: '', icon: LogOut, tooltip: 'Logout' }] : []),
  ];

  const renderContent = () => {
    const isPro = (subscription?.subscription_plan === 'Pro' || subscription?.plan === 'pro') &&
      (!subscription.sub_end_date || new Date(subscription.sub_end_date) > new Date());

    switch (activeTab) {
      case 'practice':
        const freeLimitReached = !isPro && subscription?.num_valuations >= 5;
        const proLimitReached = isPro && subscription?.num_valuations >= 25;

        if (freeLimitReached || proLimitReached) {
          return (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', borderRadius: '1.5rem', maxWidth: '600px', margin: '0 auto' }}>
              <h2 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Limit Reached</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2rem' }}>
                {freeLimitReached
                  ? "You have reached your limit of 5 free speech evaluations. Please upgrade to the Pro Plan to continue."
                  : "You have reached your Pro limit of 25 speech evaluations for this month. Your limit will reset on your next billing cycle."
                }
              </p>
              <button
                onClick={() => setActiveTab('price-plan')}
                style={{
                  padding: '1rem 2.5rem',
                  background: 'var(--accent-gradient)',
                  color: 'white',
                  borderRadius: '2rem',
                  fontWeight: '700',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-glow)'
                }}
              >
                {freeLimitReached ? "Go to Price Plan" : "View Plan Status"}
              </button>
            </div>
          );
        }
        return <SpeechInputWrapper user={user} onUploadSuccess={() => setActiveTab('analyze')} />;
      case 'analyze':
        return <AnalyzeVideo user={user} />;
      case 'signup':
        return <AuthForm onLoginSuccess={(userData) => {
          localStorage.setItem('speechUser', JSON.stringify(userData));
          setIsAuthenticated(true);
          setUser(userData);
          setActiveTab('home');
        }} />;
      case 'class-setup':
        return <ClassSetup user={user} />;
      case 'admin-tools':
      case 'setup-instructor':
      case 'master-evaluation':
      case 'user-management':
        return <AdminTools user={user} activeSubTab={activeTab === 'admin-tools' ? 'setup-instructor' : activeTab} />;
      case 'profile':
        return <Profile user={user} refreshAppProfile={fetchProfile} />;
      case 'faq':
        return <FAQ />;
      case 'contact':
        return <Contact />;
      case 'home':
        return (
          <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: '3rem', paddingBottom: '5rem' }}>

            {/* HER0 SECTION */}
            <div className="glass-panel" style={{
              width: '100%',
              zIndex: 1,
              padding: '2.5rem 2rem',
              textAlign: 'center',
              borderRadius: '2rem',
              background: 'var(--glass)',
              border: '1px solid var(--glass-border)',
              position: 'relative',
              overflow: 'visible',
              flexShrink: 0
            }}>
              {/* Decorative background glow */}
              <div style={{
                position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)',
                width: '60%', height: '40%', background: 'var(--accent-primary)',
                filter: 'blur(120px)', opacity: 0.1, pointerEvents: 'none'
              }} />

              <h1 style={{
                fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '1rem',
                letterSpacing: '-2px', lineHeight: '1.1', fontWeight: '900', color: 'var(--text-primary)'
              }}>
                Master the Art of <br />
                <span className="gradient-text">Public Speaking</span>
              </h1>

              <p style={{
                color: 'var(--text-secondary)', fontSize: '1.25rem', lineHeight: '1.6',
                marginBottom: '3rem', maxWidth: '700px', marginInline: 'auto', fontWeight: '400'
              }}>
                Join thousands of professionals using <strong style={{ color: 'var(--text-primary)' }}>Practice Your Speech</strong> to conquer stage fright and deliver high-impact presentations with real-time AI feedback.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem', position: 'relative' }}>
                {[
                  { icon: Video, title: '1. Record', desc: 'Securely upload your video or record live' },
                  { icon: Zap, title: '2. Transcribe', desc: 'High-accuracy speech-to-text processing' },
                  { icon: Sparkles, title: '3. Smart Insight', desc: 'Instant Analysis' },
                  { icon: BarChart2, title: '4. Metrics', desc: 'Get WPM, fillers, and sentiment data' },
                  { icon: Check, title: '5. Refine', desc: 'Apply feedback and master your speech' }
                ].map((step, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '56px', height: '56px', borderRadius: '1rem',
                      background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--accent-primary)', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)'
                    }}>
                      <step.icon size={24} />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <h4 style={{ margin: '0 0 0.15rem 0', fontWeight: '700', fontSize: '1rem' }}>{step.title}</h4>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.3' }}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ADVANCED CAPABILITIES SECTION */}
            <div className="glass-panel" style={{
              width: '100%', zIndex: 1, padding: '3.5rem 2.5rem', borderRadius: '2rem',
              background: 'var(--glass)', border: '1px solid var(--glass-border)',
              position: 'relative', overflow: 'visible', textAlign: 'left'
            }}>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem', fontWeight: '800', textAlign: 'center', letterSpacing: '-1px' }}>
                Advanced <span className="gradient-text">Capabilities</span>
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                {[
                  { title: 'Emotional Intelligence', desc: 'Our Speech Analysis Engine maps eyes, mouth, and brow movements to detect subtle sentiment shifts.', icon: Sparkles, tint: '#a855f7' },
                  { title: 'Delivery Dynamics', desc: 'Real-time WPM (Words Per Minute) tracking and meaningful pause analysis for better rhythm.', icon: Zap, tint: '#0ea5e9' },
                  { title: 'Instant Transcription', desc: 'High-fidelity speech-to-text processing that captures every nuance of your delivery for audit.', icon: Video, tint: '#10b981' },
                  { title: 'Content Evolution', desc: 'Compare your intro, body, and conclusion scores to see where your structure needs punch.', icon: BarChart2, tint: '#f59e0b' },
                  { title: 'Visual Confidence', desc: 'Deep posture and eye-contact analysis to ensure you hold the room with professional poise.', icon: Target, tint: '#ec4899' },
                  { title: 'Filler Elimination', desc: 'Automated detection of "um", "ah", and "like" patterns with strategy-based coaching.', icon: Mic, tint: '#6366f1' },
                  { title: 'Vocabulary Builder', desc: 'AI suggestions to replace repetitive words with sophisticated, high-impact alternatives.', icon: Palette, tint: '#f43f5e' },
                  { title: 'Rhetorical Analysis', desc: 'AI identifies metaphors, triadic structures, and parallelism to elevate your sophisticated word choice.', icon: Zap, tint: '#06b6d4' },
                  { title: 'Grammar & Breath-ability', desc: 'Deep syntax analysis identifies run-on sentences that hinder your vocal clarity and audience retention.', icon: Check, tint: '#8b5cf6' },
                  { title: 'Progress Tracking', desc: 'Interactive charts track your improvement across pacing, confidence, and structure over time.', icon: LineChart, tint: '#10b981' },
                  { title: 'Secure Privacy', desc: 'Enterprise-grade encryption ensures your practice videos and reports are for your eyes only.', icon: Home, tint: '#64748b' },
                  { title: 'Actionable Improv', desc: 'Receive "Rewritten Passages" suggestions that transform your rough drafts into world-class scripts.', icon: Zap, tint: '#f43f5e' }
                ].map((feature, idx) => (
                  <div key={idx} style={{
                    padding: '2rem',
                    background: `linear-gradient(135deg, rgba(255,255,255,0.03) 0%, ${feature.tint}08 100%)`,
                    borderRadius: '1.5rem', border: `1px solid ${feature.tint}20`,
                    transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden'
                  }} className="feature-card">
                    <div style={{
                      position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px',
                      background: feature.tint, filter: 'blur(50px)', opacity: 0.15
                    }} />
                    <div style={{ color: feature.tint, marginBottom: '1rem' }}><feature.icon size={32} /></div>
                    <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '1.25rem', fontWeight: '700' }}>{feature.title}</h3>
                    <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA SECTION */}
            <div style={{ width: '100%', padding: '2rem 0', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
              <button
                onClick={() => setActiveTab(isAuthenticated ? 'practice' : 'signup')}
                style={{
                  padding: '1.25rem 4rem', background: 'var(--accent-gradient)', color: 'white',
                  borderRadius: '3rem', fontWeight: '800', fontSize: '1.25rem', boxShadow: 'var(--shadow-glow)',
                  border: 'none', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05) translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 15px 30px rgba(56, 189, 248, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1) translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
                }}
              >
                {isAuthenticated ? 'Start Analyzing Your Speech' : 'Create Free Account'}
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <Check size={16} color="var(--success)" /> 5 evaluations included free
                <span style={{ margin: '0 0.5rem', opacity: 0.3 }}>|</span>
                <Check size={16} color="var(--success)" /> No installation required
              </div>
            </div>
          </div>
        );

      case 'price-plan': {
        return (
          <div className="glass-panel" style={{
            padding: '3rem',
            textAlign: 'center',
            borderRadius: '1.5rem',
            maxWidth: '1000px',
            margin: '0 auto',
            border: '1px solid var(--glass-border)',
            background: 'var(--glass)'
          }}>
            <h2 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '3rem' }}>Choose Your Plan</h2>
            {!isPro && subscription?.num_valuations >= 5 && (
              <p style={{
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                padding: '1rem',
                borderRadius: '0.5rem',
                marginBottom: '2rem',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                fontWeight: '600'
              }}>
                You've used all 5 free speeches. Upgrade to Pro to unlock unlimited analysis!
              </p>
            )}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '2rem',
              justifyContent: 'center',
              alignItems: 'stretch'
            }}>


              {/* Free Plan - Only show if not on an active renewing Pro plan */}
              {!(isPro && subscription?.renewal !== false) && (
                <div style={{
                  padding: '2rem',
                  borderRadius: '1rem',
                  background: 'var(--glass)',
                  border: '3px solid #ef4444',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  width: '320px',
                  transition: 'transform 0.3s ease',
                  position: 'relative',
                  boxShadow: '0 0 15px rgba(239, 68, 68, 0.3)'
                }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{
                    position: 'absolute',
                    top: '-12px',
                    background: '#ef4444',
                    color: 'white',
                    padding: '0.2rem 1rem',
                    borderRadius: '1rem',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>YOUR PLAN</div>
                  <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Free Plan</h3>
                  <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '1rem' }}>Free</div>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Your first 5 speech evaluations are free</p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', width: '100%', textAlign: 'left' }}>
                    <li style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Check size={16} color="var(--accent-primary)" /> 5 Free Speech Evaluations
                    </li>
                    <li style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Check size={16} color="var(--accent-primary)" /> Basic AI Analysis
                    </li>
                    <li style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Check size={16} color="var(--accent-primary)" /> Email Support
                    </li>
                  </ul>
                  {isAuthenticated ? (
                    <div style={{
                      padding: '0.8rem 2rem',
                      color: !isPro ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      fontWeight: '700',
                      fontSize: '1.1rem',
                    }}>
                      {!isPro ? 'Current Plan' : 'Free Tier'}
                    </div>
                  ) : (
                    <button
                      onClick={() => setActiveTab('signup')}
                      style={{
                        padding: '0.8rem 2rem',
                        background: 'var(--glass)',
                        color: 'var(--text-primary)',
                        borderRadius: '2rem',
                        border: '1px solid var(--accent-primary)',
                        cursor: 'pointer',
                        fontWeight: '600',
                        width: '100%',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = 'var(--accent-primary)';
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = 'var(--glass)';
                        e.currentTarget.style.color = 'var(--text-primary)';
                      }}
                    >
                      Get Started
                    </button>
                  )}
                </div>
              )}

              {/* Pro Plan */}
              <div style={{
                padding: '2rem',
                borderRadius: '1rem',
                background: 'var(--glass)',
                border: '2px solid var(--accent-primary)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                position: 'relative',
                boxShadow: 'var(--shadow-glow)',
                width: '320px',
                transition: 'transform 0.3s ease'
              }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  background: 'var(--accent-primary)',
                  color: 'white',
                  padding: '0.2rem 1rem',
                  borderRadius: '1rem',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>RECOMMENDED</div>
                <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Pro Plan</h3>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent-primary)', marginBottom: '0.2rem' }}>$7<span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>/month</span></div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>(incl sales tax + card fee)</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', width: '100%', textAlign: 'left' }}>
                  <li style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Check size={16} color="var(--accent-primary)" /> 25 Speech Evaluations / Month
                  </li>
                  <li style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Check size={16} color="var(--accent-primary)" /> Advanced AI Analysis
                  </li>
                  <li style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Check size={16} color="var(--accent-primary)" /> Priority Support
                  </li>
                  <li style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Check size={16} color="var(--accent-primary)" /> Early Access to New Features
                  </li>
                </ul>
                {(isPro && (subscription?.renewal !== false)) ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
                    <div style={{
                      padding: '0.8rem 2rem',
                      color: 'var(--accent-primary)',
                      fontWeight: '700',
                      fontSize: '1.1rem',
                      textAlign: 'center'
                    }}>
                      Already Subscribed
                    </div>
                    <button
                      onClick={handleCancelSubscription}
                      style={{
                        padding: '0.6rem 1.5rem',
                        background: 'transparent',
                        color: '#ef4444',
                        borderRadius: '2rem',
                        border: '1px solid #ef4444',
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
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#ef4444';
                      }}
                    >
                      Cancel Subscription
                    </button>
                  </div>
                ) : (isPro && subscription?.renewal === false) ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', alignItems: 'center' }}>
                    <div style={{
                      padding: '0.8rem 2rem',
                      color: 'var(--accent-primary)',
                      fontWeight: '700',
                      fontSize: '1.1rem',
                      textAlign: 'center'
                    }}>
                      Subscription Ending
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      Expires on: {subscription?.sub_end_date ? new Date(subscription.sub_end_date).toLocaleDateString() : 'N/A'}
                    </div>
                    <button
                      onClick={handleReactivateSubscription}
                      style={{
                        padding: '0.8rem 2.5rem',
                        background: 'var(--accent-gradient)',
                        color: 'white',
                        borderRadius: '2rem',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: '600',
                        width: 'auto',
                        boxShadow: 'var(--shadow-glow)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      Renew Subscription
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleBuyPlan}
                    style={{
                      padding: '0.8rem 2.5rem',
                      background: 'var(--accent-gradient)',
                      color: 'white',
                      borderRadius: '2rem',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: '600',
                      width: 'auto',
                      boxShadow: 'var(--shadow-glow)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    Buy Pro Plan
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      }
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
      {/* Persistent Left/Right Vertical Colored Bars */}
      <div style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: '16px', zIndex: 9999, background: barColor, boxShadow: `2px 0 10px ${barColor}99`, transition: 'background-color 0.5s ease, box-shadow 0.5s ease' }} />
      <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '16px', zIndex: 9999, background: barColor, boxShadow: `-2px 0 10px ${barColor}99`, transition: 'background-color 0.5s ease, box-shadow 0.5s ease' }} />

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
              Practice Your <span style={{ color: 'var(--accent-primary)', WebkitTextFillColor: 'initial' }}>Speech</span>
            </h1>
            {isAuthenticated && user?.name && (
              <button
                onClick={() => setActiveTab('profile')}
                style={{
                  fontSize: '1rem', fontWeight: 600, color: 'var(--text-secondary)', marginTop: '0.25rem',
                  background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0,
                  opacity: 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  transition: 'color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
              >
                Welcome, <span style={{ color: 'var(--accent-primary)', marginLeft: '4px', textDecoration: 'underline' }}>{user.name}</span>
              </button>
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
              <div
                key={item.id}
                style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
              >
                <button
                  onClick={() => {
                    if (item.id === 'logout') {
                      handleLogout();
                    } else if (item.subItems) {
                      setOpenMenu(openMenu === item.id ? null : item.id);
                    } else {
                      setActiveTab(item.id);
                      setOpenMenu(null);
                    }
                  }}
                  style={{
                    padding: '0.6rem 1.2rem',
                    borderRadius: '0.75rem',
                    color: (activeTab === item.id || (item.subItems && item.subItems.some(si => si.id === activeTab))) ? 'var(--text-primary)' : 'var(--text-secondary)',
                    background: (activeTab === item.id || (item.subItems && item.subItems.some(si => si.id === activeTab))) ? 'var(--glass)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontWeight: (activeTab === item.id || (item.subItems && item.subItems.some(si => si.id === activeTab))) ? '600' : '400',
                    transition: 'all 0.3s ease',
                    border: (activeTab === item.id || (item.subItems && item.subItems.some(si => si.id === activeTab))) ? '1px solid var(--glass-border)' : '1px solid transparent'
                  }}
                  title={item.tooltip || item.label}
                >
                  <item.icon size={18} />
                  {item.label}
                  {item.subItems && (
                    <ChevronDown
                      size={14}
                      style={{
                        marginLeft: '0.25rem',
                        opacity: 0.7,
                        transform: openMenu === item.id ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s ease'
                      }}
                    />
                  )}
                </button>

                {/* Vertical Stacked Dropdown - Click Activated */}
                {openMenu === item.id && item.subItems && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      marginTop: '0.5rem',
                      minWidth: '220px',
                      background: 'var(--bg-secondary)',
                      borderRadius: '1rem',
                      padding: '0.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.25rem',
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
                      border: '1px solid var(--glass-border)',
                      zIndex: 100
                    }}
                  >
                    {item.subItems.map(subItem => (
                      <button
                        key={subItem.id}
                        onClick={() => {
                          setActiveTab(subItem.id);
                          setOpenMenu(null);
                        }}
                        style={{
                          padding: '0.8rem 1rem',
                          borderRadius: '0.75rem',
                          fontSize: '0.9rem',
                          color: activeTab === subItem.id ? 'var(--accent-primary)' : 'var(--text-primary)',
                          background: activeTab === subItem.id ? 'rgba(255,255,255,0.05)' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-start',
                          gap: '0.75rem',
                          fontWeight: activeTab === subItem.id ? '700' : '400',
                          transition: 'all 0.2s',
                          width: '100%'
                        }}
                      >
                        <subItem.icon size={16} />
                        {subItem.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}
          </nav>

          <div style={{ width: '1px', height: '24px', background: 'var(--glass-border)', margin: '0 0.5rem' }}></div>

          {/* User Profile Hook */}
          {isAuthenticated && (
            <button
              onClick={() => setActiveTab('profile')}
              style={{
                padding: '0.6rem 1.2rem',
                borderRadius: '0.75rem',
                color: activeTab === 'profile' ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: activeTab === 'profile' ? 'var(--glass)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: activeTab === 'profile' ? '600' : '400',
                transition: 'all 0.3s ease',
                border: activeTab === 'profile' ? '1px solid var(--glass-border)' : '1px solid transparent'
              }}
              title="Profile"
            >
              <User size={18} />
              Profile
            </button>
          )}

          {/* Theme Toggle Button Hidden (requested by user) */}
          {/* 
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
          */}
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        flex: 1,
        position: 'relative',
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: '0.5rem 2rem 2rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        color: 'var(--text-primary)'
      }}>
        <GeometricBackground activeTab={activeTab} />
        <AnimatePresence mode='wait'>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{ width: '100%', minHeight: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', marginBottom: '2rem' }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Payment Modal */}
      {clientSecret && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div className="glass-panel" style={{
            width: '100%', maxWidth: '500px', padding: '2rem',
            background: 'var(--bg-primary)', borderRadius: '1rem', position: 'relative'
          }}>
            <button
              onClick={() => setClientSecret('')}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>
            <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', marginTop: 0 }}>Complete Payment</h2>

            {/* Elements Provider */}
            <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night' } }}>
              <CheckoutForm onSuccess={handlePaymentSuccess} subscriptionId={subscriptionId} userId={user?.id || user?.userId} />
            </Elements>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
