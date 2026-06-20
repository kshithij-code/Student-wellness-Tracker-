import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import WeeklyWellnessDigest from '../components/WeeklyWellnessDigest';
import type { JournalEntry } from '../types';

// Simple mock for recharts ResponsiveContainer and chart graphics to bypass SVG width constraints in jsdom
vi.mock('recharts', async (importOriginal) => {
  const original = await importOriginal<typeof import('recharts')>();
  return {
    ...original,
    ResponsiveContainer: ({ children }: any) => <div data-testid="mock-responsive-container">{children}</div>,
  };
});

describe('WeeklyWellnessDigest Component Tests', () => {
  const mockJournals: JournalEntry[] = [
    {
      id: 1,
      date: new Date().toISOString(), // Today
      mood: 8,
      content: "I did some solid revision today.",
      analysis: {
        emotionalState: ['Focused', 'Content'],
        stressTriggers: [],
        copingCard: "Revision anchor: Keep studying in blocks of 50 minutes.",
        analyzedAt: new Date().toISOString(),
        evaluatedMood: 9
      }
    },
    {
      id: 2,
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
      mood: 4,
      content: "Feeling really stressed and anxious.",
      analysis: {
        emotionalState: ['Anxious'],
        stressTriggers: ['Workload'],
        copingCard: "Breathe: Slow down your breathing rate.",
        analyzedAt: new Date().toISOString(),
        evaluatedMood: 5
      }
    }
  ];

  it('renders title and subtitle correctly', () => {
    render(<WeeklyWellnessDigest journals={mockJournals} />);
    expect(screen.getByText('7-Day Weekly Wellness Digest')).toBeInTheDocument();
    expect(screen.getByText(/Correlate your logged mood alongside Gemini-analyzed text sentiment/)).toBeInTheDocument();
  });

  it('renders aggregated coping cards correctly', () => {
    render(<WeeklyWellnessDigest journals={mockJournals} />);
    
    // Check that coping card content is compiled and shown
    expect(screen.getByText(/"Revision anchor: Keep studying in blocks of 50 minutes."/)).toBeInTheDocument();
    expect(screen.getByText(/"Breathe: Slow down your breathing rate."/)).toBeInTheDocument();
  });

  it('renders fallback message when no journals exist', () => {
    render(<WeeklyWellnessDigest journals={[]} />);
    expect(screen.getByText('No stress relief cards yet')).toBeInTheDocument();
    expect(screen.getByText(/Once you log study sessions with negative emotions/)).toBeInTheDocument();
  });
});
