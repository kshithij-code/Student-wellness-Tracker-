import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  User, 
  GraduationCap, 
  Flag, 
  Check, 
  HeartHandshake,
  Clock
} from 'lucide-react';
import type { StudentProfile } from '../types';

export default function OnboardingModal() {
  const { completeOnboarding } = useApp();
  const [step, setStep] = useState<number>(1);
  
  // Profile form state
  const [name, setName] = useState<string>('');
  const [major, setMajor] = useState<string>('');
  const [yearOfStudy, setYearOfStudy] = useState<string>('Sophomore');
  const [examType, setExamType] = useState<string>('Final Exams');
  const [stressTriggers, setStressTriggers] = useState<string[]>([]);
  const [targetExamTitle, setTargetExamTitle] = useState<string>('');
  const [targetExamDate, setTargetExamDate] = useState<string>('');
  const [studyGoalHours, setStudyGoalHours] = useState<number>(4);

  // Common stressful triggers for students
  const availableTriggers = [
    "Time management strain",
    "Fear of failure",
    "Sleep deprivation",
    "Subject-specific math fatigue",
    "Peer comparison pressure",
    "Social isolation",
    "Fear of public speaking"
  ];

  const handleToggleTrigger = (trigger: string) => {
    if (stressTriggers.includes(trigger)) {
      setStressTriggers(stressTriggers.filter(t => t !== trigger));
    } else {
      setStressTriggers([...stressTriggers, trigger]);
    }
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    const defaultProfile: StudentProfile = {
      name: name.trim() || 'Alex',
      major: major.trim() || 'Psychology',
      yearOfStudy,
      examType: examType.trim() || 'Final Evaluation',
      stressTriggers: stressTriggers.length > 0 ? stressTriggers : ['Academic load'],
      targetExamTitle: targetExamTitle.trim() || 'Main Exam',
      targetExamDate: targetExamDate || new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 10 days out
      studyGoalHours
    };
    completeOnboarding(defaultProfile);
  };

  return (
    <div className="fixed inset-0 bg-[#3a302a]/70 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none">
      <div className="bg-[#fffbf7] border border-[#d8d0c8]/60 w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between animate-fade-in relative">
        
        {/* Visual Progress Bar Accent */}
        <div className="w-full h-1.5 bg-[#d8d0c8]/30 flex">
          <div 
            className="h-full bg-[#c2652a] transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Modal Inner Header */}
        <div className="p-8 pb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#c2652a] animate-pulse" />
              <span className="text-[10px] uppercase tracking-widest text-[#8c3c3c] font-black">
                MindfulCampus Onboarding
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-[#3a302a]/50 bg-[#faf5ee] border border-[#d8d0c8]/30 px-2.5 py-1 rounded-full">
              STEP {step} OF 4
            </span>
          </div>

          <p className="text-xs text-[#3a302a]/60 leading-relaxed mb-1">
            Let's structure your personalized mental sanctuary.
          </p>
        </div>

        {/* Modal Form Step Carousel */}
        <div className="px-8 py-2 flex-grow overflow-y-auto max-h-[420px] scrollbar-thin">
          
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-[#d8d0c8]/30 pb-3">
                <h1 className="font-serif text-2xl font-light italic text-[#3a302a] flex items-center gap-2">
                  <User className="w-5 h-5 text-[#c2652a]" /> What should we call you?
                </h1>
                <p className="text-xs text-[#3a302a]/60 mt-1">
                  Introduce yourself so Serene can companion you by name.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label htmlFor="student-name-input" className="block text-xs font-bold text-[#3a302a]/80">Your Name</label>
                  <input
                    id="student-name-input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="E.g., Alex Johnson"
                    autoFocus
                    className="w-full text-sm p-3.5 rounded-xl border border-[#d8d0c8] bg-white text-[#3a302a] focus:outline-none focus:ring-1 focus:ring-[#c2652a]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="field-of-study" className="block text-xs font-bold text-[#3a302a]/80">Major / Field of Study</label>
                    <input
                      id="field-of-study"
                      type="text"
                      value={major}
                      onChange={(e) => setMajor(e.target.value)}
                      placeholder="E.g., Psychology, Pre-Med"
                      className="w-full text-sm p-3.5 rounded-xl border border-[#d8d0c8] bg-white text-[#3a302a] focus:outline-none focus:ring-1 focus:ring-[#c2652a]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="academic-year-select" className="block text-xs font-bold text-[#3a302a]/80">Academic Year</label>
                    <select
                      id="academic-year-select"
                      value={yearOfStudy}
                      onChange={(e) => setYearOfStudy(e.target.value)}
                      className="w-full text-sm p-3.5 rounded-xl border border-[#d8d0c8] bg-white text-[#3a302a] focus:outline-none focus:ring-1 focus:ring-[#c2652a]"
                    >
                      <option value="Freshman (Year 1)">Freshman (Year 1)</option>
                      <option value="Sophomore (Year 2)">Sophomore (Year 2)</option>
                      <option value="Junior (Year 3)">Junior (Year 3)</option>
                      <option value="Senior (Year 4)">Senior (Year 4)</option>
                      <option value="Postgraduate">Postgraduate</option>
                      <option value="JEE / Competitive Prep">JEE / Competitive Prep</option>
                      <option value="High School Scholar">High School Scholar</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-[#d8d0c8]/30 pb-3">
                <h1 className="font-serif text-2xl font-light italic text-[#3a302a] flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-[#c2652a]" /> What exam are you pacing?
                </h1>
                <p className="text-xs text-[#3a302a]/60 mt-1">
                  We'll automatically set up a beautiful live tracking countdown on your dashboard.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="exam-type-input" className="block text-xs font-bold text-[#3a302a]/80">General Exam Type</label>
                    <input
                      id="exam-type-input"
                      type="text"
                      value={examType}
                      onChange={(e) => setExamType(e.target.value)}
                      placeholder="E.g., Finals, Midterms, MCAT"
                      className="w-full text-sm p-3.5 rounded-xl border border-[#d8d0c8] bg-white text-[#3a302a] focus:outline-none focus:ring-1 focus:ring-[#c2652a]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="countdown-title-input" className="block text-xs font-bold text-[#3a302a]/80">Countdown Title</label>
                    <input
                      id="countdown-title-input"
                      type="text"
                      value={targetExamTitle}
                      onChange={(e) => setTargetExamTitle(e.target.value)}
                      placeholder="E.g., Advanced Mathematics Finals"
                      className="w-full text-sm p-3.5 rounded-xl border border-[#d8d0c8] bg-white text-[#3a302a] focus:outline-none focus:ring-1 focus:ring-[#c2652a]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="countdown-date-input" className="block text-xs font-bold text-[#3a302a]/80">Exam Date</label>
                  <input
                    id="countdown-date-input"
                    type="date"
                    value={targetExamDate}
                    onChange={(e) => setTargetExamDate(e.target.value)}
                    className="w-full text-sm p-3.5 rounded-xl border border-[#d8d0c8] bg-white text-[#3a302a] focus:outline-none focus:ring-1 focus:ring-[#c2652a]"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-[#d8d0c8]/30 pb-3">
                <h1 className="font-serif text-2xl font-light italic text-[#3a302a] flex items-center gap-2">
                  <Flag className="w-5 h-5 text-[#c2652a]" /> Identify Your Stressors
                </h1>
                <p className="text-xs text-[#3a302a]/60 mt-1">
                  Select factors that often weigh on you. Serene uses this context to offer tailored advice.
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5 pt-2">
                {availableTriggers.map((trigger) => {
                  const isSelected = stressTriggers.includes(trigger);
                  return (
                    <button
                      key={trigger}
                      type="button"
                      onClick={() => handleToggleTrigger(trigger)}
                      className={`text-xs px-4 py-3 rounded-xl border font-medium flex items-center gap-2 transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-[#c2652a] text-white border-[#c2652a] shadow-sm'
                          : 'bg-white text-[#3a302a] border-[#d8d0c8] hover:border-[#c2652a]/45'
                      }`}
                    >
                      {isSelected ? <Check className="w-3.5 h-3.5" /> : null}
                      {trigger}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-[#d8d0c8]/30 pb-3">
                <h1 className="font-serif text-2xl font-light italic text-[#3a302a] flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#c2652a]" /> Commit to a Rest Limit
                </h1>
                <p className="text-xs text-[#3a302a]/60 mt-1">
                  How many hours of focused, structured study prep do you seek to manage daily?
                </p>
              </div>

              <div className="space-y-4 pt-4">
                <div className="bg-[#faf5ee] border border-[#d8d0c8]/40 p-5 rounded-2xl flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] tracking-wider text-[#c2652a] uppercase font-bold">Target Study pacing</span>
                    <h4 className="text-lg font-bold text-[#3a302a]">{studyGoalHours} Hours / Day</h4>
                  </div>
                  <span className="text-3xl">⏱️</span>
                </div>

                <div className="space-y-2">
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={studyGoalHours}
                    onChange={(e) => setStudyGoalHours(parseInt(e.target.value))}
                    className="w-full accent-[#c2652a] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#3a302a]/55 font-mono">
                    <span>1 hour (Steady revision)</span>
                    <span>12 hours (High-stakes)</span>
                  </div>
                </div>

                <div className="p-4 bg-white border border-[#d8d0c8]/30 rounded-2xl flex items-start gap-3 mt-4">
                  <HeartHandshake className="w-5 h-5 text-[#8c3c3c] shrink-0 mt-0.5" />
                  <p className="text-[11px] text-[#3a302a]/65 leading-relaxed">
                    Remember: Serene is designed around structural balance. Study sprints must always be paired with digital screen detoxes and quiet box breathing.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Buttons */}
        <div className="p-8 pt-4 flex gap-3 border-t border-[#d8d0c8]/30 bg-white/40">
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="px-5 py-3 border border-[#d8d0c8] hover:bg-[#faf5ee] text-[#3a302a] font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          )}

          <button
            type="button"
            onClick={handleNext}
            className="flex-1 flex items-center justify-center gap-1.5 px-5 py-3 bg-[#c2652a] text-white font-semibold text-xs rounded-xl hover:bg-[#a9521d] transition-all cursor-pointer shadow-md shadow-[#c2652a]/10"
          >
            {step === 4 ? 'Complete Setup' : 'Next Step'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
