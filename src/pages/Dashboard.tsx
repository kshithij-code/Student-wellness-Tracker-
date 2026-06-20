import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import TrendChart from '../components/TrendChart';
import { 
  Flame, 
  Compass, 
  BrainCircuit, 
  Sparkles, 
  Scale, 
  PenLine, 
  Moon, 
  AlertCircle, 
  ArrowRight,
  TrendingUp,
  GraduationCap
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
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


  return (
    <div id="dashboard-view" className="space-y-8 animate-fade-in font-manrope">
      
      {/* Overview Status Grid Header Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 select-none">
        
        {/* Streak Widget */}
        <div className="bg-white border border-[#d8d0c8]/60 p-6 rounded-3xl flex items-center gap-5 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-[#c2652a]/10 flex items-center justify-center text-[#c2652a]">
            <Flame className="w-6 h-6 fill-[#c2652a]/20" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider text-[#3a302a]/55 font-bold">Wellness Streak</span>
            <h3 className="text-2xl font-serif font-black text-[#3a302a]">{streak} Continuous Days</h3>
            <p className="text-[11px] text-[#3a302a]/60">You're maintaining a great self-care routine!</p>
          </div>
        </div>

        {/* Avg Mood Widget */}
        <div className="bg-white border border-[#d8d0c8]/60 p-6 rounded-3xl flex items-center gap-5 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-[#8c3c3c]/10 flex items-center justify-center text-[#8c3c3c]">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider text-[#3a302a]/55 font-bold">Average Mood Pulse</span>
            <h3 className="text-2xl font-serif font-black text-[#3a302a]">{averageMood > 0 ? `${averageMood} / 10` : 'None Logged'}</h3>
            <p className="text-[11px] text-[#3a302a]/60">Calculated over your secure IndexedDB history</p>
          </div>
        </div>

        {/* Exam Focus Widget */}
        <div className="bg-white border border-[#d8d0c8]/60 p-6 rounded-3xl flex items-center gap-5 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-[#faf5ee] border border-[#d8d0c8] flex items-center justify-center text-teal-800">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider text-[#3a302a]/55 font-bold">Active Countdown Hub</span>
            <h3 className="text-2xl font-serif font-black text-[#3a302a]">
              {countdowns.length} Exam {countdowns.length === 1 ? 'Target' : 'Targets'}
            </h3>
            <p className="text-[11px] text-[#3a302a]/60">Managing and pacing upcoming deadlines</p>
          </div>
        </div>
      </div>

      {/* Primary Row: Chart & Stress Triggers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Trend Graph Area */}
        <div className="lg:col-span-8 space-y-4">
          <TrendChart journals={journals} onNavigateToJournal={() => onNavigate('journal')} />
          {countdowns.length > 0 && (
            <div className="flex flex-wrap gap-3 bg-[#f5ebe0]/40 border border-[#d8d0c8]/50 p-4 rounded-2xl select-none">
              <span className="text-xs font-bold text-[#c2652a] uppercase tracking-wider self-center mr-1">Immediate Targets:</span>
              {countdowns.slice(0, 3).map((item) => {
                const daysLeft = Math.ceil((new Date(item.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                return (
                  <span 
                    key={item.id} 
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#d8d0c8] text-[#3a302a] shadow-sm flex items-center gap-1.5"
                  >
                    📝 {item.title}: <b className="text-[#8c3c3c]">{daysLeft > 0 ? `${daysLeft} days` : 'Today'}</b>
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* Stress Triggers Panel */}
        <div className="lg:col-span-4 border border-[#d8d0c8]/60 bg-white p-6 rounded-3xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 select-none">
              <AlertCircle className="w-5 h-5 text-[#8c3c3c]" />
              <h3 className="font-serif text-lg font-bold text-[#3a302a]">Stress Triggers</h3>
            </div>
            <p className="text-xs text-[#3a302a]/65 mb-6 select-none">
              Continuous assessment of stress vectors matched from your local mindfulness journals.
            </p>

            <div className="space-y-4">
              {dynamicGauges.map((g) => (
                <div key={g.name} className="space-y-1">
                  <div className="flex justify-between items-center text-xs select-none">
                    <span className="font-semibold text-[#3a302a]">{g.name}</span>
                    <span className="text-[#3a302a]/50 font-mono text-[10px]">active pulse</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#faf5ee] border border-[#d8d0c8]/30 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${g.color} rounded-full transition-all duration-500`} 
                      style={{ width: g.level }}
                    />
                  </div>
                  <p className="text-[10px] text-[#3a302a]/45 italic leading-tight select-none">
                    {g.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {detectedTriggers.length > 0 && (
            <div className="mt-6 pt-4 border-t border-[#d8d0c8]/40 select-none">
              <div className="flex items-center gap-1.5 mb-2">
                <BrainCircuit className="w-4 h-4 text-[#c2652a]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#3a302a]/80">AI Trigger Insights:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {detectedTriggers.map((t, idx) => (
                  <span 
                    key={idx} 
                    className="text-[10px] font-semibold bg-[#faf5ee] border border-[#d8d0c8] py-0.5 px-2 rounded-md text-[#8c3c3c]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Secondary Row: Daily Writing Block & Recommended Exercises */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Daily Journaling Canvas */}
        <div className="lg:col-span-7 border border-[#d8d0c8]/60 bg-white p-6 rounded-3xl shadow-sm flex flex-col justify-between">
          <form onSubmit={handleQuickJournalSubmit} className="space-y-4">
            <div className="flex items-center justify-between select-none mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#c2652a]/10 flex items-center justify-center text-[#c2652a]">
                  <PenLine className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#3a302a]">Daily Journaling</h3>
              </div>
              <span className="text-[11px] uppercase tracking-wider text-[#3a302a]/50 font-bold">offline workspace</span>
            </div>

            <label htmlFor="quick-journal-textarea" className="block text-xs font-eb-garamond italic text-[#3a302a]/70 border-l-2 border-[#c2652a]/40 pl-3 py-1 bg-[#faf5ee] rounded-r-lg">
              {profile?.name 
                ? `"${profile.name}, how is your study preparation for ${profile.targetExamTitle || profile.examType} progressing today? Write down any thoughts."` 
                : `"How was your interaction with the study group today? Try summarizing your progress."`}
            </label>

            {/* Structured notebook lines on journal editor */}
            <div className="relative">
              <textarea
                id="quick-journal-textarea"
                rows={5}
                value={quickContent}
                onChange={(e) => setQuickContent(e.target.value)}
                placeholder="I felt a bit anxious during the presentation, but the feedback was helpful. I need to remember that everyone else is also learning. Maybe I can prep more visuals..."
                className="w-full font-manrope text-sm text-[#3a302a] bg-[#faf5ee] border border-[#d8d0c8] p-4 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#c2652a] select-text placeholder:text-[#3a302a]/30 resize-none line-clamp-6 leading-relaxed"
              />
            </div>

            {/* Mood Slider UI */}
            <div className="space-y-2 select-none">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#3a302a]">How was your mood? ({quickMood}/10)</span>
                <span className="text-[11px] text-[#c2652a] font-semibold">
                  {quickMood <= 3 ? 'Deep Exhausted' : quickMood <= 6 ? 'Slight anxious' : 'Balanced / calm'}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={quickMood}
                onChange={(e) => setQuickMood(parseInt(e.target.value))}
                className="w-full accent-[#c2652a] cursor-pointer"
              />
            </div>

            {journalSavedMessage && (
              <p className="text-xs text-emerald-600 font-semibold">{journalSavedMessage}</p>
            )}

            <button
              type="submit"
              disabled={isAnalyzing || !quickContent.trim()}
              className="mt-2 w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#c2652a] disabled:bg-[#d8d0c8] text-white font-semibold text-sm transition-all hover:bg-[#a9521d] cursor-pointer disabled:cursor-not-allowed shadow-md shadow-[#c2652a]/10"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  AI Analyzing Entry...
                </>
              ) : (
                <>
                  Save & Analyze Entry
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Recommended Exercises block */}
        <div className="lg:col-span-5 border border-[#d8d0c8]/60 bg-white p-6 rounded-3xl shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-1 select-none">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#c2652a]" />
                <h3 className="font-serif text-lg font-bold text-[#3a302a]">Recommended Exercises</h3>
              </div>
              <button 
                type="button"
                onClick={() => onNavigate('mindfulness')}
                className="text-xs font-bold text-[#c2652a] hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>

            {/* Exercise List */}
            <div className="space-y-3.5">
              {/* Box Breathing */}
              <div 
                id="exercise-1"
                onClick={() => onNavigate('mindfulness')}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#faf5ee] border border-[#d8d0c8]/40 hover:border-[#c2652a]/40 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#c2652a]/10 flex items-center justify-center text-[#c2652a] group-hover:scale-105 transition-transform">
                    🧘
                  </div>
                  <div>
                    <span className="text-[10px] tracking-wider text-[#c2652a] uppercase font-bold font-mono">Mindfulness</span>
                    <h4 className="text-sm font-semibold text-[#3a302a] leading-none mt-0.5">4-4-4 Breathing Technique</h4>
                    <span className="text-xs text-[#3a302a]/55 font-mono">5 min • Beginner</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#3a302a]/30 group-hover:text-[#c2652a] group-hover:translate-x-1 transition-all" />
              </div>

              {/* Cognitive Stress Reframing */}
              <div 
                id="exercise-2"
                onClick={() => onNavigate('chat')}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#faf5ee] border border-[#d8d0c8]/40 hover:border-[#c2652a]/40 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-700 group-hover:scale-105 transition-transform">
                    🧠
                  </div>
                  <div>
                    <span className="text-[10px] tracking-wider text-orange-700 uppercase font-bold font-mono">Cognitive</span>
                    <h4 className="text-sm font-semibold text-[#3a302a] leading-none mt-0.5">Exam Stress Reframing</h4>
                    <span className="text-xs text-[#3a302a]/55 font-mono">12 min • Advanced</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#3a302a]/30 group-hover:text-[#c2652a] group-hover:translate-x-1 transition-all" />
              </div>

              {/* Digital Detox */}
              <div 
                id="exercise-3"
                onClick={() => onNavigate('mindfulness')}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#faf5ee] border border-[#d8d0c8]/40 hover:border-[#c2652a]/40 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center text-violet-700 group-hover:scale-105 transition-transform">
                    <Moon className="w-5 h-5 text-violet-700" />
                  </div>
                  <div>
                    <span className="text-[10px] tracking-wider text-violet-700 uppercase font-bold font-mono">Sleep</span>
                    <h4 className="text-sm font-semibold text-[#3a302a] leading-none mt-0.5">Digital Detox Routine</h4>
                    <span className="text-xs text-[#3a302a]/55 font-mono">15 min • Daily ritual</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#3a302a]/30 group-hover:text-[#c2652a] group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
