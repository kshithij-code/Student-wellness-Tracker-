import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Wind, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

type BreathState = 'inhale' | 'hold' | 'exhale' | 'rest';

interface BreathingPreset {
  id: string;
  name: string;
  inhale: number;
  hold: number;
  exhale: number;
  description: string;
  benefits: string;
}

const PRESETS: BreathingPreset[] = [
  {
    id: 'box',
    name: '4-4-4 Box Breathing',
    inhale: 4,
    hold: 4,
    exhale: 4,
    description: 'The navy SEAL standard. Equal intervals reset your nervous system to focus during heavy studies.',
    benefits: 'Great for general stress and exam day preparation.'
  },
  {
    id: 'relax',
    name: '4-7-8 Deep Relaxation',
    inhale: 4,
    hold: 7,
    exhale: 8,
    description: 'Dr. Andrew Weil technique. Heavily activates the vagus nerve to calm extreme exam panic or handle study insomnia.',
    benefits: 'Best for acute anxiety, panic overloads, or sleep troubles.'
  },
  {
    id: 'resonance',
    name: '5-5 Coherent Resonance',
    inhale: 5,
    hold: 0,
    exhale: 5,
    description: 'Eliminates states of high friction and matches your breathing with heart-rate patterns for tranquil clarity.',
    benefits: 'Excellent for deep study flow sessions and steady revision intervals.'
  },
  {
    id: 'quick',
    name: '3-3 Pre-Exam Anchor',
    inhale: 3,
    hold: 2,
    exhale: 3,
    description: 'A rapid-cycle pacer designed to immediately discharge physical adrenaline before writing a NEET/JEE test.',
    benefits: 'Perfect for immediate relief right in the testing hall.'
  }
];

