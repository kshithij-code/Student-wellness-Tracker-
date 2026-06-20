import Dexie, { type Table } from 'dexie';
import type { JournalEntry, ChatMessage, ExamCountdown } from '../types';

export class MentalWellnessDatabase extends Dexie {
  journals!: Table<JournalEntry, number>;
  chatHistory!: Table<ChatMessage, number>;
  countdowns!: Table<ExamCountdown, number>;

  constructor() {
    super('MentalWellnessDatabase');
    this.version(1).stores({
      journals: '++id, date, mood',
      chatHistory: '++id, timestamp, sender',
      countdowns: '++id, title, date',
    });
  }
}

export const db = new MentalWellnessDatabase();
export default db;
