import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Wind } from 'lucide-react';

type BreathState = 'inhale' | 'hold' | 'exhale' | 'rest';

export default function BreathingGuide() {
  const [isActive, setIsActive] = useState(false);
  const [breathState, setBreathState] = useState<BreathState>('rest');
  const [timer, setTimer] = useState(4); // each state lasts 4 seconds
  const [completedCycles, setCompletedCycles] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            // State transitions
            setBreathState((currentState) => {
              switch (currentState) {
                case 'rest':
                  return 'inhale';
                case 'inhale':
                  return 'hold';
                case 'hold':
                  return 'exhale';
                case 'exhale':
                  setCompletedCycles((c) => c + 1);
                  return 'inhale'; // Box Breathing loop
                default:
                  return 'rest';
              }
            });
            return 4; // Reset to 4s
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
  }, [isActive]);

  const toggleSession = () => {
    if (!isActive) {
      setBreathState('inhale');
      setTimer(4);
    }
    setIsActive(!isActive);
  };

  const resetSession = () => {
    setIsActive(false);
    setBreathState('rest');
    setTimer(4);
    setCompletedCycles(0);
  };

  // Determine circle size scaling based on breathing phase
  const getCircleScale = () => {
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
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
      case 'rest':
      default:
        return 'Ready to Begin?';
    }
  };

  return (
    <div 
      id="breathing-guide-card" 
      data-testid="breathing-guide"
      className="p-8 bg-white border border-[#d8d0c8]/60 rounded-3xl shadow-sm text-center flex flex-col items-center justify-center select-none"
    >
      <div className="flex items-center gap-2 mb-2">
        <Wind className="w-5 h-5 text-[#c2652a]" />
        <h3 className="font-serif text-xl font-bold text-[#3a302a]">
          4-4-4 Box Breathing
        </h3>
      </div>
      <p className="font-manrope text-xs text-[#3a302a]/60 max-w-sm mb-8">
        Calm your autonomic nervous system instantly. Align your lungs with the expanding portal to restore emotional equilibrium.
      </p>

      {/* Interactive Visual Circle */}
      <div className="relative h-64 w-64 flex items-center justify-center mb-8">
        {/* Soft background pulse */}
        <div className={`absolute h-48 w-48 rounded-full blur-2xl opacity-15 transition-all duration-[4000ms] ease-in-out ${getCircleScale()}`} />

        {/* Floating Ring */}
        <div className={`absolute h-44 w-44 rounded-full border-2 border-dashed border-[#c2652a]/20 transition-all duration-[4000ms] ${isActive ? 'animate-spin-slow' : ''}`} />

        {/* Breathing Portal */}
        <div 
          data-testid="breathing-circle"
          className={`h-36 w-36 rounded-full flex flex-col items-center justify-center text-white font-manrope font-semibold transition-all duration-[4000ms] ease-in-out shadow-lg shadow-[#3a302a]/5 ${getCircleScale()}`}
        >
          {isActive ? (
            <div className="text-center">
              <span className="block text-2xl font-bold font-mono tracking-wider">{timer}s</span>
              <span className="text-[10px] tracking-widest text-white/80 uppercase">remaining</span>
            </div>
          ) : (
            <span className="text-sm tracking-wide lowercase">inhale flow</span>
          )}
        </div>
      </div>

      {/* Guide Indicator Header */}
      <div className="mb-6 h-12">
        <h4 data-testid="breathing-state-label" className="font-serif text-2xl font-bold text-[#c2652a] tracking-wide transition-all duration-500">
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
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#c2652a] hover:bg-[#a9521d] text-white font-manrope font-semibold text-sm shadow-md shadow-[#c2652a]/15 transition-all active:scale-95 cursor-pointer"
        >
          {isActive ? (
            <>
              <Pause className="w-4 h-4 fill-white" />
              Pause Guide
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              Start Breathing
            </>
          )}
        </button>

        <button
          type="button"
          onClick={resetSession}
          title="Reset timer"
          className="p-2.5 rounded-full border border-[#d8d0c8]/60 text-[#3a302a]/70 hover:bg-[#d8d0c8]/20 transition-all active:scale-95 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
