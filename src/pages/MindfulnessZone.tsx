import React from 'react';
import BreathingGuide from '../components/BreathingGuide';
import { useMindfulness } from '../hooks/useMindfulness';
import type { SelfDoubtDeconstruction } from '../types';
import { 
  Compass, 
  Award, 
  RefreshCw, 
  Eye, 
  Clock,
  Brain,
  Sparkles,
  Info,
  Copy,
  Trash2,
  Heart,
  Bookmark
} from 'lucide-react';

const COMMON_DISTORTIONS = [
  {
    title: 'Catastrophizing',
    academicExample: '“I answered one question poorly in this mock paper, which means I will fail the actual JEE/NEET.”',
    correction: 'Focus on overall progress. One mistake is a diagnostic signpost, not a final verdict on your intelligence.'
  },
  {
    title: 'Social Comparison',
    academicExample: '“Everyone is studying 12 hours and answering instantly in the forums; I must be too slow.”',
    correction: 'Focus on your own consolidation. Quality deliberate work for 4 hours beats 10 hours of panic-scrolling.'
  },
  {
    title: '“Should” Demands',
    academicExample: '“I should be motivated all the time and never feel tired or brain-fogged during physics.”',
    correction: 'Human brains require rest. Exhaustion is a biological constraint, not a sign of weak discipline.'
  },
  {
    title: 'Fortune Telling',
    academicExample: '“I know exactly what will happen. I will freeze during GATE/UPSC and forget everything.”',
    correction: 'You cannot predict the future. Prepare small items today and trust your active cognitive recall to serve you.'
  }
];

const MINI_TIPS = [
  { title: 'The Screen-Dim Pause', time: '2 min', action: 'Gently turn down your screen brightness to zero, close your eyes, and place warm palms over your eyelids to relax your optic nerves.' },
  { title: 'Neck & Trapezius Release', time: '3 min', action: 'Drop your heavy shoulders. Slowly rotate your head 5 times clockwise, then counter-clockwise. Take structured deep breaths to release neck lactic stress.' },
  { title: 'Hydration Anchor', time: '1 min', action: 'Sip a glass of cool water deliberately. Pay close attention to its refreshing temperature and feel it grounding your dry, nervous throat.' }
];

interface MindfulnessZonePresenterProps {
  apiKey: string;
  activeTab: 'somatic' | 'reframing';
  setActiveTab: (tab: 'somatic' | 'reframing') => void;
  checklist: Record<string, boolean>;
  handleToggle: (key: string) => void;
  progressPercent: number;
  resetGrounding: () => void;
  userDoubt: string;
  setUserDoubt: (doubt: string) => void;
  isAnalyzing: boolean;
  currentReframe: SelfDoubtDeconstruction | null;
  setCurrentReframe: (reframe: SelfDoubtDeconstruction | null) => void;
  efficacyLedger: SelfDoubtDeconstruction[];
  copystate: boolean;
  handleDeconstruct: (e: React.FormEvent) => void;
  saveToLedger: () => void;
  deleteFromLedger: (id: string) => void;
  copyToClipboard: (text: string) => void;
  loadSuggestion: (doubtText: string) => void;
}

