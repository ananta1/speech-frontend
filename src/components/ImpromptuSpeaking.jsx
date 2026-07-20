import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Camera, Video, Mic, X, Download, RefreshCcw, StopCircle, PlayCircle, Circle, UploadCloud, Sparkles, Timer, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../config';

const IMPROMPTU_TOPICS = [
    "If you could have dinner with any historical figure, who would it be and why?",
    "Is technology making us more or less connected?",
    "What is the most important lesson you have learned in life so far?",
    "Describe a book or movie that changed your perspective.",
    "What does success mean to you?",
    "If you could change one thing about the world, what would it be?",
    "The best advice you've ever received and how it helped you.",
    "Why is failure sometimes necessary for growth?",
    "How do you handle stress or pressure in your daily life?",
    "If you had to choose a new hobby starting today, what would it be?",
    "The impact of social media on the younger generation.",
    "Is it better to be a generalist or a specialist?",
    "What is a skill you think everyone should learn?",
    "Describe a place where you feel most at peace.",
    "How do you define happiness?",
    "Should public speaking be a mandatory subject in schools?",
    "What role does creativity play in your life?",
    "If you could travel to any point in time, where and when would you go?",
    "The importance of keeping a daily journal or self-reflecting.",
    "How has a mentor or teacher influenced your path?",
    "What does it mean to be a good leader?",
    "Is it more important to be liked or respected?",
    "How do you handle disagreement with someone you respect?",
    "What is a risk you took that was completely worth it?",
    "What are you most grateful for today?"
];

