import React, { useState } from 'react';
import { Webcam, UploadCloud } from 'lucide-react';
import CameraView from './CameraView';
import UploadVideo from './UploadVideo';
import { motion, AnimatePresence } from 'framer-motion';

const SpeechInputWrapper = ({ user, onUploadSuccess }) => {
    const [mode, setMode] = useState('record'); // 'record' or 'upload'

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
