import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export function useJournal() {
  const { 
    journals, 
    addJournalEntry, 
    deleteJournalEntry, 
    isAnalyzing 
  } = useApp();

  const [mood, setMood] = useState<number>(7);
  const [content, setContent] = useState<string>('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const handleCreateEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setStatusMessage('Syncing with GenAI analyzer...');
    await addJournalEntry(mood, content.trim());
    setContent('');
    setMood(7);
    setStatusMessage('Entry analyzed and synchronized successfully.');
    setTimeout(() => setStatusMessage(''), 4000);
  };

  const getMoodEmoji = (score: number) => {
    if (score <= 2) return '😞';
    if (score <= 4) return '😐';
    if (score <= 6) return '🙂';
    if (score <= 8) return '😊';
    return '😌';
  };

  return {
    journals,
    isAnalyzing,
    deleteJournalEntry,
    mood,
    setMood,
    content,
    setContent,
    expandedId,
    setExpandedId,
    statusMessage,
    handleCreateEntry,
    getMoodEmoji
  };
}
