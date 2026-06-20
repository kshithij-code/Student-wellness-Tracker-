import React from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import type { JournalEntry } from '../types';
import { BookOpen } from 'lucide-react';
import ChartLegend from './ChartLegend';

interface TrendChartProps {
  journals: JournalEntry[];
  onNavigateToJournal?: () => void;
}

export default function TrendChart({ journals, onNavigateToJournal }: TrendChartProps) {
  // Take last 14 entries and reverse them so they go in chronological order (left-to-right)
  const chartData = [...journals]
    .slice(0, 14)
    .reverse()
    .map((e) => {
      const d = new Date(e.date);
      return {
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        mood: e.mood,
        stress: e.analysis?.stressTriggers && e.analysis.stressTriggers.length > 0 
          ? Math.max(1, 11 - e.mood) // stress correlates negatively with mood
          : Math.min(9, 10 - e.mood),
      };
    });

  if (journals.length === 0) {
    return (
      <div className="h-72 w-full border border-[#d8d0c8]/60 rounded-3xl bg-white p-6 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full bg-[#c2652a]/10 flex items-center justify-center text-[#c2652a] mb-3">
          <BookOpen className="w-5 h-5" />
        </div>
        <h4 className="font-serif text-lg font-bold text-[#3a302a]">
          Your Wellness Trend
        </h4>
        <p className="font-manrope text-xs text-[#3a302a]/60 max-w-sm mt-1 mb-4">
          Once you complete your first study-break journal entry, our local GenAI engine will chart your daily mood and stress levels here.
        </p>
        {onNavigateToJournal && (
          <button
            type="button"
            onClick={onNavigateToJournal}
            className="px-5 py-2 rounded-xl bg-[#c2652a] hover:bg-[#a9521d] text-white font-manrope font-semibold text-xs transition-all cursor-pointer"
          >
            Log Today's Mood
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="border border-[#d8d0c8]/60 rounded-3xl bg-white p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-serif text-lg font-bold text-[#3a302a]">
            Mood & Stress Trends
          </h3>
          <p className="text-xs font-manrope text-[#3a302a]/65">
            Fluctuation over last {chartData.length} logs. Stress level is derived by GenAI patterns.
          </p>
        </div>
        {/* Legend */}
        <ChartLegend 
          ariaLabel="Trends legend representation" 
          items={[
            { label: 'Mood', color: '#c2652a', value: '1-10' },
            { label: 'Est. Stress', color: '#8c3c3c', dashed: true }
          ]} 
        />
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid stroke="#d8d0c833" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#3a302a77" 
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dy={10}
              className="font-manrope" 
            />
            <YAxis 
              stroke="#3a302a77" 
              fontSize={11}
              domain={[0, 10]}
              tickLine={false}
              axisLine={false}
              dx={-5}
              className="font-manrope"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#faf5ee', 
                border: '1px solid #d8d0c8',
                borderRadius: '16px',
                fontFamily: 'Manrope',
                fontSize: '11px',
                boxShadow: '0 2px 12px rgba(58, 48, 42, 0.04)'
              }} 
            />
            <ReferenceLine y={5} stroke="#d8d0c8" strokeDasharray="3 3-exact" />
            <Line 
              type="monotone" 
              dataKey="mood" 
              stroke="#c2652a" 
              strokeWidth={3} 
              activeDot={{ r: 6, fill: '#c2652a' }}
              dot={{ r: 4, fill: '#ffffff', stroke: '#c2652a', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="stress" 
              stroke="#8c3c3c" 
              strokeWidth={2} 
              strokeDasharray="4 4"
              activeDot={{ r: 5, fill: '#8c3c3c' }}
              dot={{ r: 3, fill: '#ffffff', stroke: '#8c3c3c', strokeWidth: 1.5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
