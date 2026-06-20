import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { deconstructSelfDoubt } from '../services/gemini';
import type { SelfDoubtDeconstruction } from '../types';

export function useMindfulness() {
  const { apiKey } = useApp();
  
  // Tab toggle state
  const [activeTab, setActiveTab] = useState<'somatic' | 'reframing'>('somatic');

  // Grounding state
  const [checklist, setChecklist] = useState({
    see1: false, see2: false, see3: false, see4: false, see5: false,
    feel1: false, feel2: false, feel3: false, feel4: false,
    hear1: false, hear2: false, hear3: false,
    smell1: false, smell2: false,
    acknowledge1: false
  });

  const handleToggle = (key: keyof typeof checklist) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const totalItems = Object.keys(checklist).length;
  const completedItems = Object.values(checklist).filter(Boolean).length;
  const progressPercent = Math.round((completedItems / totalItems) * 100);

  const resetGrounding = () => {
    setChecklist({
      see1: false, see2: false, see3: false, see4: false, see5: false,
      feel1: false, feel2: false, feel3: false, feel4: false,
      hear1: false, hear2: false, hear3: false,
      smell1: false, smell2: false,
      acknowledge1: false
    });
  };

  // CBT Reframing workshop state
  const [userDoubt, setUserDoubt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentReframe, setCurrentReframe] = useState<SelfDoubtDeconstruction | null>(null);
  const [efficacyLedger, setEfficacyLedger] = useState<SelfDoubtDeconstruction[]>([]);
  const [copystate, setCopystate] = useState(false);

  // Load ledger from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sa_reframed_thoughts');
    if (saved) {
      try {
        setEfficacyLedger(JSON.parse(saved));
      } catch (e) {
        console.warn('Could not read saved efficacy ledger');
      }
    }
  }, []);

  const handleDeconstruct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userDoubt.trim()) return;

    setIsAnalyzing(true);
    try {
      const result = await deconstructSelfDoubt(userDoubt, apiKey);
      setCurrentReframe(result);
    } catch (err) {
      console.error('Reframing error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const saveToLedger = () => {
    if (!currentReframe) return;
    
    const newEntry: SelfDoubtDeconstruction = {
      ...currentReframe,
      id: `reframe-${Date.now()}`,
      createdAt: Date.now()
    };

    const updated = [newEntry, ...efficacyLedger];
    setEfficacyLedger(updated);
    localStorage.setItem('sa_reframed_thoughts', JSON.stringify(updated));
    setCurrentReframe(null);
    setUserDoubt('');
  };

  const deleteFromLedger = (id: string) => {
    const updated = efficacyLedger.filter(item => item.id !== id);
    setEfficacyLedger(updated);
    localStorage.setItem('sa_reframed_thoughts', JSON.stringify(updated));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopystate(true);
    setTimeout(() => setCopystate(false), 2000);
  };

  const loadSuggestion = (doubtText: string) => {
    setUserDoubt(doubtText);
    setCurrentReframe(null);
  };

  return {
    apiKey,
    activeTab,
    setActiveTab,
    checklist,
    handleToggle,
    progressPercent,
    resetGrounding,
    userDoubt,
    setUserDoubt,
    isAnalyzing,
    currentReframe,
    setCurrentReframe,
    efficacyLedger,
    copystate,
    handleDeconstruct,
    saveToLedger,
    deleteFromLedger,
    copyToClipboard,
    loadSuggestion
  };
}