export default function BreathingGuide() {
  const { journals, profile, countdowns } = useApp();
  const [selectedPresetId, setSelectedPresetId] = useState<string>('box');
  const [isActive, setIsActive] = useState(false);
  const [breathState, setBreathState] = useState<BreathState>('rest');
  const [timer, setTimer] = useState(4);
  const [completedCycles, setCompletedCycles] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activePreset = PRESETS.find(p => p.id === selectedPresetId) || PRESETS[0];

  // Auto-adapt recommendation based on student logs
  const getAIRecommendation = () => {
    const latestJournal = journals[0];
    const hasUpcomingExam = (countdowns && countdowns.length > 0);
    const lowMood = latestJournal && latestJournal.mood <= 4;
    const extremePanic = latestJournal?.analysis?.emotionalState?.some(e => 
      ['anxious', 'exhausted', 'overwhelmed', 'agitated', 'scared'].includes(e.toLowerCase())
    );

    if (extremePanic || lowMood) {
      return {
        id: 'relax',
        reason: `Based on your recent lower mood log (${latestJournal?.mood}/10), we recommend the 4-7-8 Deep Relaxation pacer to reset your nervous system.`
      };
    }
    if (hasUpcomingExam) {
      const mainTarget = countdowns[0].title;
      return {
        id: 'quick',
        reason: `With "${mainTarget}" approaching, we recommend the 3-3 Pre-Exam Anchor for rapid somatic control and focus.`
      };
    }
    if (profile?.studyGoalHours && profile.studyGoalHours >= 6) {
      return {
        id: 'resonance',
        reason: `Since your study goal is quite ambitious (${profile.studyGoalHours} hrs/day), we recommend 5-5 Coherent Resonance to maintain long study flow.`
      };
    }

    return {
      id: 'box',
      reason: "For normal daily pacing, we recommend the standard 4-4-4 Box Breathing. It is perfect for sustaining high-cognitive concentration."
    };
  };

  const recommendation = getAIRecommendation();

  // Apply AI Recommendation on load/change
  useEffect(() => {
    setSelectedPresetId(recommendation.id);
    setTimer(PRESETS.find(p => p.id === recommendation.id)?.inhale || 4);
  }, [journals, countdowns, profile]);

  // Handle ticking session
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            let nextState: BreathState = 'rest';
            let nextDuration = 4;

            if (breathState === 'rest' || breathState === 'exhale') {
              if (breathState === 'exhale') {
                setCompletedCycles((c) => c + 1);
              }
              nextState = 'inhale';
              nextDuration = activePreset.inhale;
            } else if (breathState === 'inhale') {
              if (activePreset.hold > 0) {
                nextState = 'hold';
                nextDuration = activePreset.hold;
              } else {
                nextState = 'exhale';
                nextDuration = activePreset.exhale;
              }
            } else if (breathState === 'hold') {
              nextState = 'exhale';
              nextDuration = activePreset.exhale;
            }

            setBreathState(nextState);
            return nextDuration;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, breathState, activePreset]);

  const toggleSession = () => {
    if (!isActive) {
      setBreathState('inhale');
      setTimer(activePreset.inhale);
    }
    setIsActive(!isActive);
  };

  const resetSession = () => {
    setIsActive(false);
    setBreathState('rest');
    setTimer(activePreset.inhale);
    setCompletedCycles(0);
  };

  const handlePresetSelect = (presetId: string) => {
    const selected = PRESETS.find(p => p.id === presetId) || PRESETS[0];
    setSelectedPresetId(presetId);
    setIsActive(false);
    setBreathState('rest');
    setTimer(selected.inhale);
    setCompletedCycles(0);
  };

  // Determine circle size scaling & border styles based on breathing phase and preset timing
  const getCircleScaleClass = () => {
    switch (breathState) {
      case 'inhale':
        return 'scale-130 bg-[#c2652a]';
      case 'hold':
        return 'scale-130 bg-[#8c3c3c]';
      case 'exhale':
        return 'scale-90 bg-[#c2652a]/70';
      case 'rest':
      default:
        return 'scale-100 bg-[#d8d0c8]';
    }
  };

  const getBreathLabel = () => {
    switch (breathState) {
      case 'inhale':
        return 'Breathe In';
      case 'hold':
        return 'Hold Breath';
      case 'exhale':
        return 'Breathe Out';
      case 'rest':
      default:
        return 'Ready to Begin?';
    }
  };

  const durationSec = breathState === 'inhale' ? activePreset.inhale : 
                      breathState === 'hold' ? activePreset.hold : 
                      breathState === 'exhale' ? activePreset.exhale : 4;

  return (
    <div 
      id="breathing-guide-card" 
      data-testid="breathing-guide"
      className="p-6 md:p-8 bg-white border border-[#d8d0c8]/60 rounded-3xl shadow-sm flex flex-col items-center justify-center select-none"
    >
      <div className="flex items-center gap-2 mb-1.5 w-full justify-between pb-3 border-b border-[#d8d0c8]/30">
        <div className="flex items-center gap-2">
          <Wind className="w-5 h-5 text-[#c2652a]" />
          <h3 className="font-serif text-lg font-bold text-[#3a302a]">
            Adaptive Breathing Pacer
          </h3>
        </div>
        <span className="text-[10px] bg-emerald-100 border border-emerald-200 text-emerald-800 font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Dynamically Adaptive
        </span>
      </div>

      {/* AI Recommendation Banner */}
      <div className="w-full mt-3 p-3 bg-amber-500/5 rounded-2xl border border-amber-500/10 text-left mb-6">
        <p className="text-[11px] font-bold text-[#c2652a] flex items-center gap-1">
          ✨ Personal Recommendation
        </p>
        <p className="text-[11px] text-[#3a302a]/80 mt-1 font-semibold leading-relaxed">
          {recommendation.reason}
        </p>
      </div>

      {/* Preset Selector Chips */}
      <div className="grid grid-cols-2 gap-2 w-full mb-6 text-left">
        {PRESETS.map((preset) => {
          const isSelected = preset.id === selectedPresetId;
          const isAIRecommend = preset.id === recommendation.id;
          return (
            <button
              key={preset.id}
              onClick={() => handlePresetSelect(preset.id)}
              className={`p-2.5 rounded-xl border text-xs text-left transition-all ${
                isSelected 
                  ? 'bg-[#c2652a] border-[#c2652a] text-white shadow-sm' 
                  : 'bg-[#faf5ee]/60 border-[#d8d0c8]/30 text-[#3a302a]/80 hover:bg-[#faf5ee]'
              }`}
            >
              <div className="flex items-center justify-between font-bold">
                <span>{preset.name}</span>
                {isAIRecommend && (
                  <span className={`text-[9px] px-1 py-0.2 rounded font-semibold ${isSelected ? 'bg-white text-[#c2652a]' : 'bg-[#c2652a]/10 text-[#c2652a]'}`}>
                    AI Fav
                  </span>
                )}
              </div>
              <p className={`text-[10px] mt-0.5 leading-snug line-clamp-1 opacity-80 ${isSelected ? 'text-white/90' : 'text-[#3a302a]/60'}`}>
                In: {preset.inhale}s{preset.hold > 0 ? ` • Hold: ${preset.hold}s` : ''} • Out: {preset.exhale}s
              </p>
            </button>
          );
        })}
      </div>

      <p className="font-manrope text-xs text-[#3a302a]/65 text-center max-w-sm mb-6 leading-relaxed">
        {activePreset.description}
      </p>

      {/* Interactive Visual Circle */}
      <div className="relative h-56 w-56 flex items-center justify-center mb-6">
        {/* Soft background pulse */}
        <div 
          className={`absolute h-40 w-40 rounded-full blur-2xl opacity-15 transition-all ease-in-out ${getCircleScaleClass()}`} 
          style={{ transitionDuration: `${durationSec}s` }}
        />

        {/* Floating Ring */}
        <div className={`absolute h-36 w-36 rounded-full border-2 border-dashed border-[#c2652a]/20 transition-all ${isActive ? 'animate-spin-slow' : ''}`} />

        {/* Breathing Portal */}
        <div 
          data-testid="breathing-circle"
          className={`h-28 w-28 rounded-full flex flex-col items-center justify-center text-white font-manrope font-semibold transition-all ease-in-out shadow-lg shadow-[#3a302a]/5 ${getCircleScaleClass()}`}
          style={{ transitionDuration: `${durationSec}s` }}
        >
          {isActive ? (
            <div className="text-center">
              <span className="block text-xl font-bold font-mono tracking-wider">{timer}s</span>
              <span className="text-[9px] tracking-widest text-white/80 uppercase">remaining</span>
            </div>
          ) : (
            <span className="text-xs tracking-wide lowercase font-bold">inhale flow</span>
          )}
        </div>
      </div>

      {/* Guide Indicator Header */}
      <div className="mb-6 h-12 text-center">
        <h4 data-testid="breathing-state-label" className="font-serif text-xl font-bold text-[#c2652a] tracking-wide transition-all duration-500">
          {getBreathLabel()}
        </h4>
        {isActive && (
          <p className="text-xs text-[#3a302a]/50 mt-1 font-mono">
            {completedCycles} {completedCycles === 1 ? 'cycle' : 'cycles'} completed this session
          </p>
        )}
      </div>

      {/* Controls Container */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleSession}
          data-testid="breathing-toggle-btn"
          className="flex items-center gap-2 px-6 py-2 rounded-full bg-[#c2652a] hover:bg-[#a9521d] text-white font-manrope font-semibold text-xs shadow-md shadow-[#c2652a]/15 transition-all active:scale-95 cursor-pointer"
        >
          {isActive ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-white" />
              Pause Guide
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-white" />
              Start Breathing
            </>
          )}
        </button>

        <button
          type="button"
          onClick={resetSession}
          title="Reset timer"
          className="p-2 rounded-full border border-[#d8d0c8]/60 text-[#3a302a]/70 hover:bg-[#d8d0c8]/20 transition-all active:scale-95 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
