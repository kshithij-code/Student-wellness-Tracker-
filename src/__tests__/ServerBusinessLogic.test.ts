import { describe, it, expect } from 'vitest';

// Function mirroring the exact journal sentiment fallback logic of /server.ts
function simulateServerJournalAnalysisLogic(content: string, mood: number) {
  const normalized = content.toLowerCase();
  const emotionalState: string[] = [];
  const stressTriggers: string[] = [];

  if (mood <= 3) {
    emotionalState.push("Deep Exhaustion", "Overwhelmed");
  } else if (mood <= 6) {
    emotionalState.push("Anxious", "Determined");
  } else {
    emotionalState.push("Calm", "Balanced");
  }

  if (normalized.includes("fight") || normalized.includes("argument") || normalized.includes("angry")) {
    emotionalState.push("Agitated");
  }
  if (normalized.includes("fail") || normalized.includes("scared") || normalized.includes("fear")) {
    emotionalState.push("Apprehensive");
  }
  if (normalized.includes("hope") || normalized.includes("try") || normalized.includes("learn")) {
    emotionalState.push("Resilient");
  }
  if (emotionalState.length === 0) emotionalState.push("Reflective");

  if (normalized.includes("exam") || normalized.includes("test") || normalized.includes("quiz") || normalized.includes("grade")) {
    stressTriggers.push("Academic Evaluator Pressure");
  }
  if (normalized.includes("sleep") || normalized.includes("tired") || normalized.includes("fatigue") || normalized.includes("insomnia")) {
    stressTriggers.push("Sleep Deprivation");
  }
  if (normalized.includes("friend") || normalized.includes("social") || normalized.includes("lonely") || normalized.includes("isolate")) {
    stressTriggers.push("Social Isolation");
  }
  if (normalized.includes("time") || normalized.includes("schedule") || normalized.includes("busy") || normalized.includes("deadline")) {
    stressTriggers.push("Time Management Strain");
  }
  if (stressTriggers.length === 0) {
    stressTriggers.push("Subconscious fatigue");
  }

  let evaluatedMood = mood;
  if (normalized.includes("tired") || normalized.includes("exhausted") || normalized.includes("fatigue") || normalized.includes("stress") || normalized.includes("panic") || normalized.includes("overwhelm")) {
    evaluatedMood = Math.max(1, evaluatedMood - 2);
  }
  if (normalized.includes("fail") || normalized.includes("scared") || normalized.includes("cry") || normalized.includes("sad") || normalized.includes("angry")) {
    evaluatedMood = Math.max(1, evaluatedMood - 2);
  }
  if (normalized.includes("hope") || normalized.includes("happy") || normalized.includes("excited") || normalized.includes("glad") || normalized.includes("proud") || normalized.includes("accomplished")) {
    evaluatedMood = Math.min(10, evaluatedMood + 2);
  }

  return {
    emotionalState,
    stressTriggers,
    evaluatedMood
  };
}

describe('Server Fallback Analysis Business Logic Unit Tests', () => {

  it('determines the correct emotional states and triggers under normal mood', () => {
    const analysis = simulateServerJournalAnalysisLogic(
      "I am preparing for my next college geometry exam which worries me slightly.",
      8
    );

    expect(analysis.emotionalState).toContain("Calm");
    expect(analysis.stressTriggers).toContain("Academic Evaluator Pressure");
    // Not heavily downrated without extreme stress descriptors
    expect(analysis.evaluatedMood).toBe(8);
  });

  it('correctly categorizes agitated or apprehensive student states with low mood', () => {
    const analysis = simulateServerJournalAnalysisLogic(
      "Had an argument with my group partners today. I am scared I will fail this semester.",
      3
    );

    expect(analysis.emotionalState).toContain("Deep Exhaustion");
    expect(analysis.emotionalState).toContain("Agitated");
    expect(analysis.emotionalState).toContain("Apprehensive");
    expect(analysis.stressTriggers).toHaveLength(1);
    expect(analysis.stressTriggers[0]).toBe("Subconscious fatigue");
    
    // Low mood starts at 3, downrated with fail/scared/argument triggers (capped at 1 minimum)
    expect(analysis.evaluatedMood).toBe(1);
  });

  it('promotes positive mood adjustments when resilient keywords are matched', () => {
    const analysis = simulateServerJournalAnalysisLogic(
      "Feeling some anxiety about my schedule, but I hope and try to make things work out.",
      6
    );

    expect(analysis.emotionalState).toContain("Anxious");
    expect(analysis.emotionalState).toContain("Resilient");
    expect(analysis.stressTriggers).toContain("Time Management Strain");
    
    // Base 6 + 2 (hope/try) = 8
    expect(analysis.evaluatedMood).toBe(8);
  });

});
