import React from 'react';
import { HelpCircle } from 'lucide-react';

const FAQ = () => {
    const faqSections = [
        {
            title: "Technical & Rehearsal FAQs",
            items: [
                {
                    q: "How many times should I practice my speech before the actual event?",
                    a: "For a high-stakes presentation, experts recommend rehearsing out loud at least 10 times. The first few rounds help you internalize the content, while the later rounds allow you to focus on your \"stage presence\" and vocal variety."
                },
                {
                    q: "How do I stop using filler words like \"um,\" \"ah,\" and \"like\"?",
                    a: "Awareness is the first step. Our platform tracks these fillers in real-time. A pro tip is to replace the \"um\" with a deliberate pause. Silence sounds thoughtful to an audience, whereas fillers can reduce your perceived authority."
                },
                {
                    q: "Is it better to practice in front of a mirror or record a video?",
                    a: "While mirrors provide instant feedback on posture, video recording is superior for growth. It allows you to watch yourself as an \"audience member\" without the distraction of self-correcting in the moment."
                },
                {
                    q: "How do I overcome \"stage fright\" or public speaking anxiety?",
                    a: "Anxiety often comes from the fear of the unknown. By using a rehearsal tool to simulate the speaking environment, you build \"muscle memory.\" Treating the adrenaline as \"excitement\" rather than \"fear\" can also shift your performance from defensive to dynamic."
                }
            ]
        },
        {
            title: "Content & Delivery FAQs",
            items: [
                {
                    q: "Should I memorize my speech word-for-word?",
                    a: "No. Memorizing word-for-word often leads to a \"robotic\" delivery and high stress if you forget a single line. Instead, memorize your Opening, your Closing, and your Key Transitions. For the middle, use a bulleted outline to stay conversational."
                },
                {
                    q: "How do I make my technical presentations more engaging?",
                    a: "Avoid \"death by PowerPoint.\" Use the 10-20-30 Rule: no more than 10 slides, lasting no more than 20 minutes, with a font size no smaller than 30 points. Focus on the story behind the data, not just the data itself."
                },
                {
                    q: "What is the ideal pacing for a professional speech?",
                    a: "The average speaking rate is about 130–150 words per minute. If you are nervous, you will likely speed up. Our tool helps you monitor your \"WPM\" to ensure your audience can digest your message."
                }
            ]
        },
        {
            title: "Platform & Privacy FAQs",
            items: [
                {
                    q: "Is my audio and video data kept private?",
                    a: "At Practice Your Speech, we prioritize your privacy. Your rehearsal recordings are encrypted and only accessible to you for review and analysis."
                },
                {
                    q: "Do I need any special equipment to use the site?",
                    a: "Just a standard laptop or smartphone with a working microphone and camera. For the best feedback, we recommend using a quiet room to ensure the AI can accurately track your vocal clarity."
                },
                {
                    q: "Can I use this for team training or corporate workshops?",
                    a: "Yes! We offer features for teams to share feedback and track collective improvement. It’s a great way to ensure a consistent brand voice across your sales or engineering departments."
                }
            ]
        }
    ];

    return (
        <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto', paddingBottom: '4rem' }}>
            <div style={{ textAlign: 'left', marginBottom: '3rem' }}>
                <h2 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '1rem' }}>
                    <HelpCircle size={40} /> Frequently Asked Questions
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                    Everything you need to know about improving your speech and using our platform.
                </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                {faqSections.map((section, idx) => (
                    <div key={idx}>
                        <h3 style={{
                            fontSize: '1.5rem',
                            color: 'var(--accent-primary)',
                            marginBottom: '1.5rem',
                            borderBottom: '1px solid var(--glass-border)',
                            paddingBottom: '0.5rem'
                        }}>
                            {section.title}
                        </h3>
                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            {section.items.map((item, i) => (
                                <div key={i} className="glass-panel" style={{
                                    padding: '1.5rem',
                                    borderRadius: '1rem',
                                    border: '1px solid var(--glass-border)',
                                    background: 'var(--glass)'
                                }}>
                                    <h4 style={{ margin: '0 0 0.8rem 0', color: 'var(--text-primary)', fontSize: '1.1rem', lineHeight: '1.4' }}>
                                        {item.q}
                                    </h4>
                                    <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                        {item.a}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FAQ;
