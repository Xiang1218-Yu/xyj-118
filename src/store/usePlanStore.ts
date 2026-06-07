import { create } from 'zustand';
import type { UserPreferences, DatePlan, PlanCount, Activity, Surprise } from '../types';
import { generateDatePlan, savePlanToStorage, getSavedPlans, deletePlanFromStorage, clearAllPlans, generateMultipleDatePlans } from '../utils/planGenerator';
import { useSurpriseStore } from './useSurpriseStore';

const calculateEstimatedCost = (activities: Activity[]): number => {
  return activities.reduce((sum, activity) => sum + activity.cost, 0);
};

interface PlanState {
  preferences: UserPreferences;
  currentPlan: DatePlan | null;
  currentPlans: DatePlan[];
  selectedPlanIndex: number;
  savedPlans: DatePlan[];
  isGenerating: boolean;
  setRelationshipStage: (stage: UserPreferences['relationshipStage']) => void;
  toggleInterest: (interest: string) => void;
  setBudget: (budget: UserPreferences['budget']) => void;
  setPlanCount: (count: PlanCount) => void;
  setUseFavoriteSurprises: (use: boolean) => void;
  generatePlan: () => Promise<DatePlan>;
  generateMultiplePlans: () => Promise<DatePlan[]>;
  saveCurrentPlan: () => void;
  clearCurrentPlan: () => void;
  loadSavedPlans: () => void;
  resetPreferences: () => void;
  deleteSavedPlan: (planId: string) => void;
  loadPlan: (plan: DatePlan) => void;
  clearAllSavedPlans: () => void;
  selectPlan: (index: number) => void;
  reorderActivities: (newOrder: Activity[]) => void;
  updateActivity: (activityId: string, updates: Partial<Activity>) => void;
}

const defaultPreferences: UserPreferences = {
  relationshipStage: 'dating',
  interests: [],
  budget: 'medium',
  planCount: 2,
  useFavoriteSurprises: false,
};

export const usePlanStore = create<PlanState>((set, get) => ({
  preferences: defaultPreferences,
  currentPlan: null,
  currentPlans: [],
  selectedPlanIndex: 0,
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

  setPlanCount: (count) =>
    set((state) => ({
      preferences: { ...state.preferences, planCount: count },
    })),

  setUseFavoriteSurprises: (use) =>
    set((state) => ({
      preferences: { ...state.preferences, useFavoriteSurprises: use },
    })),

  generatePlan: async () => {
    set({ isGenerating: true });
    
    await new Promise((resolve) => setTimeout(resolve, 2500));
    
    const { preferences } = get();
    let favoriteSurprises: Surprise[] | undefined;
    
    if (preferences.useFavoriteSurprises) {
      const surpriseStore = useSurpriseStore.getState();
      favoriteSurprises = surpriseStore.getFavoriteSurprises({
        relationshipStage: preferences.relationshipStage,
        budget: preferences.budget,
      }) as Surprise[];
    }
    
    const plan = generateDatePlan(preferences, favoriteSurprises);
    set({ currentPlan: plan, currentPlans: [plan], isGenerating: false });
    return plan;
  },

  generateMultiplePlans: async () => {
    set({ isGenerating: true });
    
    const { preferences } = get();
    let favoriteSurprises: Surprise[] | undefined;
    
    if (preferences.useFavoriteSurprises) {
      const surpriseStore = useSurpriseStore.getState();
      favoriteSurprises = surpriseStore.getFavoriteSurprises({
        relationshipStage: preferences.relationshipStage,
        budget: preferences.budget,
      }) as Surprise[];
    }
    
    await new Promise((resolve) => setTimeout(resolve, 2500 + (preferences.planCount - 1) * 500));
    
    const plans = generateMultipleDatePlans(preferences, preferences.planCount, favoriteSurprises);
    set({ 
      currentPlans: plans,
      currentPlan: plans[0],
      selectedPlanIndex: 0,
      isGenerating: false,
    });
    return plans;
  },

  saveCurrentPlan: () => {
    const { currentPlans, selectedPlanIndex } = get();
    const planToSave = currentPlans[selectedPlanIndex] || get().currentPlan;
    if (planToSave) {
      savePlanToStorage(planToSave);
      get().loadSavedPlans();
    }
  },

  clearCurrentPlan: () => set({ currentPlan: null, currentPlans: [], selectedPlanIndex: 0 }),

  loadSavedPlans: () => {
    set({ savedPlans: getSavedPlans() });
  },

  resetPreferences: () => set({ preferences: defaultPreferences }),

  deleteSavedPlan: (planId) => {
    deletePlanFromStorage(planId);
    get().loadSavedPlans();
  },

  loadPlan: (plan) => {
    set({ currentPlan: plan, currentPlans: [plan], selectedPlanIndex: 0 });
  },

  clearAllSavedPlans: () => {
    clearAllPlans();
    get().loadSavedPlans();
  },

  selectPlan: (index) => {
    const { currentPlans } = get();
    if (index >= 0 && index < currentPlans.length) {
      set({ 
        selectedPlanIndex: index,
        currentPlan: currentPlans[index]
      });
    }
  },

  reorderActivities: (newOrder) => {
    const { currentPlans, selectedPlanIndex } = get();
    const updatedPlans = [...currentPlans];
    const plan = { ...updatedPlans[selectedPlanIndex] };
    plan.activities = newOrder;
    plan.estimatedCost = calculateEstimatedCost(newOrder);
    updatedPlans[selectedPlanIndex] = plan;
    set({ 
      currentPlans: updatedPlans,
      currentPlan: plan,
    });
  },

  updateActivity: (activityId, updates) => {
    const { currentPlans, selectedPlanIndex } = get();
    const updatedPlans = [...currentPlans];
    const plan = { ...updatedPlans[selectedPlanIndex] };
    plan.activities = plan.activities.map((activity) =>
      activity.id === activityId ? { ...activity, ...updates } : activity
    );
    plan.estimatedCost = calculateEstimatedCost(plan.activities);
    updatedPlans[selectedPlanIndex] = plan;
    set({ 
      currentPlans: updatedPlans,
      currentPlan: plan,
    });
  },
}));
