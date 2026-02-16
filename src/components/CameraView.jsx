import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Camera, Video, Mic, X, Download, RefreshCcw, StopCircle, PlayCircle, Image as ImageIcon, Circle, UploadCloud } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../config';

const CameraView = ({ user, onUploadSuccess }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [mode, setMode] = useState('video');
    const [capturedImage, setCapturedImage] = useState(null);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const [isRecording, setIsRecording] = useState(false);
    const [recordedVideoUrl, setRecordedVideoUrl] = useState(null);
    const [recordingMimeType, setRecordingMimeType] = useState('video/webm'); // Default
    const mediaRecorderRef = useRef(null);
    const [error, setError] = useState(null);
    const [showFlash, setShowFlash] = useState(false);

    // Upload State
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadName, setUploadName] = useState('');
    const [isUploading, setIsUploading] = useState(false);

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
                    setError("Unable to access camera. Please allow permissions.");
                }
            }
        };

        initCamera();

        return () => {
            isMounted = false;
            stopCamera();
        };
    }, []);

    const handleTakePhoto = useCallback(() => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            const dataUrl = canvas.toDataURL('image/png');
            setCapturedImage(dataUrl);
            setShowFlash(true);
            setTimeout(() => setShowFlash(false), 200);
        }
    }, [videoRef, canvasRef]);

    const handleStartRecording = useCallback(() => {
        if (stream) {
            setRecordedChunks([]);

            // Feature detect MP4 support (better for Rekognition)
            let mimeType = 'video/webm';
            if (MediaRecorder.isTypeSupported('video/mp4')) {
                mimeType = 'video/mp4';
            } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
                mimeType = 'video/webm;codecs=vp9';
            }
            // If mp4 not supported, we fall back to webm. Rekognition might fail on webm.
            // Future improvement: Server-side conversion using FFMPEG.

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
            setIsRecording(true);
        }
    }, [stream]);

    // Effect to create URL when recording stops
    useEffect(() => {
        if (!isRecording && recordedChunks.length > 0) {
            const blob = new Blob(recordedChunks, { type: recordingMimeType });
            const url = URL.createObjectURL(blob);
            setRecordedVideoUrl(url);
        }
    }, [isRecording, recordedChunks, recordingMimeType]);

    const handleStopRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    }, [isRecording]);

    const handleDownload = (url, filename) => {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const resetCapture = () => {
        setCapturedImage(null);
        setRecordedVideoUrl(null);
        setRecordedChunks([]);
        setIsRecording(false);
        setUploadName('');
        setShowUploadModal(false);
    };

    const handleUploadClick = () => {
        setUploadName(`speech-${new Date().toISOString().slice(0, 10)}`);
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

            // Determines extension based on mimeType
            const ext = recordingMimeType.includes('mp4') ? '.mp4' : '.webm';
            const fileNameWithExt = uploadName.endsWith(ext) ? uploadName : `${uploadName}${ext}`;

            // 1. Get Presigned URL
            const res = await fetch(`${API_BASE_URL}/get-upload-url`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
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

            // 2. Upload to S3
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

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', width: '100%', height: '100%',
            alignItems: 'center', justifyContent: 'center', position: 'relative'
        }}>

            <div className="glass-panel" style={{
                position: 'relative', width: '90%', maxWidth: '800px', height: '60%', minHeight: '400px',
                borderRadius: '1.5rem', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: '#000'
            }}>
                <AnimatePresence>
                    {showFlash && (
                        <motion.div
                            initial={{ opacity: 1 }} animate={{ opacity: 0 }} exit={{ opacity: 0 }}
                            style={{ position: 'absolute', inset: 0, background: 'white', zIndex: 50 }}
                        />
                    )}
                </AnimatePresence>

                {error && <div style={{ color: 'var(--danger)', padding: '2rem' }}>{error}</div>}

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

                {isRecording && (
                    <motion.div
                        animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}
                        style={{
                            position: 'absolute', top: '20px', right: '20px',
                            background: 'var(--danger)', color: 'white',
                            padding: '0.5rem 1rem', borderRadius: '9999px',
                            display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold'
                        }}
                    >
                        <Circle size={12} fill="currentColor" /> REC
                    </motion.div>
                )}

                <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>

            <div className="glass-panel" style={{
                marginTop: '1.5rem', padding: '1rem 2rem', borderRadius: '9999px',
                display: 'flex', gap: '2rem', alignItems: 'center'
            }}>
                {(capturedImage || recordedVideoUrl) ? (
                    <>
                        <button onClick={resetCapture} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
                            <div style={{ padding: '0.8rem', background: 'var(--bg-secondary)', borderRadius: '50%', color: 'var(--text-secondary)' }}>
                                <RefreshCcw size={24} />
                            </div>
                            <span style={{ fontSize: '0.8rem' }}>Retake</span>
                        </button>

                        <button
                            onClick={handleUploadClick}
                            disabled={isUploading}
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', opacity: isUploading ? 0.5 : 1 }}
                        >
                            <div style={{ padding: '0.8rem', background: 'var(--accent-gradient)', borderRadius: '50%', color: 'white' }}>
                                <UploadCloud size={24} />
                            </div>
                            <span style={{ fontSize: '0.8rem' }}>Upload</span>
                        </button>
                    </>
                ) : (
                    <div style={{ position: 'relative', height: '80px', width: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={isRecording ? handleStopRecording : handleStartRecording}
                            style={{
                                width: '100%', height: '100%', borderRadius: '50%',
                                border: '4px solid var(--text-primary)', padding: '4px',
                                background: 'transparent', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                        >
                            <div style={{
                                width: '100%', height: '100%', borderRadius: '50%',
                                background: isRecording ? 'var(--danger)' : 'var(--text-primary)',
                                transition: 'all 0.3s ease',
                                transform: isRecording ? 'scale(0.5)' : 'scale(1)',
                                borderRadius: isRecording ? '12px' : '50%'
                            }} />
                        </motion.button>
                        <div style={{ position: 'absolute', bottom: '-2.5rem', width: '150px', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                            {isRecording ? 'Tap to Stop' : 'Tap to Record'}
                        </div>
                    </div>
                )}
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
                                padding: '2rem', borderRadius: '1.5rem', width: '90%', maxWidth: '400px',
                                background: 'var(--bg-primary)', border: '1px solid var(--glass-border)'
                            }}
                        >
                            <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.4rem' }} className="gradient-text">Save & Upload</h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                                Give your speech a name to save it to your library.
                            </p>

                            <input
                                type="text"
                                value={uploadName}
                                onChange={(e) => setUploadName(e.target.value)}
                                placeholder="speech-practice-1"
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

export default CameraView;
