import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Anniversary, CalendarType, AnniversaryType } from '../types';
import { generateId, getDaysUntilNextAnniversary } from '../utils/lunarUtils';

interface AnniversaryState {
  anniversaries: Anniversary[];
  addAnniversary: (data: Omit<Anniversary, 'id' | 'createdAt'>) => void;
  updateAnniversary: (id: string, data: Partial<Anniversary>) => void;
  deleteAnniversary: (id: string) => void;
  getSortedAnniversaries: () => Anniversary[];
}

const defaultAnniversaries: Anniversary[] = [
  {
    id: generateId(),
    title: '在一起',
    date: '2023-02-14',
    calendarType: 'solar',
    type: 'love',
    emoji: '💑',
    themeColor: '#FF6B9D',
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    title: 'TA的生日',
    date: '1999-08-15',
    calendarType: 'lunar',
    type: 'birthday',
    emoji: '🎂',
    themeColor: '#A78BFA',
    createdAt: new Date().toISOString(),
  },
];

export const useAnniversaryStore = create<AnniversaryState>()(
  persist(
    (set, get) => ({
      anniversaries: defaultAnniversaries,

      addAnniversary: (data) => {
        const newAnniversary: Anniversary = {
          ...data,
          id: generateId(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          anniversaries: [...state.anniversaries, newAnniversary],
        }));
      },

      updateAnniversary: (id, data) => {
        set((state) => ({
          anniversaries: state.anniversaries.map((a) =>
            a.id === id ? { ...a, ...data } : a
          ),
        }));
      },

      deleteAnniversary: (id) => {
        set((state) => ({
          anniversaries: state.anniversaries.filter((a) => a.id !== id),
        }));
      },

      getSortedAnniversaries: () => {
        return [...get().anniversaries].sort((a, b) => {
          const daysA = getDaysUntilNextAnniversary(a.date, a.calendarType);
          const daysB = getDaysUntilNextAnniversary(b.date, b.calendarType);
          return daysA - daysB;
        });
      },
    }),
    {
      name: 'anniversary-storage',
    }
  )
);

export type { CalendarType, AnniversaryType };
