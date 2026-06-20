import { GoogleGenAI } from '@google/genai';
import type { JournalAnalysis, ChatMessage, JournalEntry } from '../types';

// Helper to sanitize JSON response from Gemini
function cleanJsonString(input: string): string {
  let cleaned = input.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  return cleaned.trim();
}

/**
 * Analyzes a journal entry using either Gemini API (if key is set)
 * or a fully featured client-side rule-based fallback system.
 */
export async function analyzeJournalEntry(
  content: string,
  mood: number,
  apiKey?: string
): Promise<JournalAnalysis> {
  if (apiKey && apiKey.trim() !== '') {
    try {
      const ai = new GoogleGenAI({
        apiKey: apiKey.trim(),
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const prompt = `
        You are an expert student mental wellness assistant. Analyze the following student journal entry (Mood score: ${mood}/10):
        
        "${content}"
        
        Provide the analysis strictly in JSON format with the following keys:
        - "emotionalState": Array of strings representing detected emotions (e.g. ["Overwhelmed", "Determined", "Hopeful"]). Match the student tone. Max 4 items.
        - "stressTriggers": Array of strings representing extracted stress triggers (e.g. ["Exam timetable fatigue", "Peer comparison", "Fear of failure"]). Max 3 items.
        - "copingCard": A concise, highly encouraging, personalized actionable advice card addressing their specific situation (e.g., "Since you mentioned feeling overwhelmed by math, try breaking down today's task into 3 pomodoros."). Make it empathetic and practical. Max 3 sentences.
        
        Return ONLY valid JSON. Keep responses constructive, warm, and geared toward a student mindset.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const responseText = response.text;
      if (responseText) {
        const cleanedJson = cleanJsonString(responseText);
        const data = JSON.parse(cleanedJson) as {
          emotionalState: string[];
          stressTriggers: string[];
          copingCard: string;
        };
        return {
          emotionalState: Array.isArray(data.emotionalState) ? data.emotionalState : ['Reflective'],
          stressTriggers: Array.isArray(data.stressTriggers) ? data.stressTriggers : [],
          copingCard: data.copingCard || 'Focus on self-compassion and take things one small step at a time.',
          analyzedAt: new Date().toISOString(),
        };
      }
    } catch (e) {
      console.warn('Gemini Journal Analysis API Error, falling back to local simulation:', e);
    }
  }

  // Realistic Fallback Analyzer
  return simulateJournalAnalysis(content, mood);
}

/**
 * Generates an empathetic chatbot response from "Serene" (AI wellness buddy).
 * Uses the latest journal entry to establish a baseline of context about how they've been feeling.
 */
export async function generateChatResponse(
  chatHistory: ChatMessage[],
  latestJournal?: JournalEntry,
  apiKey?: string
): Promise<string> {
  const currentText = chatHistory[chatHistory.length - 1]?.text || '';
  
  if (apiKey && apiKey.trim() !== '') {
    try {
      const ai = new GoogleGenAI({
        apiKey: apiKey.trim(),
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // Prepare conversation transcript
      const recentHistory = chatHistory.slice(-8); // send last 8 messages for context
      const transcript = recentHistory.map(m => `${m.sender === 'user' ? 'Student' : 'Serene'}: ${m.text}`).join('\n');

      let contextPrompt = '';
      if (latestJournal) {
        contextPrompt = `
          Student's context from today's journal:
          - Content: "${latestJournal.content}"
          - Mood scale: ${latestJournal.mood}/10
          ${latestJournal.analysis ? `- Extracted triggers: ${latestJournal.analysis.stressTriggers.join(', ')}` : ''}
        `;
      }

      const prompt = `
        You are "Serene", an empathetic, warm, non-judgmental digital guide and wellness companion designed specifically to support stressed students.
        Your tone is supportive, grounded, and attentive. Speak like a caring mentor or friend.

        ${contextPrompt}

        Weave in reference to their state only if it is natural and helpful. Encourage them to be kind to themselves. Use brief, warm, readable paragraphs. Avoid clinical diagnosing or hyper-formal advice.

        Recent conversation history:
        ${transcript}

        Generate Serene's next response:
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          temperature: 0.8,
        },
      });

      if (response.text) {
        return response.text.trim();
      }
    } catch (e) {
      console.warn('Gemini chat response API Error, falling back to local companion:', e);
    }
  }

  // Realistic Fallback Chat Companion
  return simulateChatResponse(currentText, latestJournal);
}

/* -------------------------------------------------------------
 * FALLBACK IMPLEMENTATIONS (Highly realistic client-side logic)
 * ------------------------------------------------------------- */

