import React, { useState, useRef } from 'react';
import { UploadCloud, Check, AlertCircle, Video, FileVideo } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../config';

const UploadVideo = ({ user, onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success, error
    const [errorMessage, setErrorMessage] = useState('');
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            // Validate file type
            if (!selectedFile.type.startsWith('video/')) {
                setErrorMessage('Please select a valid video file.');
                setFile(null);
                return;
            }
            // Validate file size (e.g., max 100MB)
            if (selectedFile.size > 100 * 1024 * 1024) {
                setErrorMessage('File size exceeds 100MB limit.');
                setFile(null);
                return;
            }
            setFile(selectedFile);
            setErrorMessage('');
            setUploadStatus('idle');
        }
    };

    const handleUpload = async () => {
        if (!file || !user) return;

        setIsUploading(true);
        setUploadStatus('uploading');
        setErrorMessage('');

        try {
            // 1. Get Presigned URL from Backend
            const getUrlResponse = await fetch(`${API_BASE_URL}/get-upload-url`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    email: user.email,
                    fileName: file.name,
                    fileType: file.type
                })
            });

            if (!getUrlResponse.ok) {
                throw new Error('Failed to get upload URL');
            }

            const { uploadUrl, key } = await getUrlResponse.json();

            // 2. Upload File to S3
            const uploadResponse = await fetch(uploadUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': file.type
                },
                body: file
            });

            if (!uploadResponse.ok) {
                throw new Error('Failed to upload file to storage');
            }

            setUploadStatus('success');
            if (onUploadSuccess) onUploadSuccess(key);

        } catch (error) {
            console.error(error);
            setUploadStatus('error');
            setErrorMessage(error.message || 'Upload failed. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="glass-panel" style={{
            maxWidth: '600px', width: '100%', margin: '0 auto',
            padding: '2.5rem', borderRadius: '1.5rem', textAlign: 'center'
        }}>
            <h2 className="gradient-text" style={{ marginBottom: '1.5rem', fontSize: '2rem' }}>Upload Speech</h2>

            <div
                className={`drop-zone ${file ? 'active' : ''}`}
                style={{
                    border: '2px dashed var(--glass-border)',
                    borderRadius: '1rem',
                    padding: '3rem 2rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: file ? 'rgba(255,255,255,0.05)' : 'transparent',
                    position: 'relative'
                }}
                onClick={() => fileInputRef.current.click()}
            >
                <input
                    type="file"
                    accept="video/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />

                {file ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <FileVideo size={48} color="var(--accent-primary)" />
                        <div>
                            <p style={{ fontWeight: '600', margin: '0 0 0.25rem 0' }}>{file.name}</p>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
                                {(file.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                        </div>
                        <button
                            onClick={(e) => { e.stopPropagation(); setFile(null); }}
                            style={{
                                marginTop: '0.5rem',
                                color: 'var(--danger)',
                                fontSize: '0.875rem',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            Remove
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)' }}>
                        <UploadCloud size={48} />
                        <p style={{ margin: 0 }}>Click to select a speech recording</p>
                        <p style={{ fontSize: '0.75rem', opacity: 0.7, margin: 0 }}>Max size: 100MB</p>
                    </div>
                )}
            </div>

            {errorMessage && (
                <div style={{
                    marginTop: '1.5rem',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    background: 'rgba(239, 68, 68, 0.1)',
                    color: '#ef4444',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    fontSize: '0.9rem'
                }}>
                    <AlertCircle size={16} />
                    {errorMessage}
                </div>
            )}

            {uploadStatus === 'success' && (
                <div style={{
                    marginTop: '1.5rem',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    background: 'rgba(34, 197, 94, 0.1)',
                    color: '#22c55e',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    fontWeight: '500'
                }}>
                    <Check size={20} />
                    Upload Successful!
                </div>
            )}

            <button
                onClick={handleUpload}
                disabled={!file || isUploading || uploadStatus === 'success'}
                style={{
                    marginTop: '2rem',
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    background: uploadStatus === 'success' ? 'var(--success)' : 'var(--accent-gradient)',
                    color: 'white',
                    fontWeight: '600',
                    boxShadow: 'var(--shadow-glow)',
                    opacity: (!file || isUploading) ? 0.7 : 1,
                    cursor: (!file || isUploading) ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                }}
            >
                {isUploading ? 'Uploading...' : (uploadStatus === 'success' ? 'Uploaded' : 'Upload Video')}
            </button>
        </div>
    );
};

export default UploadVideo;
