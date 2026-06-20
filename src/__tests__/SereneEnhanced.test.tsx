import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';

// Import target helpers and page components to test
import { analyzeJournalEntry, generateChatResponse } from '../services/gemini';
import Settings from '../pages/Settings';
import Dashboard from '../pages/Dashboard';

// Mock Mock context hooks to run component-level tests flawlessly
const mockSetGeminiApiKey = vi.fn();
const mockExportBackup = vi.fn();
const mockClearAllData = vi.fn();

vi.mock('../context/AppContext', () => {
  return {
    useApp: () => ({
      apiKey: 'test-personalza-api-key',
      setGeminiApiKey: mockSetGeminiApiKey,
      exportBackup: mockExportBackup,
      clearAllData: mockClearAllData,
      journals: [
        {
          id: 101,
          date: '2026-06-20',
          mood: 7,
          content: 'Preparing well for the math exam today',
          analysis: {
            emotionalState: ['Resilient', 'Anxious'],
            stressTriggers: ['Academic pressure'],
            copingCard: 'Keep breathing and maintain routine limits.',
            analyzedAt: '2026-06-20T00:00:00.000Z',
            evaluatedMood: 6
          }
        }
      ],
      streak: 5,
      averageMood: 8.2,
      countdowns: [],
      detectedTriggers: [],
      addJournalEntry: vi.fn(),
      isAnalyzing: false,
      profile: {
        name: 'Jane Doe',
        major: 'Computer Science',
        yearOfStudy: 'Sophomore',
        examType: 'Midterm exams',
        targetExamTitle: 'CS 101 Finals',
        studyGoalHours: 6,
        stressTriggers: ['Time Management', 'Exam Pressure']
      },
      threads: [
        { id: 'default', title: 'Serene Sanctuary', createdAt: Date.now() },
        { id: 'custom-session-1', title: 'Talk Session Info', createdAt: Date.now() }
      ],
      activeThreadId: 'default',
      setActiveThreadId: vi.fn(),
      createNewThread: vi.fn(),
      deleteThread: vi.fn()
    })
  };
});

describe('Serene Enhanced Component & Services Test Suite', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Settings Page Component Tests', () => {
    it('renders the Gemini configuration panels and handles typing keys', () => {
      render(<Settings />);

      // Verify header titles display beautifully
      expect(screen.getByText('Gemini API Key Configuration')).toBeInTheDocument();
      expect(screen.getByText('Verify & Cache Secret')).toBeInTheDocument();

      // Verify the input loads existing context API key
      const keyInput = screen.getByLabelText(/Custom Gemini API Key/i) as HTMLInputElement;
      expect(keyInput.value).toBe('test-personalza-api-key');

      // Test editing Key entry
      fireEvent.change(keyInput, { target: { value: 'AIzaSyNewCustomTestKeySecret' } });
      expect(keyInput.value).toBe('AIzaSyNewCustomTestKeySecret');
    });

    it('triggers save callbacks upon submitting custom secret API key', () => {
      render(<Settings />);

      const keyInput = screen.getByLabelText(/Custom Gemini API Key/i) as HTMLInputElement;
      fireEvent.change(keyInput, { target: { value: 'NewToken' } });

      const submitButton = screen.getByText('Verify & Cache Secret');
      fireEvent.click(submitButton);

      // setGeminiApiKey should be requested with cleaned input
      expect(mockSetGeminiApiKey).toHaveBeenCalledWith('NewToken');
    });
  });

  describe('Dashboard Metrics & Profile Tests', () => {
    it('displays personalized study times, targets, and active student gauges', () => {
      render(<Dashboard onNavigate={vi.fn()} />);

      // Verify customized student greeting renders
      expect(screen.getByText(/Jane Doe/)).toBeInTheDocument();

      // Check key stats and labels
      expect(screen.getByText(/CS 101 Finals/)).toBeInTheDocument();
      expect(screen.getByText(/Time Management/)).toBeInTheDocument();
      expect(screen.getByText(/Exam Pressure/)).toBeInTheDocument();
    });
  });

  describe('Rule-Based Fallback Gemini Sentiment Services Tests', () => {
    it('properly extracts appropriate emotions, triggers, and coping templates according to journal content', async () => {
      // Test extreme exam pressure content logic
      const resultExam = await analyzeJournalEntry(
        'I am so incredibly anxious and tired of prepping for my math geometry exams quiz!',
        4
      );

      expect(resultExam.emotionalState).toContain('Anxious');
      expect(resultExam.stressTriggers).toContain('Academic Evaluator Pressure');
      expect(resultExam.copingCard).toContain('Pomodoros');

      // Test sleep-deprivation and weary student triggers
      const resultTired = await analyzeJournalEntry(
        'I have missed sleep for two days straight and suffer from terrible fatigue.',
        2
      );

      expect(resultTired.stressTriggers).toContain('Sleep Deprivation / Burnout');
      expect(resultTired.copingCard).toContain('sleep tonight');
    });

    it('simulates companion conversational chat replies back appropriately matching contextual themes', async () => {
      // Greetings
      const responseG = await generateChatResponse([
        { sender: 'user', text: 'hello there serene buddy', timestamp: Date.now() }
      ]);
      expect(responseG).toContain('Serene');

      // Exhausted queries
      const responseE = await generateChatResponse([
        { sender: 'user', text: 'I am so tired and did not sleep at all', timestamp: Date.now() }
      ]);
      expect(responseE).toContain('closing the books');
    });
  });

});
