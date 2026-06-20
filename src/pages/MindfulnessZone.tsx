import React, { useState } from 'react';
import BreathingGuide from '../components/BreathingGuide';
import { 
  Compass, 
  HelpCircle, 
  Award, 
  RefreshCw, 
  VolumeX, 
  Eye, 
  Moon, 
  CheckCircle,
  Clock 
} from 'lucide-react';

export default function MindfulnessZone() {
  // 5-4-3-2-1 Grounding steps state
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

  // Calculate completed checklist score
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

  // Structured exercises content
  const miniTips = [
    { title: 'The Screen-Dim Pause', time: '2 min', action: 'Gently turn down your screen brightness to zero, close your eyes, and place warm palms over your eyelids to relax your optic nerves.' },
    { title: 'Neck & Trapezius Release', time: '3 min', action: 'Drop your heavy shoulders. Slowly rotate your head 5 times clockwise, then counter-clockwise. Take structured deep breaths to release neck lactic stress.' },
    { title: 'Hydration Anchor', time: '1 min', action: 'Sip a glass of cool water deliberately. Pay close attention to its refreshing temperature and feel it grounding your dry, nervous throat.' }
  ];

  return (
    <div id="mindfulness-zone-view" className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in font-manrope">
      
      {/* Left: Breathing Guide portal */}
      <div className="lg:col-span-6 space-y-6">
        <BreathingGuide />

        {/* Short mindfulness cards list */}
        <div className="border border-[#d8d0c8]/60 bg-white p-6 rounded-3xl shadow-sm select-none">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-[#c2652a]" />
            <h4 className="font-serif text-base font-bold text-[#3a302a]">
              Immediate Study-Break Audio rituals
            </h4>
          </div>
          <p className="text-xs text-[#3a302a]/65 mb-4">
            Quick somatic cooldown exercises to slot directly between exam revision runs:
          </p>

          <div className="space-y-3">
            {miniTips.map((tip, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-[#faf5ee]/60 border border-[#d8d0c8]/30 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <h5 className="font-bold text-[#c2652a]">{tip.title}</h5>
                  <span className="text-[10px] bg-white border px-2 py-0.5 rounded-full font-mono text-[#3a302a]/50">
                    {tip.time}
                  </span>
                </div>
                <p className="text-[11px] text-[#3a302a]/70 leading-relaxed">
                  {tip.action}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Interactive 5-4-3-2-1 Sensory grounding checklist */}
      <div className="lg:col-span-6 space-y-6 select-none">
        <div className="border border-[#d8d0c8]/60 bg-white p-6 rounded-3xl shadow-sm flex flex-col justify-between">
          
          <div>
            <div className="flex justify-between items-center border-b border-[#d8d0c8]/35 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-[#8c3c3c]" />
                <h3 className="font-serif text-lg font-bold text-[#3a302a]">
                  5-4-3-2-1 Grounding Ritual
                </h3>
              </div>
              <button
                type="button"
                onClick={resetGrounding}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#3a302a]/55 hover:text-[#c2652a] transition-colors cursor-pointer"
                title="Reset checklist"
              >
                <RefreshCw className="w-3.5 h-3.5 animate-spin-hover" />
                Reset Checklist
              </button>
            </div>

            <p className="text-xs text-[#3a302a]/65 mb-5 leading-relaxed">
              Grounding redirects cognitive processes away from anxiety-inducing loops back to your direct physical presence or surroundings. Check off each item as you identify it:
            </p>

            {/* Scientific progress bar */}
            <div className="bg-[#faf5ee] border border-[#d8d0c8]/40 p-4.5 rounded-2xl mb-6 space-y-2">
              <div className="flex justify-between text-xs font-bold text-[#3a302a]">
                <span>Grounding Anchor Progress:</span>
                <span className="font-mono text-[#c2652a]">{progressPercent}% Locked</span>
              </div>
              <div className="h-2 w-full bg-[#d8d0c8]/45 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-600 transition-all duration-500 rounded-full" 
                  style={{ width: `${progressPercent}%` }} 
                />
              </div>
            </div>

            {/* Checklist options */}
            <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
              
              {/* SEE 5 items */}
              <div className="space-y-2 bg-[#faf5ee]/50 p-3 rounded-xl border border-[#d8d0c8]/25">
                <h4 className="text-[11px] font-bold text-[#c2652a] uppercase tracking-wider">
                  1. Identify 5 things you can SEE around you:
                </h4>
                <div className="grid grid-cols-1 gap-1.5">
                  <label className="flex items-center gap-2.5 text-xs text-[#3a302a]/80 cursor-pointer">
                    <input type="checkbox" checked={checklist.see1} onChange={() => handleToggle('see1')} className="w-4 h-4 rounded border-[#d8d0c8] text-[#c2652a] focus:ring-[#c2652a] cursor-pointer" />
                    A physical book or paper sheet
                  </label>
                  <label className="flex items-center gap-2.5 text-xs text-[#3a302a]/80 cursor-pointer">
                    <input type="checkbox" checked={checklist.see2} onChange={() => handleToggle('see2')} className="w-4 h-4 rounded border-[#d8d0c8] text-[#c2652a] focus:ring-[#c2652a] cursor-pointer" />
                    How light beams hit the wall or floor
                  </label>
                  <label className="flex items-center gap-2.5 text-xs text-[#3a302a]/80 cursor-pointer">
                    <input type="checkbox" checked={checklist.see3} onChange={() => handleToggle('see3')} className="w-4 h-4 rounded border-[#d8d0c8] text-[#c2652a] focus:ring-[#c2652a] cursor-pointer" />
                    The grain of wood or fabric texture
                  </label>
                  <label className="flex items-center gap-2.5 text-xs text-[#3a302a]/80 cursor-pointer">
                    <input type="checkbox" checked={checklist.see4} onChange={() => handleToggle('see4')} className="w-4 h-4 rounded border-[#d8d0c8] text-[#c2652a] focus:ring-[#c2652a] cursor-pointer" />
                    An object with a curved edge
                  </label>
                  <label className="flex items-center gap-2.5 text-xs text-[#3a302a]/80 cursor-pointer">
                    <input type="checkbox" checked={checklist.see5} onChange={() => handleToggle('see5')} className="w-4 h-4 rounded border-[#d8d0c8] text-[#c2652a] focus:ring-[#c2652a] cursor-pointer" />
                    The tiny blinking LED of an electronic
                  </label>
                </div>
              </div>

              {/* FEEL 4 items */}
              <div className="space-y-2 bg-[#faf5ee]/50 p-3 rounded-xl border border-[#d8d0c8]/25">
                <h4 className="text-[11px] font-bold text-[#c2652a] uppercase tracking-wider">
                  2. Identify 4 things you can FEEL in contact:
                </h4>
                <div className="grid grid-cols-1 gap-1.5">
                  <label className="flex items-center gap-2.5 text-xs text-[#3a302a]/80 cursor-pointer">
                    <input type="checkbox" checked={checklist.feel1} onChange={() => handleToggle('feel1')} className="w-4 h-4 rounded border-[#d8d0c8] text-[#c2652a] focus:ring-[#c2652a] cursor-pointer" />
                    The solid weight of your feet on the ground
                  </label>
                  <label className="flex items-center gap-2.5 text-xs text-[#3a302a]/80 cursor-pointer">
                    <input type="checkbox" checked={checklist.feel2} onChange={() => handleToggle('feel2')} className="w-4 h-4 rounded border-[#d8d0c8] text-[#c2652a] focus:ring-[#c2652a] cursor-pointer" />
                    The support of your chair under your spine
                  </label>
                  <label className="flex items-center gap-2.5 text-xs text-[#3a302a]/80 cursor-pointer">
                    <input type="checkbox" checked={checklist.feel3} onChange={() => handleToggle('feel3')} className="w-4 h-4 rounded border-[#d8d0c8] text-[#c2652a] focus:ring-[#c2652a] cursor-pointer" />
                    The drafts or direct temperature of the room air
                  </label>
                  <label className="flex items-center gap-2.5 text-xs text-[#3a302a]/80 cursor-pointer">
                    <input type="checkbox" checked={checklist.feel4} onChange={() => handleToggle('feel4')} className="w-4 h-4 rounded border-[#d8d0c8] text-[#c2652a] focus:ring-[#c2652a] cursor-pointer" />
                    The cloth texture of your shirt sleeves
                  </label>
                </div>
              </div>

              {/* HEAR 3 items */}
              <div className="space-y-2 bg-[#faf5ee]/50 p-3 rounded-xl border border-[#d8d0c8]/25">
                <h4 className="text-[11px] font-bold text-[#c2652a] uppercase tracking-wider">
                  3. Identify 3 distinct things you can HEAR:
                </h4>
                <div className="grid grid-cols-1 gap-1.5">
                  <label className="flex items-center gap-2.5 text-xs text-[#3a302a]/80 cursor-pointer">
                    <input type="checkbox" checked={checklist.hear1} onChange={() => handleToggle('hear1')} className="w-4 h-4 rounded border-[#d8d0c8] text-[#c2652a] focus:ring-[#c2652a] cursor-pointer" />
                    The soft whir of a fan or refrigerator motor
                  </label>
                  <label className="flex items-center gap-2.5 text-xs text-[#3a302a]/80 cursor-pointer">
                    <input type="checkbox" checked={checklist.hear2} onChange={() => handleToggle('hear2')} className="w-4 h-4 rounded border-[#d8d0c8] text-[#c2652a] focus:ring-[#c2652a] cursor-pointer" />
                    An distant hum of outdoor traffic or birds
                  </label>
                  <label className="flex items-center gap-2.5 text-xs text-[#3a302a]/80 cursor-pointer">
                    <input type="checkbox" checked={checklist.hear3} onChange={() => handleToggle('hear3')} className="w-4 h-4 rounded border-[#d8d0c8] text-[#c2652a] focus:ring-[#c2652a] cursor-pointer" />
                    The rhythmic sound of your own inhalation
                  </label>
                </div>
              </div>

              {/* SMELL 2 items */}
              <div className="space-y-2 bg-[#faf5ee]/50 p-3 rounded-xl border border-[#d8d0c8]/25">
                <h4 className="text-[11px] font-bold text-[#c2652a] uppercase tracking-wider">
                  4. Identify 2 things you can detect via SMELL:
                </h4>
                <div className="grid grid-cols-1 gap-1.5">
                  <label className="flex items-center gap-2.5 text-xs text-[#3a302a]/80 cursor-pointer">
                    <input type="checkbox" checked={checklist.smell1} onChange={() => handleToggle('smell1')} className="w-4 h-4 rounded border-[#d8d0c8] text-[#c2652a] focus:ring-[#c2652a] cursor-pointer" />
                    The scent of books or pencil graphite
                  </label>
                  <label className="flex items-center gap-2.5 text-xs text-[#3a302a]/80 cursor-pointer">
                    <input type="checkbox" checked={checklist.smell2} onChange={() => handleToggle('smell2')} className="w-4 h-4 rounded border-[#d8d0c8] text-[#c2652a] focus:ring-[#c2652a] cursor-pointer" />
                    The aroma of nearby coffee or study snacks
                  </label>
                </div>
              </div>

              {/* ACKNOWLEDGE 1 item */}
              <div className="space-y-2 bg-[#faf5ee]/50 p-3 rounded-xl border border-[#d8d0c8]/25">
                <h4 className="text-[11px] font-bold text-[#c2652a] uppercase tracking-wider">
                  5. Acknowledge 1 thing you truly appreciate:
                </h4>
                <label className="flex items-center gap-2.5 text-xs text-[#3a302a]/85 cursor-pointer leading-relaxed">
                  <input type="checkbox" checked={checklist.acknowledge1} onChange={() => handleToggle('acknowledge1')} className="w-4 h-4 rounded border-[#d8d0c8] text-[#c2652a] focus:ring-[#c2652a] cursor-pointer" />
                  Your body's incredible resilience. You show up and try, which is completely enough.
                </label>
              </div>

            </div>
          </div>

          {progressPercent === 100 && (
            <div className="mt-6 flex items-center gap-3 bg-emerald-50 border border-emerald-200 p-4 rounded-2xl animate-bounce">
              <Award className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <h5 className="text-xs font-bold text-emerald-800">You're fully grounded!</h5>
                <p className="text-[10px] text-emerald-700">Your visual attention is now anchored. Take this peaceful momentum back into your day.</p>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
