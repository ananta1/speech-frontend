import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Trash2, Bot, User, Minimize2 } from 'lucide-react';
// API_BASE_URL removed since API calls are disabled in chatbot

const Chatbot = ({ onNavigateToContact }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Hi there! For any questions or support inquiries, please contact us directly using our [Contact Us](/contact) page. We will get back to you as soon as possible!',
      time: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to the bottom of the chat list
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText.trim(),
      time: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate typing delay to keep chatbot "as-is" feel
    setTimeout(() => {
      const botResponse = {
        id: Date.now().toString(),
        sender: 'bot',
        text: 'For any questions or support inquiries, please contact us directly using our [Contact Us](/contact) page. We will get back to you as soon as possible!',
        time: new Date()
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 800);
  };

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear the conversation?')) {
      setMessages([
        {
          id: 'welcome',
          sender: 'bot',
          text: 'Conversation cleared. If you have any questions, please contact us at our [Contact Us](/contact) page.',
          time: new Date()
        }
      ]);
    }
  };

  // Helper function to parse bold (**), inline code (`), links ([text](url)), and lists (-)
  const formatMessageText = (text) => {
    if (!text) return null;
    
    return text.split('\n').map((line, lineIdx) => {
      const trimmed = line.trim();
      const isBullet = trimmed.startsWith('- ') || trimmed.startsWith('* ');
      const lineContent = isBullet ? trimmed.substring(2) : line;
      
      // Split line by bold markdown (**), inline code (`), and links ([text](url))
      const regex = /(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\))/g;
      const splitParts = lineContent.split(regex);
      const renderedParts = splitParts.map((part, partIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={partIdx} style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code key={partIdx} style={{ 
              background: 'rgba(255, 255, 255, 0.08)', 
              padding: '2px 6px', 
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '0.85em',
              color: 'var(--accent-primary)',
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              {part.slice(1, -1)}
            </code>
          );
        }
        if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
          const match = part.match(/\[(.*?)\]\((.*?)\)/);
          if (match) {
            const linkText = match[1];
            const url = match[2];
            
            // Check if it's an internal SPA link (like /contact)
            const isInternal = url.startsWith('/') || url.includes(window.location.host);
            
            return (
              <a 
                key={partIdx} 
                href={url} 
                onClick={(e) => {
                  if (isInternal && onNavigateToContact) {
                    e.preventDefault();
                    onNavigateToContact();
                  }
                }}
                style={{ 
                  color: 'var(--accent-primary)', 
                  textDecoration: 'underline',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
                target={isInternal ? '_self' : '_blank'}
                rel={isInternal ? '' : 'noopener noreferrer'}
              >
                {linkText}
              </a>
            );
          }
        }
        return part;
      });

      if (isBullet) {
        return (
          <li key={lineIdx} style={{ marginLeft: '1.2rem', listStyleType: 'disc', margin: '4px 0', color: 'var(--text-primary)' }}>
            {renderedParts}
          </li>
        );
      }
      return <p key={lineIdx} style={{ margin: '4px 0', minHeight: '1em' }}>{renderedParts}</p>;
    });
  };

  return (
    <>
      <style>{`
        .suggestion-pill {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .suggestion-pill:hover {
          background: rgba(255, 255, 255, 0.08) !important;
          border-color: var(--accent-primary) !important;
          transform: translateY(-1px);
        }
        .chat-input-field {
          transition: all 0.2s ease;
        }
        .chat-input-field:focus {
          border-color: var(--accent-primary) !important;
          box-shadow: 0 0 10px var(--shadow-glow) !important;
          background: #ffffff !important;
          outline: none;
        }
        .chat-input-field::placeholder {
          color: #64748b !important;
        }
        .chatbot-close-btn {
          transition: all 0.2s ease;
        }
        .chatbot-close-btn:hover {
          color: var(--danger) !important;
          background: rgba(239, 68, 68, 0.1) !important;
        }
        .chatbot-clear-btn {
          transition: all 0.2s ease;
        }
        .chatbot-clear-btn:hover {
          color: var(--accent-primary) !important;
          background: rgba(56, 189, 248, 0.1) !important;
        }
        @keyframes status-pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.4; }
          100% { transform: scale(1); opacity: 1; }
        }
        .status-dot-pulse {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--success);
          animation: status-pulse 2s infinite ease-in-out;
        }
      `}</style>

      {/* Floating Action Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="pulse-circle"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 999,
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'var(--accent-gradient)',
          boxShadow: 'var(--shadow-glow)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          cursor: 'pointer',
          border: 'none',
          boxSizing: 'border-box'
        }}
        title="Support Chatbot"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close-icon"
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 45, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Minimize2 size={22} />
            </motion.div>
          ) : (
            <motion.div
              key="chat-icon"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageSquare size={22} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed',
              bottom: '6rem',
              right: '2rem',
              width: '390px',
              height: '560px',
              zIndex: 998,
              borderRadius: 'var(--radius-xl)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.5)',
              background: 'var(--glass)',
              backdropFilter: 'blur(20px)',
              border: '1px solid var(--glass-border)'
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '1rem 1.25rem',
                borderBottom: '1px solid var(--glass-border)',
                background: 'rgba(0, 0, 0, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: 'var(--accent-gradient)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    position: 'relative'
                  }}
                >
                  <Bot size={18} />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: -1,
                      right: -1,
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: 'var(--bg-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <span className="status-dot-pulse" />
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--success)', zIndex: 1 }} />
                  </div>
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>Support AI</h4>
                  <span style={{ fontSize: '0.72rem', color: 'var(--success)', opacity: 0.95, display: 'block', marginTop: '1px' }}>Online & Ready</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <button
                  onClick={handleClearChat}
                  className="chatbot-clear-btn"
                  style={{
                    padding: '0.45rem',
                    borderRadius: '0.5rem',
                    color: 'var(--text-secondary)',
                    background: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  title="Clear chat"
                >
                  <Trash2 size={15} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="chatbot-close-btn"
                  style={{
                    padding: '0.45rem',
                    borderRadius: '0.5rem',
                    color: 'var(--text-secondary)',
                    background: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  title="Close chat"
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div
              style={{
                flex: 1,
                padding: '1.25rem',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                background: 'rgba(0, 0, 0, 0.1)'
              }}
            >
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    display: 'flex',
                    justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    alignItems: 'flex-start',
                    gap: '0.5rem'
                  }}
                >
                  {msg.sender === 'bot' && (
                    <div
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--glass-border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent-primary)',
                        flexShrink: 0,
                        marginTop: '2px'
                      }}
                    >
                      <Bot size={13} />
                    </div>
                  )}
                  <div
                    style={{
                      maxWidth: '78%',
                      padding: '0.7rem 0.95rem',
                      borderRadius: msg.sender === 'user' ? '1.15rem 1.15rem 0.25rem 1.15rem' : '1.15rem 1.15rem 1.15rem 0.25rem',
                      background: msg.sender === 'user' ? 'var(--accent-gradient)' : 'var(--bg-secondary)',
                      color: msg.sender === 'user' ? '#fff' : 'var(--text-primary)',
                      border: msg.sender === 'user' ? 'none' : '1px solid var(--glass-border)',
                      fontSize: '0.88rem',
                      lineHeight: '1.45',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      wordBreak: 'break-word'
                    }}
                  >
                    {msg.sender === 'bot' ? formatMessageText(msg.text) : msg.text}
                    
                    {/* Suggested actions removed */}
                  </div>
                  {msg.sender === 'user' && (
                    <div
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-primary)',
                        flexShrink: 0,
                        marginTop: '2px'
                      }}
                    >
                      <User size={13} />
                    </div>
                  )}
                </motion.div>
              ))}

              {isTyping && (
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '0.5rem' }}>
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--glass-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-primary)',
                      flexShrink: 0
                    }}
                  >
                    <Bot size={13} />
                  </div>
                  <div
                    style={{
                      padding: '0.7rem 1.1rem',
                      borderRadius: '1.15rem',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--glass-border)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  >
                    <motion.span
                      animate={{ y: [0, -4, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                      style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--text-secondary)', display: 'inline-block' }}
                    />
                    <motion.span
                      animate={{ y: [0, -4, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: 0.15 }}
                      style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--text-secondary)', display: 'inline-block' }}
                    />
                    <motion.span
                      animate={{ y: [0, -4, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }}
                      style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--text-secondary)', display: 'inline-block' }}
                    />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form Footer */}
            <form
              onSubmit={handleSendMessage}
              style={{
                padding: '0.85rem 1.25rem',
                borderTop: '1px solid var(--glass-border)',
                background: 'rgba(0, 0, 0, 0.15)',
                display: 'flex',
                gap: '0.6rem',
                alignItems: 'center'
              }}
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask support a question..."
                className="chat-input-field"
                style={{
                  flex: 1,
                  background: '#ffffff',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '0.75rem',
                  padding: '0.65rem 0.9rem',
                  color: '#1e293b',
                  fontSize: '0.88rem',
                  fontFamily: 'inherit'
                }}
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '0.75rem',
                  background: inputText.trim() ? 'var(--accent-gradient)' : 'rgba(255,255,255,0.03)',
                  color: inputText.trim() ? '#fff' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  cursor: inputText.trim() ? 'pointer' : 'default',
                  transition: 'all 0.2s',
                  boxShadow: inputText.trim() ? '0 4px 10px rgba(56, 189, 248, 0.2)' : 'none'
                }}
              >
                <Send size={15} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
