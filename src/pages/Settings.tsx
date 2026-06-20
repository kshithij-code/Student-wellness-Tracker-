import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Settings2, 
  Key, 
  Download, 
  Trash2, 
  HelpCircle, 
  Smile, 
  Eye, 
  EyeOff,
  PhoneCall,
  Lock
} from 'lucide-react';

export default function Settings() {
  const { 
    apiKey, 
    setGeminiApiKey, 
    exportBackup, 
    clearAllData 
  } = useApp();

  const [inputKey, setInputKey] = useState<string>(apiKey);
  const [showKey, setShowKey] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [showConfirmReset, setShowConfirmReset] = useState<boolean>(false);

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    setGeminiApiKey(inputKey.trim());
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleWipeData = async () => {
    await clearAllData();
    setInputKey('');
    setShowConfirmReset(false);
  };

  const emergencyHelplines = [
    { country: 'United States & Canada', name: 'Suicide & Crisis Lifeline', number: 'Call or Text 988', timing: '24/7 Available' },
    { country: 'United Kingdom', name: 'Student Minds / Samaritans', number: 'Call 116 123', timing: '24/7 Support' },
    { country: 'India', name: 'Kiran Mental Health Helpline', number: 'Call 1800-599-0019', timing: 'Govt, 24/7 free' },
    { country: 'Australia', name: 'Lifeline Australia', number: 'Call 13 11 14', timing: '24/7 Support' }
  ];

  return (
    <div id="settings-view" className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in font-manrope select-none">
      
      {/* Left Column: API Configuration & Data Controls */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* API Key Vault */}
        <div className="border border-[#d8d0c8]/60 bg-white p-6 rounded-3xl shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Key className="w-5 h-5 text-[#c2652a]" />
            <h3 className="font-serif text-lg font-bold text-[#3a302a]">
              Gemini API Sandbox Config
            </h3>
          </div>
          <p className="text-xs text-[#3a302a]/65 mb-5 leading-relaxed">
            By default, the wellness analyzer relies on a high-fidelity mock engine local to your browser. Connect your standard Gemini API key to activate genuine, advanced natural language sentiment extraction and contextual chat companion reasoning.
          </p>

          <form onSubmit={handleSaveKey} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="apiKey" className="block text-xs font-bold text-[#3a302a]/75 flex items-center justify-between">
                <span>Gemini API Key (stored entirely locally)</span>
                <span className="text-[10px] text-emerald-600 font-mono flex items-center gap-1 font-bold">
                  <Lock className="w-3 h-3" /> local-only
                </span>
              </label>
              
              <div className="relative">
                <input
                  id="apiKey"
                  type={showKey ? 'text' : 'password'}
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full text-xs font-mono p-3 pr-10 rounded-xl border border-[#d8d0c8] bg-[#faf5ee]/60 focus:outline-none focus:ring-1 focus:ring-[#c2652a] select-text text-[#3a302a]"
                />
                
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-3.5 text-[#3a302a]/40 hover:text-[#3a302a]"
                  title={showKey ? 'Hide key' : 'Show key'}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {saveSuccess && (
              <p className="text-xs text-emerald-600 font-semibold">API Key cached securely in LocalStorage!</p>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#c2652a] text-white font-semibold text-xs hover:bg-[#a9521d] transition-all cursor-pointer shadow-md shadow-[#c2652a]/10"
            >
              Verify & Cache Secret
            </button>
          </form>
        </div>

        {/* Local Storage Sandbox Data Control */}
        <div className="border border-[#d8d0c8]/60 bg-white p-6 rounded-3xl shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Settings2 className="w-5 h-5 text-[#8c3c3c]" />
            <h3 className="font-serif text-lg font-bold text-[#3a302a]">
              Sandbox Sync & Storage Controls
            </h3>
          </div>
          <p className="text-xs text-[#3a302a]/65 mb-5 leading-relaxed">
            All data logged in MindfulCampus is completely private to your device. It resides securely in your sandboxed IndexedDB space (Dexie) and is never transmitted to remote trackers.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Backup export */}
            <button
              type="button"
              onClick={exportBackup}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-[#d8d0c8] text-[#3a302a] hover:bg-[#faf5ee] rounded-xl font-bold text-xs transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Export Journal Backup (.json)
            </button>

            {/* Danger Zone clear */}
            {showConfirmReset ? (
              <div className="flex-1 flex gap-2">
                <button
                  type="button"
                  onClick={handleWipeData}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-bold text-xs hover:bg-red-700 cursor-pointer"
                >
                  Yes, Wipe Everything
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirmReset(false)}
                  className="px-4 py-3 border border-[#d8d0c8] text-[#3a302a] hover:bg-gray-100 rounded-xl font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowConfirmReset(true)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl font-bold text-xs transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                Clear All Sandbox Data
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Right Column: Crisis Support Helplines for high school / college students */}
      <div className="lg:col-span-5 space-y-6">
        <div className="border border-[#d8d0c8]/60 bg-white p-6 rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-[#8c3c3c]" />
            <h3 className="font-serif text-lg font-bold text-[#3a302a]">
              Immediate Wellness Support lines
            </h3>
          </div>
          
          <p className="text-xs text-[#3a302a]/65 leading-relaxed">
            If you represent a student feeling completely overwhelmed, please remember help is always available. You are never alone. Reach out to the verified channels below for structured expert conversations:
          </p>

          <div className="space-y-3 pt-2">
            {emergencyHelplines.map((hl) => (
              <div key={hl.name} className="p-3 bg-[#faf5ee]/70 border border-[#d8d0c8]/30 rounded-xl space-y-0.5">
                <span className="text-[10px] uppercase tracking-wider text-[#3a302a]/45 font-bold font-mono">
                  {hl.country}
                </span>
                <h5 className="text-xs font-bold text-[#8c3c3c] leading-none">
                  {hl.name}
                </h5>
                <div className="flex justify-between items-center text-xs text-[#3a302a] font-mono font-black pt-1">
                  <span>{hl.number}</span>
                  <span className="text-[10px] text-[#3a302a]/55 font-normal">{hl.timing}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#faf5ee] border border-[#d8d0c8]/45 p-4 rounded-2xl flex items-center gap-2.5">
            <Smile className="w-5 h-5 text-[#c2652a] shrink-0" />
            <p className="text-[10px] text-[#3a302a]/60 leading-relaxed">
              Academic stress is temporary and never represents your worth. Be kind to yourself today and authorize a screen-free break.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
