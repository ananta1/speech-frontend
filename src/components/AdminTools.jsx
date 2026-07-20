import React, { useState, useEffect } from 'react';
import { UserPlus, Shield, CheckCircle, AlertCircle, Loader2, Mail, Save, Plus, Trash2, Edit3, ClipboardList, X, MessageSquare, ChevronDown, ChevronUp, Clock, Search, Sparkles, RefreshCcw, Activity, Globe, Eye, TrendingUp } from 'lucide-react';
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

    // ── Email Coach State ──
    const defaultEmailBody = `Hi Coach

I love the work you're doing with your school's debate and speaking courses.
I'm the creator of https://practiceyourspeech.com, a platform designed to act as 'additional help' for your students. 
We allow coaches to create classes where students can practice on camera and get immediate AI feedback on their delivery mechanics (pacing, filler words, etc.) before they even step into your classroom.
I'm looking for expert coaches to pilot the platform with their students for free in exchange for feedback to help us improve.
Would you be open to a quick chat to see if this could be useful for your team this season?

Feel free to drop us a message anytime at https://practiceyourspeech.com/contact

-Practice your Speech team`;
    const [coachEmail, setCoachEmail] = useState('');
    const [emailSubject, setEmailSubject] = useState('Partnership with PracticeYourSpeech');
    const [emailBody, setEmailBody] = useState(defaultEmailBody);
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const [emailMsg, setEmailMsg] = useState({ text: '', type: '' });

    // ── Messages State ──
    const [contactMessages, setContactMessages] = useState([]);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [messagesMsg, setMessagesMsg] = useState({ text: '', type: '' });
    const [expandedMessageId, setExpandedMessageId] = useState(null);
    const [messagesSearch, setMessagesSearch] = useState('');

    // ── Coach Communications State ──
    const [coachComms, setCoachComms] = useState([]);
    const [isLoadingComms, setIsLoadingComms] = useState(false);
    const [commsMsg, setCommsMsg] = useState({ text: '', type: '' });
    const [commsSearch, setCommsSearch] = useState('');
    const [expandedCommId, setExpandedCommId] = useState(null);

    // ── Impromptu Topics State ──
    const [topics, setTopics] = useState([]);
    const [isLoadingTopics, setIsLoadingTopics] = useState(false);
    const [topicsMsg, setTopicsMsg] = useState({ text: '', type: '' });
    const [newTopicText, setNewTopicText] = useState('');
    const [numGenerate, setNumGenerate] = useState(5);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isAddingTopic, setIsAddingTopic] = useState(false);
    const [deletingTopicId, setDeletingTopicId] = useState(null);

    // ── Traffic Monitoring State ──
    const [trafficData, setTrafficData] = useState({ visitors: [], totalVisits: 0, uniqueVisitors: 0 });
    const [isLoadingTraffic, setIsLoadingTraffic] = useState(false);
    const [trafficMsg, setTrafficMsg] = useState({ text: '', type: '' });
    const [trafficSearch, setTrafficSearch] = useState('');

    // Fetch data when switching tabs
    useEffect(() => {
        if (activeSubTab === 'traffic-monitoring' && trafficData.visitors.length === 0) {
            fetchTrafficData();
        }
        if (activeSubTab === 'master-evaluation' && !criteria) {
            fetchMasterCriteria();
        }
        if (activeSubTab === 'user-management' && usersList.length === 0) {
            fetchUsersList();
        }
        if (activeSubTab === 'messages' && contactMessages.length === 0) {
            fetchContactMessages();
        }
        if (activeSubTab === 'email-history' && coachComms.length === 0) {
            fetchCoachCommunications();
        }
        if (activeSubTab === 'impromptu-management' && topics.length === 0) {
            fetchTopicsList();
        }
    }, [activeSubTab]);

    const fetchTrafficData = async () => {
        setIsLoadingTraffic(true);
        setTrafficMsg({ text: '', type: '' });
        try {
            const res = await fetch(`${API_BASE_URL}/get-visitors`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ adminId: user.id || user.userId })
            });
            const data = await res.json();
            if (res.ok) {
                setTrafficData({
                    visitors: data.visitors || [],
                    totalVisits: data.totalVisits || 0,
                    uniqueVisitors: data.uniqueVisitors || 0
                });
            } else {
                setTrafficMsg({ text: data.message || 'Failed to fetch traffic logs', type: 'error' });
            }
        } catch (err) {
            console.error("Traffic fetch error:", err);
            setTrafficMsg({ text: 'Network error fetching traffic logs', type: 'error' });
        } finally {
            setIsLoadingTraffic(false);
        }
    };

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

    const fetchContactMessages = async () => {
        setIsLoadingMessages(true);
        setMessagesMsg({ text: '', type: '' });
        try {
            const res = await fetch(`${API_BASE_URL}/get-contact-messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ adminId: user.id || user.userId })
            });
            const data = await res.json();
            if (res.ok) {
                setContactMessages(data.messages || []);
            } else {
                setMessagesMsg({ text: data.message || 'Failed to load messages.', type: 'error' });
            }
        } catch (err) {
            setMessagesMsg({ text: 'Connection error.', type: 'error' });
        } finally {
            setIsLoadingMessages(false);
        }
    };

    const fetchCoachCommunications = async () => {
        setIsLoadingComms(true);
        setCommsMsg({ text: '', type: '' });
        try {
            const res = await fetch(`${API_BASE_URL}/get-coach-communications`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ adminId: user.id || user.userId })
            });
            const data = await res.json();
            if (res.ok) {
                setCoachComms(data.communications || []);
            } else {
                setCommsMsg({ text: data.message || 'Failed to load email history.', type: 'error' });
            }
        } catch (err) {
            setCommsMsg({ text: 'Connection error.', type: 'error' });
        } finally {
            setIsLoadingComms(false);
        }
    };

    const fetchTopicsList = async () => {
        setIsLoadingTopics(true);
        setTopicsMsg({ text: '', type: '' });
        try {
            const res = await fetch(`${API_BASE_URL}/list-impromptu-topics`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            });
            const data = await res.json();
            if (res.ok) {
                setTopics(data.topics || []);
            } else {
                setTopicsMsg({ text: data.message || 'Failed to load topics.', type: 'error' });
            }
        } catch (err) {
            setTopicsMsg({ text: 'Connection error.', type: 'error' });
        } finally {
            setIsLoadingTopics(false);
        }
    };

    const handleAddTopic = async (e) => {
        e.preventDefault();
        if (!newTopicText.trim()) return;
        setIsAddingTopic(true);
        setTopicsMsg({ text: '', type: '' });
        try {
            const res = await fetch(`${API_BASE_URL}/add-impromptu-topic`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    adminId: user.id || user.userId,
                    topic: newTopicText
                })
            });
            const data = await res.json();
            if (res.ok) {
                setTopics(prev => [data.topic, ...prev]);
                setNewTopicText('');
                setTopicsMsg({ text: 'Topic added successfully!', type: 'success' });
            } else {
                setTopicsMsg({ text: data.message || 'Failed to add topic.', type: 'error' });
            }
        } catch (err) {
            setTopicsMsg({ text: 'Connection error.', type: 'error' });
        } finally {
            setIsAddingTopic(false);
        }
    };

    const handleDeleteTopic = async (topicId) => {
        if (!window.confirm("Are you sure you want to delete this topic?")) return;
        setDeletingTopicId(topicId);
        setTopicsMsg({ text: '', type: '' });
        try {
            const res = await fetch(`${API_BASE_URL}/delete-impromptu-topic`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    adminId: user.id || user.userId,
                    topicId: topicId
                })
            });
            const data = await res.json();
            if (res.ok) {
                setTopics(prev => prev.filter(t => t.topicId !== topicId));
                setTopicsMsg({ text: 'Topic deleted successfully.', type: 'success' });
            } else {
                setTopicsMsg({ text: data.message || 'Failed to delete topic.', type: 'error' });
            }
        } catch (err) {
            setTopicsMsg({ text: 'Connection error.', type: 'error' });
        } finally {
            setDeletingTopicId(null);
        }
    };

    const handleGenerateTopics = async () => {
        setIsGenerating(true);
        setTopicsMsg({ text: '', type: '' });
        try {
            const res = await fetch(`${API_BASE_URL}/generate-impromptu-topics`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    adminId: user.id || user.userId,
                    count: numGenerate
                })
            });
            const data = await res.json();
            if (res.ok) {
                setTopics(prev => [...(data.topics || []), ...prev]);
                setTopicsMsg({ text: `Successfully generated ${data.topics?.length || 0} topics with AI!`, type: 'success' });
            } else {
                setTopicsMsg({ text: data.message || 'Failed to generate topics.', type: 'error' });
            }
        } catch (err) {
            setTopicsMsg({ text: 'Connection error.', type: 'error' });
        } finally {
            setIsGenerating(false);
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

    const getRelativeTime = (dateStr) => {
        const now = new Date();
        const date = new Date(dateStr);
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
        return date.toLocaleDateString();
    };

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

    const handleUpdateQuota = async (userId, email, currentCount) => {
        const newVal = window.prompt(`Update monthly speech count for ${email}\n(Currently ${currentCount}):`, currentCount);
        if (newVal === null) return;
        const parsed = parseInt(newVal, 10);
        if (isNaN(parsed) || parsed < 0) {
            alert("Please enter a valid positive number.");
            return;
        }
        setIsLoadingUsers(true);
        try {
            const res = await fetch(`${API_BASE_URL}/update-speech-quota`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    adminId: user.id || user.userId,
                    targetUserId: userId,
                    newMonthlyCount: parsed
                })
            });
            if (res.ok) {
                setUsersList(prev => prev.map(u => u.userId === userId ? { ...u, monthlySpeechCount: parsed } : u));
                setUsersMsg({ text: `Updated speech count for ${email} to ${parsed}`, type: 'success' });
            } else {
                setUsersMsg({ text: 'Failed to update quota.', type: 'error' });
            }
        } catch (err) {
            setUsersMsg({ text: 'Connection error.', type: 'error' });
        } finally {
            setIsLoadingUsers(false);
            setTimeout(() => setUsersMsg({ text: '', type: '' }), 3000);
        }
    };

    const handleDeleteUser = async (userId, email) => {
        if (!window.confirm(`Are you sure you want to permanently delete the user ${email}? This action cannot be undone.`)) return;
        setIsLoadingUsers(true);
        try {
            const res = await fetch(`${API_BASE_URL}/delete-user`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    adminId: user.id || user.userId,
                    targetUserId: userId
                })
            });
            if (res.ok) {
                setUsersList(prev => prev.filter(u => u.userId !== userId));
                setUsersMsg({ text: `Successfully deleted user ${email}`, type: 'success' });
            } else {
                const data = await res.json();
                setUsersMsg({ text: data.message || 'Failed to delete user.', type: 'error' });
            }
        } catch (err) {
            setUsersMsg({ text: 'Connection error.', type: 'error' });
        } finally {
            setIsLoadingUsers(false);
            setTimeout(() => setUsersMsg({ text: '', type: '' }), 5000);
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
                                                <th style={{ padding: '1rem', textAlign: 'center' }}>Actions</th>
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
                                                    <td style={{ padding: '1rem', fontWeight: '600' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            {u.monthlySpeechCount} <span style={{ color: 'var(--text-secondary)' }}>|</span> {u.totalSpeechCount}
                                                            <button 
                                                                onClick={() => handleUpdateQuota(u.userId, u.email, u.monthlySpeechCount)}
                                                                style={{
                                                                    background: 'none', border: 'none', cursor: 'pointer',
                                                                    color: '#0ea5e9', padding: '0.2rem', display: 'flex'
                                                                }}
                                                                title="Edit Monthly Quota"
                                                            >
                                                                <Edit3 size={14} />
                                                            </button>
                                                        </div>
                                                    </td>
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
                                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                                        <button 
                                                            onClick={() => handleDeleteUser(u.userId, u.email)}
                                                            disabled={isLoadingUsers || u.role === 'super_admin'}
                                                            style={{
                                                                background: 'none', border: 'none', cursor: u.role === 'super_admin' ? 'not-allowed' : 'pointer',
                                                                color: u.role === 'super_admin' ? '#cbd5e1' : '#ef4444', padding: '0.4rem', margin: '0 auto', display: 'flex'
                                                            }}
                                                            title="Delete User"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {usersList.length === 0 && (
                                                <tr><td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>No users found.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </motion.div>
                    )}
                    {/* ══════════════ EMAIL COACH ══════════════ */}
                    {activeSubTab === 'email-coach' && (
                        <motion.div
                            key="email-coach"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="glass-panel"
                            style={{ padding: '2.5rem', borderRadius: '1.5rem', color: 'var(--text-primary)', background: '#ffffff' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                                <div style={{
                                    width: '48px', height: '48px', borderRadius: '1rem',
                                    background: 'rgba(16, 185, 129, 0.1)', color: '#10b981',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h3 className="gradient-text" style={{ fontSize: '2rem', fontWeight: '800', margin: 0 }}>Email Coach</h3>
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Send an invitation to a coach.</p>
                                </div>
                            </div>

                            {emailMsg.text && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                                    style={{
                                        padding: '1rem', borderRadius: '0.8rem', marginBottom: '1.5rem',
                                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                                        background: emailMsg.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                        color: emailMsg.type === 'success' ? '#10b981' : '#ef4444',
                                        border: `1px solid ${emailMsg.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                                    }}
                                >
                                    {emailMsg.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                                    <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>{emailMsg.text}</span>
                                </motion.div>
                            )}

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Coach Email Address</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={20} />
                                    <input
                                        type="email" value={coachEmail}
                                        onChange={(e) => setCoachEmail(e.target.value)}
                                        placeholder="coach@school.edu"
                                        style={{
                                            padding: '1rem 1.2rem 1rem 3.5rem', background: '#ffffff',
                                            border: '1px solid var(--glass-border)', borderRadius: '1rem',
                                            color: 'var(--text-primary)', fontSize: '1rem', outline: 'none', width: '100%'
                                        }}
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Subject</label>
                                <input
                                    type="text" value={emailSubject}
                                    onChange={(e) => setEmailSubject(e.target.value)}
                                    placeholder="Email Subject"
                                    style={{
                                        padding: '1rem 1.2rem', background: '#ffffff',
                                        border: '1px solid var(--glass-border)', borderRadius: '1rem',
                                        color: 'var(--text-primary)', fontSize: '1rem', outline: 'none', width: '100%'
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Message Body</label>
                                <textarea
                                    value={emailBody}
                                    onChange={(e) => setEmailBody(e.target.value)}
                                    rows={12}
                                    style={{
                                        padding: '1rem 1.2rem', background: '#ffffff',
                                        border: '1px solid var(--glass-border)', borderRadius: '1rem',
                                        color: 'var(--text-primary)', fontSize: '1rem', outline: 'none', width: '100%',
                                        resize: 'vertical', fontFamily: 'inherit', lineHeight: '1.5'
                                    }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-start' }}>
                                <a
                                    href={`mailto:${coachEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`}
                                    style={{
                                        padding: '1rem 2rem', background: 'var(--accent-gradient)', color: 'white',
                                        border: 'none', borderRadius: '1rem', fontWeight: '800', fontSize: '1rem',
                                        textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                                        boxShadow: 'var(--shadow-glow)', transition: 'all 0.3s'
                                    }}
                                >
                                    <Mail size={18} /> Open in Email Client
                                </a>
                                <button
                                    onClick={async () => {
                                        if (!coachEmail.trim()) {
                                            setEmailMsg({ text: 'Please provide an email address.', type: 'error' });
                                            return;
                                        }
                                        setIsSendingEmail(true);
                                        setEmailMsg({ text: '', type: '' });
                                        try {
                                            const res = await fetch(`${API_BASE_URL}/send-coach-email`, {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({
                                                    adminId: user.id || user.userId,
                                                    email: coachEmail.trim(),
                                                    subject: emailSubject,
                                                    body: emailBody
                                                })
                                            });
                                            const data = await res.json();
                                            if (res.ok) {
                                                setEmailMsg({ text: 'Email sent successfully!', type: 'success' });
                                                setCoachEmail('');
                                            } else {
                                                setEmailMsg({ text: data.message || 'Failed to send email.', type: 'error' });
                                            }
                                        } catch (err) {
                                            setEmailMsg({ text: 'No backend email endpoint configured (use "Open in Email Client").', type: 'error' });
                                        } finally {
                                            setIsSendingEmail(false);
                                        }
                                    }}
                                    disabled={isSendingEmail || !coachEmail}
                                    style={{
                                        padding: '1rem 2rem', background: '#16a34a', color: 'white',
                                        border: 'none', borderRadius: '1rem', fontWeight: '800', fontSize: '1rem',
                                        cursor: (isSendingEmail || !coachEmail) ? 'not-allowed' : 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    {isSendingEmail ? <Loader2 className="spinner" size={18} /> : <><CheckCircle size={18} /> Send via Server</>}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* ══════════════ MESSAGES ══════════════ */}
                    {activeSubTab === 'messages' && (
                        <motion.div
                            key="messages"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="glass-panel"
                            style={{ padding: '2.5rem', borderRadius: '1.5rem', color: 'var(--text-primary)', background: '#ffffff' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                                <div style={{
                                    width: '48px', height: '48px', borderRadius: '1rem',
                                    background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <MessageSquare size={24} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 className="gradient-text" style={{ fontSize: '2rem', fontWeight: '800', margin: 0 }}>Messages</h3>
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>View all contact form submissions and user communications.</p>
                                </div>
                                <button
                                    onClick={fetchContactMessages}
                                    disabled={isLoadingMessages}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                                        padding: '0.75rem 1.25rem', borderRadius: '0.8rem',
                                        background: '#a855f7', color: 'white',
                                        border: 'none', fontWeight: '700', cursor: isLoadingMessages ? 'not-allowed' : 'pointer',
                                        fontSize: '0.95rem', transition: 'all 0.2s'
                                    }}
                                >
                                    {isLoadingMessages ? <Loader2 className="spinner" size={16} /> : <Clock size={16} />} Refresh
                                </button>
                            </div>

                            {messagesMsg.text && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                                    style={{
                                        padding: '1rem', borderRadius: '0.8rem', marginBottom: '1.5rem',
                                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                                        background: messagesMsg.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                        color: messagesMsg.type === 'success' ? '#10b981' : '#ef4444',
                                        border: `1px solid ${messagesMsg.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                                    }}
                                >
                                    {messagesMsg.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                                    <span style={{ fontWeight: '500' }}>{messagesMsg.text}</span>
                                </motion.div>
                            )}

                            {/* Search */}
                            <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                                <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
                                <input
                                    type="text"
                                    value={messagesSearch}
                                    onChange={(e) => setMessagesSearch(e.target.value)}
                                    placeholder="Search by email, subject, or message..."
                                    style={{
                                        width: '100%', padding: '0.9rem 1rem 0.9rem 3rem',
                                        background: '#fafafa', border: '1px solid var(--glass-border)',
                                        borderRadius: '0.8rem', fontSize: '0.95rem', color: '#1a1a1a',
                                        outline: 'none', transition: 'border 0.2s'
                                    }}
                                />
                            </div>

                            {/* Stats Bar */}
                            {!isLoadingMessages && contactMessages.length > 0 && (
                                <div style={{
                                    display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap'
                                }}>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                                        padding: '0.6rem 1.2rem', borderRadius: '2rem',
                                        background: 'rgba(168, 85, 247, 0.08)', color: '#a855f7',
                                        fontSize: '0.85rem', fontWeight: '700'
                                    }}>
                                        <MessageSquare size={14} />
                                        {contactMessages.length} Total Messages
                                    </div>
                                    {messagesSearch && (
                                        <div style={{
                                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                                            padding: '0.6rem 1.2rem', borderRadius: '2rem',
                                            background: 'rgba(37, 99, 235, 0.08)', color: '#2563eb',
                                            fontSize: '0.85rem', fontWeight: '700'
                                        }}>
                                            <Search size={14} />
                                            {contactMessages.filter(m => {
                                                const q = messagesSearch.toLowerCase();
                                                return (m.email || '').toLowerCase().includes(q) ||
                                                    (m.subject || '').toLowerCase().includes(q) ||
                                                    (m.message || '').toLowerCase().includes(q);
                                            }).length} Matching
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Messages List */}
                            {isLoadingMessages && contactMessages.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                                    <Loader2 className="spinner" size={32} style={{ marginBottom: '1rem' }} />
                                    <p>Loading messages...</p>
                                </div>
                            ) : contactMessages.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                                    <MessageSquare size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                                    <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>No messages yet</p>
                                    <p style={{ fontSize: '0.9rem' }}>Contact form submissions will appear here.</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {contactMessages
                                        .filter(m => {
                                            if (!messagesSearch) return true;
                                            const q = messagesSearch.toLowerCase();
                                            return (m.email || '').toLowerCase().includes(q) ||
                                                (m.subject || '').toLowerCase().includes(q) ||
                                                (m.message || '').toLowerCase().includes(q);
                                        })
                                        .map((msg) => {
                                            const isExpanded = expandedMessageId === msg.messageId;
                                            const dateStr = msg.createdAt ? new Date(msg.createdAt).toLocaleString() : 'N/A';
                                            const relativeTime = msg.createdAt ? getRelativeTime(msg.createdAt) : '';

                                            return (
                                                <motion.div
                                                    key={msg.messageId}
                                                    layout
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    style={{
                                                        borderRadius: '1rem',
                                                        border: isExpanded ? '2px solid rgba(168, 85, 247, 0.3)' : '1px solid var(--glass-border)',
                                                        background: isExpanded ? 'rgba(168, 85, 247, 0.02)' : '#fafafa',
                                                        overflow: 'hidden', transition: 'all 0.2s', cursor: 'pointer'
                                                    }}
                                                    onClick={() => setExpandedMessageId(isExpanded ? null : msg.messageId)}
                                                >
                                                    {/* Collapsed Header */}
                                                    <div style={{
                                                        padding: '1.25rem 1.5rem',
                                                        display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap'
                                                    }}>
                                                        <div style={{
                                                            width: '40px', height: '40px', borderRadius: '50%',
                                                            background: 'linear-gradient(135deg, #a855f7, #6366f1)',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            color: 'white', fontSize: '0.85rem', fontWeight: '800',
                                                            flexShrink: 0, textTransform: 'uppercase'
                                                        }}>
                                                            {(msg.email || '?')[0]}
                                                        </div>
                                                        <div style={{ flex: 1, minWidth: '200px' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                                                                <span style={{ fontWeight: '700', color: '#1a1a1a', fontSize: '1rem' }}>{msg.email}</span>
                                                                <span style={{
                                                                    padding: '0.15rem 0.5rem', borderRadius: '0.4rem',
                                                                    background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7',
                                                                    fontSize: '0.7rem', fontWeight: '600'
                                                                }}>
                                                                    {relativeTime}
                                                                </span>
                                                            </div>
                                                            <div style={{
                                                                fontSize: '0.9rem', color: '#475569', fontWeight: '500',
                                                                marginTop: '0.25rem',
                                                                maxWidth: '600px', overflow: 'hidden',
                                                                textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                                                            }}>
                                                                {msg.subject || '(No Subject)'}
                                                            </div>
                                                        </div>
                                                        <div style={{ color: 'var(--text-secondary)', flexShrink: 0 }}>
                                                            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                                        </div>
                                                    </div>

                                                    {/* Expanded Content */}
                                                    <AnimatePresence>
                                                        {isExpanded && (
                                                            <motion.div
                                                                initial={{ opacity: 0, height: 0 }}
                                                                animate={{ opacity: 1, height: 'auto' }}
                                                                exit={{ opacity: 0, height: 0 }}
                                                                style={{ overflow: 'hidden' }}
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <div style={{
                                                                    padding: '0 1.5rem 1.5rem 1.5rem',
                                                                    borderTop: '1px solid rgba(168, 85, 247, 0.1)'
                                                                }}>
                                                                    <div style={{
                                                                        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                                                        gap: '1rem', marginTop: '1.25rem', marginBottom: '1.25rem'
                                                                    }}>
                                                                        <div style={{
                                                                            padding: '0.75rem 1rem', borderRadius: '0.7rem',
                                                                            background: 'rgba(37, 99, 235, 0.05)', border: '1px solid rgba(37, 99, 235, 0.1)'
                                                                        }}>
                                                                            <div style={{ fontSize: '0.7rem', color: '#2563eb', fontWeight: '700', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>From</div>
                                                                            <div style={{ fontSize: '0.9rem', color: '#1a1a1a', fontWeight: '600' }}>{msg.email}</div>
                                                                        </div>
                                                                        <div style={{
                                                                            padding: '0.75rem 1rem', borderRadius: '0.7rem',
                                                                            background: 'rgba(168, 85, 247, 0.05)', border: '1px solid rgba(168, 85, 247, 0.1)'
                                                                        }}>
                                                                            <div style={{ fontSize: '0.7rem', color: '#a855f7', fontWeight: '700', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Subject</div>
                                                                            <div style={{ fontSize: '0.9rem', color: '#1a1a1a', fontWeight: '600' }}>{msg.subject || '(No Subject)'}</div>
                                                                        </div>
                                                                        <div style={{
                                                                            padding: '0.75rem 1rem', borderRadius: '0.7rem',
                                                                            background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.1)'
                                                                        }}>
                                                                            <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: '700', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Received</div>
                                                                            <div style={{ fontSize: '0.9rem', color: '#1a1a1a', fontWeight: '600' }}>{dateStr}</div>
                                                                        </div>
                                                                    </div>

                                                                    <div style={{
                                                                        padding: '1.25rem', borderRadius: '0.8rem',
                                                                        background: '#ffffff', border: '1px solid var(--glass-border)',
                                                                        fontSize: '0.95rem', color: '#334155', lineHeight: '1.7',
                                                                        whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                                                                        fontFamily: 'inherit'
                                                                    }}>
                                                                        {msg.message || '(No message body)'}
                                                                    </div>

                                                                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
                                                                        <a
                                                                            href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || '')}`}
                                                                            style={{
                                                                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                                                                padding: '0.6rem 1.2rem', borderRadius: '0.7rem',
                                                                                background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb',
                                                                                textDecoration: 'none', fontWeight: '600', fontSize: '0.85rem',
                                                                                transition: 'all 0.2s', border: 'none', cursor: 'pointer'
                                                                            }}
                                                                        >
                                                                            <Mail size={14} /> Reply
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </motion.div>
                                            );
                                        })}
                                    {contactMessages.filter(m => {
                                        if (!messagesSearch) return true;
                                        const q = messagesSearch.toLowerCase();
                                        return (m.email || '').toLowerCase().includes(q) ||
                                            (m.subject || '').toLowerCase().includes(q) ||
                                            (m.message || '').toLowerCase().includes(q);
                                    }).length === 0 && messagesSearch && (
                                            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                                                <Search size={32} style={{ marginBottom: '0.5rem', opacity: 0.3 }} />
                                                <p>No messages match your search.</p>
                                            </div>
                                        )}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeSubTab === 'email-history' && (
                        <motion.div
                            key="email-history"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="glass-panel"
                            style={{ padding: '2.5rem', borderRadius: '1.5rem', color: 'var(--text-primary)', background: '#ffffff' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                                <div style={{
                                    width: '48px', height: '48px', borderRadius: '1rem',
                                    background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <Clock size={24} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 className="gradient-text" style={{ fontSize: '2rem', fontWeight: '800', margin: 0 }}>Email History</h3>
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>View all emails sent via the server to debate and speaking coaches.</p>
                                </div>
                                <button
                                    onClick={fetchCoachCommunications}
                                    disabled={isLoadingComms}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                                        padding: '0.75rem 1.25rem', borderRadius: '0.8rem',
                                        background: '#2563eb', color: 'white',
                                        border: 'none', fontWeight: '700', cursor: isLoadingComms ? 'not-allowed' : 'pointer',
                                        fontSize: '0.95rem', transition: 'all 0.2s'
                                    }}
                                >
                                    {isLoadingComms ? <Loader2 className="spinner" size={16} /> : <Clock size={16} />} Refresh
                                </button>
                            </div>

                            {commsMsg.text && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                                    style={{
                                        padding: '1rem', borderRadius: '0.8rem', marginBottom: '1.5rem',
                                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                                        background: commsMsg.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                        color: commsMsg.type === 'success' ? '#10b981' : '#ef4444',
                                        border: `1px solid ${commsMsg.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                                    }}
                                >
                                    {commsMsg.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                                    <span style={{ fontWeight: '500' }}>{commsMsg.text}</span>
                                </motion.div>
                            )}

                            {/* Search */}
                            <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                                <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
                                <input
                                    type="text"
                                    value={commsSearch}
                                    onChange={(e) => setCommsSearch(e.target.value)}
                                    placeholder="Search by coach email, subject, or email body..."
                                    style={{
                                        width: '100%', padding: '0.9rem 1rem 0.9rem 3rem',
                                        background: '#fafafa', border: '1px solid var(--glass-border)',
                                        borderRadius: '0.8rem', fontSize: '0.95rem', color: '#1a1a1a',
                                        outline: 'none', transition: 'border 0.2s'
                                    }}
                                />
                            </div>

                            {/* Stats Bar */}
                            {!isLoadingComms && coachComms.length > 0 && (
                                <div style={{
                                    display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap'
                                }}>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                                        padding: '0.6rem 1.2rem', borderRadius: '2rem',
                                        background: 'rgba(37, 99, 235, 0.08)', color: '#2563eb',
                                        fontSize: '0.85rem', fontWeight: '700'
                                    }}>
                                        <Mail size={14} />
                                        {coachComms.length} Emails Sent
                                    </div>
                                    {commsSearch && (
                                        <div style={{
                                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                                            padding: '0.6rem 1.2rem', borderRadius: '2rem',
                                            background: 'rgba(37, 99, 235, 0.08)', color: '#2563eb',
                                            fontSize: '0.85rem', fontWeight: '700'
                                        }}>
                                            <Search size={14} />
                                            {coachComms.filter(m => {
                                                const q = commsSearch.toLowerCase();
                                                return (m.coachEmail || '').toLowerCase().includes(q) ||
                                                    (m.subject || '').toLowerCase().includes(q) ||
                                                    (m.body || '').toLowerCase().includes(q);
                                            }).length} Matching
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Comms List */}
                            {isLoadingComms && coachComms.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                                    <Loader2 className="spinner" size={32} style={{ marginBottom: '1rem' }} />
                                    <p>Loading email history...</p>
                                </div>
                            ) : coachComms.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                                    <Mail size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                                    <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>No emails sent yet</p>
                                    <p style={{ fontSize: '0.9rem' }}>When you send coach partnership emails, they will be logged here.</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {coachComms
                                        .filter(m => {
                                            if (!commsSearch) return true;
                                            const q = commsSearch.toLowerCase();
                                            return (m.coachEmail || '').toLowerCase().includes(q) ||
                                                (m.subject || '').toLowerCase().includes(q) ||
                                                (m.body || '').toLowerCase().includes(q);
                                        })
                                        .map((msg) => {
                                            const isExpanded = expandedCommId === msg.communicationId;
                                            const dateStr = msg.sentAt ? new Date(msg.sentAt).toLocaleString() : 'N/A';
                                            const relativeTime = msg.sentAt ? getRelativeTime(msg.sentAt) : '';

                                            return (
                                                <motion.div
                                                    key={msg.communicationId}
                                                    layout
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    style={{
                                                        borderRadius: '1rem',
                                                        border: isExpanded ? '2px solid rgba(37, 99, 235, 0.3)' : '1px solid var(--glass-border)',
                                                        background: isExpanded ? 'rgba(37, 99, 235, 0.02)' : '#fafafa',
                                                        overflow: 'hidden', transition: 'all 0.2s', cursor: 'pointer'
                                                    }}
                                                    onClick={() => setExpandedCommId(isExpanded ? null : msg.communicationId)}
                                                >
                                                    {/* Collapsed Header */}
                                                    <div style={{
                                                        padding: '1.25rem 1.5rem',
                                                        display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap'
                                                    }}>
                                                        <div style={{
                                                            width: '40px', height: '40px', borderRadius: '50%',
                                                            background: 'linear-gradient(135deg, #2563eb, #38bdf8)',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            color: 'white', fontSize: '0.85rem', fontWeight: '800',
                                                            flexShrink: 0, textTransform: 'uppercase'
                                                        }}>
                                                            {(msg.coachEmail || '?')[0]}
                                                        </div>
                                                        <div style={{ flex: 1, minWidth: '200px' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                                                                <span style={{ fontWeight: '700', color: '#1a1a1a', fontSize: '1rem' }}>{msg.coachEmail}</span>
                                                                <span style={{
                                                                    padding: '0.15rem 0.5rem', borderRadius: '0.4rem',
                                                                    background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb',
                                                                    fontSize: '0.7rem', fontWeight: '600'
                                                                }}>
                                                                    {relativeTime}
                                                                </span>
                                                            </div>
                                                            <div style={{
                                                                fontSize: '0.9rem', color: '#475569', fontWeight: '500',
                                                                marginTop: '0.25rem',
                                                                maxWidth: '600px', overflow: 'hidden',
                                                                textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                                                            }}>
                                                                {msg.subject || '(No Subject)'}
                                                            </div>
                                                        </div>
                                                        <div style={{ color: 'var(--text-secondary)', flexShrink: 0 }}>
                                                            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                                        </div>
                                                    </div>

                                                    {/* Expanded Content */}
                                                    <AnimatePresence>
                                                        {isExpanded && (
                                                            <motion.div
                                                                initial={{ opacity: 0, height: 0 }}
                                                                animate={{ opacity: 1, height: 'auto' }}
                                                                exit={{ opacity: 0, height: 0 }}
                                                                style={{ overflow: 'hidden' }}
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <div style={{
                                                                    padding: '0 1.5rem 1.5rem 1.5rem',
                                                                    borderTop: '1px solid rgba(37, 99, 235, 0.1)'
                                                                }}>
                                                                    <div style={{
                                                                        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                                                        gap: '1rem', marginTop: '1.25rem', marginBottom: '1.25rem'
                                                                    }}>
                                                                        <div style={{
                                                                            padding: '0.75rem 1rem', borderRadius: '0.7rem',
                                                                            background: 'rgba(37, 99, 235, 0.05)', border: '1px solid rgba(37, 99, 235, 0.1)'
                                                                        }}>
                                                                            <div style={{ fontSize: '0.7rem', color: '#2563eb', fontWeight: '700', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sent To</div>
                                                                            <div style={{ fontSize: '0.9rem', color: '#1a1a1a', fontWeight: '600' }}>{msg.coachEmail}</div>
                                                                        </div>
                                                                        <div style={{
                                                                            padding: '0.75rem 1rem', borderRadius: '0.7rem',
                                                                            background: 'rgba(168, 85, 247, 0.05)', border: '1px solid rgba(168, 85, 247, 0.1)'
                                                                        }}>
                                                                            <div style={{ fontSize: '0.7rem', color: '#a855f7', fontWeight: '700', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Subject</div>
                                                                            <div style={{ fontSize: '0.9rem', color: '#1a1a1a', fontWeight: '600' }}>{msg.subject || '(No Subject)'}</div>
                                                                        </div>
                                                                        <div style={{
                                                                            padding: '0.75rem 1rem', borderRadius: '0.7rem',
                                                                            background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.1)'
                                                                        }}>
                                                                            <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: '700', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sent At</div>
                                                                            <div style={{ fontSize: '0.9rem', color: '#1a1a1a', fontWeight: '600' }}>{dateStr}</div>
                                                                        </div>
                                                                    </div>

                                                                    <div style={{
                                                                        padding: '1.25rem', borderRadius: '0.8rem',
                                                                        background: '#ffffff', border: '1px solid var(--glass-border)',
                                                                        fontSize: '0.95rem', color: '#334155', lineHeight: '1.7',
                                                                        whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                                                                        fontFamily: 'inherit'
                                                                    }}>
                                                                        {msg.body || '(No content body)'}
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </motion.div>
                                            );
                                        })}
                                    {coachComms.filter(m => {
                                        if (!commsSearch) return true;
                                        const q = commsSearch.toLowerCase();
                                        return (m.coachEmail || '').toLowerCase().includes(q) ||
                                            (m.subject || '').toLowerCase().includes(q) ||
                                            (m.body || '').toLowerCase().includes(q);
                                    }).length === 0 && commsSearch && (
                                            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                                                <Search size={32} style={{ marginBottom: '0.5rem', opacity: 0.3 }} />
                                                <p>No email records match your search.</p>
                                            </div>
                                        )}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeSubTab === 'impromptu-management' && (
                        <motion.div
                            key="impromptu-management"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="glass-panel"
                            style={{ padding: '2.5rem', borderRadius: '1.5rem', color: 'var(--text-primary)', background: '#ffffff' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                                <div style={{
                                    width: '48px', height: '48px', borderRadius: '1rem',
                                    background: 'rgba(56, 189, 248, 0.1)', color: '#0ea5e9',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <ClipboardList size={24} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 className="gradient-text" style={{ fontSize: '2rem', fontWeight: '800', margin: 0 }}>Impromptu Topics</h3>
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Manage impromptu speaking topics for practice sessions or generate new prompts with AWS Bedrock.</p>
                                </div>
                            </div>

                            {topicsMsg.text && (
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    padding: '1rem', borderRadius: '0.8rem', marginBottom: '1.5rem',
                                    background: topicsMsg.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                                    color: topicsMsg.type === 'error' ? '#ef4444' : '#22c55e',
                                    border: `1px solid ${topicsMsg.type === 'error' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)'}`,
                                    fontSize: '0.95rem'
                                }}>
                                    {topicsMsg.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
                                    {topicsMsg.text}
                                </div>
                            )}

                            {/* Control Panels */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                                gap: '1.5rem',
                                marginBottom: '2rem'
                            }}>
                                {/* Manual Add Card */}
                                <div style={{
                                    padding: '1.5rem',
                                    borderRadius: '1rem',
                                    background: '#f8fafc',
                                    border: '1px solid #e2e8f0',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between'
                                }}>
                                    <div>
                                        <h4 style={{ margin: '0 0 0.5rem 0', color: '#1e293b', fontWeight: '700', fontSize: '1.1rem' }}>Add Custom Topic</h4>
                                        <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: '#64748b' }}>Write a custom speaking prompt to append to the database library.</p>
                                        <textarea
                                            value={newTopicText}
                                            onChange={(e) => setNewTopicText(e.target.value)}
                                            placeholder="e.g. If you had to select one word to describe your life's philosophy, what would it be?"
                                            style={{
                                                width: '100%',
                                                height: '80px',
                                                padding: '0.75rem',
                                                borderRadius: '0.5rem',
                                                border: '1px solid #cbd5e1',
                                                background: 'white',
                                                color: '#1e293b',
                                                fontSize: '0.9rem',
                                                resize: 'none',
                                                marginBottom: '1rem'
                                            }}
                                        />
                                    </div>
                                    <button
                                        onClick={handleAddTopic}
                                        disabled={isAddingTopic || !newTopicText.trim()}
                                        style={{
                                            padding: '0.75rem 1rem',
                                            borderRadius: '0.5rem',
                                            background: '#2563eb',
                                            color: 'white',
                                            border: 'none',
                                            fontWeight: '600',
                                            cursor: (isAddingTopic || !newTopicText.trim()) ? 'not-allowed' : 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                            fontSize: '0.9rem',
                                            opacity: (isAddingTopic || !newTopicText.trim()) ? 0.6 : 1
                                        }}
                                    >
                                        {isAddingTopic ? <Loader2 className="spinner" size={16} /> : <Plus size={16} />}
                                        Add Topic
                                    </button>
                                </div>

                                {/* AI Generation Card */}
                                <div style={{
                                    padding: '1.5rem',
                                    borderRadius: '1rem',
                                    background: '#f8fafc',
                                    border: '1px solid #e2e8f0',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between'
                                }}>
                                    <div>
                                        <h4 style={{ margin: '0 0 0.5rem 0', color: '#1e293b', fontWeight: '700', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Sparkles size={18} color="#d946ef" style={{ flexShrink: 0 }} />
                                            AI Topic Generator
                                        </h4>
                                        <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.85rem', color: '#64748b' }}>Use AWS Bedrock Nova model to instantly draft new thought-provoking questions.</p>
                                        
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                            <label style={{ fontSize: '0.9rem', color: '#475569', fontWeight: '500' }}>Count:</label>
                                            <select
                                                value={numGenerate}
                                                onChange={(e) => setNumGenerate(parseInt(e.target.value))}
                                                style={{
                                                    padding: '0.5rem',
                                                    borderRadius: '0.4rem',
                                                    border: '1px solid #cbd5e1',
                                                    background: 'white',
                                                    color: '#1e293b',
                                                    fontSize: '0.9rem',
                                                    width: '80px'
                                                }}
                                            >
                                                <option value={3}>3</option>
                                                <option value={5}>5</option>
                                                <option value={10}>10</option>
                                                <option value={15}>15</option>
                                            </select>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleGenerateTopics}
                                        disabled={isGenerating}
                                        style={{
                                            padding: '0.75rem 1rem',
                                            borderRadius: '0.5rem',
                                            background: 'linear-gradient(135deg, #d946ef 0%, #8b5cf6 100%)',
                                            color: 'white',
                                            border: 'none',
                                            fontWeight: '600',
                                            cursor: isGenerating ? 'not-allowed' : 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                            fontSize: '0.9rem',
                                            boxShadow: '0 4px 10px rgba(217, 70, 239, 0.2)'
                                        }}
                                    >
                                        {isGenerating ? <Loader2 className="spinner" size={16} /> : <Sparkles size={16} />}
                                        Generate with AI
                                    </button>
                                </div>
                            </div>

                            {/* Active List */}
                            <div style={{ marginTop: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                                    <h4 style={{ margin: 0, color: '#1e293b', fontWeight: '700', fontSize: '1.2rem' }}>
                                        Active Prompts ({topics.length})
                                    </h4>
                                    <button
                                        onClick={fetchTopicsList}
                                        disabled={isLoadingTopics}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            borderRadius: '0.5rem',
                                            background: 'transparent',
                                            border: '1px solid #cbd5e1',
                                            color: '#64748b',
                                            fontSize: '0.85rem',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.4rem'
                                        }}
                                    >
                                        {isLoadingTopics ? <Loader2 className="spinner" size={12} /> : <RefreshCcw size={12} />}
                                        Reload List
                                    </button>
                                </div>

                                {isLoadingTopics ? (
                                    <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem', color: '#64748b' }}>
                                        <Loader2 className="spinner" size={32} />
                                    </div>
                                ) : topics.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8', border: '1px dashed #cbd5e1', borderRadius: '1rem' }}>
                                        No impromptu topics found. Generate or add some above!
                                    </div>
                                ) : (
                                    <div style={{
                                        maxHeight: '400px',
                                        overflowY: 'auto',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '0.8rem',
                                        background: '#f8fafc'
                                    }}>
                                        {topics.map((t, idx) => (
                                            <div
                                                key={t.topicId || idx}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    padding: '1rem 1.25rem',
                                                    borderBottom: idx === topics.length - 1 ? 'none' : '1px solid #e2e8f0',
                                                    gap: '1.5rem',
                                                    background: 'white'
                                                }}
                                            >
                                                <div style={{ flex: 1, textAlign: 'left' }}>
                                                    <div style={{ color: '#1e293b', fontSize: '0.95rem', fontWeight: '500', lineHeight: '1.4' }}>
                                                        "{t.topic}"
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.35rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                                                        <span>Creator: <strong style={{ color: t.createdBy === 'system' ? '#0ea5e9' : t.createdBy === 'bedrock' ? '#d946ef' : '#64748b' }}>{t.createdBy}</strong></span>
                                                        <span>•</span>
                                                        <span>Added: {t.createdAt ? new Date(parseInt(t.createdAt) * 1000).toLocaleDateString() : 'N/A'}</span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteTopic(t.topicId)}
                                                    disabled={deletingTopicId === t.topicId}
                                                    style={{
                                                        padding: '0.5rem',
                                                        borderRadius: '0.4rem',
                                                        background: 'transparent',
                                                        border: 'none',
                                                        color: '#ef4444',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        transition: 'background-color 0.2s'
                                                    }}
                                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.05)'}
                                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                    title="Delete topic"
                                                >
                                                    {deletingTopicId === t.topicId ? (
                                                        <Loader2 className="spinner" size={16} />
                                                    ) : (
                                                        <Trash2 size={16} />
                                                    )}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {activeSubTab === 'traffic-monitoring' && (
                        <motion.div
                            key="traffic-monitoring"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="glass-panel"
                            style={{ padding: '2.5rem', borderRadius: '1.5rem', color: 'var(--text-primary)', background: '#ffffff' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{
                                        width: '48px', height: '48px', borderRadius: '1rem',
                                        background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <Activity size={24} />
                                    </div>
                                    <div>
                                        <h3 className="gradient-text" style={{ fontSize: '2rem', fontWeight: '800', margin: 0 }}>Traffic Monitoring</h3>
                                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Track visitor traffic, IP addresses, location geolocation, and usage analytics for practiceyourspeech.com.</p>
                                    </div>
                                </div>
                                <button
                                    onClick={fetchTrafficData}
                                    disabled={isLoadingTraffic}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                                        padding: '0.6rem 1.25rem', borderRadius: '0.6rem',
                                        background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444',
                                        border: '1px solid rgba(239, 68, 68, 0.2)', fontWeight: '600',
                                        cursor: 'pointer', fontSize: '0.9rem'
                                    }}
                                >
                                    <RefreshCcw size={16} className={isLoadingTraffic ? "spinner" : ""} /> Refresh Logs
                                </button>
                            </div>

                            {trafficMsg.text && (
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    padding: '1rem', borderRadius: '0.8rem', marginBottom: '1.5rem',
                                    background: trafficMsg.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                                    color: trafficMsg.type === 'error' ? '#ef4444' : '#22c55e',
                                    border: `1px solid ${trafficMsg.type === 'error' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)'}`,
                                    fontSize: '0.95rem'
                                }}>
                                    <AlertCircle size={20} />
                                    {trafficMsg.text}
                                </div>
                            )}

                            {/* Stat Summary Cards */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                                gap: '1.5rem',
                                marginBottom: '2rem'
                            }}>
                                <div style={{ padding: '1.5rem', borderRadius: '1rem', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                                        <Eye size={16} /> Total Visits
                                    </div>
                                    <div style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a' }}>
                                        {trafficData.totalVisits || trafficData.visitors.length}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>Total recorded page visits</div>
                                </div>

                                <div style={{ padding: '1.5rem', borderRadius: '1rem', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#3b82f6', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                                        <Globe size={16} /> Unique Visitors
                                    </div>
                                    <div style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a' }}>
                                        {trafficData.uniqueVisitors || new Set(trafficData.visitors.map(v => v.ipAddress)).size}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>Distinct IP addresses</div>
                                </div>

                                <div style={{ padding: '1.5rem', borderRadius: '1rem', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                                        <TrendingUp size={16} /> Today's Visits
                                    </div>
                                    <div style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a' }}>
                                        {trafficData.visitors.filter(v => v.date === new Date().toISOString().split('T')[0]).length}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>Visits recorded today</div>
                                </div>
                            </div>

                            {/* Search Bar */}
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div style={{ position: 'relative', flex: 1 }}>
                                    <input
                                        type="text"
                                        placeholder="Search by IP, location, or browser user agent..."
                                        value={trafficSearch}
                                        onChange={(e) => setTrafficSearch(e.target.value)}
                                        style={{
                                            width: '100%', padding: '0.8rem 1rem 0.8rem 2.8rem',
                                            borderRadius: '0.8rem', border: '1px solid #cbd5e1',
                                            fontSize: '0.95rem', outline: 'none', color: '#1e293b'
                                        }}
                                    />
                                    <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                </div>
                                {trafficSearch && (
                                    <button
                                        onClick={() => setTrafficSearch('')}
                                        style={{ padding: '0.8rem 1.25rem', borderRadius: '0.8rem', border: '1px solid #cbd5e1', background: '#f1f5f9', color: '#475569', cursor: 'pointer' }}
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>

                            {/* Visitor Table */}
                            {isLoadingTraffic ? (
                                <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                                    <Loader2 className="spinner" size={32} style={{ marginBottom: '0.5rem' }} />
                                    <p>Loading visitor traffic logs...</p>
                                </div>
                            ) : (
                                <div style={{ borderRadius: '1rem', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                                <th style={{ textAlign: 'left', padding: '0.9rem 1.2rem', fontSize: '0.75rem', fontWeight: '700', color: '#ef4444', textTransform: 'uppercase' }}>VISITOR IP</th>
                                                <th style={{ textAlign: 'left', padding: '0.9rem 1.2rem', fontSize: '0.75rem', fontWeight: '700', color: '#ef4444', textTransform: 'uppercase' }}>GEOLOCATION</th>
                                                <th style={{ textAlign: 'left', padding: '0.9rem 1.2rem', fontSize: '0.75rem', fontWeight: '700', color: '#ef4444', textTransform: 'uppercase' }}>USER AGENT</th>
                                                <th style={{ textAlign: 'left', padding: '0.9rem 1.2rem', fontSize: '0.75rem', fontWeight: '700', color: '#ef4444', textTransform: 'uppercase' }}>TIMESTAMP</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {trafficData.visitors
                                                .filter(v => {
                                                    if (!trafficSearch) return true;
                                                    const q = trafficSearch.toLowerCase();
                                                    return (v.ipAddress || '').toLowerCase().includes(q) ||
                                                        (v.location || '').toLowerCase().includes(q) ||
                                                        (v.userAgent || '').toLowerCase().includes(q);
                                                })
                                                .slice(0, 50)
                                                .map((v, i) => (
                                                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                        <td style={{ padding: '0.85rem 1.2rem', fontSize: '0.85rem', fontFamily: 'monospace', fontWeight: '600', color: '#0f172a' }}>
                                                            {v.ipAddress || 'unknown'}
                                                        </td>
                                                        <td style={{ padding: '0.85rem 1.2rem', fontSize: '0.85rem', color: '#334155' }}>
                                                            {v.location || 'Unknown'}
                                                        </td>
                                                        <td style={{ padding: '0.85rem 1.2rem', fontSize: '0.8rem', color: '#64748b', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={v.userAgent}>
                                                            {v.userAgent || 'unknown'}
                                                        </td>
                                                        <td style={{ padding: '0.85rem 1.2rem', fontSize: '0.85rem', color: '#64748b' }}>
                                                            {v.timestamp ? new Date(v.timestamp).toLocaleString() : 'N/A'}
                                                        </td>
                                                    </tr>
                                                ))}
                                            {trafficData.visitors.length === 0 && (
                                                <tr>
                                                    <td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                                                        No visitor traffic logs recorded yet.
                                                    </td>
                                                </tr>
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
