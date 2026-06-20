import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Sidebar, { type PageId } from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Journal from './pages/Journal';
import ChatCompanion from './pages/ChatCompanion';
import MindfulnessZone from './pages/MindfulnessZone';
import ExamHub from './pages/ExamHub';
import Settings from './pages/Settings';
import OnboardingModal from './components/OnboardingModal';
import { useApp } from './context/AppContext';

function CoreApp() {
  const { isOnboardingCompleted } = useApp();
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');

  const renderActivePage = () => {
    switch (currentPage) {
      case 'journal':
        return <Journal />;
      case 'chat':
        return <ChatCompanion />;
      case 'mindfulness':
        return <MindfulnessZone />;
      case 'exam':
        return <ExamHub />;
      case 'settings':
        return <Settings />;
      case 'dashboard':
      default:
        return <Dashboard onNavigate={(page) => setCurrentPage(page as PageId)} />;
    }
  };

  const getPageTitle = () => {
    switch (currentPage) {
      case 'journal':
        return 'Daily Journal Workspace';
      case 'chat':
        return 'Wellness Chat';
      case 'mindfulness':
        return 'Mindfulness & Coping Zone';
      case 'exam':
        return 'Exam Hub & Support News';
      case 'settings':
        return 'Global Settings';
      case 'dashboard':
      default:
        return 'Dashboard';
    }
  };

  const getPageDescription = () => {
    switch (currentPage) {
      case 'journal':
        return 'Review sentiment analysis, stressors, and personalized action cards powered securely by local GenAI.';
      case 'chat':
        return 'A safe, supportive space with Serene—your digital wellness guide—integrated with latest journal context.';
      case 'mindfulness':
        return 'Pause the books. Take part in guided breathing and ground your visual focus instantly.';
      case 'exam':
        return 'Pace exam targets cleanly while staying informed with campus resources and study tips.';
      case 'settings':
        return 'Manage API keys, configure backups, and access crucial emergency helplines.';
      case 'dashboard':
      default:
        return 'Welcome to your wellness tracker. Monitor streaks, analyze stress levels, and ground your focus.';
    }
  };

  return (
    <div id="mindfulcampus-applet" className="min-h-screen bg-[#faf5ee] flex font-manrope selection:bg-[#c2652a]/20 selection:text-[#c2652a]">
      {!isOnboardingCompleted && <OnboardingModal />}
      {/* Sidebar navigation */}
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {/* Main workspace container */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          <Header 
            title={getPageTitle()} 
            description={getPageDescription()} 
            onNavigateToSettings={() => setCurrentPage('settings')} 
          />
          
          {/* Active Router Frame */}
          <div className="transition-all duration-300">
            {renderActivePage()}
          </div>
        </main>
        
        {/* Humble, compliant footer matching guidelines layout */}
        <footer className="py-6 mt-12 border-t border-[#d8d0c8]/40 select-none text-center">
          <p className="text-[11px] text-[#3a302a]/45 font-manrope">
            © 2026 MindfulCampus suporte systems. local sandbox and IndexedDB encrypted.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <CoreApp />
    </AppProvider>
  );
}
