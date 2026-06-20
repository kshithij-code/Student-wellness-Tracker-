import React from 'react';
import { Bell, Search, Settings, Flame, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  title: string;
  description?: string;
  onNavigateToSettings?: () => void;
}

export default function Header({ title, description, onNavigateToSettings }: HeaderProps) {
  const { streak, averageMood, profile } = useApp();

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good Morning';
    if (hours < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="w-full flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-[#d8d0c8]/40 gap-4 select-none">
      <div>
        <h2 className="font-serif text-4xl font-light italic text-[#3a302a] tracking-tight mt-0.5 animate-fade-in">
          {title === 'Dashboard' ? `${getGreeting()}, ${profile?.name || 'Student'}` : title}
        </h2>
        <p className="font-manrope text-sm text-[#3a302a]/60 mt-1">
          {formattedDate} • Take a deep breath.
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Streak Pill */}
        <div className="flex items-center gap-2 bg-[#c2652a]/10 border border-[#c2652a]/20 px-3.5 py-1.5 rounded-full select-none cursor-default">
          <Flame className="w-4 h-4 text-[#c2652a] fill-[#c2652a]" />
          <span className="font-manrope text-xs font-bold text-[#c2652a]">
            {streak} Day Streak
          </span>
        </div>

        {/* Avg Mood Pill */}
        {averageMood > 0 && (
          <div className="flex items-center gap-2 bg-[#8c3c3c]/5 border border-[#8c3c3c]/15 px-3.5 py-1.5 rounded-full select-none cursor-default">
            <Heart className="w-4 h-4 text-[#8c3c3c] fill-[#8c3c3c]/20" />
            <span className="font-manrope text-xs font-bold text-[#8c3c3c]">
              Avg Mood: {averageMood}/10
            </span>
          </div>
        )}

        <div className="h-6 w-px bg-[#d8d0c8]/50" />

        {/* Action Widgets */}
        <div className="flex items-center gap-2" role="toolbar" aria-label="Quick Actions">
          <button 
            type="button"
            className="w-10 h-10 rounded-full flex items-center justify-center border border-[#d8d0c8]/60 text-[#3a302a]/70 hover:bg-[#d8d0c8]/20 hover:text-[#3a302a] transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[#c2652a] focus-visible:outline-offset-2"
            title="Search insights"
            aria-label="Search insights"
          >
            <Search className="w-4.5 h-4.5" aria-hidden="true" />
          </button>
          
          <button 
            type="button"
            className="w-10 h-10 rounded-full flex items-center justify-center border border-[#d8d0c8]/60 text-[#3a302a]/70 hover:bg-[#d8d0c8]/20 hover:text-[#3a302a] transition-all relative cursor-pointer focus-visible:outline-2 focus-visible:outline-[#c2652a] focus-visible:outline-offset-2"
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell className="w-4.5 h-4.5" aria-hidden="true" />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-[#8c3c3c] rounded-full" aria-hidden="true"></span>
          </button>

          {onNavigateToSettings && (
            <button 
              type="button"
              onClick={onNavigateToSettings}
              className="w-10 h-10 rounded-full flex items-center justify-center border border-[#d8d0c8]/60 text-[#3a302a]/70 hover:bg-[#d8d0c8]/20 hover:text-[#3a302a] transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[#c2652a] focus-visible:outline-offset-2"
              title="Settings"
              aria-label="Settings"
            >
              <Settings className="w-4.5 h-4.5" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
