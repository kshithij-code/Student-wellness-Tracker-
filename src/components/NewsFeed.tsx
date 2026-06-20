import React from 'react';
import type { NewsItem } from '../types';
import { Newspaper, BookOpen, Quote } from 'lucide-react';

interface NewsFeedProps {
  news: NewsItem[];
}

export default function NewsFeed({ news }: NewsFeedProps) {
  return (
    <div className="border border-[#d8d0c8]/60 rounded-3xl bg-white p-6 shadow-sm select-none">
      <div className="flex items-center gap-2 mb-4">
        <Newspaper className="w-5 h-5 text-[#c2652a]" />
        <h3 className="font-serif text-lg font-bold text-[#3a302a]">
          Campus Wellness & News Feed
        </h3>
      </div>
      <p className="font-manrope text-xs text-[#3a302a]/65 mb-6">
        Latest official mock exam support, mental wellness articles, and positive student-perspective guidelines.
      </p>

      {/* Inspirational Quote of the Day */}
      <div className="bg-[#faf5ee] border border-[#d8d0c8]/45 p-4 rounded-2xl mb-6 relative">
        <Quote className="absolute top-2 right-3 w-8 h-8 text-[#c2652a]/10" />
        <p className="font-serif italic text-sm text-[#3a302a]/85 pr-6 leading-relaxed">
          "Don't study to escape the exam; study to broaden your horizon. You are already complete, and this material is simply an experiment to test your concentration."
        </p>
        <span className="block mt-2 font-manrope text-[11px] font-bold text-[#c2652a] uppercase tracking-wider">
          — Zen Scholar Tip
        </span>
      </div>

      {/* List */}
      <div className="flex flex-col gap-4">
        {news.map((item) => (
          <div 
            key={item.id} 
            className="group border-b border-[#d8d0c8]/30 last:border-0 pb-4 last:pb-0 transition-all"
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className={`px-2.5 py-0.5 rounded-full font-manrope text-[10px] font-bold uppercase tracking-wider border ${
                item.category === 'Official Update' ? 'bg-[#8c3c3c]/5 border-[#8c3c3c]/15 text-[#8c3c3c]' :
                item.category === 'Study Tip' ? 'bg-[#c2652a]/5 border-[#c2652a]/15 text-[#c2652a]' :
                'bg-[#3a302a]/5 border-[#3a302a]/15 text-[#3a302a]'
              }`}>
                {item.category}
              </span>
              <span className="text-[10px] font-mono text-[#3a302a]/45">
                {item.date} {item.readTime && `• ${item.readTime}`}
              </span>
            </div>
            
            <h4 className="font-serif text-sm font-semibold text-[#3a302a] group-hover:text-[#c2652a] transition-all cursor-pointer leading-snug">
              {item.title}
            </h4>
            
            <p className="font-manrope text-xs text-[#3a302a]/60 mt-1 line-clamp-2 leading-relaxed">
              {item.summary}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
