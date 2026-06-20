import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import NewsFeed from '../components/NewsFeed';
import { 
  CalendarClock, 
  Trash2, 
  PlusSquare, 
  Hourglass, 
  AlertCircle,
  GraduationCap
} from 'lucide-react';

export default function ExamHub() {
  const { 
    countdowns, 
    addExamCountdown, 
    deleteExamCountdown, 
    newsFeed 
  } = useApp();

  const [title, setTitle] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('00:00');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleCreateCountdown = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) {
      setErrorMessage('Please fill in both name and target date.');
      return;
    }

    setErrorMessage('');
    await addExamCountdown(title.trim(), date, time);
    setTitle('');
    setDate('');
    setTime('00:00');
  };

  // Helper to calculate days and hours cleanly
  const calcTimeLeft = (targetDateStr: string, targetTimeStr?: string) => {
    const combinedStr = `${targetDateStr}T${targetTimeStr || '00:00'}:00`;
    const diffMs = new Date(combinedStr).getTime() - Date.now();
    
    if (diffMs <= 0) {
      return { status: 'Evaluated / Concluded', days: 0, hours: 0, active: false };
    }

    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;

    return { status: `${days}d ${hours}h left`, days, hours, active: true };
  };

  return (
    <div id="exam-hub-view" className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in font-manrope">
      
      {/* Left Column: Create Exam Countdown + Active Grid */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Creation Form */}
        <div className="border border-[#d8d0c8]/60 bg-white p-6 rounded-3xl shadow-sm">
          <div className="flex items-center gap-2 mb-4 select-none">
            <CalendarClock className="w-5 h-5 text-[#c2652a]" />
            <h3 className="font-serif text-lg font-bold text-[#3a302a]">
              Monitor an Upcoming Exam
            </h3>
          </div>
          
          <form onSubmit={handleCreateCountdown} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Exam Title */}
              <div className="space-y-1.5">
                <label htmlFor="exam-name" className="block text-xs font-bold text-[#3a302a]/75">
                  Exam / Midterm Name
                </label>
                <input
                  id="exam-name"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Physics 101 Midterm"
                  className="w-full text-xs font-manrope p-3 rounded-xl border border-[#d8d0c8] bg-[#faf5ee]/60 focus:outline-none focus:ring-1 focus:ring-[#c2652a] select-text text-[#3a302a]"
                />
              </div>

              {/* Target Date */}
              <div className="space-y-1.5">
                <label htmlFor="exam-date" className="block text-xs font-bold text-[#3a302a]/75">
                  Target Date (YYYY-MM-DD)
                </label>
                <input
                  id="exam-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full text-xs font-manrope p-3 rounded-xl border border-[#d8d0c8] bg-[#faf5ee]/60 focus:outline-none focus:ring-1 focus:ring-[#c2652a] select-text text-[#3a302a]"
                />
              </div>

            </div>

            {errorMessage && (
              <p className="text-xs text-[#8c3c3c] font-semibold">{errorMessage}</p>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#c2652a] text-white font-semibold text-xs hover:bg-[#a9521d] transition-all cursor-pointer shadow-md shadow-[#c2652a]/10"
            >
              <PlusSquare className="w-4 h-4" />
              Anchor Target Countdown
            </button>
          </form>
        </div>

        {/* Existing Grid */}
        <div className="space-y-3">
          <h4 className="font-serif text-base font-bold text-[#3a302a] select-none pl-1">
            Active Study Goal Timelines
          </h4>

          {countdowns.length === 0 ? (
            <div className="border border-dashed border-[#d8d0c8] rounded-3xl p-10 text-center select-none bg-white/40">
              <Hourglass className="w-10 h-10 text-[#d8d0c8] mx-auto mb-3" />
              <p className="font-serif text-[#3a302a] font-bold">No timelines recorded yet</p>
              <p className="font-manrope text-xs text-[#3a302a]/55 max-w-xs mx-auto mt-1">
                Pin targets above (like Mock JEEs or midterms) to pace your learning curve comfortably.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {countdowns.map((item) => {
                const clock = calcTimeLeft(item.date, item.time);
                return (
                  <div 
                    key={item.id} 
                    className="border border-[#d8d0c8]/60 bg-white p-4.5 rounded-2xl flex flex-col justify-between shadow-sm select-none gap-4 hover:border-[#c2652a]/30 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-[9px] bg-amber-50 border border-amber-200 text-amber-800 font-mono font-bold uppercase tracking-wider py-0.5 px-2 rounded-full">
                          Target
                        </span>
                        <h5 className="font-serif text-sm font-black text-[#3a302a] mt-1.5 leading-none">
                          {item.title}
                        </h5>
                        <p className="text-[10px] text-[#3a302a]/55 font-mono">
                          Target: {item.date} {item.time !== '00:00' && `• ${item.time}`}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => item.id && deleteExamCountdown(item.id)}
                        className="p-1.5 rounded-full hover:bg-red-50 text-[#3a302a]/30 hover:text-red-700 transition"
                        title="Delete countdown"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="pt-2 border-t border-[#d8d0c8]/30 flex justify-between items-center">
                      <span className="text-xs text-[#3a302a]/50">Pacing index</span>
                      <span className={`text-xs font-bold font-mono ${clock.active ? 'text-[#8c3c3c]' : 'text-[#3a302a]/40'}`}>
                        {clock.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Right Column: Campus NewsFeed */}
      <div className="lg:col-span-5 h-full">
        <NewsFeed news={newsFeed} />
      </div>

    </div>
  );
}
