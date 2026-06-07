import { create } from 'zustand';
import type { UserPreferences, DatePlan } from '../types';
import { generateDatePlan, savePlanToStorage, getSavedPlans } from '../utils/planGenerator';

interface PlanState {
  preferences: UserPreferences;
  currentPlan: DatePlan | null;
  savedPlans: DatePlan[];
  isGenerating: boolean;
  setRelationshipStage: (stage: UserPreferences['relationshipStage']) => void;
  toggleInterest: (interest: string) => void;
  setBudget: (budget: UserPreferences['budget']) => void;
  generatePlan: () => Promise<DatePlan>;
  saveCurrentPlan: () => void;
  clearCurrentPlan: () => void;
  loadSavedPlans: () => void;
  resetPreferences: () => void;
}

const defaultPreferences: UserPreferences = {
  relationshipStage: 'dating',
  interests: [],
  budget: 'medium',
};

export const usePlanStore = create<PlanState>((set, get) => ({
  preferences: defaultPreferences,
  currentPlan: null,
  savedPlans: [],
  isGenerating: false,

  setRelationshipStage: (stage) =>
    set((state) => ({
      preferences: { ...state.preferences, relationshipStage: stage },
    })),

  toggleInterest: (interest) =>
    set((state) => {
      const interests = state.preferences.interests;
      const newInterests = interests.includes(interest)
        ? interests.filter((i) => i !== interest)
        : [...interests, interest];
      return {
        preferences: { ...state.preferences, interests: newInterests },
      };
    }),

  setBudget: (budget) =>
    set((state) => ({
      preferences: { ...state.preferences, budget },
    })),

  generatePlan: async () => {
    set({ isGenerating: true });
    
    await new Promise((resolve) => setTimeout(resolve, 2500));
    
    const plan = generateDatePlan(get().preferences);
    set({ currentPlan: plan, isGenerating: false });
    return plan;
  },

  saveCurrentPlan: () => {
    const { currentPlan } = get();
    if (currentPlan) {
      savePlanToStorage(currentPlan);
      get().loadSavedPlans();
    }
  },

  clearCurrentPlan: () => set({ currentPlan: null }),

  loadSavedPlans: () => {
    set({ savedPlans: getSavedPlans() });
  },

  resetPreferences: () => set({ preferences: defaultPreferences }),
}));