const ImpromptuSpeaking = ({ user, onUploadSuccess }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const [isRecording, setIsRecording] = useState(false);
    const [recordedVideoUrl, setRecordedVideoUrl] = useState(null);
    const [recordingMimeType, setRecordingMimeType] = useState('video/webm');
    const mediaRecorderRef = useRef(null);
    const recordingTimeoutRef = useRef(null);
    const [error, setError] = useState(null);
    const [showFlash, setShowFlash] = useState(false);

    // Impromptu specific states
    const [topic, setTopic] = useState('');
    const [isTopicDrawn, setIsTopicDrawn] = useState(false);

    // Upload State
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadName, setUploadName] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
            setStream(null);
        }
    };

    useEffect(() => {
        let isMounted = true;
        
        const initCamera = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

                if (!isMounted) {
                    mediaStream.getTracks().forEach(track => track.stop());
                    return;
                }

                streamRef.current = mediaStream;
                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
                setError(null);
            } catch (err) {
                if (isMounted) {
                    console.error("Error accessing camera:", err);
                    setError("Unable to access camera. Please allow camera and microphone permissions.");
                }
            }
        };

        initCamera();

        return () => {
            isMounted = false;
            stopCamera();
        };
    }, []);

    // Timer effect
    useEffect(() => {
        let interval;
        if (isRecording) {
            interval = setInterval(() => {
                setRecordingTime((prev) => prev + 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isRecording]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const [topicsList, setTopicsList] = useState([]);
    const [isLoadingTopics, setIsLoadingTopics] = useState(true);

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/list-impromptu-topics`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({})
                });
                if (res.ok) {
                    const data = await res.json();
                    setTopicsList(data.topics || []);
                }
            } catch (err) {
                console.error("Error fetching impromptu topics:", err);
            } finally {
                setIsLoadingTopics(false);
            }
        };
        fetchTopics();
    }, []);

    const handleGetTopic = () => {
        const activePool = topicsList.length > 0 ? topicsList.map(t => t.topic) : IMPROMPTU_TOPICS;
        const filteredTopics = activePool.filter(t => t !== topic);
        if (filteredTopics.length === 0) {
            if (activePool.length > 0) {
                setTopic(activePool[0]);
                setIsTopicDrawn(true);
            }
            return;
        }
        const randomIndex = Math.floor(Math.random() * filteredTopics.length);
        const chosenTopic = filteredTopics[randomIndex];
        setTopic(chosenTopic);
        setIsTopicDrawn(true);
    };

    const handleStartRecording = useCallback(() => {
        if (!isTopicDrawn) {
            alert("Please draw a topic first before you start recording!");
            return;
        }

        if (stream) {
            setRecordedChunks([]);

            let mimeType = 'video/webm';
            if (MediaRecorder.isTypeSupported('video/mp4')) {
                mimeType = 'video/mp4';
            } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
                mimeType = 'video/webm;codecs=vp9';
            }

            setRecordingMimeType(mimeType);
            console.log(`Recording with mimeType: ${mimeType}`);

            const mediaRecorder = new MediaRecorder(stream, { mimeType });
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    setRecordedChunks((prev) => [...prev, event.data]);
                }
            };

            mediaRecorder.start();
            setRecordingTime(0);
            setIsRecording(true);
        }
    }, [stream, isTopicDrawn]);

    useEffect(() => {
        if (!isRecording && recordedChunks.length > 0) {
            const blob = new Blob(recordedChunks, { type: recordingMimeType });
            const url = URL.createObjectURL(blob);
            setRecordedVideoUrl(url);
        }
    }, [isRecording, recordedChunks, recordingMimeType]);

    const handleStopRecording = useCallback(() => {
        if (recordingTimeoutRef.current) clearTimeout(recordingTimeoutRef.current);
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    }, [isRecording]);



    const resetCapture = () => {
        setCapturedImage(null);
        setRecordedVideoUrl(null);
        setRecordedChunks([]);
        setIsRecording(false);
        setUploadName('');
        setShowUploadModal(false);
    };

    const handleUploadClick = () => {
        // Generate pre-populated name based on selected topic
        const sanitizedTopic = topic.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, "-");
        setUploadName(`Impromptu-${sanitizedTopic}`.substring(0, 60));
        setShowUploadModal(true);
    };

    const confirmUpload = async () => {
        if (!uploadName.trim()) {
            alert("Please enter a file name.");
            return;
        }

        setIsUploading(true);
        try {
            const blob = new Blob(recordedChunks, { type: recordingMimeType });
            const ext = recordingMimeType.includes('mp4') ? '.mp4' : '.webm';
            const fileNameWithExt = uploadName.endsWith(ext) ? uploadName : `${uploadName}${ext}`;

            const res = await fetch(`${API_BASE_URL}/get-upload-url`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id || user.userId,
                    email: user.email,
                    fileName: fileNameWithExt,
                    fileType: recordingMimeType
                })
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || 'Failed to get upload URL');
            }

            const { uploadUrl } = await res.json();

            const uploadRes = await fetch(uploadUrl, {
                method: 'PUT',
                body: blob,
                headers: { 'Content-Type': recordingMimeType }
            });

            if (!uploadRes.ok) throw new Error('Failed to upload video content');

            if (onUploadSuccess) {
                onUploadSuccess();
            } else {
                alert("Speech uploaded successfully!");
                resetCapture();
            }
        } catch (err) {
            console.error(err);
            alert(`Error uploading: ${err.message}`);
        } finally {
            setIsUploading(false);
        }
    };

    // Calculate Timer Colors & Badges
    const isUnderMin = recordingTime < 60;
    const isTargetZone = recordingTime >= 60 && recordingTime <= 120;
    const isOverMax = recordingTime > 120;
    const progressPercent = Math.min((recordingTime / 120) * 100, 100);

    const timerColor = isRecording
        ? (isOverMax ? '#ef4444' : isUnderMin ? '#eab308' : '#22c55e') // Red (>2m) / Yellow (<1m) / Green (1m-2m)
        : 'var(--text-primary)';

    const progressBarGradient = isOverMax
        ? 'linear-gradient(to right, #ef4444, #f87171)'
        : isUnderMin
            ? 'linear-gradient(to right, #eab308, #fbbf24)'
            : 'linear-gradient(to right, #22c55e, #4ade80)';

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            maxWidth: '1200px',
            gap: '2rem',
            padding: '1rem',
            alignItems: 'stretch'
        }}>
            
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '2rem',
                alignItems: 'start'
            }}>
                
                {/* Topic Generation Panel */}
                <div className="glass-panel" style={{
                    padding: '2rem',
                    borderRadius: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem',
                    background: 'var(--glass)',
                    border: '1px solid var(--glass-border)',
                    height: '100%',
                    justifyContent: 'space-between'
                }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                            <div style={{
                                padding: '0.5rem',
                                background: 'rgba(251, 191, 36, 0.1)',
                                borderRadius: '0.5rem',
                                color: '#f59e0b'
                            }}>
                                <Sparkles size={20} />
                            </div>
                            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700' }}>Impromptu Speaking Practice</h3>
                        </div>

                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', margin: '0 0 1.5rem 0' }}>
                            Impromptu speaking stretches your thinking-on-your-feet skills. Draw a topic below, review your goal, and hit record when you're ready to speak.
                        </p>

                        <div style={{
                            padding: '1.5rem',
                            borderRadius: '1rem',
                            minHeight: '140px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            background: 'rgba(0,0,0,0.15)',
                            border: '1px dashed var(--glass-border)',
                            marginBottom: '1.5rem',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <AnimatePresence mode="wait">
                                {isTopicDrawn ? (
                                    <motion.div
                                        key={topic}
                                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                        transition={{ duration: 0.25 }}
                                        style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-primary)', padding: '0.5rem' }}
                                    >
                                        "{topic}"
                                    </motion.div>
                                ) : (
                                    <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.95rem' }}>
                                        No topic drawn yet. Click 'Get Topic' to generate an impromptu speaking topic.
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Guideline info */}
                        <div style={{
                            display: 'flex',
                            gap: '0.75rem',
                            padding: '1rem',
                            borderRadius: '0.75rem',
                            background: 'rgba(56, 189, 248, 0.05)',
                            border: '1px solid rgba(56, 189, 248, 0.1)',
                            fontSize: '0.85rem',
                            lineHeight: '1.4',
                            color: 'var(--text-secondary)',
                            alignItems: 'flex-start',
                            marginBottom: '1.5rem'
                        }}>
                            <AlertCircle size={16} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <div>
                                <strong>Speaking Goals:</strong> Practice speaking for <strong>1 to 2 minutes</strong>. The timer turns yellow under 1:00, green in your target zone (1:00–2:00), and red after 2:00.
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleGetTopic}
                        style={{
                            padding: '1rem 2rem',
                            background: 'var(--accent-gradient)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '1rem',
                            cursor: 'pointer',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.75rem',
                            boxShadow: 'var(--shadow-glow)',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <Sparkles size={18} />
                        {isTopicDrawn ? "Get Another Topic" : "Get Topic"}
                    </button>
                </div>

                {/* Camera Feedback Panel */}
                <div className="glass-panel" style={{
                    padding: '2rem',
                    borderRadius: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    background: 'var(--glass)',
                    border: '1px solid var(--glass-border)'
                }}>
                    <div className="glass-panel" style={{
                        position: 'relative',
                        width: '100%',
                        aspectRatio: '4/3',
                        maxHeight: '420px',
                        borderRadius: '1rem',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#000',
                        border: '1px solid var(--glass-border)'
                    }}>
                        <AnimatePresence>
                            {showFlash && (
                                <motion.div
                                    initial={{ opacity: 1 }} animate={{ opacity: 0 }} exit={{ opacity: 0 }}
                                    style={{ position: 'absolute', inset: 0, background: 'white', zIndex: 50 }}
                                />
                            )}
                        </AnimatePresence>

                        {error && <div style={{ color: 'var(--danger)', padding: '2rem', textAlign: 'center' }}>{error}</div>}

                        <video
                            ref={videoRef} autoPlay muted playsInline
                            style={{
                                width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)',
                                display: (capturedImage || recordedVideoUrl) ? 'none' : 'block'
                            }}
                        />

                        {capturedImage && (
                            <img src={capturedImage} alt="Captured" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
                        )}

                        {recordedVideoUrl && (
                            <video
                                src={recordedVideoUrl} controls
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            />
                        )}

                        {/* Top Header - Recording Time and Status */}
                        <AnimatePresence>
                            {isRecording && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    style={{
                                        position: 'absolute', top: '16px', right: '16px', zIndex: 100,
                                        background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)',
                                        color: 'white', padding: '6px 14px', borderRadius: '10px',
                                        display: 'flex', alignItems: 'center', gap: '10px',
                                        border: '1px solid rgba(255,255,255,0.15)'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <motion.div
                                            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
                                            transition={{ repeat: Infinity, duration: 1 }}
                                            style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }}
                                        />
                                        <span style={{ fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.1em' }}>REC</span>
                                    </div>
                                    <div style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.3)' }} />
                                    <span style={{ fontSize: '1.1rem', fontFamily: 'monospace', fontWeight: '700', color: timerColor }}>
                                        {formatTime(recordingTime)}
                                    </span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Progress Bar (Visual representation of 2-minute goal) */}
                        {isRecording && (
                            <div style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: '6px',
                                background: 'rgba(255,255,255,0.2)',
                                zIndex: 10
                            }}>
                                <div style={{
                                    height: '100%',
                                    width: `${progressPercent}%`,
                                    background: progressBarGradient,
                                    transition: 'width 1s linear, background 0.3s ease'
                                }} />
                            </div>
                        )}

                        {/* Camera Action Buttons (overlay at the bottom of video container) */}
                        <div style={{
                            position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)',
                            padding: '0.4rem 1.2rem', borderRadius: '9999px',
                            display: 'flex', gap: '1.25rem', alignItems: 'center', zIndex: 50,
                            background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            {(capturedImage || recordedVideoUrl) ? (
                                <>
                                    <button onClick={resetCapture} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                                        <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', color: 'white' }}>
                                            <RefreshCcw size={16} />
                                        </div>
                                        <span style={{ fontSize: '0.7rem' }}>Retake</span>
                                    </button>

                                    <button
                                        onClick={handleUploadClick}
                                        disabled={isUploading}
                                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem', background: 'none', border: 'none', color: 'white', cursor: 'pointer', opacity: isUploading ? 0.5 : 1 }}
                                    >
                                        <div style={{ padding: '0.5rem', background: 'var(--accent-gradient)', borderRadius: '50%', color: 'white' }}>
                                            <UploadCloud size={16} />
                                        </div>
                                        <span style={{ fontSize: '0.7rem' }}>Upload</span>
                                    </button>
                                </>
                            ) : (
                                <div style={{ position: 'relative', height: '40px', width: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={isRecording ? handleStopRecording : handleStartRecording}
                                        disabled={!isTopicDrawn}
                                        style={{
                                            width: '100%', height: '100%', borderRadius: '50%',
                                            border: '2px solid white', padding: '2px',
                                            background: 'transparent', cursor: isTopicDrawn ? 'pointer' : 'not-allowed',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            opacity: isTopicDrawn ? 1 : 0.4
                                        }}
                                        title={isTopicDrawn ? "Record speech" : "Please draw a topic first"}
                                    >
                                        <div style={{
                                            width: '100%', height: '100%',
                                            borderRadius: isRecording ? '0.2rem' : '50%',
                                            background: isRecording ? '#22c55e' : '#ef4444',
                                            transition: 'all 0.3s ease',
                                            transform: isRecording ? 'scale(0.5)' : 'scale(1)',
                                        }} />
                                    </motion.button>
                                </div>
                            )}
                        </div>

                        <canvas ref={canvasRef} style={{ display: 'none' }} />
                    </div>

                    {/* Timer Status Text */}
                    {isRecording && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginTop: '1rem',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: timerColor
                        }}>
                            <Timer size={16} />
                            {isUnderMin ? (
                                <span>Goal: Speak at least 1 min ({60 - recordingTime}s left)</span>
                            ) : (
                                <span>Target Zone! Max limit 2 mins ({120 - recordingTime}s left)</span>
                            )}
                        </div>
                    )}

                    {!isRecording && !recordedVideoUrl && (
                        <div style={{ margin: '1rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                            {isTopicDrawn 
                                ? "Click the red button to start recording your response."
                                : "Draw a topic using the panel on the left to start."}
                        </div>
                    )}
                </div>

            </div>

            <AnimatePresence>
                {showUploadModal && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="glass-panel"
                            style={{
                                padding: '2rem', borderRadius: '1.5rem', width: '90%', maxWidth: '450px',
                                background: 'var(--bg-primary)', border: '1px solid var(--glass-border)'
                            }}
                        >
                            <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.4rem' }} className="gradient-text">Save Impromptu Speech</h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                                Your speech will be saved and automatically processed for evaluations. You can customize the name below:
                            </p>

                            <input
                                type="text"
                                value={uploadName}
                                onChange={(e) => setUploadName(e.target.value)}
                                placeholder="Impromptu speech title"
                                style={{
                                    width: '100%', padding: '0.8rem 1rem', borderRadius: '0.75rem',
                                    background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)',
                                    color: 'var(--text-primary)', marginBottom: '1.5rem', fontSize: '1rem'
                                }}
                                autoFocus
                            />

                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                <button
                                    onClick={() => setShowUploadModal(false)}
                                    disabled={isUploading}
                                    style={{
                                        padding: '0.6rem 1.2rem', borderRadius: '0.5rem',
                                        background: 'transparent', color: 'var(--text-secondary)',
                                        border: 'none', cursor: 'pointer', fontSize: '0.9rem'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmUpload}
                                    disabled={isUploading}
                                    style={{
                                        padding: '0.6rem 1.5rem', borderRadius: '0.5rem',
                                        background: 'var(--accent-gradient)', color: 'white',
                                        border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500',
                                        display: 'flex', alignItems: 'center', gap: '0.5rem'
                                    }}
                                >
                                    {isUploading ? (
                                        <>
                                            <div className="spinner-small" /> Uploading...
                                        </>
                                    ) : 'Confirm Upload'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ImpromptuSpeaking;
