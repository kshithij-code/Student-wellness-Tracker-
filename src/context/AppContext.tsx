import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { db } from '../db';
import type { JournalEntry, ChatMessage, ExamCountdown, NewsItem, StudentProfile, ChatThread } from '../types';

interface AppContextType {
  journals: JournalEntry[];
  chatHistory: ChatMessage[];
  countdowns: ExamCountdown[];
  streak: number;
  averageMood: number;
  detectedTriggers: string[];
  isAnalyzing: boolean;
  isTyping: boolean;
  newsFeed: NewsItem[];
  profile: StudentProfile | null;
  isOnboardingCompleted: boolean;
  completeOnboarding: (profile: StudentProfile) => Promise<void>;
  updateStudentProfile: (profile: StudentProfile) => Promise<void>;
  addJournalEntry: (mood: number, content: string) => Promise<void>;
  deleteJournalEntry: (id: number) => Promise<void>;
  addChatMessage: (text: string) => Promise<void>;
  clearChatHistory: () => Promise<void>;
  addExamCountdown: (title: string, date: string, time?: string) => Promise<void>;
  deleteExamCountdown: (id: number) => Promise<void>;
  exportBackup: () => void;
  clearAllData: () => Promise<void>;
  apiKey: string;
  setGeminiApiKey: (key: string) => Promise<void>;
  threads: ChatThread[];
  activeThreadId: string;
  setActiveThreadId: (id: string) => void;
  createNewThread: (title?: string) => Promise<string>;
  deleteThread: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_NEWS: NewsItem[] = [
  {
    id: 'news-init-1',
    title: 'University Announces Expanded Virtual Counseling Hours for Midterms',
    category: 'Official Update',
    summary: 'A new mental support framework will remain online 24/7 this semester to ease student evaluation schedules. Chat support is accessible directly through your portal.',
    date: '2026-06-18',
    readTime: '3 min read',
    link: '#',
  }
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [countdowns, setCountdowns] = useState<ExamCountdown[]>([]);
  const [streak, setStreak] = useState<number>(0);
  const [averageMood, setAverageMood] = useState<number>(0);
  const [detectedTriggers, setDetectedTriggers] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [newsFeed, setNewsFeed] = useState<NewsItem[]>(INITIAL_NEWS);

  // API key & Custom chat threads state
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('sa_custom_api_key') || '');
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string>('default');

  const setGeminiApiKey = async (key: string) => {
    localStorage.setItem('sa_custom_api_key', key);
    setApiKey(key);
  };
  
  // Onboarding profile state
  const [profile, setProfileState] = useState<StudentProfile | null>(null);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<boolean>(false);

  // Initialize threads on mount
  useEffect(() => {
    const savedThreads = localStorage.getItem('sa_chat_threads');
    const savedActive = localStorage.getItem('sa_active_thread_id');
    if (savedThreads) {
      try {
        const parsed = JSON.parse(savedThreads) as ChatThread[];
        setThreads(parsed);
        if (savedActive) {
          setActiveThreadId(savedActive);
        } else if (parsed.length > 0) {
          setActiveThreadId(parsed[0].id);
        }
      } catch (e) {
        console.error("Failed to parse saved chat threads:", e);
      }
    } else {
      const initial: ChatThread[] = [
        { id: 'default', title: 'Serene Sanctuary', createdAt: Date.now() }
      ];
      setThreads(initial);
      localStorage.setItem('sa_chat_threads', JSON.stringify(initial));
      setActiveThreadId('default');
      localStorage.setItem('sa_active_thread_id', 'default');
    }
  }, []);

  // Load profile on start
  useEffect(() => {
    const savedProfile = localStorage.getItem('sa_student_profile');
    const onboardStatus = localStorage.getItem('sa_onboard_completed') === 'true';
    if (savedProfile) {
      try {
        setProfileState(JSON.parse(savedProfile));
        setIsOnboardingCompleted(onboardStatus);
      } catch (e) {
        console.error("Failed to parse student profile:", e);
      }
    } else {
      setIsOnboardingCompleted(false);
    }
  }, []);

