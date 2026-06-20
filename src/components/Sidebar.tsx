import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  BookOpenText, 
  MessageSquareHeart, 
  Compass, 
  CalendarDays, 
  Settings, 
  HelpCircle, 
  ShieldCheck 
} from 'lucide-react';

export type PageId = 'dashboard' | 'journal' | 'chat' | 'mindfulness' | 'exam' | 'settings';

interface SidebarProps {
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
}

export default function Sidebar({ currentPage, setCurrentPage }: SidebarProps) {
  const { profile, streak } = useApp();
  const menuItems = [
    { id: 'dashboard' as PageId, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'journal' as PageId, label: 'Daily Journaling', icon: BookOpenText },
    { id: 'chat' as PageId, label: 'Wellness Chat', icon: MessageSquareHeart },
    { id: 'mindfulness' as PageId, label: 'Mindfulness Zone', icon: Compass },
    { id: 'exam' as PageId, label: 'Exam Hub & News', icon: CalendarDays },
    { id: 'settings' as PageId, label: 'Settings', icon: Settings },
  ];

  const studentName = profile?.name || 'Student';
  const studentInitials = profile?.name 
    ? profile.name.trim().split(/\s+/).slice(0, 2).map(p => p[0]).join('').toUpperCase()
    : 'ST';

  const studentMajor = profile?.major 
    ? `${profile.yearOfStudy ? profile.yearOfStudy + ' ' : ''}${profile.major}`
    : 'Campus Scholar';

  return (
    <aside id="sidebar-container" className="fixed top-0 left-0 h-screen w-64 bg-[#fffbf7] border-r border-[#d8d0c8]/60 flex flex-col justify-between p-8 z-30 select-none">
      <div className="flex flex-col gap-10">
        {/* Brand Header */}
        <div>
          <h1 className="font-serif text-2xl font-medium text-[#c2652a]">
            MindfulCampus
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-[#8c3c3c] mt-1 font-bold">
            Student Care Hub
          </p>
        </div>

        {/* Navigation Routes */}
        <nav className="flex flex-col gap-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => setCurrentPage(item.id)}
                className={`flex items-center space-x-3 text-sm font-medium transition-all duration-200 cursor-pointer text-left ${
                  isActive
                    ? 'text-[#c2652a]'
                    : 'text-[#3a302a]/60 hover:text-[#c2652a]'
                }`}
              >
                <div className={`w-1 h-4 rounded-full transition-all duration-200 ${isActive ? 'bg-[#c2652a]' : 'bg-transparent'}`} />
                <Icon className="w-4.5 h-4.5 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Information Profile & Streak */}
      <div className="flex flex-col gap-5 pt-4 border-t border-[#d8d0c8]/60">
        <div className="p-4 bg-white/50 rounded-xl border border-[#d8d0c8]/40">
          <div className="text-xs text-[#8c3c3c] font-semibold mb-2 uppercase tracking-tight">Weekly Streak</div>
          <div className="flex space-x-1.5 mb-3">
            <div className={`w-5 h-5 rounded-full ${streak >= 1 ? 'bg-[#c2652a]' : 'bg-[#d8d0c8]/50'}`} title="Mon - Completed" />
            <div className={`w-5 h-5 rounded-full ${streak >= 2 ? 'bg-[#c2652a]' : 'bg-[#d8d0c8]/50'}`} title="Tue - Completed" />
            <div className={`w-5 h-5 rounded-full ${streak >= 3 ? 'bg-[#c2652a]' : 'bg-[#d8d0c8]/50'}`} title="Wed - Completed" />
            <div className={`w-5 h-5 rounded-full ${streak >= 4 ? 'bg-[#c2652a]' : 'bg-[#d8d0c8]/50'}`} title="Thu - Completed" />
            <div className={`w-5 h-5 rounded-full ${streak >= 5 ? 'bg-[#c2652a]' : 'bg-[#d8d0c8]/50'}`} title="Fri - Completed" />
            <div className={`w-5 h-5 rounded-full ${streak >= 6 ? 'bg-[#c2652a]' : 'bg-[#d8d0c8]/50'}`} title="Sat - Completed" />
            <div className={`w-5 h-5 rounded-full ${streak >= 7 ? 'bg-[#c2652a]' : 'bg-[#d8d0c8]/50'}`} title="Sun - Completed" />
          </div>
          
          <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-[#d8d0c8]/20">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-[#d8d0c8]/50 flex items-center justify-center font-bold text-[#c2652a] text-xs">
              {studentInitials}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-semibold text-[#3a302a] leading-none truncate font-sans">
                {studentName}
              </h4>
              <p className="text-[10px] text-[#3a302a]/55 mt-1 truncate">
                {studentMajor}
              </p>
            </div>
          </div>
        </div>

        {/* Marginal Support links */}
        <div className="flex flex-col gap-2 px-1">
          <a
            href="#support-resources"
            className="flex items-center gap-2 text-[11px] text-[#3a302a]/60 hover:text-[#c2652a] transition-colors py-0.5"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Empathetic Support
          </a>
          <a
            href="#privacy-statement"
            className="flex items-center gap-2 text-[11px] text-[#3a302a]/60 hover:text-[#c2652a] transition-colors py-0.5"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            LocalStorage Protected
          </a>
        </div>
      </div>
    </aside>
  );
}