function simulateJournalAnalysis(content: string, mood: number): JournalAnalysis {
  const normalized = content.toLowerCase();
  const emotionalState: string[] = [];
  const stressTriggers: string[] = [];
  let copingCard = '';

  // Emotional states determination
  if (mood <= 3) {
    emotionalState.push('Deep Exhaustion', 'Overwhelmed');
  } else if (mood <= 6) {
    emotionalState.push('Anxious', 'Determined');
  } else {
    emotionalState.push('Calmed', 'Balanced');
  }

  if (normalized.includes('fight') || normalized.includes('argument') || normalized.includes('angry')) {
    emotionalState.push('Agitated');
  }
  if (normalized.includes('fail') || normalized.includes('scared') || normalized.includes('fear')) {
    emotionalState.push('Apprehensive');
  }
  if (normalized.includes('hope') || normalized.includes('try') || normalized.includes('learn')) {
    emotionalState.push('Resilient');
  }

  // If list empty, fill default
  if (emotionalState.length === 0) emotionalState.push('Reflective');

  // Stress triggers determination
  if (normalized.includes('exam') || normalized.includes('test') || normalized.includes('quiz') || normalized.includes('exam') || normalized.includes('grade') || normalized.includes('mark')) {
    stressTriggers.push('Academic Evaluator Pressure');
  }
  if (normalized.includes('sleep') || normalized.includes('tired') || normalized.includes('fatigue') || normalized.includes('night') || normalized.includes('insomnia')) {
    stressTriggers.push('Sleep Deprivation / Burnout');
  }
  if (normalized.includes('friend') || normalized.includes('social') || normalized.includes('group') || normalized.includes('lonely') || normalized.includes('isolate')) {
    stressTriggers.push('Social Isolation & Peer stress');
  }
  if (normalized.includes('time') || normalized.includes('schedule') || normalized.includes('busy') || normalized.includes('late') || normalized.includes('deadline')) {
    stressTriggers.push('Time Management Strain');
  }
  if (normalized.includes('math') || normalized.includes('physics') || normalized.includes('calculus') || normalized.includes('science')) {
    stressTriggers.push('Subject-Specific Anxiety');
  }

  if (stressTriggers.length === 0) {
    stressTriggers.push('Subconscious self-doubt');
  }

  // Coping card generation
  if (normalized.includes('exam') || normalized.includes('test')) {
    copingCard = `Try breaking down your prep into structured 25-minute Pomodoros. Give yourself permission to pause. High exam marks do not specify your value as a human.`;
  } else if (normalized.includes('sleep') || normalized.includes('tired')) {
    copingCard = `Prioritize your sleep tonight above any further study. When your brain is exhausted, studying has diminishing returns. Dim your screens 30 minutes before bed.`;
  } else if (normalized.includes('math') || normalized.includes('physics')) {
    copingCard = `Subject fatigue is very real. Try tackling the math/physics problem block with a friend or write down just 1 small sub-concept to review today, avoiding massive checklists.`;
  } else {
    copingCard = `Ground yourself in the present moment. Focus on taking 3 intentional deep breaths. You have handled tough spots before, and you can handle this step as well.`;
  }

  return {
    emotionalState,
    stressTriggers,
    copingCard,
    analyzedAt: new Date().toISOString(),
  };
}

function simulateChatResponse(userText: string, latestJournal?: JournalEntry): string {
  const norm = userText.toLowerCase();

  // If there's a reference to the journal
  const mentionStress = norm.includes('stressed') || norm.includes('anxious') || norm.includes('scared') || norm.includes('afraid') || norm.includes('worry');
  const mentionStudy = norm.includes('study') || norm.includes('exam') || norm.includes('test') || norm.includes('deadline') || norm.includes('work') || norm.includes('homework');

  if (norm.includes('hello') || norm.includes('hi') || norm.includes('hey')) {
    let greeting = `Hello! I'm Serene, your mental wellness companion. I'm here in this quiet space whenever you need to talk, vent, or just breathe. What's on your mind today?`;
    if (latestJournal) {
      greeting += ` I saw in your journal entry that you rated your mood as a ${latestJournal.mood}/10. How corresponds with how you are feeling right now?`;
    }
    return greeting;
  }

  if (mentionStudy) {
    return `Exam timelines can indeed make us feel like we are constantly running on empty. Remember, study load is like weights—it requires structured recovery between reps. Have you taken a screen-free study break today? Simple things like walking for 5 minutes can restore cognitive clarity.`;
  }

  if (mentionStress) {
    return `It is completely natural to feel anxious when the pressure mounts. That sensation of tightening up is just your mind try to handle too many inputs at once. Let's do a quick grounding exercise together, or simply vent it all out to me. You are completely safe here.`;
  }

  if (norm.includes('sleep') || norm.includes('tired') || norm.includes('exhausted')) {
    return `Gently closing the books might be the most productive decision you make tonight. Retaining information requires consolidation in deep REM cycles. Why don't we try a brief Box Breathing cycle right now to trigger your body's relaxation response?`;
  }

  // Generic empathetic replies
  const responses = [
    `I hear you, and it sounds like you've been carrying a heavy weight recently. Remember, progress isn't represented by immediate mastery; just showing up is a huge win.`,
    `That is incredibly valid. Often, the highest standards we fail to meet are the ones we unfairly set for ourselves. What would a kind friend say to you right now?`,
    `Thank you for sharing that with me. It takes real courage to acknowledge feeling overwhelmed. Let's take a breath together and decide on one very small action card for today.`,
    `I'm right here with you. How would it feel to take 5 minutes to release your jaw, lower your shoulders, and let go of any urgent demands?`
  ];

  const idx = Math.floor(Math.random() * responses.length);
  return responses[idx];
}
