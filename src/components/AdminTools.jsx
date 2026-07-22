import React, { useState, useEffect } from 'react';
import { UserPlus, Shield, CheckCircle, AlertCircle, Loader2, Mail, Save, Plus, Trash2, Edit3, ClipboardList, X, MessageSquare, ChevronDown, ChevronUp, Clock, Search, Sparkles, RefreshCcw, RefreshCw, Activity, Globe, Eye, TrendingUp, ArrowLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../config';

const ADMIN_CARDS = [
    {
        id: 'traffic-monitoring',
        title: 'Traffic Monitoring',
        badge: 'Analytics',
        description: 'Monitor real-time site visits, unique visitors, user IPs, locations, and page hit logs.',
        icon: Globe,
        tint: '#0284c7',
        btnBg: 'linear-gradient(135deg, #0284c7, #0369a1)'
    },
    {
        id: 'user-management',
        title: 'User Management',
        badge: 'Users & Roles',
        description: 'Inspect registered user accounts, manage monthly speech evaluation limits, and adjust role permissions.',
        icon: Shield,
        tint: '#16a34a',
        btnBg: 'linear-gradient(135deg, #16a34a, #15803d)'
    },
    {
        id: 'master-evaluation',
        title: 'Master Criteria Rubrics',
        badge: 'System Rubrics',
        description: 'Manage system-wide speech scoring metrics, criteria weights, and default evaluation rules.',
        icon: ClipboardList,
        tint: '#9333ea',
        btnBg: 'linear-gradient(135deg, #9333ea, #7e22ce)'
    },
    {
        id: 'setup-instructor',
        title: 'Promote Instructor',
        badge: 'Access Control',
        description: 'Grant instructor administrative privileges to existing student accounts by email address.',
        icon: UserPlus,
        tint: '#2563eb',
        btnBg: 'linear-gradient(135deg, #2563eb, #1d4ed8)'
    },
    {
        id: 'messages',
        title: 'Contact Messages',
        badge: 'Inquiries',
        description: 'View and respond to user messages submitted through the website contact form.',
        icon: MessageSquare,
        tint: '#e11d48',
        btnBg: 'linear-gradient(135deg, #e11d48, #be123c)'
    },
    {
        id: 'impromptu-management',
        title: 'Impromptu Topics',
        badge: 'Practice Prompts',
        description: 'Add, edit, generate with AI, and manage impromptu speaking prompts for user practice.',
        icon: Sparkles,
        tint: '#d97706',
        btnBg: 'linear-gradient(135deg, #d97706, #b45309)'
    },
    {
        id: 'email-coach',
        title: 'Outreach Email Coach',
        badge: 'Outreach',
        description: 'Send customized partnership proposals and outreach emails to prospective speech coaches.',
        icon: Mail,
        tint: '#0891b2',
        btnBg: 'linear-gradient(135deg, #0891b2, #0e7490)'
    },
    {
        id: 'email-history',
        title: 'Email History',
        badge: 'Audit Trail',
        description: 'Review past outreach email logs, recipient details, and coach communications history.',
        icon: Clock,
        tint: '#4f46e5',
        btnBg: 'linear-gradient(135deg, #4f46e5, #4338ca)'
    },
    {
        id: 'feature-campaign',
        title: 'Feature Campaign Email',
        badge: 'Campaigns',
        description: 'Send feature announcement emails detailing all platform tools (AI Studio, Video Analysis, Speech Content Examples) to selected students in DynamoDB.',
        icon: Sparkles,
        tint: '#6366f1',
        btnBg: 'linear-gradient(135deg, #6366f1, #4f46e5)'
    }
];

const AdminTools = ({ user, activeSubTab = 'hub' }) => {
    const [subTab, setSubTab] = useState(activeSubTab === 'admin-tools' ? 'hub' : (activeSubTab || 'hub'));

    useEffect(() => {
        if (activeSubTab === 'admin-tools') setSubTab('hub');
        else if (activeSubTab) setSubTab(activeSubTab);
    }, [activeSubTab]);

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
    const [resendingId, setResendingId] = useState(null);
    const [resendStatus, setResendStatus] = useState({});

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

    // ── Feature Campaign Email State ──
    const DEFAULT_CAMPAIGN_BODY = `Welcome to Practice Your Speech! We are excited to introduce powerful new tools designed to elevate your public speaking skills:

🎙️ Speech Studio (Sentence & Pronunciation Practice)
Practice practice sentences or custom text with instant sentence-level pronunciation scoring, syllable stress analysis, phoneme accuracy breakdowns, and word-by-word articulation feedback.

📹 Automatic Video Upload & AI Analysis
Upload your speech videos directly for instant feedback! Analysis begins automatically upon upload completion—evaluating vocal delivery, body language, facial expressions, and speech structure.

✨ Verbatim Speech Content Improvement Examples
Get tailored, section-by-section script rewrites citing your actual spoken content for Introduction, Body Structure, Conclusion, Storytelling, Audience Connection, and Rhetorical Devices!

⚡ Impromptu Speaking & Table Topics
Challenge yourself with random impromptu speech topics! Features auto-generated topic prompts, built-in recording timer, and instant performance analysis.

🔍 Interactive Hover Feedback Popovers (Zone C)
Hover over words in your transcript to view instant pronunciation, grammar, and delivery feedback popovers without losing your place.

📊 Granular Metrics & Progress Dashboard
Track overall score trends (1-10 scale), pronunciation scores, delivery metrics, and performance logs across all your practices.`;

    const [selectedCampaignEmails, setSelectedCampaignEmails] = useState(new Set());
    const [campaignSubject, setCampaignSubject] = useState("🚀 Discover What's New on Practice Your Speech!");
    const [campaignCustomNote, setCampaignCustomNote] = useState('');
    const [campaignBody, setCampaignBody] = useState(DEFAULT_CAMPAIGN_BODY);
    const [externalEmailsInput, setExternalEmailsInput] = useState('');
    const [campaignSearch, setCampaignSearch] = useState('');
    const [campaignRoleFilter, setCampaignRoleFilter] = useState('all');
    const [isSendingCampaign, setIsSendingCampaign] = useState(false);
    const [campaignMsg, setCampaignMsg] = useState({ text: '', type: '', results: [] });

    const getParsedExternalEmails = () => {
        if (!externalEmailsInput || !externalEmailsInput.trim()) return [];
        return externalEmailsInput
            .split(/[\n,;\s]+/)
            .map(e => e.trim().toLowerCase())
            .filter(e => e && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
    };

    // Fetch data when switching tabs
    useEffect(() => {
        if (subTab === 'traffic-monitoring' && trafficData.visitors.length === 0) {
            fetchTrafficData();
        }
        if (subTab === 'master-evaluation' && !criteria) {
            fetchMasterCriteria();
        }
        if ((subTab === 'user-management' || subTab === 'feature-campaign') && usersList.length === 0) {
            fetchUsersList();
        }
        if (subTab === 'messages' && contactMessages.length === 0) {
            fetchContactMessages();
        }
        if (subTab === 'email-history' && coachComms.length === 0) {
            fetchCoachCommunications();
        }
        if (subTab === 'impromptu-management' && topics.length === 0) {
            fetchTopicsList();
        }
    }, [subTab]);

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

    const toggleCampaignUser = (email) => {
        if (!email) return;
        setSelectedCampaignEmails(prev => {
            const next = new Set(prev);
            if (next.has(email)) next.delete(email);
            else next.add(email);
            return next;
        });
    };

    const getFilteredCampaignUsers = () => {
        return usersList.filter(u => {
            if (!u.email) return false;
            if (campaignRoleFilter !== 'all' && (u.role || 'student') !== campaignRoleFilter) return false;
            if (campaignSearch) {
                const q = campaignSearch.toLowerCase();
                return (u.email || '').toLowerCase().includes(q) || (u.name || '').toLowerCase().includes(q);
            }
            return true;
        });
    };

    const toggleSelectAllCampaignUsers = () => {
        const filtered = getFilteredCampaignUsers();
        const filteredEmails = filtered.map(u => u.email).filter(Boolean);
        const allSelected = filteredEmails.every(e => selectedCampaignEmails.has(e));

        setSelectedCampaignEmails(prev => {
            const next = new Set(prev);
            if (allSelected) {
                filteredEmails.forEach(e => next.delete(e));
            } else {
                filteredEmails.forEach(e => next.add(e));
            }
            return next;
        });
    };

    const handleSendCampaignEmail = async () => {
        const dbRecipients = Array.from(selectedCampaignEmails);
        const externalRecipients = getParsedExternalEmails();
        const allRecipientsSet = new Set([...dbRecipients, ...externalRecipients]);
        const recipientsList = Array.from(allRecipientsSet);

        if (recipientsList.length === 0) {
            setCampaignMsg({ text: 'Please select at least one recipient user or enter external email addresses.', type: 'error' });
            return;
        }

        setIsSendingCampaign(true);
        setCampaignMsg({ text: '', type: '', results: [] });

        try {
            const res = await fetch(`${API_BASE_URL}/send-feature-campaign-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    adminId: user?.id || user?.userId || user?.email || localStorage.getItem('userId'),
                    recipientEmails: recipientsList,
                    subject: campaignSubject,
                    customNote: campaignCustomNote,
                    campaignBody: campaignBody
                })
            });

            const data = await res.json();
            if (res.ok) {
                setCampaignMsg({
                    text: data.message || `Campaign emails dispatched to ${data.totalSent} users!`,
                    type: 'success',
                    results: data.results || []
                });
            } else {
                setCampaignMsg({ text: data.message || 'Failed to send campaign emails.', type: 'error' });
            }
        } catch (err) {
            console.error("Campaign email error:", err);
            setCampaignMsg({ text: 'Network error sending campaign email.', type: 'error' });
        } finally {
            setIsSendingCampaign(false);
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
                body: JSON.stringify({ adminId: user?.id || user?.userId || user?.email || localStorage.getItem('userId') })
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

    const handleResendEmail = async (msg, e) => {
        if (e) e.stopPropagation();
        if (!msg || !msg.coachEmail) return;

        const commId = msg.communicationId;
        setResendingId(commId);
        setResendStatus(prev => ({ ...prev, [commId]: { text: 'Resending email...', type: 'info' } }));

        try {
            const isCampaign = msg.category === 'feature_campaign' || (msg.subject || '').startsWith('[Campaign]');
            const endpoint = isCampaign ? `${API_BASE_URL}/send-feature-campaign-email` : `${API_BASE_URL}/send-coach-email`;
            const adminId = user?.id || user?.userId || user?.email || localStorage.getItem('userId');

            const payload = isCampaign ? {
                adminId,
                recipientEmails: [msg.coachEmail],
                subject: (msg.subject || '').replace(/^\[Campaign\]\s*/, ''),
                campaignBody: msg.body
            } : {
                adminId,
                email: msg.coachEmail,
                subject: msg.subject,
                body: msg.body
            };

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (res.ok) {
                setResendStatus(prev => ({
                    ...prev,
                    [commId]: { text: `✓ Resent email successfully to ${msg.coachEmail}!`, type: 'success' }
                }));
                setTimeout(() => fetchCoachCommunications(), 1000);
            } else {
                setResendStatus(prev => ({
                    ...prev,
                    [commId]: { text: data.message || 'Failed to resend email.', type: 'error' }
                }));
            }
        } catch (err) {
            console.error("Resend email error:", err);
            setResendStatus(prev => ({
                ...prev,
                [commId]: { text: 'Network error resending email.', type: 'error' }
            }));
        } finally {
            setResendingId(null);
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

    if (subTab === 'hub') {
        return (
            <div style={{ width: '100%', maxWidth: '1150px', margin: '0 auto', padding: '1rem 0.5rem 2rem' }}>
                {/* Header Banner */}
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1.25rem', borderRadius: '999px', background: 'rgba(239,68,68,0.12)', border: '1.5px solid rgba(239,68,68,0.4)' }}>
                        <Shield size={18} color="#ef4444" />
                        <span style={{ fontSize: '1.05rem', color: '#ef4444', fontWeight: '900', letterSpacing: '0.75px', textTransform: 'uppercase' }}>Admin Tools Hub</span>
                    </div>
                </div>

                {/* Cards Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', alignItems: 'stretch' }}>
                    {ADMIN_CARDS.map(card => {
                        const CardIcon = card.icon;
                        return (
                            <motion.div
                                key={card.id}
                                whileHover={{ y: -6, scale: 1.01 }}
                                transition={{ duration: 0.2 }}
                                className="glass-panel"
                                style={{
                                    padding: '1.75rem', borderRadius: '1.5rem', background: '#ffffff',
                                    border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                                    position: 'relative', overflow: 'hidden'
                                }}
                            >
                                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', background: card.btnBg }} />
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                        <div style={{ width: '50px', height: '50px', borderRadius: '1rem', background: `${card.tint}18`, border: `1px solid ${card.tint}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.tint }}>
                                            <CardIcon size={24} />
                                        </div>
                                        <span style={{ padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', background: `${card.tint}14`, color: card.tint }}>
                                            {card.badge}
                                        </span>
                                    </div>
                                    <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.4rem 0' }}>
                                        {card.title}
                                    </h3>
                                    <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1.25rem' }}>
                                        {card.description}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSubTab(card.id)}
                                    style={{
                                        width: '100%', padding: '0.8rem 1rem', borderRadius: '0.75rem',
                                        background: card.btnBg, color: '#ffffff',
                                        border: 'none', fontWeight: '800', fontSize: '0.9rem', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                                        boxShadow: `0 4px 12px ${card.tint}40`, transition: 'all 0.2s'
                                    }}
                                >
                                    Open Module <ChevronRight size={16} />
                                </button>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: subTab === 'user-management' ? '1550px' : '900px', margin: '0 auto', width: '100%', padding: '1rem 0.5rem 2rem', transition: 'max-width 0.3s ease' }}>
            {/* Top Back Navigation Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', padding: '0.75rem 1.25rem', background: '#ffffff', borderRadius: '1rem', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
                <button
                    onClick={() => setSubTab('hub')}
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                        padding: '0.45rem 0.9rem', borderRadius: '0.6rem',
                        background: '#ef4444', color: '#ffffff', border: 'none',
                        fontWeight: '700', fontSize: '0.88rem', cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
                    }}
                >
                    <ArrowLeft size={16} /> Back to Admin Cards
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: '600' }}>Admin Module:</span>
                    <select
                        value={subTab}
                        onChange={(e) => setSubTab(e.target.value)}
                        style={{
                            padding: '0.45rem 0.85rem', borderRadius: '0.6rem', border: '1px solid #cbd5e1',
                            fontWeight: '700', fontSize: '0.85rem', background: '#f8fafc', color: '#0f172a',
                            outline: 'none', cursor: 'pointer'
                        }}
                    >
                        <option value="traffic-monitoring">Traffic Monitoring</option>
                        <option value="user-management">User Management</option>
                        <option value="feature-campaign">Feature Campaign Email</option>
                        <option value="master-evaluation">Master Criteria</option>
                        <option value="setup-instructor">Promote Instructor</option>
                        <option value="messages">Contact Messages</option>
                        <option value="impromptu-management">Impromptu Topics</option>
                        <option value="email-coach">Email Coach</option>
                        <option value="email-history">Email History</option>
                    </select>
                </div>
            </div>

            <div style={{ width: '100%' }}>
                <AnimatePresence mode="wait">

                    {/* ══════════════ SETUP INSTRUCTOR ══════════════ */}
                    {subTab === 'setup-instructor' && (
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
                    {subTab === 'master-evaluation' && (
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
                    {subTab === 'user-management' && (
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
                                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                                        <thead>
                                            <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                                                <th style={{ padding: '0.75rem 0.85rem' }}>Name</th>
                                                <th style={{ padding: '0.75rem 0.85rem' }}>Email</th>
                                                <th style={{ padding: '0.75rem 0.85rem' }}>Role</th>
                                                <th style={{ padding: '0.75rem 0.85rem' }}>Sub. Plan</th>
                                                <th style={{ padding: '0.75rem 0.85rem' }}>Joined</th>
                                                <th style={{ padding: '0.75rem 0.85rem' }}>Prepared (Mo | Tot)</th>
                                                <th style={{ padding: '0.75rem 0.85rem' }}>Speech Studio (Mo | Tot)</th>
                                                <th style={{ padding: '0.75rem 0.85rem' }}>Impromptu (Mo | Tot)</th>
                                                <th style={{ padding: '0.75rem 0.85rem', textAlign: 'center' }}>Update Role</th>
                                                <th style={{ padding: '0.75rem 0.85rem', textAlign: 'center' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {usersList.map((u, i) => (
                                                <tr key={u.userId} style={{ borderBottom: i === usersList.length - 1 ? 'none' : '1px solid var(--glass-border)' }}>
                                                    <td style={{ padding: '0.75rem 0.85rem', fontWeight: '500' }}>{u.name}</td>
                                                    <td style={{ padding: '0.75rem 0.85rem', color: 'var(--text-secondary)' }}>{u.email}</td>
                                                    <td style={{ padding: '0.75rem 0.85rem' }}>
                                                        <span style={{
                                                            padding: '0.2rem 0.6rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: '600',
                                                            background: u.role === 'super_admin' ? 'rgba(239, 68, 68, 0.1)' : u.role === 'instructor' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                                            color: u.role === 'super_admin' ? '#ef4444' : u.role === 'instructor' ? '#0ea5e9' : '#10b981'
                                                        }}>
                                                            {u.role.toUpperCase()}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '0.75rem 0.85rem' }}>{u.plan === 'pro' || u.plan === 'Pro' ? <span style={{ color: '#8b5cf6', fontWeight: '700' }}>PRO</span> : <span style={{ color: 'var(--text-secondary)' }}>FREE</span>}</td>
                                                    <td style={{ padding: '0.75rem 0.85rem', color: 'var(--text-secondary)' }}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}</td>
                                                    <td style={{ padding: '0.75rem 0.85rem', fontWeight: '600' }}>
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
                                                    <td style={{ padding: '0.75rem 0.85rem' }}>
                                                        <span style={{ padding: '0.25rem 0.65rem', borderRadius: '0.5rem', background: 'rgba(239, 68, 68, 0.08)', color: '#dc2626', fontWeight: '700', fontSize: '0.82rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                                                            {u.studioMonthlyCount || 0} <span style={{ color: 'var(--text-secondary)', fontWeight: '400' }}>|</span> {u.studioCount || 0}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '0.75rem 0.85rem' }}>
                                                        <span style={{ padding: '0.25rem 0.65rem', borderRadius: '0.5rem', background: 'rgba(56, 189, 248, 0.08)', color: '#0284c7', fontWeight: '700', fontSize: '0.82rem', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                                                            {u.impromptuMonthlyCount || 0} <span style={{ color: 'var(--text-secondary)', fontWeight: '400' }}>|</span> {u.impromptuCount || 0}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '0.75rem 0.85rem', textAlign: 'center' }}>
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
                    {subTab === 'email-coach' && (
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
                    {subTab === 'messages' && (
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

                    {/* ══════════════ EMAIL HISTORY ══════════════ */}
                    {subTab === 'email-history' && (
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
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                                                            <button
                                                                type="button"
                                                                onClick={(e) => handleResendEmail(msg, e)}
                                                                disabled={resendingId === msg.communicationId}
                                                                style={{
                                                                    display: 'flex', alignItems: 'center', gap: '0.35rem',
                                                                    padding: '0.4rem 0.85rem', borderRadius: '0.5rem',
                                                                    background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1',
                                                                    border: '1px solid rgba(99, 102, 241, 0.25)', fontWeight: '700',
                                                                    fontSize: '0.8rem', cursor: resendingId === msg.communicationId ? 'not-allowed' : 'pointer',
                                                                    transition: 'all 0.15s ease'
                                                                }}
                                                            >
                                                                {resendingId === msg.communicationId ? (
                                                                    <Loader2 className="spinner" size={14} />
                                                                ) : (
                                                                    <RefreshCw size={14} />
                                                                )}
                                                                Resend
                                                            </button>
                                                            <div style={{ color: 'var(--text-secondary)' }}>
                                                                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                                            </div>
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

                                                                    {/* Resend Action Bar */}
                                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                                                                        {resendStatus[msg.communicationId]?.text ? (
                                                                            <div style={{
                                                                                fontSize: '0.85rem', fontWeight: '700',
                                                                                color: resendStatus[msg.communicationId].type === 'success' ? '#16a34a' : resendStatus[msg.communicationId].type === 'error' ? '#dc2626' : '#2563eb'
                                                                            }}>
                                                                                {resendStatus[msg.communicationId].text}
                                                                            </div>
                                                                        ) : <div />}
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => handleResendEmail(msg, e)}
                                                                            disabled={resendingId === msg.communicationId}
                                                                            style={{
                                                                                display: 'flex', alignItems: 'center', gap: '0.4rem',
                                                                                padding: '0.6rem 1.25rem', borderRadius: '0.6rem',
                                                                                background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#ffffff',
                                                                                border: 'none', fontWeight: '700', fontSize: '0.88rem',
                                                                                cursor: resendingId === msg.communicationId ? 'not-allowed' : 'pointer',
                                                                                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)'
                                                                            }}
                                                                        >
                                                                            {resendingId === msg.communicationId ? (
                                                                                <>
                                                                                    <Loader2 className="spinner" size={16} /> Resending...
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <RefreshCw size={16} /> Resend Email to {msg.coachEmail}
                                                                                </>
                                                                            )}
                                                                        </button>
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

                    {/* ══════════════ IMPROMPTU MANAGEMENT ══════════════ */}
                    {subTab === 'impromptu-management' && (
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

                    {/* ══════════════ TRAFFIC MONITORING ══════════════ */}
                    {subTab === 'traffic-monitoring' && (
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
                                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Track visitor traffic, IP addresses, location geolocation, and usage analytics for practiceyourspeech.com (IPs deduplicated within a 4-hour window).</p>
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

                    {/* ══════════════ FEATURE CAMPAIGN EMAIL ══════════════ */}
                    {subTab === 'feature-campaign' && (
                        <motion.div
                            key="feature-campaign"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="glass-panel"
                            style={{ padding: '2.5rem', borderRadius: '1.5rem', color: 'var(--text-primary)', background: '#ffffff' }}
                        >
                            {/* Header */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{
                                        width: '48px', height: '48px', borderRadius: '1rem',
                                        background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <Sparkles size={24} />
                                    </div>
                                    <div>
                                        <h3 className="gradient-text" style={{ fontSize: '2rem', fontWeight: '800', margin: 0 }}>Feature Campaign Email</h3>
                                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Send a feature announcement showcase email detailing all recent platform tools to selected students in DynamoDB.</p>
                                    </div>
                                </div>
                                <button
                                    onClick={fetchUsersList}
                                    disabled={isLoadingUsers}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                                        padding: '0.6rem 1.25rem', borderRadius: '0.6rem',
                                        background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1',
                                        border: '1px solid rgba(99, 102, 241, 0.2)', fontWeight: '600',
                                        cursor: 'pointer', fontSize: '0.9rem'
                                    }}
                                >
                                    <RefreshCcw size={16} className={isLoadingUsers ? "spinner" : ""} /> Refresh Users List
                                </button>
                            </div>

                            {/* Status Feedback Message */}
                            {campaignMsg.text && (
                                <div style={{
                                    display: 'flex', flexDirection: 'column', gap: '0.75rem',
                                    padding: '1.2rem', borderRadius: '0.8rem', marginBottom: '1.5rem',
                                    background: campaignMsg.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                                    color: campaignMsg.type === 'error' ? '#ef4444' : '#15803d',
                                    border: `1px solid ${campaignMsg.type === 'error' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)'}`,
                                    fontSize: '0.95rem'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700' }}>
                                        <AlertCircle size={20} />
                                        {campaignMsg.text}
                                    </div>
                                    {campaignMsg.results?.length > 0 && (
                                        <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', marginTop: '0.5rem', maxHeight: '150px', overflowY: 'auto' }}>
                                            {campaignMsg.results.map((r, idx) => (
                                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0.6rem', background: '#ffffff', borderRadius: '0.4rem', border: '1px solid #e2e8f0' }}>
                                                    <span>{r.email}</span>
                                                    <span style={{ fontWeight: '700', color: r.status === 'SUCCESS' ? '#22c55e' : '#ef4444' }}>
                                                        {r.status === 'SUCCESS' ? '✓ Dispatched via SES (Check Inbox/Spam)' : `✗ Failed (${r.error})`}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Two-Column Campaign Workspace */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
                                
                                {/* ══ COLUMN 1: STUDENT / USER RECIPIENT SELECTOR ══ */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a', fontWeight: '700' }}>
                                            1. Select Recipients ({selectedCampaignEmails.size} selected)
                                        </h4>
                                        <button
                                            onClick={toggleSelectAllCampaignUsers}
                                            style={{
                                                padding: '0.4rem 0.8rem', borderRadius: '0.5rem',
                                                background: '#6366f1', color: '#ffffff', border: 'none',
                                                fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer'
                                            }}
                                        >
                                            {getFilteredCampaignUsers().every(u => selectedCampaignEmails.has(u.email)) ? 'Deselect All' : `Select All (${getFilteredCampaignUsers().length})`}
                                        </button>
                                    </div>

                                    {/* Search Bar */}
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <div style={{ position: 'relative', flex: 1 }}>
                                            <input
                                                type="text"
                                                placeholder="Search student email or name..."
                                                value={campaignSearch}
                                                onChange={(e) => setCampaignSearch(e.target.value)}
                                                style={{
                                                    width: '100%', padding: '0.6rem 0.8rem 0.6rem 2.4rem',
                                                    borderRadius: '0.6rem', border: '1px solid #cbd5e1',
                                                    fontSize: '0.85rem', outline: 'none'
                                                }}
                                            />
                                            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                        </div>
                                    </div>

                                    {/* Role Pill Filters */}
                                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                                        {['all', 'student', 'instructor', 'super_admin'].map(r => (
                                            <button
                                                key={r}
                                                onClick={() => setCampaignRoleFilter(r)}
                                                style={{
                                                    padding: '0.25rem 0.65rem', borderRadius: '999px',
                                                    border: '1px solid #cbd5e1', fontSize: '0.75rem',
                                                    fontWeight: '600', textTransform: 'capitalize', cursor: 'pointer',
                                                    background: campaignRoleFilter === r ? '#6366f1' : '#f8fafc',
                                                    color: campaignRoleFilter === r ? '#ffffff' : '#64748b'
                                                }}
                                            >
                                                {r}
                                            </button>
                                        ))}
                                    </div>

                                    {/* User Scroll Checklist */}
                                    <div style={{
                                        maxHeight: '400px', overflowY: 'auto', borderRadius: '0.8rem',
                                        border: '1px solid #e2e8f0', background: '#f8fafc', padding: '0.5rem'
                                    }}>
                                        {isLoadingUsers ? (
                                            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                                                <Loader2 className="spinner" size={24} style={{ marginBottom: '0.5rem' }} />
                                                <p style={{ margin: 0, fontSize: '0.85rem' }}>Loading user list...</p>
                                            </div>
                                        ) : getFilteredCampaignUsers().length === 0 ? (
                                            <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
                                                No users matching filter criteria.
                                            </div>
                                        ) : (
                                            getFilteredCampaignUsers().map((u, i) => {
                                                const isSelected = selectedCampaignEmails.has(u.email);
                                                return (
                                                    <div
                                                        key={i}
                                                        onClick={() => toggleCampaignUser(u.email)}
                                                        style={{
                                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                            padding: '0.65rem 0.85rem', borderRadius: '0.6rem', marginBottom: '0.35rem',
                                                            background: isSelected ? 'rgba(99, 102, 241, 0.08)' : '#ffffff',
                                                            border: `1px solid ${isSelected ? 'rgba(99, 102, 241, 0.3)' : '#f1f5f9'}`,
                                                            cursor: 'pointer', transition: 'all 0.15s ease'
                                                        }}
                                                    >
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
                                                            <input
                                                                type="checkbox"
                                                                checked={isSelected}
                                                                onChange={() => {}}
                                                                style={{ width: '16px', height: '16px', accentColor: '#6366f1', cursor: 'pointer' }}
                                                            />
                                                            <div style={{ overflow: 'hidden' }}>
                                                                <div style={{ fontWeight: '600', fontSize: '0.88rem', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                                    {u.name || u.email}
                                                                </div>
                                                                <div style={{ fontSize: '0.75rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                                    {u.email}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <span style={{
                                                            fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '0.4rem',
                                                            fontWeight: '700', textTransform: 'uppercase',
                                                            background: u.role === 'super_admin' ? 'rgba(168, 85, 247, 0.15)' : u.role === 'instructor' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(100, 116, 139, 0.15)',
                                                            color: u.role === 'super_admin' ? '#a855f7' : u.role === 'instructor' ? '#3b82f6' : '#64748b'
                                                        }}>
                                                            {u.role || 'student'}
                                                        </span>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>

                                    {/* Additional External Recipients Input */}
                                    <div style={{ marginTop: '0.5rem' }}>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#475569', marginBottom: '0.35rem' }}>
                                            Additional / External Emails ({getParsedExternalEmails().length} valid)
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={externalEmailsInput}
                                            onChange={(e) => setExternalEmailsInput(e.target.value)}
                                            placeholder="Enter external emails not in database (separated by commas or newlines)..."
                                            style={{
                                                width: '100%', padding: '0.65rem 0.85rem', borderRadius: '0.65rem',
                                                border: '1px solid #cbd5e1', fontSize: '0.82rem', outline: 'none',
                                                color: '#0f172a', resize: 'vertical', fontFamily: 'inherit'
                                            }}
                                        />
                                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
                                            💡 You can paste any external recipient emails here (e.g. prospective students, external coaches).
                                        </div>
                                    </div>
                                </div>

                                {/* ══ COLUMN 2: CAMPAIGN MESSAGE & FEATURE SHOWCASE PREVIEW ══ */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a', fontWeight: '700' }}>
                                        2. Compose Campaign & Feature Showcase
                                    </h4>

                                    {/* Subject Input */}
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#475569', marginBottom: '0.35rem' }}>
                                            Email Subject Line
                                        </label>
                                        <input
                                            type="text"
                                            value={campaignSubject}
                                            onChange={(e) => setCampaignSubject(e.target.value)}
                                            placeholder="Subject line..."
                                            style={{
                                                width: '100%', padding: '0.75rem 1rem', borderRadius: '0.75rem',
                                                border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', color: '#0f172a', fontWeight: '600'
                                            }}
                                        />
                                    </div>

                                    {/* Custom Personal Note */}
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#475569', marginBottom: '0.35rem' }}>
                                            Custom Personal Note (Optional)
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={campaignCustomNote}
                                            onChange={(e) => setCampaignCustomNote(e.target.value)}
                                            placeholder="Add a custom note from your instructor or administration..."
                                            style={{
                                                width: '100%', padding: '0.75rem 1rem', borderRadius: '0.75rem',
                                                border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none', color: '#0f172a', resize: 'vertical'
                                            }}
                                        />
                                    </div>

                                    {/* Fully Editable Campaign Email Body */}
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                                            <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>
                                                Campaign Email Content (Fully Editable)
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => setCampaignBody(DEFAULT_CAMPAIGN_BODY)}
                                                style={{ background: 'none', border: 'none', color: '#6366f1', fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer' }}
                                            >
                                                Reset Default Text
                                            </button>
                                        </div>
                                        <textarea
                                            rows={12}
                                            value={campaignBody}
                                            onChange={(e) => setCampaignBody(e.target.value)}
                                            placeholder="Write your campaign announcement content here..."
                                            style={{
                                                width: '100%', padding: '0.85rem 1rem', borderRadius: '0.75rem',
                                                border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none', color: '#0f172a',
                                                resize: 'vertical', fontFamily: 'inherit', lineHeight: '1.6'
                                            }}
                                        />
                                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.3rem' }}>
                                            💡 Feel free to edit, add, or customize any text above before sending.
                                        </div>
                                    </div>

                                    {/* Send Campaign Button */}
                                    <button
                                        onClick={handleSendCampaignEmail}
                                        disabled={isSendingCampaign || (selectedCampaignEmails.size === 0 && getParsedExternalEmails().length === 0)}
                                        style={{
                                            padding: '1rem 1.5rem', borderRadius: '0.8rem',
                                            background: (selectedCampaignEmails.size === 0 && getParsedExternalEmails().length === 0) ? '#94a3b8' : 'linear-gradient(135deg, #6366f1, #a855f7)',
                                            color: '#ffffff', border: 'none', fontWeight: '800', fontSize: '1rem',
                                            cursor: (selectedCampaignEmails.size === 0 && getParsedExternalEmails().length === 0) ? 'not-allowed' : 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
                                            boxShadow: (selectedCampaignEmails.size > 0 || getParsedExternalEmails().length > 0) ? '0 10px 20px rgba(99, 102, 241, 0.3)' : 'none',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        {isSendingCampaign ? (
                                            <>
                                                <Loader2 className="spinner" size={20} />
                                                Sending Campaign...
                                            </>
                                        ) : (
                                            <>
                                                <Mail size={20} />
                                                Send Feature Campaign Email ({new Set([...selectedCampaignEmails, ...getParsedExternalEmails()]).size} Total Recipients)
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
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
