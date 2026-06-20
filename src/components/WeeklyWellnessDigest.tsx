import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceLine 
} from 'recharts';
import { 
  Sparkles, 
  Award, 
  AlertCircle, 
  CheckCircle, 
  Calendar, 
  Compass, 
  Check, 
  BookMarked 
} from 'lucide-react';
import type { JournalEntry } from '../types';
import ChartLegend from './ChartLegend';

interface WeeklyWellnessDigestProps {
  journals: JournalEntry[];
  studyGoalHours?: number;
  onNavigateToJournal?: () => void;
}

export default function WeeklyWellnessDigest({ 
  journals, 
  studyGoalHours = 4, 
  onNavigateToJournal 
}: WeeklyWellnessDigestProps) {
  
  // Calculate the past 7 days ending today
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  const formattedData = last7Days.map(day => {
    const dayStr = day.toDateString();
    
    // Find all journal entries logged on this day
    const sameDayEntries = journals.filter(e => {
      const entryDate = new Date(e.date);
      return entryDate.toDateString() === dayStr;
    });

    if (sameDayEntries.length > 0) {
      // Average mood score (1-10)
      const avgMood = sameDayEntries.reduce((sum, e) => sum + e.mood, 0) / sameDayEntries.length;
      
      // Average AI evaluated mood sentiment (1-10)
      const evaluatedMoods = sameDayEntries.map(e => e.analysis?.evaluatedMood ?? e.mood);
      const avgSentiment = evaluatedMoods.reduce((sum, val) => sum + val, 0) / sameDayEntries.length;

      // Collect coping cards
      const copingCards = sameDayEntries
        .map(e => e.analysis?.copingCard)
        .filter(Boolean) as string[];

      return {
        dayName: day.toLocaleDateString('en-US', { weekday: 'short' }),
        dateLabel: day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        mood: parseFloat(avgMood.toFixed(1)),
        sentiment: parseFloat(avgSentiment.toFixed(1)),
        copingCards,
        hasLogs: true
      };
    } else {
      return {
        dayName: day.toLocaleDateString('en-US', { weekday: 'short' }),
        dateLabel: day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        mood: null,
        sentiment: null,
        copingCards: [],
        hasLogs: false
      };
    }
  });

  // Extract all compiled coping cards with their corresponding day labels
  const recordedCopingCards = formattedData
    .filter(d => d.hasLogs && d.copingCards.length > 0)
    .map(d => ({
      dayLabel: `${d.dayName} (${d.dateLabel})`,
      cards: d.copingCards
    }));

  const totalLogs = formattedData.filter(d => d.hasLogs).length;

  return (
    <div 
      id="weekly-wellness-digest-widget" 
      className="p-6 md:p-8 bg-white border border-[#d8d0c8]/60 rounded-3xl shadow-sm flex flex-col space-y-6 select-none text-left"
    >
      {/* Header section with title and stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#d8d0c8]/30 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#c2652a]" />
            <h3 className="font-serif text-lg font-bold text-[#3a302a]">
              7-Day Weekly Wellness Digest
            </h3>
          </div>
          <p className="text-xs text-[#3a302a]/65 mt-1 leading-relaxed">
            Correlate your logged mood alongside Gemini-analyzed text sentiment and therapeutic coping cards.
          </p>
        </div>

        {/* Dynamic status pill */}
        <div className="shrink-0 flex items-center gap-1.5 self-start sm:self-auto">
          {totalLogs >= 3 ? (
            <span className="text-[10px] bg-emerald-100 border border-emerald-200 text-emerald-800 font-mono font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Robust Data Active
            </span>
          ) : (
            <span className="text-[10px] bg-amber-100 border border-amber-200 text-amber-800 font-mono font-bold px-2.5 py-1 rounded-full flex items-center gap-1" title="Log more entries to enrich AI trends">
              <Sparkles className="w-3 h-3" /> Log more days for deeper trends
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recharts chart summary block (left col) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex justify-between items-center text-xs font-semibold text-[#3a302a]/80">
            <span>Sentiment vs Mood Correlation</span>
            
            {/* Reusable, fully accessible chart legend */}
            <ChartLegend 
              ariaLabel="Wellness sentiment vs mood representation" 
              items={[
                { label: 'Your Logged Mood', color: '#c2652a', value: '1-10' },
                { label: 'Gemini Evaluated Sentiment', color: '#059669', value: '1-10' }
              ]} 
            />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart 
                data={formattedData} 
                margin={{ top: 10, right: 10, left: -25, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c2652a" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#c2652a" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSentiment" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#d8d0c833" vertical={false} />
                <XAxis 
                  dataKey="dayName" 
                  stroke="#3a302a77" 
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                  className="font-manrope font-semibold"
                />
                <YAxis 
                  stroke="#3a302a77" 
                  fontSize={11}
                  domain={[1, 10]}
                  tickLine={false}
                  axisLine={false}
                  dx={-5}
                  tickCount={10}
                  className="font-manrope font-semibold"
                />
                <Tooltip
                  allowEscapeViewBox={{ x: true, y: true }}
                  contentStyle={{
                    backgroundColor: '#faf5ee',
                    border: '1px solid #d8d0c8',
                    borderRadius: '16px',
                    fontFamily: 'Manrope',
                    fontSize: '11px',
                    boxShadow: '0 4px 12px rgba(58, 48, 42, 0.05)'
                  }}
                  formatter={(value: any, name: string) => {
                    if (value === null) return ['Not Logged', name === 'mood' ? 'Logged Mood' : 'Analyzed Sentiment'];
                    return [value, name === 'mood' ? 'Logged Mood' : 'Analyzed Sentiment'];
                  }}
                  labelFormatter={(index: any, items: any[]) => {
                    const item = items?.[0]?.payload || formattedData[index];
                    return item ? `${item.dayName}, ${item.dateLabel}` : '';
                  }}
                />
                <ReferenceLine y={5} stroke="#d8d0c8" strokeDasharray="3 3" />
                <Area 
                  type="monotone" 
                  dataKey="mood" 
                  stroke="#c2652a" 
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorMood)"
                  connectNulls={true}
                  dot={{ r: 4, fill: '#ffffff', stroke: '#c2652a', strokeWidth: 2 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="sentiment" 
                  stroke="#059669" 
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorSentiment)"
                  connectNulls={true}
                  dot={{ r: 4, fill: '#ffffff', stroke: '#059669', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Coping Cards highlights column (right col) */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          <div className="space-y-3 flex-1">
            <span className="text-[10px] uppercase font-bold text-[#3a302a]/60 block tracking-wider">
              7-Day Coping Highlights
            </span>

            {recordedCopingCards.length === 0 ? (
              <div className="p-5 border border-dashed border-[#d8d0c8] bg-[#faf5ee]/40 rounded-2xl text-center space-y-3">
                <Compass className="w-8 h-8 text-[#c2652a]/40 mx-auto" />
                <h4 className="text-xs font-bold text-[#3a302a]">No stress relief cards yet</h4>
                <p className="text-[11px] leading-relaxed text-[#3a302a]/60 font-semibold">
                  Once you log study sessions with negative emotions or heavy triggers, Gemini generates specialized Coping Cards which summarize here.
                </p>
                {onNavigateToJournal && (
                  <button
                    type="button"
                    onClick={onNavigateToJournal}
                    className="text-[10.5px] text-[#c2652a] hover:underline font-bold flex items-center gap-1 mx-auto"
                  >
                    Log mood now &rarr;
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3 max-h-[195px] overflow-y-auto pr-1">
                {recordedCopingCards.map((record, index) => (
                  <div 
                    key={index} 
                    className="p-3.5 bg-emerald-50/50 border border-emerald-600/15 rounded-2xl space-y-1 text-left relative"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[9.5px] font-bold text-[#059669] uppercase tracking-wider font-mono">
                        Coping Card Anchor
                      </span>
                      <span className="text-[9px] text-[#3a302a]/55 font-semibold">
                        {record.dayLabel}
                      </span>
                    </div>
                    {record.cards.map((cardText, cIdx) => (
                      <p 
                        key={cIdx} 
                        className="text-[11px] text-[#3a302a]/80 font-semibold leading-relaxed pl-3 border-l-2 border-emerald-500/40"
                      >
                        "{cardText}"
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick wellness affirmation */}
          <div className="bg-[#faf5ee] border border-[#d8d0c8]/40 p-3.5 rounded-2xl relative overflow-hidden">
            <div className="absolute right-0 bottom-0 scale-125 translate-x-2 translate-y-2 opacity-5 text-[#c2652a]">
              🧘
            </div>
            <h5 className="text-[10.5px] font-bold text-[#c2652a] uppercase tracking-wider flex items-center gap-1 mb-1">
              <Award className="w-3.5 h-3.5" /> Affirmation of the week
            </h5>
            <p className="text-[11px] text-[#3a302a]/75 font-semibold leading-relaxed">
              "My worth isn't contingent on speed of coverage or mock ranks. True growth is steady, patient, and sequential. I am pacing myself with pride."
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
