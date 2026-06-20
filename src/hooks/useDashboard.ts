import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export function useDashboard() {
  const { 
    journals, 
    countdowns, 
    detectedTriggers, 
    streak, 
    averageMood, 
    addJournalEntry, 
    isAnalyzing,
    profile
  } = useApp();

  const [quickMood, setQuickMood] = useState<number>(7);
  const [quickContent, setQuickContent] = useState<string>('');
  const [journalSavedMessage, setJournalSavedMessage] = useState<string>('');

  const handleQuickJournalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickContent.trim()) return;

    await addJournalEntry(quickMood, quickContent.trim());
    setQuickContent('');
    setJournalSavedMessage('Journal entry analyzed and saved successfully!');
    setTimeout(() => setJournalSavedMessage(''), 4000);
  };

  // Dynamically populated stress and study load gauges derived from student details
  const studentTriggers = profile?.stressTriggers && profile.stressTriggers.length > 0 
    ? profile.stressTriggers 
    : ['Academic workload', 'Time management strain'];

  const dynamicGauges = [
    { 
      name: 'Daily Study Pacing', 
      level: profile?.studyGoalHours ? `${Math.min(100, Math.round((profile.studyGoalHours / 12) * 100))}%` : '40%', 
      color: 'bg-[#c2652a]', 
      desc: `Pacing ${profile?.studyGoalHours || 4} hours per day focus target.` 
    },
    ...studentTriggers.map((t, index) => {
      const levels = ['70%', '55%', '45%', '35%'];
      const colors = ['bg-[#8c3c3c]', 'bg-amber-600', 'bg-orange-500', 'bg-[#c2652a]/70'];
      const details = [
        'Disclosed major tension catalyst during onboarding',
        'Significant secondary focus pressure item',
        'Disclosed situational study stress factor',
        'Periodic pressure factor tracking'
      ];
      return {
        name: t,
        level: index < levels.length ? levels[index] : '50%',
        color: index < colors.length ? colors[index] : 'bg-[#c2652a]',
        desc: index < details.length ? details[index] : 'Self-identified stress triggers tracking'
      };
    })
  ].slice(0, 4);

  return {
    journals,
    countdowns,
    detectedTriggers,
    streak,
    averageMood,
    isAnalyzing,
    profile,
    quickMood,
    setQuickMood,
    quickContent,
    setQuickContent,
    journalSavedMessage,
    handleQuickJournalSubmit,
    dynamicGauges
  };
}
