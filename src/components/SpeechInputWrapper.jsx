import React, { useState } from 'react';
import { Webcam, UploadCloud, Settings } from 'lucide-react';
import CameraView from './CameraView';
import UploadVideo from './UploadVideo';
import { motion, AnimatePresence } from 'framer-motion';

const SpeechInputWrapper = ({ user, onUploadSuccess }) => {
    const [mode, setMode] = useState('record'); // 'record' or 'upload'
    const [showSettings, setShowSettings] = useState(false);
    const [analysisConfig, setAnalysisConfig] = useState({
        visual: { eyeContact: true, posture: false, facialExpression: true },
        audio: { fillers: true, pacing: true, monotone: false },
        content: { vocabulary: false, sentiment: true, structure: true }
    });

    const toggleConfig = (category, key) => {
        setAnalysisConfig(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [key]: !prev[category][key]
            }
        }));
    };

    return (
        <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem'
        }}>
            {/* Unified Control Bar */}
            <div className="glass-panel" style={{
                display: 'flex',
                padding: '0.4rem',
                borderRadius: '0.8rem',
                gap: '0.5rem',
                background: 'rgba(0,0,0,0.2)',
                position: 'relative',
                zIndex: 50,
                alignItems: 'center'
            }}>
                <button
                    onClick={() => setMode('record')}
                    style={{
                        padding: '0.6rem 1.2rem',
                        borderRadius: '0.6rem',
                        background: mode === 'record' ? 'var(--accent-gradient)' : 'transparent',
                        color: mode === 'record' ? 'white' : 'var(--text-secondary)',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontWeight: mode === 'record' ? '600' : '500',
                        fontSize: '0.95rem',
                        transition: 'all 0.3s ease',
                        boxShadow: mode === 'record' ? 'var(--shadow-glow)' : 'none'
                    }}
                >
                    <Webcam size={18} />
                    Record Video
                </button>
                <button
                    onClick={() => setMode('upload')}
                    style={{
                        padding: '0.6rem 1.2rem',
                        borderRadius: '0.6rem',
                        background: mode === 'upload' ? 'var(--accent-gradient)' : 'transparent',
                        color: mode === 'upload' ? 'white' : 'var(--text-secondary)',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontWeight: mode === 'upload' ? '600' : '500',
                        fontSize: '0.95rem',
                        transition: 'all 0.3s ease',
                        boxShadow: mode === 'upload' ? 'var(--shadow-glow)' : 'none'
                    }}
                >
                    <UploadCloud size={18} />
                    Upload Video
                </button>

                {/* Divider and Settings Button */}
                <div style={{ width: '1px', height: '24px', background: 'var(--glass-border)', margin: '0 0.5rem' }}></div>

                <button
                    onClick={() => setShowSettings(!showSettings)}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        background: showSettings ? 'rgba(255,255,255,0.1)' : 'transparent',
                        color: showSettings ? 'white' : 'var(--text-secondary)',
                        borderRadius: '0.6rem',
                        padding: '0.6rem 1rem', cursor: 'pointer', fontSize: '0.9rem',
                        border: 'none',
                        transition: 'all 0.2s ease'
                    }}
                >
                    <Settings size={18} />
                    {showSettings ? 'Hide Settings' : 'Customize Evaluation'}
                </button>

                <AnimatePresence>
                    {showSettings && (
                        <motion.div
                            initial={{ height: 0, opacity: 0, y: -10 }}
                            animate={{ height: 'auto', opacity: 1, y: 0 }}
                            exit={{ height: 0, opacity: 0, y: -10 }}
                            style={{
                                position: 'absolute',
                                top: 'calc(100% + 10px)',
                                left: 0,
                                right: 0,
                                overflow: 'hidden',
                                width: '100%',
                                minWidth: '300px'
                            }}
                        >
                            <div className="glass-panel" style={{
                                padding: '1.5rem',
                                borderRadius: '1rem',
                                border: '1px solid var(--glass-border)',
                                background: 'var(--glass)',
                                backdropFilter: 'blur(10px)',
                                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
                            }}>
                                <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)', textAlign: 'center' }}>Select Evaluation Metrics</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>

                                    {/* Visual Group */}
                                    <div>
                                        <h5 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-primary)', fontSize: '0.85rem' }}>Visual</h5>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                                <input type="checkbox" checked={analysisConfig.visual.eyeContact} onChange={() => toggleConfig('visual', 'eyeContact')} />
                                                Eye Contact
                                            </label>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                                <input type="checkbox" checked={analysisConfig.visual.posture} onChange={() => toggleConfig('visual', 'posture')} />
                                                Posture
                                            </label>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                                <input type="checkbox" checked={analysisConfig.visual.facialExpression} onChange={() => toggleConfig('visual', 'facialExpression')} />
                                                Expressions
                                            </label>
                                        </div>
                                    </div>

                                    {/* Audio Group */}
                                    <div>
                                        <h5 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-primary)', fontSize: '0.85rem' }}>Audio</h5>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                                <input type="checkbox" checked={analysisConfig.audio.fillers} onChange={() => toggleConfig('audio', 'fillers')} />
                                                Fillers
                                            </label>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                                <input type="checkbox" checked={analysisConfig.audio.pacing} onChange={() => toggleConfig('audio', 'pacing')} />
                                                Pacing
                                            </label>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                                <input type="checkbox" checked={analysisConfig.audio.monotone} onChange={() => toggleConfig('audio', 'monotone')} />
                                                Tone
                                            </label>
                                        </div>
                                    </div>

                                    {/* Content Group */}
                                    <div>
                                        <h5 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-primary)', fontSize: '0.85rem' }}>Content</h5>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                                <input type="checkbox" checked={analysisConfig.content.sentiment} onChange={() => toggleConfig('content', 'sentiment')} />
                                                Sentiment
                                            </label>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                                <input type="checkbox" checked={analysisConfig.content.structure} onChange={() => toggleConfig('content', 'structure')} />
                                                Structure
                                            </label>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                                <input type="checkbox" checked={analysisConfig.content.vocabulary} onChange={() => toggleConfig('content', 'vocabulary')} />
                                                Vocabulary
                                            </label>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>



            {/* Content Area */}
            <div style={{
                flex: 1,
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                overflow: 'hidden'
            }}>
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={mode}
                        initial={{ opacity: 0, x: mode === 'record' ? -20 : 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: mode === 'record' ? 20 : -20 }}
                        transition={{ duration: 0.2 }}
                        style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center' }}
                    >
                        {mode === 'record' ? (
                            <CameraView user={user} onUploadSuccess={onUploadSuccess} />
                        ) : (
                            <div style={{ marginTop: '2rem', width: '100%', display: 'flex', justifyContent: 'center' }}>
                                <UploadVideo user={user} onUploadSuccess={onUploadSuccess} />
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SpeechInputWrapper;
