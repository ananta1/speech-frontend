import React, { useState } from 'react';
import { BookOpen, Trophy, Settings, Users, ArrowLeft, Sparkles, ChevronRight, CheckCircle2, Award, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import ClassSetup from './ClassSetup';
import CompetitionSetup from './CompetitionSetup';

const InstructorTools = ({ user, initialTab = 'hub' }) => {
    // Sub-tab view state: 'hub' | 'class-setup' | 'competition-setup'
    const [subTab, setSubTab] = useState(initialTab === 'class-setup' ? 'class-setup' : initialTab === 'competition-setup' ? 'competition-setup' : 'hub');

    if (subTab === 'class-setup') {
        return (
            <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header Navigation Bar back to Instructor Hub */}
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
                        <ArrowLeft size={16} /> Back to Instructor Cards
                    </button>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            onClick={() => setSubTab('class-setup')}
                            style={{
                                padding: '0.45rem 1rem', borderRadius: '0.6rem', border: 'none',
                                fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer',
                                background: '#ef4444', color: '#ffffff'
                            }}
                        >
                            Class Setup
                        </button>
                        <button
                            onClick={() => setSubTab('competition-setup')}
                            style={{
                                padding: '0.45rem 1rem', borderRadius: '0.6rem', border: '1px solid rgba(0,0,0,0.1)',
                                fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer',
                                background: '#f8fafc', color: '#334155'
                            }}
                        >
                            Competition Setup
                        </button>
                    </div>
                </div>

                <ClassSetup user={user} />
            </div>
        );
    }

    if (subTab === 'competition-setup') {
        return (
            <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header Navigation Bar back to Instructor Hub */}
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
                        <ArrowLeft size={16} /> Back to Instructor Cards
                    </button>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            onClick={() => setSubTab('class-setup')}
                            style={{
                                padding: '0.45rem 1rem', borderRadius: '0.6rem', border: '1px solid rgba(0,0,0,0.1)',
                                fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer',
                                background: '#f8fafc', color: '#334155'
                            }}
                        >
                            Class Setup
                        </button>
                        <button
                            onClick={() => setSubTab('competition-setup')}
                            style={{
                                padding: '0.45rem 1rem', borderRadius: '0.6rem', border: 'none',
                                fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer',
                                background: '#ef4444', color: '#ffffff'
                            }}
                        >
                            Competition Setup
                        </button>
                    </div>
                </div>

                <CompetitionSetup user={user} />
            </div>
        );
    }

    return (
        <div style={{ width: '100%', maxWidth: '1100px', margin: '0 auto', padding: '1rem 0.5rem 2rem' }}>
            {/* Header Banner */}
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1.25rem', borderRadius: '999px', background: 'rgba(239,68,68,0.12)', border: '1.5px solid rgba(239,68,68,0.4)' }}>
                    <Shield size={18} color="#ef4444" />
                    <span style={{ fontSize: '1.05rem', color: '#ef4444', fontWeight: '900', letterSpacing: '0.75px', textTransform: 'uppercase' }}>Instructor Management Hub</span>
                </div>
            </div>

            {/* 2 Main Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem', alignItems: 'stretch' }}>
                
                {/* ═══ CARD 1: CLASS SETUP ═══ */}
                <motion.div
                    whileHover={{ y: -6, scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                    className="glass-panel"
                    style={{
                        padding: '2rem', borderRadius: '1.5rem', background: '#ffffff',
                        border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                        position: 'relative', overflow: 'hidden'
                    }}
                >
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', background: 'linear-gradient(to right, #38bdf8, #2563eb)' }} />
                    
                    <div>
                        {/* Header & Icon */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                            <div style={{ width: '56px', height: '56px', borderRadius: '1rem', background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                                <BookOpen size={28} />
                            </div>
                            <span style={{ padding: '0.3rem 0.8rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', background: 'rgba(37,99,235,0.1)', color: '#2563eb' }}>
                                Class Management
                            </span>
                        </div>

                        <h3 style={{ fontSize: '1.45rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.5rem 0' }}>
                            Class Setup
                        </h3>
                        <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.55', marginBottom: '1.5rem' }}>
                            Create custom classes for your students, add student email rosters, customize speech evaluation rubrics, and view completed student speeches.
                        </p>

                        {/* Checklist Highlights */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.75rem', background: '#f8fafc', padding: '1rem', borderRadius: '0.85rem', border: '1px solid #e2e8f0' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.88rem', color: '#334155', fontWeight: '600' }}>
                                <CheckCircle2 size={16} color="#2563eb" /> Add & manage student class rosters
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.88rem', color: '#334155', fontWeight: '600' }}>
                                <CheckCircle2 size={16} color="#2563eb" /> Configure custom evaluation rubrics
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.88rem', color: '#334155', fontWeight: '600' }}>
                                <CheckCircle2 size={16} color="#2563eb" /> Review student speech scores & feedback
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setSubTab('class-setup')}
                        style={{
                            width: '100%', padding: '0.9rem 1.25rem', borderRadius: '0.85rem',
                            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#ffffff',
                            border: 'none', fontWeight: '800', fontSize: '0.95rem', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                            boxShadow: '0 4px 14px rgba(37,99,235,0.35)', transition: 'all 0.2s'
                        }}
                    >
                        Manage Classes <ChevronRight size={18} />
                    </button>
                </motion.div>

                {/* ═══ CARD 2: COMPETITION SETUP ═══ */}
                <motion.div
                    whileHover={{ y: -6, scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                    className="glass-panel"
                    style={{
                        padding: '2rem', borderRadius: '1.5rem', background: '#ffffff',
                        border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                        position: 'relative', overflow: 'hidden'
                    }}
                >
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', background: 'linear-gradient(to right, #f59e0b, #d97706)' }} />
                    
                    <div>
                        {/* Header & Icon */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                            <div style={{ width: '56px', height: '56px', borderRadius: '1rem', background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
                                <Trophy size={28} />
                            </div>
                            <span style={{ padding: '0.3rem 0.8rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', background: 'rgba(245,158,11,0.12)', color: '#d97706' }}>
                                Event Scoring
                            </span>
                        </div>

                        <h3 style={{ fontSize: '1.45rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.5rem 0' }}>
                            Competition Setup
                        </h3>
                        <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.55', marginBottom: '1.5rem' }}>
                            Set up competitive speech events, manage registered participants, assign custom judging parameters, and evaluate contestant speeches.
                        </p>

                        {/* Checklist Highlights */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.75rem', background: '#f8fafc', padding: '1rem', borderRadius: '0.85rem', border: '1px solid #e2e8f0' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.88rem', color: '#334155', fontWeight: '600' }}>
                                <CheckCircle2 size={16} color="#d97706" /> Create & schedule speech competitions
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.88rem', color: '#334155', fontWeight: '600' }}>
                                <CheckCircle2 size={16} color="#d97706" /> Set competition speech criteria & guidelines
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.88rem', color: '#334155', fontWeight: '600' }}>
                                <CheckCircle2 size={16} color="#d97706" /> Track participant scores & leaderboards
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setSubTab('competition-setup')}
                        style={{
                            width: '100%', padding: '0.9rem 1.25rem', borderRadius: '0.85rem',
                            background: 'linear-gradient(135deg, #d97706, #b45309)', color: '#ffffff',
                            border: 'none', fontWeight: '800', fontSize: '0.95rem', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                            boxShadow: '0 4px 14px rgba(217,119,6,0.35)', transition: 'all 0.2s'
                        }}
                    >
                        Manage Competitions <ChevronRight size={18} />
                    </button>
                </motion.div>

            </div>
        </div>
    );
};

export default InstructorTools;
