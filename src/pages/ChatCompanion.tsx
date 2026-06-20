import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Send, 
  Trash2, 
  RefreshCw, 
  Smile, 
  Mic, 
  Compass, 
  Activity, 
  Info, 
  MessageSquareHeart,
  Bot,
  Plus,
  MessageSquare,
  MessageCircle
} from 'lucide-react';

export default function ChatCompanion() {
  const { 
    chatHistory, 
    addChatMessage, 
    clearChatHistory, 
    isTyping, 
    journals,
    threads,
    activeThreadId,
    setActiveThreadId,
    createNewThread,
    deleteThread,
    profile
  } = useApp();

  const [input, setInput] = useState<string>('');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Auto Scroll to bottom on new chats
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const text = input.trim();
    setInput('');
    await addChatMessage(text);
  };

  const getDayLabel = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div id="wellness-chat-view" className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-160px)] animate-fade-in font-manrope">
      
      {/* Central Chat & Thread Panel */}
      <div className="lg:col-span-8 flex border border-[#d8d0c8]/60 bg-white rounded-3xl overflow-hidden shadow-sm h-full">
        
        {/* Left Side Thread Panel - Hidden on very small mobile, visible on medium+ screens */}
        <div className="w-56 bg-[#faf5ee]/60 border-r border-[#d8d0c8]/45 flex flex-col justify-between shrink-0 h-full hidden sm:flex select-none">
          <div className="p-4 flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-3.5">
              <span className="text-[10px] font-mono tracking-wider text-[#3a302a]/55 uppercase font-bold">
                Chat History
              </span>
              <button
                type="button"
                onClick={() => createNewThread()}
                className="p-1 rounded-md hover:bg-[#c2652a]/10 text-[#c2652a] transition-all cursor-pointer"
                title="Start new conversation"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable list of threads */}
            <div className="space-y-1 overflow-y-auto flex-1 pr-1 font-sans">
              {threads.map((t) => {
                const isActive = t.id === activeThreadId;
                return (
                  <div
                    key={t.id}
                    onClick={() => setActiveThreadId(t.id)}
                    className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                      isActive 
                        ? 'bg-[#c2652a]/15 text-[#c2652a]' 
                        : 'text-[#3a302a]/75 hover:bg-[#faf5ee] hover:text-[#3a302a]'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <MessageSquare className="w-3.5 h-3.5 shrink-0 opacity-70" />
                      <span className="truncate">{t.title}</span>
                    </div>
                    {/* Delete button (allows clear for default) */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Do you want to clear/delete this session?`)) {
                          deleteThread(t.id);
                        }
                      }}
                      className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                      title={t.id === 'default' ? 'Clear session' : 'Delete session'}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-4 border-t border-[#d8d0c8]/45 bg-[#faf5ee]/40 text-center">
            <button
              onClick={() => createNewThread()}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#c2652a] hover:bg-[#a9521d] text-white text-xs font-semibold transition-all shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              New Chat
            </button>
          </div>
        </div>

        {/* Right Area - Active Conversational View */}
        <div className="flex-1 flex flex-col justify-between h-full overflow-hidden">
          
          {/* Chat Title bar */}
          <div className="bg-[#faf5ee] border-b border-[#d8d0c8]/50 px-6 py-4 flex justify-between items-center select-none">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-full bg-[#c2652a]/10 flex items-center justify-center text-[#c2652a] shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <h3 className="font-serif text-sm font-bold text-[#3a302a] leading-none flex items-center gap-2">
                  Serene Partner
                  <span className="sm:hidden text-[9px] bg-[#c2652a]/10 px-1.5 py-0.5 rounded font-sans text-[#c2652a] font-normal shrink-0">
                    {threads.length} chats
                  </span>
                </h3>
                <p className="text-[10px] text-emerald-800 mt-1 flex items-center gap-1 font-semibold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Secure Confidential Session
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Mobile trigger dropdown - switch threads */}
              <div className="flex sm:hidden items-center gap-1">
                <select
                  value={activeThreadId}
                  onChange={(e) => setActiveThreadId(e.target.value)}
                  className="bg-[#faf5ee] border border-[#d8d0c8] text-[10px] rounded-lg px-2 py-1 text-[#3a302a] focus:ring-1 focus:ring-[#c2652a] max-w-[90px] outline-none"
                >
                  {threads.map(t => (
                    <option key={t.id} value={t.id}>{t.title}</option>
                  ))}
                </select>
                <button
                  onClick={() => createNewThread()}
                  className="p-1 rounded-lg border border-[#d8d0c8]/60 bg-white hover:bg-[#faf5ee] text-[#c2652a]"
                  title="New Session"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button 
                type="button"
                onClick={clearChatHistory}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#d8d0c8] text-xs font-semibold text-[#3a302a]/65 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-all cursor-pointer"
                title="Clear current thread logs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear Chat</span>
              </button>
            </div>
          </div>

          {/* Bubble Stream Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-[#faf5ee]/25 to-white select-text">
            
            {chatHistory.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto select-none pt-12">
                <div className="w-16 h-16 rounded-full bg-[#f4ebe1] flex items-center justify-center text-[#c2652a] mb-4">
                  👑
                </div>
                <h4 className="font-serif text-2xl font-bold text-[#34241d] leading-snug">
                  Hello, {profile?.name || 'Student'}.
                </h4>
                <p className="font-manrope text-sm text-[#3a302a]/65 mt-2">
                  Your companion is here in this quiet space. How are you feeling about your studies today? You can vent, share goals, or brainstorm study break routines safely.
                </p>
                {journals.length > 0 && (
                  <div className="mt-4 p-3 bg-[#faf5ee] border border-[#d8d0c8]/45 rounded-xl text-xs text-[#3a302a]/70">
                    ⚡ Serene has context of your latest mood rating of <b>{journals[0].mood}/10</b>. Just say "How can I improve my mood?" to begin context talk.
                  </div>
                )}
              </div>
            ) : (
              <>
                {chatHistory.map((msg) => {
                  const isBot = msg.sender === 'serene';
                  return (
                    <div 
                      key={msg.id || msg.timestamp} 
                      className={`flex ${isBot ? 'justify-start' : 'justify-end'} gap-3 items-end`}
                    >
                      {isBot && (
                        <div className="w-8 h-8 shrink-0 rounded-full bg-[#c2652a]/10 flex items-center justify-center text-[#c2652a] font-serif font-black text-sm border border-[#c2652a]/10">
                          S
                        </div>
                      )}
                      
                      <div className="max-w-[78%] space-y-1">
                        <div 
                          className={`p-4 rounded-3xl text-sm leading-relaxed ${
                            isBot 
                              ? 'bg-[#faf5ee] border border-[#d8d0c8]/50 text-[#3a302a] rounded-bl-none shadow-sm' 
                              : 'bg-[#c2652a] text-white rounded-br-none shadow-md shadow-[#c2652a]/10'
                          }`}
                        >
                          {msg.text}
                        </div>
                        <span className={`block text-[9px] font-mono text-[#3a302a]/40 ${!isBot ? 'text-right' : 'text-left'}`}>
                          {getDayLabel(msg.timestamp)}
                        </span>
                      </div>

                      {!isBot && (
                        <div className="w-8 h-8 shrink-0 rounded-full bg-[#f5ebe0] flex items-center justify-center text-[#8c3c3c] font-black text-xs border border-white">
                          {profile?.name ? profile.name.slice(0, 2).toUpperCase() : 'ME'}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Bot typing indicator */}
                {isTyping && (
                  <div className="flex justify-start gap-3 items-end">
                    <div className="w-8 h-8 rounded-full bg-[#c2652a]/10 flex items-center justify-center text-[#c2652a] font-serif font-black text-sm">
                      S
                    </div>
                    <div className="bg-[#faf5ee] border border-[#d8d0c8]/50 p-4 rounded-3xl rounded-bl-none flex items-center gap-1.5 shadow-sm">
                      <span className="w-2 h-2 bg-[#c2652a]/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-[#c2652a]/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-[#c2652a]/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Custom Form input panel matching mockups */}
          <form onSubmit={handleSendMessage} className="p-4 bg-[#faf5ee]/40 border-t border-[#d8d0c8]/50 select-none">
            <div className="flex items-center gap-2.5 bg-white border border-[#d8d0c8]/80 p-1.5 pl-4 rounded-full shadow-inner shadow-black/[0.01]">
              <button
                type="button"
                className="p-1.5 rounded-full text-[#3a302a]/55 hover:text-[#3a302a] hover:bg-[#faf5ee] transition-all cursor-pointer"
                title="Add emojis"
              >
                <Smile className="w-5 h-5" />
              </button>
              
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isTyping}
                placeholder="Type your thoughts..."
                className="flex-1 text-sm bg-transparent border-0 focus:outline-none focus:ring-0 select-text text-[#3a302a] placeholder:text-[#3a302a]/40"
              />

              <button
                type="button"
                className="p-1.5 rounded-full text-[#3a302a]/55 hover:text-[#3a302a] hover:bg-[#faf5ee] transition-all cursor-pointer"
                title="Speak thought"
              >
                <Mic className="w-5 h-5" />
              </button>
              
              <button
                type="submit"
                disabled={isTyping || !input.trim()}
                className="w-10 h-10 rounded-full bg-[#c2652a] hover:bg-[#a9521d] text-white flex items-center justify-center transition-all disabled:bg-[#d8d0c8] select-none cursor-pointer"
                title="Send message"
              >
                <Send className="w-4.5 h-4.5 fill-white/10 shrink-0" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Sidebar Support Panels from designer Mockups */}
      <div className="lg:col-span-4 space-y-6 select-none">
        
        {/* Micro-Goals */}
        <div className="border border-[#d8d0c8]/60 bg-white p-5 rounded-3xl shadow-sm">
          <span className="text-[9px] uppercase tracking-wider text-[#c2652a] font-black font-mono">Today's Focus</span>
          <div className="flex items-center gap-2 mt-1 mb-3">
            <div className="w-7 h-7 rounded-lg bg-[#c2652a]/10 flex items-center justify-center text-xs">
              🎯
            </div>
            <h4 className="font-serif text-base font-bold text-[#3a302a]">
              Micro-Goals Strategy
            </h4>
          </div>
          <p className="text-xs text-[#3a302a]/70 leading-relaxed bg-[#faf5ee] p-3.5 rounded-2xl border border-[#d8d0c8]/40">
            "Focus entirely on finishing just one paragraph or solving a singular problem segment. Small wins build cognitive momentum and ease deadline pressure."
          </p>
        </div>

        {/* Coping Strategies list */}
        <div className="border border-[#d8d0c8]/60 bg-white p-5 rounded-3xl shadow-sm space-y-4">
          <span className="text-[9px] uppercase tracking-wider text-[#8c3c3c] font-black font-mono">Coping Strategies</span>
          
          <div className="space-y-3.5">
            {/* Box Breathing list */}
            <div className="flex gap-3.5">
              <div className="w-9 h-9 shrink-0 rounded-xl bg-violet-100 flex items-center justify-center text-sm">
                🌬️
              </div>
              <div>
                <h5 className="text-xs font-bold text-[#3a302a]">Guided Box Breathing</h5>
                <p className="text-[11px] text-[#3a302a]/65 leading-relaxed mt-0.5">
                  Synchronize your breaths (4s inhale, 4s hold, 4s exhale) to halt heart-rate variance immediately.
                </p>
              </div>
            </div>

            {/* Pomodoro Lite */}
            <div className="flex gap-3.5">
              <div className="w-9 h-9 shrink-0 rounded-xl bg-orange-100 flex items-center justify-center text-sm">
                ⏱️
              </div>
              <div>
                <h5 className="text-xs font-bold text-[#3a302a]">Pomodoro Lite Method</h5>
                <p className="text-[11px] text-[#3a302a]/65 leading-relaxed mt-0.5">
                  Secure blocks of 15 minutes focus, followed by 5 minutes stretching. Prevents study fatigue.
                </p>
              </div>
            </div>

            {/* 5-4-3-2-1 check */}
            <div className="flex gap-3.5">
              <div className="w-9 h-9 shrink-0 rounded-xl bg-emerald-100 flex items-center justify-center text-sm">
                👁️
              </div>
              <div>
                <h5 className="text-xs font-bold text-[#3a302a]">The 5-4-3-2-1 Rule</h5>
                <p className="text-[11px] text-[#3a302a]/65 leading-relaxed mt-0.5">
                  Ground yourself by naming 5 things you see, 4 you feel, 3 you hear, 2 you smell, and 1 you appreciate.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mental Health notice disclaimer */}
        <div className="bg-[#faf5ee] border border-[#d8d0c8]/45 p-4 rounded-2xl flex items-start gap-2.5">
          <Info className="w-4.5 h-4.5 text-[#3a302a]/50 shrink-0 mt-0.5" />
          <p className="text-[11px] text-[#3a302a]/60 leading-normal">
            <b>Disclaimer:</b> Serene is a GenAI-powered supportive companion applet for academic/stress pacing. It is not a professional counseling tool. If you are facing extreme crisis, please head to the settings tab to consult the immediate emergency helplines.
          </p>
        </div>

      </div>

    </div>
  );
}
