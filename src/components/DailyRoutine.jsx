import React, { useState, useEffect, useRef } from 'react';
import { Flame, Quote, BookOpen, Volume2, Target, Video, Sparkles, Trophy, Play, CheckCircle2, RotateCcw, Award, Zap, ChevronRight, HelpCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// CURATED 31 QUOTES (One for each day of the month)
const DAILY_QUOTES = [
  { text: "Speech is power: speech is to persuade, to convert, to compel.", author: "Ralph Waldo Emerson" },
  { text: "There are always three speeches for every one you actually gave. The one you written, the one you gave, and the one you wish you had given.", author: "Dale Carnegie" },
  { text: "The human brain starts working the moment you are born and never stops until you stand up to speak in public.", author: "George Jessel" },
  { text: "Let thy speech be better than silence, or be silent.", author: "Dionysius of Halicarnassus" },
  { text: "Well-timed silence hath more eloquence than speech.", author: "Martin Farquhar Tupper" },
  { text: "A good speech should be like a woman's skirt; long enough to cover the subject and short enough to create interest.", author: "Winston Churchill" },
  { text: "You can speak well if your tongue can deliver the message of your heart.", author: "John Ford" },
  { text: "Be still when you have nothing to say; when genuine passion moves you, say what you have to say, and say it hot.", author: "D.H. Lawrence" },
  { text: "The most precious things in speech are the pauses.", author: "Ralph Richardson" },
  { text: "All the great speakers were bad speakers at first.", author: "Ralph Waldo Emerson" },
  { text: "The finest art is the art of public speaking.", author: "James A. Garfield" },
  { text: "Words have incredible power. They can make people's hearts soar, or they can tear people down.", author: "Dr. Gary Chapman" },
  { text: "If you can't write it down in one sentence, you can't say it in one hour.", author: "Anonymous" },
  { text: "If you don't know what you want to achieve in your presentation, your audience never will.", author: "Harvey Diamond" },
  { text: "Make sure you have finished speaking before your audience has finished listening.", author: "Dorothy Sarnoff" },
  { text: "Speak clearly, if you speak at all; carve every word before you let it fall.", author: "Oliver Wendell Holmes" },
  { text: "Great stories happen to those who can tell them.", author: "Ira Glass" },
  { text: "The success of your presentation will be judged not by the knowledge you send but by what the listener receives.", author: "Lilly Walters" },
  { text: "Grip the audience with your opening hook, guide them with your structured map, and seal the deal with your conclusion.", author: "Speech Coach Tip" },
  { text: "It is not the words you speak, but the cadence, pitch, and passion behind them that make your message stick.", author: "Public Speaking Wisdom" },
  { text: "True eloquence consists in saying all that is necessary, and nothing but what is necessary.", author: "François de La Rochefoucauld" },
  { text: "Public speaking is the art of diluting a two-minute idea with a two-hour vocabulary.", author: "John Alston" },
  { text: "It takes one hour of preparation for each minute of presentation time.", author: "Wayne Burgraff" },
  { text: "A speaker should be like an elevator: smooth, fast, and drop people off on the right floor.", author: "Anonymous" },
  { text: "Only the prepared speaker deserves to be confident.", author: "Dale Carnegie" },
  { text: "Simple language is the most powerful vehicle for complex thoughts.", author: "Speech Masterclass" },
  { text: "Your audience will forgive a lack of polish, but they will never forgive a lack of preparation.", author: "Presentation Guide" },
  { text: "Loudness is not vocal power. Resonance, clarity, and articulation carry the weight of authority.", author: "Elocution Coach" },
  { text: "Speak up, speak out, speak clear, and never doubt the value of your story.", author: "Anonymous" },
  { text: "Habit is the intersection of knowledge, skill, and desire. Rehearse daily to build public speaking reflex.", author: "Stephen R. Covey (Adapted)" },
  { text: "The best way to conquer public speaking anxiety is to simulate the stage until it feels like home.", author: "Speech Science" }
];

// CURATED 31 WORDS OF THE DAY
const DAILY_WORDS = [
  { word: "Eloquence", ipa: "/ˈɛləkwəns/", def: "Fluent or persuasive speaking or writing.", sentence: "The senator delivered his speech with absolute eloquence, captivating the entire room." },
  { word: "Perspicacious", ipa: "/ˌpɜːspɪˈkeɪʃəs/", def: "Having a ready insight into and understanding of things.", sentence: "Her perspicacious analysis of the audience's mood allowed her to pivot her speech topic instantly." },
  { word: "Articulate", ipa: "/ɑːˈtɪkjʊlət/", def: "Having or showing the ability to speak fluently and coherently.", sentence: "He is an articulate speaker who explains technical engineering concepts in simple terms." },
  { word: "Cognizant", ipa: "/ˈkɒɡnɪz(ə)nt/", def: "Having knowledge or being aware of.", sentence: "A speaker must remain cognizant of their pacing, ensuring they do not speak too quickly." },
  { word: "Rhetoric", ipa: "/ˈrɛtərɪk/", def: "The art of effective or persuasive speaking or writing.", sentence: "Her use of classical rhetoric helped convince the board to approve the expansion project." },
  { word: "Elocution", ipa: "/ˌɛləˈkjuːʃ(ə)n/", def: "The skill of clear and expressive speech, especially of distinct pronunciation.", sentence: "She took elocution lessons to improve her pronunciation of consonant clusters." },
  { word: "Mellifluous", ipa: "/mɪˈlɪflʊəs/", def: "Sweet or musical; pleasant to hear.", sentence: "The announcer had a mellifluous voice that kept listeners tuned in for hours." },
  { word: "Resonant", ipa: "/ˈrɛz(ə)nənt/", def: "Deep, clear, and continuing to sound or ring.", sentence: "His resonant baritone voice filled the entire auditorium without needing a microphone." },
  { word: "Loquacious", ipa: "/ləˈkweɪʃəs/", def: "Tending to talk a great deal; talkative.", sentence: "An impromptu speech is a great exercise to help naturally loquacious speakers learn to be concise." },
  { word: "Laconic", ipa: "/ləˈkɒnɪk/", def: "Using very few words.", sentence: "His laconic style of presenting made every single word he spoke feel twice as important." },
  { word: "Grandiloquent", ipa: "/ɡrænˈdɪləkwənt/", def: "Pompous or extravagant in language, style, or manner.", sentence: "Avoid grandiloquent phrases when speaking to customers; clarity beats complex vocab." },
  { word: "Veracity", ipa: "/vəˈrasɪti/", def: "Conformity to facts; accuracy and truthfulness.", sentence: "To establish authority as a speaker, always verify the veracity of your stats." },
  { word: "Equivocate", ipa: "/ɪˈkwɪvəkeɪt/", def: "Use ambiguous language so as to conceal the truth or avoid committing oneself.", sentence: "During the Q&A session, the spokesperson tried to equivocate rather than give a direct answer." },
  { word: "Cacophony", ipa: "/kəˈkɒfəni/", def: "A harsh, discordant mixture of sounds.", sentence: "The cacophony of background noise in the café made it difficult for the voice recorder to evaluate her speech." },
  { word: "Euphemism", ipa: "/ˈjuːfəmɪz(ə)m/", def: "A mild or indirect word substituted for one considered to be too harsh.", sentence: "Using a euphemism like 'restructuring' instead of 'layoffs' is common in corporate addresses." },
  { word: "Garrulous", ipa: "/ˈɡærʊləs/", def: "Excessively talkative, especially on trivial matters.", sentence: "A garrulous presentation lacks focus; write bullet points to keep your delivery structured." },
  { word: "Hyperbole", ipa: "/hʌɪˈpəːbəli/", def: "Exaggerated statements or claims not meant to be taken literally.", sentence: "She used hyperbole in her opening pitch to highlight the scale of the customer's problem." },
  { word: "Iconoclast", ipa: "/ʌɪˈkɒnəklæst/", def: "A person who attacks cherished beliefs or institutions.", sentence: "As a speaker, he was an iconoclast, challenging long-held corporate management methodologies." },
  { word: "Juxtaposition", ipa: "/ˌdʒʌkstəpəˈzɪʃ(ə)n/", def: "The fact of two things being seen or placed close together with contrasting effect.", sentence: "The juxtaposition of a silent pause right after a loud exclamation creates dramatic tension." },
  { word: "Obfuscate", ipa: "/ˈɒbfʌskeɪt/", def: "Render obscure, unclear, or unintelligible.", sentence: "Jargon should not be used to obfuscate your main idea; keep slide bullets simple." },
  { word: "Pugnacious", ipa: "/pʌɡˈneɪʃəs/", def: "Eager or quick to argue, quarrel, or fight.", sentence: "When dealing with a pugnacious audience member, maintain a calm and professional tone." },
  { word: "Salubrious", ipa: "/səˈluːbrɪəs/", def: "Health-giving; healthy.", sentence: "Maintaining good vocal hygiene is salubrious for long-term voice projection." },
  { word: "Sinuous", ipa: "/ˈsɪnjʊəs/", def: "Having many curves and turns; graceful and winding.", sentence: "Her speech took a sinuous narrative path, weaving multiple anecdotes into a single call to action." },
  { word: "Soporific", ipa: "/ˌsɒpəˈrɪfɪk/", def: "Tending to induce drowsiness or sleep.", sentence: "Monotone vocal delivery is soporific; use vocal variety to keep your audience alert." },
  { word: "Ubiquitous", ipa: "/juːˈbɪkwɪtəs/", def: "Present, appearing, or found everywhere.", sentence: "Filler words like 'like' are ubiquitous in casual speech, but should be minimized in public addresses." },
  { word: "Vociferous", ipa: "/və(ʊ)ˈsɪfərəs/", def: "Vehement or clamorous; expressing opinions in a loud or forceful way.", sentence: "Despite vociferous objections from some stakeholders, the proposal was approved." },
  { word: "Synecdoche", ipa: "/sɪˈnɛkdəki/", def: "A figure of speech in which a part is made to represent the whole.", sentence: "Using 'wheels' to refer to a car is an example of synecdoche, a useful rhetorical device." },
  { word: "Blandishment", ipa: "/ˈblændɪʃm(ə)nt/", def: "A flattering or pleasing statement or action used to persuade someone.", sentence: "He resisted the interviewer's blandishments and stuck firmly to his prepared talking points." },
  { word: "Anonymity", ipa: "/ˌænəˈnɪmɪti/", def: "The condition of being anonymous.", sentence: "Practicing baseline sentences provides a safe zone of anonymity to train your vocal cords." },
  { word: "Zephyr", ipa: "/ˈzɛfə/", def: "A gentle, mild breeze.", sentence: "Let your breath flow smoothly like a zephyr, rather than forcing gasps of air between sentences." },
  { word: "Rapport", ipa: "/ræˈpɔː/", def: "A close and harmonious relationship in which people understand each other's feelings.", sentence: "Establishing quick rapport with your audience in the first 30 seconds is key to persuasive speaking." }
];

// Curated random topics for the 60-Second Reflex Challenge
const REFLEX_TOPICS = [
  "Describe your favorite childhood memory.",
  "What is the future of artificial intelligence in education?",
  "Why is active listening crucial in leadership?",
  "If you could travel anywhere in the world right now, where and why?",
  "Explain the value of failure as a prerequisite for success.",
  "Describe a book or movie that significantly changed your outlook.",
  "What are the benefits of wake-up routines?",
  "How does public speaking build self-confidence?",
  "Describe how you handle difficult decisions under stress.",
  "Why do you think storytelling is so powerful in communication?"
];

const DailyRoutine = ({ user, setActiveTab }) => {
  // Select quote and word based on date of month (1-31)
  const dayOfMonth = new Date().getDate();
  const todayQuote = DAILY_QUOTES[(dayOfMonth - 1) % DAILY_QUOTES.length];
  const todayWord = DAILY_WORDS[(dayOfMonth - 1) % DAILY_WORDS.length];

  // State loaded from localStorage or DB
  const [streak, setStreak] = useState(0);
  const [completedToday, setCompletedToday] = useState(false);
  const [habits, setHabits] = useState({
    quoteRead: false,
    wordPracticed: false,
    reflexDone: false,
    speakUpDone: false,
    studioDone: false,
    impromptuDone: false
  });

  // Reflex Game State
  const [reflexState, setReflexState] = useState('idle'); // 'idle' | 'countdown' | 'running' | 'completed'
  const [reflexTopic, setReflexTopic] = useState('');
  const [timer, setTimer] = useState(60);
  const countdownIntervalRef = useRef(null);
  const timerIntervalRef = useRef(null);

  useEffect(() => {
    loadProgress();
  }, [user]);

  const loadProgress = () => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];

      // 1. Try loading from logged-in user object first
      if (user) {
        const dbStreak = user.dailyStreak ? parseInt(user.dailyStreak, 10) : 0;
        const dbLastCheck = user.lastCheckInDate || '';
        const dbHabits = user.dailyHabits || null;

        setStreak(dbStreak);
        if (dbLastCheck === todayStr) {
          setCompletedToday(true);
        } else {
          setCompletedToday(false);
        }

        if (dbHabits) {
          if (dbLastCheck === todayStr) {
            setHabits(dbHabits);
          } else {
            setHabits({
              quoteRead: false,
              wordPracticed: false,
              reflexDone: false,
              speakUpDone: false,
              studioDone: false,
              impromptuDone: false
            });
          }
        } else {
          setHabits({
            quoteRead: false,
            wordPracticed: false,
            reflexDone: false,
            speakUpDone: false,
            studioDone: false,
            impromptuDone: false
          });
        }
        return;
      }

      // 2. Fallback to localStorage for guest/unregistered users
      const storedStreak = localStorage.getItem('speechDailyStreak');
      const storedLastCheck = localStorage.getItem('speechDailyLastCheck');
      const storedHabits = localStorage.getItem('speechDailyHabits');

      if (storedStreak) {
        setStreak(parseInt(storedStreak, 10));
      }

      if (storedLastCheck === todayStr) {
        setCompletedToday(true);
      } else {
        setCompletedToday(false);
      }

      if (storedHabits) {
        const parsed = JSON.parse(storedHabits);
        const lastHabitDate = localStorage.getItem('speechDailyHabitsDate');
        if (lastHabitDate === todayStr) {
          setHabits(parsed);
        } else {
          setHabits({
            quoteRead: false,
            wordPracticed: false,
            reflexDone: false,
            speakUpDone: false,
            studioDone: false,
            impromptuDone: false
          });
        }
      }
    } catch (e) {
      console.error("Failed to load daily routine progress:", e);
    }
  };

  const saveHabits = async (newHabits) => {
    setHabits(newHabits);
    const todayStr = new Date().toISOString().split('T')[0];
    localStorage.setItem('speechDailyHabits', JSON.stringify(newHabits));
    localStorage.setItem('speechDailyHabitsDate', todayStr);

    const allChecked = Object.values(newHabits).every(val => val === true);
    let newStreak = streak;
    let nextCompletedToday = completedToday;

    if (allChecked && !completedToday) {
      newStreak = streak + 1;
      setStreak(newStreak);
      nextCompletedToday = true;
      localStorage.setItem('speechDailyStreak', newStreak.toString());
      localStorage.setItem('speechDailyLastCheck', todayStr);
    }

    // Sync to DynamoDB if user is registered/logged in
    if (user) {
      try {
        const userId = user.id || user.userId;
        await fetch(`${API_BASE_URL}/update-streak`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            streak: newStreak,
            lastCheckInDate: nextCompletedToday ? todayStr : (user.lastCheckInDate || ''),
            habits: newHabits
          })
        });
        
        // Also update local cached user object in localStorage
        const stored = localStorage.getItem('speechUser');
        if (stored) {
          const parsed = JSON.parse(stored);
          parsed.dailyStreak = newStreak;
          parsed.lastCheckInDate = nextCompletedToday ? todayStr : (parsed.lastCheckInDate || '');
          parsed.dailyHabits = newHabits;
          localStorage.setItem('speechUser', JSON.stringify(parsed));
        }
      } catch (err) {
        console.warn("Failed to sync daily routine streak to database:", err);
      }
    }
  };

  const toggleHabit = (key) => {
    const updated = { ...habits, [key]: !habits[key] };
    saveHabits(updated);
  };

  // TTS for Word of the Day
  const handlePronounceWord = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(todayWord.word);
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
    // Auto-check the learn word habit
    if (!habits.wordPracticed) {
      toggleHabit('wordPracticed');
    }
  };

  // Reflex Game Logic
  const startReflexGame = () => {
    const randomTopic = REFLEX_TOPICS[Math.floor(Math.random() * REFLEX_TOPICS.length)];
    setReflexTopic(randomTopic);
    setReflexState('countdown');
    setTimer(3);

    // 3 Second Countdown
    countdownIntervalRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current);
          setReflexState('running');
          // Start 60 second speech timer
          setTimer(60);
          timerIntervalRef.current = setInterval(() => {
            setTimer(t => {
              if (t <= 1) {
                clearInterval(timerIntervalRef.current);
                setReflexState('completed');
                return 0;
              }
              return t - 1;
            });
          }, 1000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const cancelReflexGame = () => {
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setReflexState('idle');
  };

  const handleReflexFeedback = (success) => {
    if (success) {
      toggleHabit('reflexDone');
    }
    setReflexState('idle');
  };

  useEffect(() => {
    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  // Compute stats
  const totalTasks = Object.keys(habits).length;
  const completedTasks = Object.values(habits).filter(val => val === true).length;
  const progressPercent = Math.round((completedTasks / totalTasks) * 100);

  // Curated habit tracking visual helper
  const taskConfig = [
    { key: 'quoteRead', label: 'Absorb Daily Speaking Insight', detail: 'Read the motivational public speaking quote of the day', type: 'internal' },
    { key: 'wordPracticed', label: 'Master Word of the Day', detail: 'Listen, pronounce, and understand today\'s high-level vocabulary word', type: 'internal' },
    { key: 'reflexDone', label: 'Complete 60-Second Reflex Challenge', detail: 'Speak on a random topic with zero filler words', type: 'game' },
    { key: 'speakUpDone', label: 'SpeakUp', detail: 'Upload or record a prepared video baseline', tab: 'practice', icon: Video, color: '#22c55e' },
    { key: 'studioDone', label: 'Speech Studio', detail: 'Complete a phoneme accuracy drill', tab: 'speech-studio', icon: Target, color: '#ef4444' },
    { key: 'impromptuDone', label: '60-Second Impromptu Speech Session', detail: 'Address a random impromptu topic card', tab: 'impromptu', icon: Sparkles, color: '#38bdf8' }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem 1.25rem 4rem' }}>
      
      {/* Upper header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 className="gradient-text" style={{ fontSize: '2.6rem', fontWeight: '900', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
          🎯 Daily Speech Routine
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '650px', margin: '0 auto', lineHeight: '1.5' }}>
          Build the habit of eloquent speaking. Dedicate 5 minutes every day to complete your checklist, maintain your streak, and sharpen your reflexes.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.75rem', alignItems: 'stretch', marginBottom: '2rem' }}>
        
        {/* LEFT COLUMN: STREAK & CURATED LEARNINGS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          
          {/* Daily Habit Streak Panel */}
          <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '1.25rem', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(239, 68, 68, 0.08))' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '1.25rem', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <Flame size={34} color="#f59e0b" style={{ filter: 'drop-shadow(0 0 8px #f59e0b)' }} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)' }}>Habit Streak</h3>
                <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {completedToday ? 'You maintained your streak today! 🔥' : 'Complete today\'s routine to keep the fire burning!'}
                </p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '950', color: '#f59e0b', lineHeight: '1' }}>{streak}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase', marginTop: '0.2rem' }}>Days Active</div>
            </div>
          </div>

          {/* Motivational Quote Card */}
          <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '1.25rem', border: '1px solid var(--glass-border)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-1rem', right: '-1rem', opacity: 0.04, color: 'var(--text-primary)' }}>
              <Quote size={120} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <Quote size={20} color="#a855f7" />
              <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#a855f7', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Insight Of the Day</h4>
            </div>
            <blockquote style={{ margin: '0 0 0.85rem 0', fontSize: '1.15rem', color: 'var(--text-primary)', fontWeight: '600', fontStyle: 'italic', lineHeight: '1.45' }}>
              "{todayQuote.text}"
            </blockquote>
            <cite style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '700', textAlign: 'right' }}>
              — {todayQuote.author}
            </cite>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              {!habits.quoteRead && (
                <button
                  onClick={() => toggleHabit('quoteRead')}
                  style={{ padding: '0.35rem 0.75rem', borderRadius: '0.5rem', border: '1px solid rgba(168,85,247,0.3)', background: 'rgba(168,85,247,0.08)', color: '#a855f7', fontSize: '0.75rem', fontWeight: '800', cursor: 'pointer' }}
                >
                  Mark as Read & Absorb
                </button>
              )}
            </div>
          </div>

          {/* Word of the Day Card */}
          <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '1.25rem', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <BookOpen size={20} color="#10b981" />
                <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#10b981', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Word Of the Day</h4>
              </div>
              <span style={{ fontSize: '0.78rem', color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '0.25rem 0.55rem', borderRadius: '0.5rem', fontWeight: '800' }}>
                Vocab Booster
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: '950', color: 'var(--text-primary)' }}>
                {todayWord.word}
              </div>
              <div style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontStyle: 'italic', fontWeight: '500' }}>
                {todayWord.ipa}
              </div>
              <button
                onClick={handlePronounceWord}
                style={{
                  width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(16,185,129,0.1)',
                  border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#10b981'
                }}
                title="Hear Pronunciation"
              >
                <Volume2 size={16} />
              </button>
            </div>

            <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '0.85rem', lineHeight: '1.4' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Definition: </strong>
              {todayWord.def}
            </div>

            <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.65rem', border: '1px solid var(--glass-border)', fontSize: '0.88rem', fontStyle: 'italic', color: 'var(--text-primary)', lineHeight: '1.4' }}>
              "{todayWord.sentence}"
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: PROGRESS & CHECKLIST */}
        <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '1.25rem', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', justifyItems: 'stretch' }}>
          
          {/* XP Progress Bar */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
              <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Zap size={18} color="#f59e0b" /> Daily Completion
              </span>
              <span style={{ fontSize: '1.1rem', fontWeight: '900', color: progressPercent === 100 ? '#22c55e' : 'var(--text-primary)' }}>
                {completedTasks}/{totalTasks} Tasks ({progressPercent}%)
              </span>
            </div>
            <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
              <div
                style={{
                  width: `${progressPercent}%`,
                  height: '100%',
                  background: progressPercent === 100 ? 'linear-gradient(90deg, #22c55e, #10b981)' : 'linear-gradient(90deg, #a855f7, #38bdf8)',
                  borderRadius: '999px',
                  transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />
            </div>
          </div>

          {/* Action Checklist Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
            {taskConfig.map(task => {
              const isChecked = habits[task.key];
              return (
                <div
                  key={task.key}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: '0.85rem',
                    background: isChecked ? 'rgba(34,197,94,0.03)' : 'rgba(255,255,255,0.01)',
                    border: isChecked ? '1px solid rgba(34,197,94,0.3)' : '1px solid var(--glass-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', minWidth: 0 }}>
                    {/* Check Circle Button */}
                    <button
                      onClick={() => toggleHabit(task.key)}
                      style={{
                        background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                        color: isChecked ? '#22c55e' : 'var(--text-secondary)', display: 'flex', alignItems: 'center'
                      }}
                    >
                      <CheckCircle2 size={24} style={{ fill: isChecked ? 'rgba(34,197,94,0.2)' : 'none', transition: 'all 0.2s' }} />
                    </button>
                    
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: '700', color: isChecked ? 'var(--text-secondary)' : 'var(--text-primary)', textDecoration: isChecked ? 'line-through' : 'none', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {task.label}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {task.detail}
                      </div>
                    </div>
                  </div>

                  {/* Direct Link Action button (for drills/sessions) */}
                  {task.tab && (
                    <button
                      onClick={() => setActiveTab(task.tab)}
                      style={{
                        padding: '0.35rem 0.65rem', borderRadius: '0.5rem',
                        background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)',
                        color: task.color || 'var(--text-primary)', fontSize: '0.78rem', fontWeight: '800',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem',
                        flexShrink: 0
                      }}
                    >
                      {task.icon && <task.icon size={12} />} Launch <ArrowRight size={12} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* 60-SECOND NO-FILLER REFLEX CHALLENGE GAME (Zone C Habit Booster) */}
      <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: '1.25rem', border: '1px solid var(--glass-border)', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(168, 85, 247, 0.08))' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={20} color="#6366f1" style={{ filter: 'drop-shadow(0 0 5px #6366f1)' }} /> Habit Booster: The 60-Second No-Filler Challenge
            </h3>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Train your brain to pause instead of saying vocal fillers like <em>"um"</em>, <em>"uh"</em>, or <em>"like"</em>. Speak aloud on the topic!
            </p>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#6366f1', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', padding: '0.25rem 0.6rem', borderRadius: '0.5rem', fontWeight: '800' }}>
            Interactive Training
          </span>
        </div>

        <AnimatePresence mode="wait">
          {reflexState === 'idle' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
              <div style={{ fontSize: '1rem', color: 'var(--text-primary)', fontWeight: '600', marginBottom: '1.25rem' }}>
                Ready to test your speech discipline? Take the 60-second speaking challenge.
              </div>
              <button
                onClick={startReflexGame}
                style={{
                  padding: '0.65rem 1.5rem', borderRadius: '0.75rem', background: 'var(--accent-gradient)',
                  color: '#fff', border: 'none', fontWeight: '800', fontSize: '0.95rem', cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 15px rgba(99,102,241,0.3)'
                }}
              >
                <Play size={16} fill="#fff" /> Start Reflex Challenge
              </button>
            </motion.div>
          )}

          {reflexState === 'countdown' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
              <div style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Prepare to Speak in...
              </div>
              <motion.div
                key={timer}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 1 }}
                style={{ fontSize: '3.5rem', fontWeight: '950', color: '#a855f7' }}
              >
                {timer}
              </motion.div>
              <button
                onClick={cancelReflexGame}
                style={{ marginTop: '1rem', padding: '0.35rem 0.8rem', borderRadius: '0.5rem', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-secondary)', fontSize: '0.8rem', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </motion.div>
          )}

          {reflexState === 'running' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem', alignItems: 'center', padding: '0.5rem 0' }}>
                <div style={{ padding: '1.25rem', background: 'rgba(0,0,0,0.2)', borderRadius: '1rem', border: '1px solid var(--glass-border)' }}>
                  <div style={{ fontSize: '0.78rem', color: '#6366f1', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.35rem' }}>
                    Speak Aloud About this topic:
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-primary)', lineHeight: '1.4' }}>
                    {reflexTopic}
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: '950', color: timer <= 10 ? '#ef4444' : '#6366f1' }}>
                    0:{timer < 10 ? `0${timer}` : timer}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', margin: '0.5rem 0' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6366f1', animation: 'pulse 1.2s infinite ease-in-out' }} />
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Microphone active</span>
                  </div>
                  <button
                    onClick={cancelReflexGame}
                    style={{ padding: '0.35rem 0.8rem', borderRadius: '0.5rem', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-secondary)', fontSize: '0.78rem', cursor: 'pointer' }}
                  >
                    Stop Early
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {reflexState === 'completed' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: 'center', padding: '1rem 0' }}>
              <Trophy size={42} color="#f59e0b" style={{ marginBottom: '0.75rem', filter: 'drop-shadow(0 0 5px rgba(245,158,11,0.4))' }} />
              <div style={{ fontSize: '1.15rem', fontWeight: '850', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>Challenge Completed!</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                Self-evaluate honestly: Did you speak for the entire duration without using filler words?
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <button
                  onClick={() => handleReflexFeedback(true)}
                  style={{ padding: '0.55rem 1.25rem', borderRadius: '#0.65rem', background: '#22c55e', color: '#fff', border: 'none', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <CheckCircle2 size={16} /> Yes, I avoided fillers!
                </button>
                <button
                  onClick={() => handleReflexFeedback(false)}
                  style={{ padding: '0.55rem 1.25rem', borderRadius: '#0.65rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', fontWeight: '800', cursor: 'pointer' }}
                >
                  No, I slipped up
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};

export default DailyRoutine;
