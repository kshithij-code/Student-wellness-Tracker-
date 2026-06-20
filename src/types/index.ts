export interface JournalAnalysis {
  emotionalState: string[];
  stressTriggers: string[];
  copingCard: string;
  analyzedAt: string;
  evaluatedMood?: number; // 1-10 text sentiment evaluated by Gemini
}

export interface JournalEntry {
  id?: number;
  date: string; // ISO string or YYYY-MM-DD
  mood: number; // 1-10 selected by user
  content: string;
  analysis?: JournalAnalysis;
}

export interface ChatMessage {
  id?: number;
  threadId?: string; // thread identifier
  sender: 'user' | 'serene' | 'system';
  text: string;
  timestamp: number; // ms timestamp
}

export interface ChatThread {
  id: string;
  title: string;
  createdAt: number;
}

export interface ExamCountdown {
  id?: number;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
}

export interface NewsItem {
  id: string;
  title: string;
  category: 'Official Update' | 'Study Tip' | 'Wellness advice' | 'Support Hub';
  summary: string;
  date: string;
  readTime?: string;
  link?: string;
}

export interface StudentProfile {
  name: string;
  major: string;
  yearOfStudy: string;
  examType: string;
  stressTriggers: string[];
  targetExamTitle: string;
  targetExamDate: string;
  studyGoalHours: number;
}

export interface SelfDoubtDeconstruction {
  id?: string;
  originalThought: string;
  distortionType: string;
  distortionExplanation: string;
  evidenceFor: string;
  evidenceAgainst: string;
  reframedThought: string;
  createdAt?: number;
}