// 1. Presenter Component
export function MindfulnessZonePresenter({
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
  efficacyLedger,
  copystate,
  handleDeconstruct,
  saveToLedger,
  deleteFromLedger,
  copyToClipboard,
  loadSuggestion
}: MindfulnessZonePresenterProps) {
  return (
    <div id="mindfulness-zone-view" className="space-y-6 animate-fade-in font-manrope">
      
      {/* Header and custom tab toggle controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#d8d0c8]/50 pb-4">
        <div>
          <h2 className="font-serif text-2xl font-black text-[#3a302a]">
            Somatic Sanctuary & Reframing Workshop
          </h2>
          <p className="text-xs text-[#3a302a]/65 mt-1 leading-relaxed">
            Switch between immediate physical stabilizers or cognitive CBT exercises to conquer heavy academic stress.
          </p>
        </div>

        {/* High contrast custom segmented control */}
        <div className="bg-[#faf5ee]/70 border border-[#d8d0c8]/60 p-1 rounded-2xl flex items-center shrink-0 w-fit self-start md:self-auto shadow-inner">
          <button
            type="button"
            id="tab-toggle-somatic"
            onClick={() => setActiveTab('somatic')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'somatic' 
                ? 'bg-[#c2652a] text-white shadow-sm' 
                : 'text-[#3a302a]/65 hover:text-[#c2652a]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Somatic Stabilizers
          </button>
          <button
            type="button"
            id="tab-toggle-reframing"
            onClick={() => setActiveTab('reframing')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'reframing' 
                ? 'bg-[#c2652a] text-white shadow-sm' 
                : 'text-[#3a302a]/65 hover:text-[#c2652a]'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            Self-Doubt Deconstruction
          </button>
        </div>
      </div>

      {activeTab === 'somatic' ? (
        /* Somatic stabilizer view (Breathing & Grounding) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Breathing guide & study rituals */}
          <div className="lg:col-span-6 space-y-6">
            <BreathingGuide />

            {/* Short mindfulness cards list */}
            <div className="border border-[#d8d0c8]/60 bg-white p-6 rounded-3xl shadow-sm select-none">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-[#c2652a]" />
                <h4 className="font-serif text-base font-bold text-[#3a302a]">
                  Immediate Study-Break Somatic Rituals
                </h4>
              </div>
              <p className="text-xs text-[#3a302a]/65 mb-4">
                Quick physical cooling exercises to slot directly between intense study hours:
              </p>

              <div className="space-y-3">
                {MINI_TIPS.map((tip, idx) => (
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

          {/* Right Column: 5-4-3-2-1 Sensory Grounding */}
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
                    <RefreshCw className="w-3.5 h-3.5" />
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
                      {['A physical book or paper sheet', 'How light beams hit the wall or floor', 'The grain of wood or fabric texture', 'An object with a curved edge', 'The tiny blinking LED of an electronic'].map((text, sIdx) => {
                        const key = `see${sIdx + 1}`;
                        return (
                          <label key={sIdx} className="flex items-center gap-2.5 text-xs text-[#3a302a]/80 cursor-pointer">
                            <input type="checkbox" checked={!!checklist[key]} onChange={() => handleToggle(key)} className="w-4 h-4 rounded border-[#d8d0c8] text-[#c2652a] focus:ring-[#c2652a] cursor-pointer" />
                            {text}
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* FEEL 4 items */}
                  <div className="space-y-2 bg-[#faf5ee]/50 p-3 rounded-xl border border-[#d8d0c8]/25">
                    <h4 className="text-[11px] font-bold text-[#c2652a] uppercase tracking-wider">
                      2. Identify 4 things you can FEEL in contact:
                    </h4>
                    <div className="grid grid-cols-1 gap-1.5">
                      {['The solid weight of your feet on the ground', 'The support of your chair under your spine', 'The drafts or direct temperature of the room air', 'The cloth texture of your shirt sleeves'].map((text, fIdx) => {
                        const key = `feel${fIdx + 1}`;
                        return (
                          <label key={fIdx} className="flex items-center gap-2.5 text-xs text-[#3a302a]/80 cursor-pointer">
                            <input type="checkbox" checked={!!checklist[key]} onChange={() => handleToggle(key)} className="w-4 h-4 rounded border-[#d8d0c8] text-[#c2652a] focus:ring-[#c2652a] cursor-pointer" />
                            {text}
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* HEAR 3 items */}
                  <div className="space-y-2 bg-[#faf5ee]/50 p-3 rounded-xl border border-[#d8d0c8]/25">
                    <h4 className="text-[11px] font-bold text-[#c2652a] uppercase tracking-wider">
                      3. Identify 3 distinct things you can HEAR:
                    </h4>
                    <div className="grid grid-cols-1 gap-1.5">
                      {['The soft whir of a fan or ventilator', 'A distant hum of outdoor traffic or birds', 'The rhythmic sound of your own inhalation'].map((text, hIdx) => {
                        const key = `hear${hIdx + 1}`;
                        return (
                          <label key={hIdx} className="flex items-center gap-2.5 text-xs text-[#3a302a]/80 cursor-pointer">
                            <input type="checkbox" checked={!!checklist[key]} onChange={() => handleToggle(key)} className="w-4 h-4 rounded border-[#d8d0c8] text-[#c2652a] focus:ring-[#c2652a] cursor-pointer" />
                            {text}
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* SMELL 2 items */}
                  <div className="space-y-2 bg-[#faf5ee]/50 p-3 rounded-xl border border-[#d8d0c8]/25">
                    <h4 className="text-[11px] font-bold text-[#c2652a] uppercase tracking-wider">
                      4. Identify 2 things you can detect via SMELL:
                    </h4>
                    <div className="grid grid-cols-1 gap-1.5">
                      {['The scent of academic books or pencil graphite', 'The aroma of nearby coffee or study snacks'].map((text, smIdx) => {
                        const key = `smell${smIdx + 1}`;
                        return (
                          <label key={smIdx} className="flex items-center gap-2.5 text-xs text-[#3a302a]/80 cursor-pointer">
                            <input type="checkbox" checked={!!checklist[key]} onChange={() => handleToggle(key)} className="w-4 h-4 rounded border-[#d8d0c8] text-[#c2652a] focus:ring-[#c2652a] cursor-pointer" />
                            {text}
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* ACKNOWLEDGE 1 item */}
                  <div className="space-y-2 bg-[#faf5ee]/50 p-3 rounded-xl border border-[#d8d0c8]/25">
                    <h4 className="text-[11px] font-bold text-[#c2652a] uppercase tracking-wider">
                      5. Acknowledge 1 thing you truly appreciate:
                    </h4>
                    <label className="flex items-center gap-2.5 text-xs text-[#3a302a]/85 cursor-pointer leading-relaxed">
                      <input type="checkbox" checked={!!checklist.acknowledge1} onChange={() => handleToggle('acknowledge1')} className="w-4 h-4 rounded border-[#d8d0c8] text-[#c2652a] focus:ring-[#c2652a] cursor-pointer" />
                      Your biological capacity and resilience. You show up, breathe, and try, which is completely enough.
                    </label>
                  </div>

                </div>
              </div>

              {progressPercent === 100 && (
                <div className="mt-6 flex items-center gap-3 bg-emerald-50 border border-emerald-200 p-4 rounded-2xl animate-bounce">
                  <Award className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div>
                    <h5 className="text-xs font-bold text-emerald-800">You are fully grounded!</h5>
                    <p className="text-[10px] text-emerald-700">Your focus and senses are securely anchored in the real present. Carry this peaceful state forward.</p>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      ) : (
        /* Reframing Workshop view */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left panel: Form, Suggesions and Common Distortions */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="border border-[#d8d0c8]/60 bg-white p-6 rounded-3xl shadow-sm text-left">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-5 h-5 text-[#c2652a]" />
                <h3 className="font-serif text-lg font-bold text-[#3a302a]">
                  Deconstruct Your Self-Doubt
                </h3>
              </div>
              <p className="text-xs text-[#3a302a]/65 mb-4 leading-relaxed">
                Anxious thoughts often contain cognitive errors. Type out a persistent doubt or fear regarding your upcoming exam (e.g., JEE, General Studies, UPSC) to analyze and scientifically reframe it.
              </p>

              {/* Suggestions Chips */}
              <div className="mb-4">
                <span className="text-[10px] font-bold text-[#3a302a]/55 uppercase tracking-wider block mb-2">
                  Common academic worries:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'I will fail UPSC because everyone is smarter.',
                    'I failed this mock math test today, I am ruined.',
                    'There is not enough time to finish this GATE syllabus.',
                  ].map((sug, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => loadSuggestion(sug)}
                      className="text-[10.5px] font-semibold bg-[#faf5ee] hover:bg-[#c2652a]/10 hover:text-[#c2652a] text-[#3a302a]/75 border border-[#d8d0c8]/40 px-2.5 py-1 rounded-full cursor-pointer transition-all"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleDeconstruct} className="space-y-4">
                <div>
                  <textarea
                    rows={3}
                    value={userDoubt}
                    onChange={(e) => setUserDoubt(e.target.value)}
                    placeholder="e.g. I have missed two preparation sessions this week and now I feel like I will fail the GATE paper and disappoint my family."
                    className="w-full text-xs p-3.5 bg-[#faf5ee]/50 border border-[#d8d0c8]/60 rounded-2xl focus:ring-1 focus:ring-[#c2652a] focus:border-[#c2652a] placeholder-[#3a302a]/30 text-[#3a302a]"
                    maxLength={350}
                    required
                  />
                  <div className="flex justify-between text-[10px] text-[#3a302a]/50 mt-1 px-1">
                    <span>CBT Academic Reframer engine</span>
                    <span>{userDoubt.length}/350 chars</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isAnalyzing || !userDoubt.trim()}
                  className="w-full justify-center flex items-center gap-2 py-3 rounded-full bg-[#c2652a] hover:bg-[#a9521d] text-white font-manrope font-semibold text-xs shadow-md shadow-[#c2652a]/15 transition-all enabled:active:scale-98 disabled:opacity-50 cursor-pointer"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Deconstructing Core Cognitive Filters...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-200 fill-amber-200" />
                      Deconstruct Self-Doubt with CBT
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Educational Distortion Flip Cards */}
            <div className="border border-[#d8d0c8]/60 bg-[#faf5ee]/50 p-6 rounded-3xl shadow-sm text-left">
              <div className="flex items-center gap-1.5 mb-2">
                <Info className="w-4 h-4 text-[#8c3c3c]" />
                <h4 className="font-serif text-sm font-bold text-[#3a302a]">
                  Academic Cognitive Distortions Cheat Sheet
                </h4>
              </div>
              <p className="text-[11px] text-[#3a302a]/60 mb-4">
                Our minds employ structural shortcuts during stress. Spotting these makes defeating them easier:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {COMMON_DISTORTIONS.map((d, idx) => (
                  <div key={idx} className="bg-white border border-[#d8d0c8]/45 p-3.5 rounded-2xl hover:border-[#c2652a]/50 transition-colors">
                    <h5 className="text-xs font-bold text-[#c2652a]">{d.title}</h5>
                    <p className="text-[10px] italic text-[#3a302a]/70 mt-1">
                      {d.academicExample}
                    </p>
                    <p className="text-[10px] text-[#3a302a]/60 mt-1.5 border-t border-[#d8d0c8]/20 pt-1.5 font-semibold text-emerald-800">
                      💡 Reframed: {d.correction}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right panel: Active Reframe Results and Efficacy Ledger list */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Display Active CBT Reframe results */}
            {currentReframe ? (
              <div className="border-2 border-[#c2652a]/30 bg-white p-6 rounded-3xl shadow-sm space-y-5 text-left animate-fade-in">
                <div className="flex items-center justify-between border-b border-[#d8d0c8]/40 pb-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-600" />
                    <h4 className="font-serif text-md font-bold text-[#3a302a]">
                      Reframed Perspective Found
                    </h4>
                  </div>
                  <span className="text-[9px] bg-[#c2652a]/10 text-[#c2652a] text-xs font-mono font-bold px-2 py-0.5 rounded-full uppercase">
                    {currentReframe.distortionType}
                  </span>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <span className="block font-bold text-[#3a302a]/55 uppercase text-[9px] tracking-wider">Original Running thought:</span>
                    <p className="italic text-[#3a302a]/75 mt-0.5 bg-[#faf5ee]/50 p-2.5 rounded-xl border border-dashed text-left">
                      "{currentReframe.originalThought}"
                    </p>
                  </div>

                  <div>
                    <span className="block font-bold text-[#3a302a]/55 uppercase text-[9px] tracking-wider">The Mind's Trick (Distortion):</span>
                    <p className="text-[#3a302a]/80 mt-1 text-left">
                      {currentReframe.distortionExplanation}
                    </p>
                  </div>

                  {/* Side by side evidence audit tables */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div className="p-3 rounded-xl bg-orange-500/5 border border-orange-500/10 text-left">
                      <span className="block font-bold text-[#c2652a] text-[10px] uppercase">Acknowledge Reality:</span>
                      <p className="text-[11px] text-[#3a302a]/75 mt-1 leading-relaxed text-left">
                        {currentReframe.evidenceFor}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-left">
                      <span className="block font-bold text-emerald-700 text-[10px] uppercase">Identify Alternative Evidence:</span>
                      <p className="text-[11px] text-[#3a302a]/75 mt-1 leading-relaxed text-left">
                        {currentReframe.evidenceAgainst}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="p-4 bg-emerald-600/5 border border-emerald-600/20 rounded-2xl relative overflow-hidden text-left">
                      <div className="absolute right-0 top-0 translate-x-1 translate-y-1 rotate-12 scale-125 opacity-10">
                        <Heart className="w-12 h-12 text-emerald-600 fill-emerald-600" />
                      </div>
                      <span className="block font-bold text-emerald-800 text-[10px] uppercase tracking-wider mb-1">
                        ✨ Core Cognitive Re-wiring statement (Say this out loud):
                      </span>
                      <p className="text-xs font-bold text-emerald-950 font-serif leading-relaxed text-left">
                        {currentReframe.reframedThought}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 pt-3 border-t border-[#d8d0c8]/25">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(currentReframe.reframedThought)}
                    className="flex-1 justify-center flex items-center gap-1.5 py-2.5 rounded-full border border-[#d8d0c8] hover:bg-[#faf5ee] text-[#3a302a]/85 font-manrope font-semibold text-[11px] transition-all cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copystate ? 'Reframed text Copied!' : 'Copy Reframe text'}
                  </button>

                  <button
                    type="button"
                    onClick={saveToLedger}
                    className="flex-1 justify-center flex items-center gap-1.5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-manrope font-semibold text-[11px] shadow-sm transition-all cursor-pointer"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    Save to Efficacy Ledger
                  </button>
                </div>
              </div>
            ) : (
              <div className="border border-dashed border-[#d8d0c8]/80 bg-[#faf5ee]/30 p-12 rounded-3xl text-center select-none">
                <Brain className="w-10 h-10 text-[#3a302a]/30 mx-auto mb-3" />
                <h5 className="font-serif text-sm font-bold text-[#3a302a]/70">No active deconstruction</h5>
                <p className="text-[11px] text-[#3a302a]/50 max-w-xs mx-auto mt-1 leading-relaxed">
                  Provide an anxious doubt or select one from the examples on the left to activate CBT cognitive re-wiring.
                </p>
              </div>
            )}

            {/* Persistent Efficacy Ledger list */}
            <div className="border border-[#d8d0c8]/60 bg-white p-6 rounded-3xl shadow-sm text-left">
              <div className="flex items-center justify-between mb-4 border-b border-[#d8d0c8]/30 pb-3">
                <div className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-[#c2652a]" />
                  <h4 className="font-serif text-sm font-bold text-[#3a302a]">
                    My Efficacy Ledger ({efficacyLedger.length})
                  </h4>
                </div>
                <span className="text-[9px] text-[#3a302a]/55 font-semibold">
                  Personalized confidence tools
                </span>
              </div>

              {efficacyLedger.length === 0 ? (
                <p className="text-[11px] text-[#3a302a]/50 italic leading-relaxed py-4 text-center">
                  Your Ledger is empty. Reframed thoughts you save will collect here so you can review them prior to entering tough exam halls.
                </p>
              ) : (
                <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
                  {efficacyLedger.map((item) => (
                    <div key={item.id} className="p-4 rounded-2xl bg-[#faf5ee]/60 border border-[#d8d0c8]/40 space-y-2 relative text-left">
                      <button
                        type="button"
                        onClick={() => item.id && deleteFromLedger(item.id)}
                        className="absolute right-3 top-3 text-[#3a302a]/40 hover:text-red-600 transition-colors cursor-pointer"
                        title="Remove entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      
                      <div className="flex items-center gap-1.5 flex-wrap pr-6">
                        <span className="text-[9px] bg-emerald-100 border border-emerald-200 text-emerald-800 font-mono font-bold px-1.5 py-0.2 rounded">
                          {item.distortionType}
                        </span>
                        <span className="text-[9px] text-[#3a302a]/55 font-mono">
                          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}
                        </span>
                      </div>

                      <div className="text-[11px] leading-relaxed text-[#3a302a]/80 space-y-1 pt-1">
                        <p className="italic line-clamp-1 border-l-2 pl-2 text-[10px] text-[#3a302a]/60">
                          "{item.originalThought}"
                        </p>
                        <p className="font-serif font-bold text-emerald-900 border-t border-[#d8d0c8]/25 pt-1.5">
                          💡 {item.reframedThought}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      )}

    </div>
  );
}

// 2. Container view
export default function MindfulnessZone() {
  const state = useMindfulness();
  return <MindfulnessZonePresenter {...state} />;
}
