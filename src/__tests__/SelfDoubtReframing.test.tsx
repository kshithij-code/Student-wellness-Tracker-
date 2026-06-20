import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { deconstructSelfDoubt } from '../services/gemini';
import MindfulnessZone from '../pages/MindfulnessZone';

// Mock context hook
vi.mock('../context/AppContext', () => {
  return {
    useApp: () => ({
      apiKey: '',
      journals: [],
      profile: {
        name: 'Alex Student',
        examType: 'NEET Practice',
        studyGoalHours: 4
      },
      countdowns: []
    })
  };
});

describe('Self-Doubt Reframing Core Workshop Tests', () => {
  
  beforeEach(() => {
    localStorage.clear();
  });

  describe('CBT Reframing Engine Service', () => {
    it('should deconstruct exam doubts based on keywords (fallback test)', async () => {
      // Assemble
      const failDoubt = "I am going to fail the next physics module because it's too tough.";
      
      // Act
      const result = await deconstructSelfDoubt(failDoubt);
      
      // Assert
      expect(result.originalThought).toBe(failDoubt);
      expect(result.distortionType).toContain('Catastrophizing');
      expect(result.distortionExplanation).toContain('any outcome short of flawless perfection');
      expect(result.reframedThought).toContain('I am capable of growing');
    });

    it('should handle comparison doubts with peer keywords (fallback test)', async () => {
      // Assemble
      const peerDoubt = "Everyone is smarter than me and studying much more.";
      
      // Act
      const result = await deconstructSelfDoubt(peerDoubt);

      // Assert
      expect(result.distortionType).toContain('Comparison');
      expect(result.evidenceAgainst).toContain('Everyone struggles in silence');
      expect(result.reframedThought).toContain('My academic track is uniquely my own');
    });
  });

  describe('MindfulnessZone CBT Workshop Integration', () => {
    it('should switch tabs between Somatic and Reframing Workshop', () => {
      render(<MindfulnessZone />);

      // Ensure initial view is Somatic stabilizers
      expect(screen.getByText('Adaptive Breathing Pacer')).toBeInTheDocument();
      expect(screen.getByText('5-4-3-2-1 Grounding Ritual')).toBeInTheDocument();

      // Find tab button and execute click
      const reframingTabBtn = screen.getByRole('button', { name: /Self-Doubt Deconstruction/i });
      fireEvent.click(reframingTabBtn);

      // Verify that CBT workshop elements now render instead
      expect(screen.getByText('Deconstruct Your Self-Doubt')).toBeInTheDocument();
      expect(screen.getByText('Academic Cognitive Distortions Cheat Sheet')).toBeInTheDocument();
    });

    it('should input stress doubt, run analysis, and display CBT breakdown', async () => {
      render(<MindfulnessZone />);

      // Switch to reframing workshop tab
      const reframingTabBtn = screen.getByRole('button', { name: /Self-Doubt Deconstruction/i });
      fireEvent.click(reframingTabBtn);

      // Find the input field and submit button
      const textarea = screen.getByPlaceholderText(/e\.g\. I have missed two/i);
      const submitBtn = screen.getByRole('button', { name: /Deconstruct Self-Doubt with CBT/i });

      // Action: Type doubt and submit
      fireEvent.change(textarea, { target: { value: 'I feel like I am so late for my exam study schedule.' } });
      fireEvent.click(submitBtn);

      // Check results render
      await waitFor(() => {
        expect(screen.getByText('Reframed Perspective Found')).toBeInTheDocument();
      });

      expect(screen.getByText(/Should.*Statements & Time Magnification/)).toBeInTheDocument();
      expect(screen.getByText('Acknowledge Reality:')).toBeInTheDocument();
      expect(screen.getByText('Save to Efficacy Ledger')).toBeInTheDocument();
    });
  });
});
