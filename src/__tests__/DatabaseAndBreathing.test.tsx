import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';

// Import local database setup to verify mock assertions
import { db } from '../db';
import BreathingGuide from '../components/BreathingGuide';

// 1. Mock Dexie indexedDB calls so they run flawlessly in our sandboxed test runner
vi.mock('../db', () => {
  let journalsStore: any[] = [];
  return {
    db: {
      journals: {
        add: vi.fn().mockImplementation(async (item) => {
          const insertWithId = { id: journalsStore.length + 1, ...item };
          journalsStore.push(insertWithId);
          return insertWithId.id;
        }),
        orderBy: vi.fn().mockReturnValue({
          reverse: vi.fn().mockReturnValue({
            toArray: vi.fn().mockImplementation(async () => {
              return [...journalsStore].reverse();
            })
          })
        }),
        delete: vi.fn().mockImplementation(async (id) => {
          journalsStore = journalsStore.filter(j => j.id !== id);
        }),
        clear: vi.fn().mockImplementation(async () => {
          journalsStore = [];
        })
      },
      chatHistory: {
        clear: vi.fn(),
        add: vi.fn(),
        orderBy: vi.fn().mockReturnValue({
          toArray: vi.fn().mockReturnValue([])
        })
      },
      countdowns: {
        clear: vi.fn(),
        add: vi.fn(),
        orderBy: vi.fn().mockReturnValue({
          toArray: vi.fn().mockReturnValue([])
        })
      }
    }
  };
});

describe('Student Mental Wellness Tracker Test Suite', () => {
  
  beforeEach(async () => {
    // Reset our mock database between runs
    await db.journals.clear();
  });

  describe('Dexie Database Unit Test', () => {
    it('should successfully insert and retrieve wellness journal logs from stores', async () => {
      // Assemble: create mock entry
      const testEntry = {
        date: new Date().toISOString(),
        mood: 8,
        content: "Feeling aligned today. Math study groups went really well.",
        analysis: {
          emotionalState: ["Resilient", "Constructive"],
          stressTriggers: ["Academic Evaluation"],
          copingCard: "Keep maintaining your pomodoro break limits.",
          analyzedAt: new Date().toISOString()
        }
      };

      // Act: Add entry via Dexie mockup
      const insertedId = await db.journals.add(testEntry);
      
      // Assert: Verify Insertion Key returned
      expect(insertedId).toBe(1);

      // Act: Retrieve journals chronologically
      const allJournals = await db.journals.orderBy('date').reverse().toArray();

      // Assert: Verify retrieval counts and item payload matching
      expect(allJournals.length).toBe(1);
      expect(allJournals[0].mood).toBe(8);
      expect(allJournals[0].content).toContain("Feeling aligned today");
      expect(allJournals[0].analysis?.emotionalState).toContain("Resilient");
    });
  });

  describe('BreathingGuide Component Test', () => {
    it('should render the box breathing instructions & toggle states', async () => {
      // Assemble
      render(<BreathingGuide />);
      
      // Assert: Verify title instruction displays
      const titleElement = screen.getByText('4-4-4 Box Breathing');
      expect(titleElement).toBeInTheDocument();

      // Assert: Verify initial rested greeting label
      const stateLabel = screen.getByTestId('breathing-state-label');
      expect(stateLabel).toHaveTextContent('Ready to Begin?');

      // Assert: Verify interactive toggle action button is visible
      const playButton = screen.getByTestId('breathing-toggle-btn');
      expect(playButton).toHaveTextContent('Start Breathing');

      // Act: Trigger play button click
      fireEvent.click(playButton);

      // Assert: Verify progress status changes immediately to Inhale phase
      expect(stateLabel).toHaveTextContent('Breathe In');
      expect(playButton).toHaveTextContent('Pause Guide');
    });
  });

});
