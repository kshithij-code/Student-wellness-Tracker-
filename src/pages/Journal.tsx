import React from 'react';
import { useJournal } from '../hooks/useJournal';
import { 
  Sparkles, 
  Trash2, 
  PenTool, 
  Smile, 
  Calendar, 
  BrainCircuit, 
  Inbox,
  AlertTriangle 
} from 'lucide-react';
import type { JournalEntry } from '../types';

interface JournalPresenterProps {
  journals: JournalEntry[];
  isAnalyzing: boolean;
  deleteJournalEntry: (id: number) => Promise<void>;
  mood: number;
  setMood: (mood: number) => void;
  content: string;
  setContent: (content: string) => void;
  expandedId: number | null;
  setExpandedId: (id: number | null) => void;
  statusMessage: string;
  handleCreateEntry: (e: React.FormEvent) => void;
  getMoodEmoji: (score: number) => string;
}

// 1. Pure Presenter element
export function JournalPresenter({
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
}: JournalPresenterProps) {
  return (
    <div id="journal-view" className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in font-manrope">
      
      {/* Left Canvas: Writing Block */}
      <div className="lg:col-span-7 space-y-6">
        <div className="border border-[#d8d0c8]/60 bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-center select-none border-b border-[#d8d0c8]/30 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <PenTool className="w-5 h-5 text-[#c2652a]" />
              <h3 className="font-serif text-lg font-bold text-[#3a302a]">
                New Journal Block
              </h3>
            </div>
            <span className="text-[10px] tracking-wider font-extrabold uppercase text-[#3a302a]/45">local sandbox</span>
          </div>

          <form onSubmit={handleCreateEntry} className="space-y-6">
            
            {/* Elegant Mood Slider with interactive preview */}
            <div className="space-y-3 bg-[#faf5ee]/70 border border-[#d8d0c8]/30 p-4 rounded-2xl select-none">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#3a302a] flex items-center gap-1.5">
                  <Smile className="w-4 h-4 text-[#c2652a]" />
                  What is your mental well-being scale?
                </span>
                <span className="font-mono font-black text-sm bg-white border border-[#d8d0c8] text-[#c2652a] px-2.5 py-0.5 rounded-full shadow-sm">
                  {getMoodEmoji(mood)} {mood} / 10
                </span>
              </div>
              
              <input
                type="range"
                min="1"
                max="10"
                value={mood}
                onChange={(e) => setMood(parseInt(e.target.value))}
                className="w-full h-1.5 bg-[#d8d0c8]/50 accent-[#c2652a] rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#3a302a]/45 px-1">
                <span>1 (Overwhelmed)</span>
                <span>5 (Neutral)</span>
                <span>10 (Completely calm)</span>
              </div>
            </div>

            {/* Premium lined notebook writing canvas */}
            <div className="space-y-2">
              <label htmlFor="journal-textarea" className="block text-xs font-bold uppercase tracking-wider text-[#3a302a]/60">
                Write openly about today's studies, triggers, or fatigue:
              </label>
              
              <textarea
                id="journal-textarea"
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Today was tough. Mock exam results came in and my physics score was lower than expected. It made me doubt if I can clear the engineering midterm next month. I stayed up too late studying formulas, and now my head is pounding..."
                className="w-full font-manrope text-sm text-[#3a302a] bg-[#faf5ee]/50 border border-[#d8d0c8] p-4.5 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#c2652a] focus:bg-white select-text placeholder:text-[#3a302a]/30 resize-none leading-relaxed transition-all"
              />
            </div>

            {statusMessage && (
              <p className="text-xs text-[#c2652a] font-medium animate-pulse">{statusMessage}</p>
            )}

            {/* Trigger GenAI analyze block */}
            <button
              type="submit"
              disabled={isAnalyzing || !content.trim()}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#c2652a] text-white font-semibold text-sm hover:bg-[#a9521d] disabled:bg-[#d8d0c8] cursor-pointer disabled:cursor-not-allowed transition-all shadow-md shadow-[#c2652a]/15"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Synthesizing Emotional Analysis...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-white/10" />
                  Analyze and Log Entry
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Right List: History Logs with GenAI expanders */}
      <div className="lg:col-span-5 space-y-4">
        <div className="border border-[#d8d0c8]/60 bg-white rounded-3xl p-6 shadow-sm select-none">
          <div className="flex justify-between items-center border-b border-[#d8d0c8]/30 pb-4 mb-4">
            <h3 className="font-serif text-lg font-bold text-[#3a302a]">
              Wellness Log Histories
            </h3>
            <span className="font-mono text-xs text-[#c2652a] font-bold">
              {journals.length} Saved
            </span>
          </div>

          {journals.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-[#faf5ee] border border-[#d8d0c8]/60 flex items-center justify-center text-[#3a302a]/30 mb-3">
                <Inbox className="w-5 h-5" />
              </div>
              <p className="font-serif text-[#3a302a] font-bold">No entries found</p>
              <p className="font-manrope text-xs text-[#3a302a]/55 max-w-xs mt-1">
                Your secure and completely confidential journals will populate here once logged.
              </p>
            </div>
          ) : (
            <div className="space-y-3.5 max-h-[550px] overflow-y-auto pr-1">
              {journals.map((entry) => {
                const isExpanded = expandedId === entry.id;
                const dateObj = new Date(entry.date);
                const showDate = dateObj.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });
                const showTime = dateObj.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div 
                    key={entry.id} 
                    className={`border rounded-2xl p-4 transition-all duration-300 ${
                      isExpanded 
                        ? 'border-[#c2652a] bg-[#faf5ee]' 
                        : 'border-[#d8d0c8]/60 hover:bg-[#faf5ee]/45 bg-white'
                    }`}
                  >
                    {/* Collapsed top bar */}
                    <div 
                      onClick={() => setExpandedId(isExpanded ? null : (entry.id || null))}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <div className="space-y-1 bg-[#faf5ee]/50 p-2 rounded-xl border border-[#d8d0c8]/20 w-fit">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-[#3a302a]/80 select-none">
                            Logged: {getMoodEmoji(entry.mood)} {entry.mood}/10
                          </span>
                          {entry.analysis?.evaluatedMood !== undefined && (
                            <span 
                              className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 flex items-center gap-1 select-none" 
                              title="Gemini analyzed emotional score from your entry text itself"
                            >
                              ✨ AI Evaluator: {getMoodEmoji(entry.analysis.evaluatedMood)} {entry.analysis.evaluatedMood}/10
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-[#3a302a]/50 font-mono">
                          <Calendar className="w-3 h-3" />
                          <span>{showDate} • {showTime}</span>
                        </div>
                      </div>

                      {/* Controls */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (entry.id) deleteJournalEntry(entry.id);
                        }}
                        className="p-1.5 rounded-full hover:bg-red-50 text-[#3a302a]/40 hover:text-red-600 transition-all cursor-pointer"
                        title="Delete entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Expandable text body & AI widgets */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-[#d8d0c8]/50 space-y-4">
                        
                        {/* Entry note text */}
                        <div className="text-sm text-[#3a302a]/85 leading-relaxed italic bg-white p-3 rounded-xl border border-[#d8d0c8]/30 max-h-48 overflow-y-auto select-text">
                          "{entry.content}"
                        </div>

                        {/* GenAI insights card section */}
                        {entry.analysis ? (
                          <div className="space-y-3.5 bg-white/70 border border-[#d8d0c8]/40 p-3.5 rounded-xl">
                            
                            {/* Emotional tags */}
                            {entry.analysis.emotionalState && entry.analysis.emotionalState.length > 0 && (
                              <div>
                                <span className="block text-[10px] font-mono uppercase font-bold text-[#3a302a]/55 mb-1.5">
                                  Emotional State:
                                </span>
                                <div className="flex flex-wrap gap-1">
                                  {entry.analysis.emotionalState.map((tag) => (
                                    <span 
                                      key={tag}
                                      className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#c2652a]/10 border border-[#c2652a]/15 text-[#c2652a]"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Extracted triggers */}
                            {entry.analysis.stressTriggers && entry.analysis.stressTriggers.length > 0 && (
                              <div>
                                <span className="block text-[10px] font-mono uppercase font-bold text-[#3a302a]/55 mb-1.5">
                                  Stress Triggers Detected:
                                </span>
                                <div className="flex flex-wrap gap-1">
                                  {entry.analysis.stressTriggers.map((trig) => (
                                    <span 
                                      key={trig}
                                      className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#8c3c3c]/10 border border-[#8c3c3c]/15 text-[#8c3c3c]"
                                    >
                                      {trig}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Personalized Copa Card */}
                            <div>
                              <span className="flex items-center gap-1 text-[10px] font-mono uppercase font-bold text-[#3a302a]/55 mb-1">
                                <BrainCircuit className="w-3.5 h-3.5 text-[#c2652a]" />
                                Context Coping Tips:
                              </span>
                              <p className="text-xs text-[#3a302a]/80 leading-relaxed pl-1.5 border-l-2 border-[#c2652a]">
                                {entry.analysis.copingCard}
                              </p>
                            </div>

                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-xs text-[#c2652a] font-mono">
                            <AlertTriangle className="w-4 h-4" />
                            No Local GenAI analysis cached for this entry.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

// 2. Container
export default function Journal() {
  const state = useJournal();
  return <JournalPresenter {...state} />;
}
