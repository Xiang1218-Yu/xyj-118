import type { DatePlan } from '../types';

const STORAGE_KEY = 'datePlans';
const MAX_SAVED_PLANS = 10;

function safeParse<T>(data: string | null, defaultValue: T): T {
  if (!data) return defaultValue;
  try {
    return JSON.parse(data) as T;
  } catch (e) {
    console.error('Failed to parse data:', e);
    return defaultValue;
  }
}

export function getSavedPlans(): DatePlan[] {
  try {
    return safeParse<DatePlan[]>(localStorage.getItem(STORAGE_KEY), []);
  } catch {
    return [];
  }
}

export function savePlanToStorage(plan: DatePlan): void {
  try {
    const savedPlans = getSavedPlans();
    savedPlans.unshift(plan);
    if (savedPlans.length > MAX_SAVED_PLANS) {
      savedPlans.pop();
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedPlans));
  } catch (e) {
    console.error('Failed to save plan:', e);
  }
}

export function deletePlanFromStorage(planId: string): void {
  try {
    const savedPlans = getSavedPlans();
    const filteredPlans = savedPlans.filter((p: DatePlan) => p.id !== planId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredPlans));
  } catch (e) {
    console.error('Failed to delete plan:', e);
  }
}

export function clearAllPlans(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear plans:', e);
  }
}