  // Fetch real-time news from Express server API on load
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/news");
        if (res.ok) {
          const data = await res.json();
          setNewsFeed(data);
        }
      } catch (err) {
        console.warn("Could not retrieve news feed from backend, staying with fallback", err);
      }
    };
    fetchNews();
  }, []);

  // Complete onboarding wizard
  const completeOnboarding = async (userProfile: StudentProfile) => {
    localStorage.setItem('sa_student_profile', JSON.stringify(userProfile));
    localStorage.setItem('sa_onboard_completed', 'true');
    setProfileState(userProfile);
    setIsOnboardingCompleted(true);

    // If they have defined an exam date, auto-populate in countdown database
    if (userProfile.targetExamTitle && userProfile.targetExamDate) {
      await addExamCountdown(userProfile.targetExamTitle, userProfile.targetExamDate);
    }

    // Seed the chat history with a lovely conversational welcomes message from Serene
    try {
      const dbChatCount = await db.chatHistory.count();
      if (dbChatCount === 0) {
        const welcomeText = `Hello, ${userProfile.name}! I'm Serene, your student mental wellness companion. I understand things can get quite tense preparing for ${userProfile.examType || 'your exams'}, especially dealing with triggers like ${userProfile.stressTriggers?.slice(0, 2).join(' or ') || 'general pressure'}. 

I am here to help you breathe, vent, or organize your thoughts. What’s on your mind today? Let’s take things one step at a time.`;
        
        await db.chatHistory.add({
          sender: 'serene',
          text: welcomeText,
          timestamp: Date.now()
        });
        await reloadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Update profile settings
  const updateStudentProfile = async (newProfile: StudentProfile) => {
    localStorage.setItem('sa_student_profile', JSON.stringify(newProfile));
    setProfileState(newProfile);
  };

  // Fetch all state from Dexie Database
  const reloadData = async () => {
    try {
      const dbJournals = await db.journals.orderBy('date').reverse().toArray();
      const dbChat = await db.chatHistory.orderBy('timestamp').toArray();
      const dbCountdowns = await db.countdowns.orderBy('date').toArray();

      setJournals(dbJournals);
      
      // Filter chat messages to matches activeThreadId. If there's no activeThreadId or it's empty, use 'default'
      const filteredChat = dbChat.filter(msg => {
        const tId = msg.threadId || 'default';
        return tId === activeThreadId;
      });
      setChatHistory(filteredChat);
      setCountdowns(dbCountdowns);

      calculateMetrics(dbJournals);
    } catch (e) {
      console.error('Failed to load data from IndexedDB:', e);
    }
  };

  useEffect(() => {
    reloadData();
  }, [activeThreadId]);

  // Calculate Streak & Metrics from Journal entries
  const calculateMetrics = (entries: JournalEntry[]) => {
    if (entries.length === 0) {
      setStreak(0);
      setAverageMood(0);
      setDetectedTriggers([]);
      return;
    }

    // 1. Average Mood
    const totalMood = entries.reduce((sum, e) => sum + e.mood, 0);
    const avg = parseFloat((totalMood / entries.length).toFixed(1));
    setAverageMood(avg);

    // 2. Well-being Streak calculation
    const entryDates = new Set<string>();
    entries.forEach(e => {
      try {
        const d = new Date(e.date);
        const yyyymmdd = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        entryDates.add(yyyymmdd);
      } catch (err) {
        console.error('Invalid date format:', e.date);
      }
    });

    let currentStreak = 0;
    const today = new Date();
    let checkDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const getFormatted = (d: Date) => 
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    const todayStr = getFormatted(checkDate);
    const yesterday = new Date(checkDate);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = getFormatted(yesterday);

    if (entryDates.has(todayStr) || entryDates.has(yesterdayStr)) {
      if (entryDates.has(todayStr)) {
        currentStreak = 1;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        currentStreak = 0; 
        checkDate = yesterday;
      }

      while (true) {
        const checkStr = getFormatted(checkDate);
        if (entryDates.has(checkStr)) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }
    setStreak(currentStreak);

    // 3. Extracted stress triggers aggregation
    const triggers = new Set<string>();
    entries.forEach(e => {
      if (e.analysis?.stressTriggers) {
        e.analysis.stressTriggers.forEach(t => triggers.add(t));
      }
    });
    setDetectedTriggers(Array.from(triggers).slice(0, 4));
  };

  // Add Journal Entry calling Express server API
  const addJournalEntry = async (mood: number, content: string) => {
    setIsAnalyzing(true);
    try {
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (apiKey) {
        headers["x-custom-api-key"] = apiKey;
      }

      const res = await fetch("/api/journal/analyze", {
        method: "POST",
        headers,
        body: JSON.stringify({ content, mood, profile }),
      });

      let analysis;
      if (res.ok) {
        analysis = await res.json();
      } else {
        throw new Error("Failed to call API analysis");
      }

      const newEntry: JournalEntry = {
        date: new Date().toISOString(),
        mood,
        content,
        analysis,
      };

      await db.journals.add(newEntry);
      await reloadData();
    } catch (e) {
      console.error('Error adding journal entry:', e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const deleteJournalEntry = async (id: number) => {
    try {
      await db.journals.delete(id);
      await reloadData();
    } catch (e) {
      console.error('Error deleting journal entry:', e);
    }
  };

  // Send message to Serene via Express server API
  const addChatMessage = async (text: string) => {
    if (!text.trim()) return;

    try {
      const userMsg: ChatMessage = {
        threadId: activeThreadId,
        sender: 'user',
        text: text.trim(),
        timestamp: Date.now(),
      };
      const savedUserMsgId = await db.chatHistory.add(userMsg);
      
      const updatedHistory = [...chatHistory, { ...userMsg, id: savedUserMsgId }];
      setChatHistory(updatedHistory);

      setIsTyping(true);

      const latestJournal = journals[0]; 

      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (apiKey) {
        headers["x-custom-api-key"] = apiKey;
      }

      // Post message to Express API backend
      const res = await fetch("/api/chat/respond", {
        method: "POST",
        headers,
        body: JSON.stringify({ chatHistory: updatedHistory, latestJournal, profile }),
      });

      let responseText = "I missed that. Can you repeat?";
      if (res.ok) {
        const data = await res.json();
        responseText = data.response;
      }

      const botMsg: ChatMessage = {
        threadId: activeThreadId,
        sender: 'serene',
        text: responseText,
        timestamp: Date.now(),
      };

      await db.chatHistory.add(botMsg);
      await reloadData();
    } catch (e) {
      console.error('Error adding chat message:', e);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChatHistory = async () => {
    try {
      const allMsgs = await db.chatHistory.toArray();
      const toDeleteIds = allMsgs.filter(m => (m.threadId || 'default') === activeThreadId).map(m => m.id).filter(id => id !== undefined) as number[];
      if (toDeleteIds.length > 0) {
        await db.chatHistory.bulkDelete(toDeleteIds);
      }
      await reloadData();
    } catch (e) {
      console.error('Error clearing chat history:', e);
    }
  };

  const addExamCountdown = async (title: string, date: string, time?: string) => {
    try {
      const newCountdown: ExamCountdown = {
        title,
        date,
        time: time || '00:00',
      };
      await db.countdowns.add(newCountdown);
      await reloadData();
    } catch (e) {
      console.error('Error adding countdown:', e);
    }
  };

  const deleteExamCountdown = async (id: number) => {
    try {
      await db.countdowns.delete(id);
      await reloadData();
    } catch (e) {
      console.error('Error deleting countdown:', e);
    }
  };

  const createNewThread = async (title?: string) => {
    const newId = 'thread_' + Date.now();
    const displayTitle = title || `Talk Session ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`;
    
    const newThread: ChatThread = {
      id: newId,
      title: displayTitle,
      createdAt: Date.now()
    };
    
    const updated = [newThread, ...threads];
    setThreads(updated);
    localStorage.setItem('sa_chat_threads', JSON.stringify(updated));
    localStorage.setItem('sa_active_thread_id', newId);
    setActiveThreadId(newId);

    // Initial warm greeting specifically for this new session
    const userName = profile?.name || 'Student';
    const welcomeText = `Hello, ${userName}! Welcome to a fresh, safe, and secure chat thread. What's on your mind today? Let's unpack whatever is stressing you out.`;
    
    await db.chatHistory.add({
      threadId: newId,
      sender: 'serene',
      text: welcomeText,
      timestamp: Date.now()
    });

    return newId;
  };

  const deleteThread = async (id: string) => {
    if (id === 'default') {
      // Clear all messages belonging to default thread rather than erasing it
      const allMsgs = await db.chatHistory.toArray();
      const toDeleteIds = allMsgs.filter(m => (m.threadId || 'default') === 'default').map(m => m.id).filter(id => id !== undefined) as number[];
      if (toDeleteIds.length > 0) {
        await db.chatHistory.bulkDelete(toDeleteIds);
      }
      const welcomeText = `A brand new clean slate! Hello, ${profile?.name || 'Student'}. How can I best guide or support your mental space today?`;
      await db.chatHistory.add({
        threadId: 'default',
        sender: 'serene',
        text: welcomeText,
        timestamp: Date.now()
      });
      await reloadData();
      return;
    }

    const updated = threads.filter(t => t.id !== id);
    setThreads(updated);
    localStorage.setItem('sa_chat_threads', JSON.stringify(updated));

    const allMsgs = await db.chatHistory.toArray();
    const toDeleteIds = allMsgs.filter(m => m.threadId === id).map(m => m.id).filter(id => id !== undefined) as number[];
    if (toDeleteIds.length > 0) {
      await db.chatHistory.bulkDelete(toDeleteIds);
    }

    if (activeThreadId === id) {
      const fallbackId = updated.length > 0 ? updated[0].id : 'default';
      localStorage.setItem('sa_active_thread_id', fallbackId);
      setActiveThreadId(fallbackId);
    } else {
      await reloadData();
    }
  };

  const exportBackup = () => {
    const backupData = {
      exportedAt: new Date().toISOString(),
      journals,
      countdowns,
      profile,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `mindfulcampus_backup_${new Date().toISOString().substring(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const clearAllData = async () => {
    try {
      await db.journals.clear();
      await db.chatHistory.clear();
      await db.countdowns.clear();
      localStorage.removeItem('sa_student_profile');
      localStorage.removeItem('sa_onboard_completed');
      setProfileState(null);
      setIsOnboardingCompleted(false);
      await reloadData();
    } catch (e) {
      console.error('Error clearing database:', e);
    }
  };

  return (
    <AppContext.Provider
      value={{
        journals,
        chatHistory,
        countdowns,
        streak,
        averageMood,
        detectedTriggers,
        isAnalyzing,
        isTyping,
        newsFeed,
        profile,
        isOnboardingCompleted,
        completeOnboarding,
        updateStudentProfile,
        addJournalEntry,
        deleteJournalEntry,
        addChatMessage,
        clearChatHistory,
        addExamCountdown,
        deleteExamCountdown,
        exportBackup,
        clearAllData,
        apiKey,
        setGeminiApiKey,
        threads,
        activeThreadId,
        setActiveThreadId,
        createNewThread,
        deleteThread,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
