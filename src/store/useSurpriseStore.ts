import { create } from 'zustand';
import type { CollectedSurprise, RelationshipStage, BudgetLevel, Surprise } from '../types';
import initialSurprises from '../data/surprises.json';

const STORAGE_KEY = 'collectedSurprises';

interface SurpriseState {
  collectedSurprises: CollectedSurprise[];
  filterStage: RelationshipStage | 'all';
  filterBudget: BudgetLevel | 'all';
  searchQuery: string;
  showFavoritesOnly: boolean;
  setFilterStage: (stage: RelationshipStage | 'all') => void;
  setFilterBudget: (budget: BudgetLevel | 'all') => void;
  setSearchQuery: (query: string) => void;
  setShowFavoritesOnly: (show: boolean) => void;
  collectSurprise: (surprise: Surprise) => void;
  toggleFavorite: (surpriseId: string) => void;
  removeSurprise: (surpriseId: string) => void;
  addCustomSurprise: (content: string, suitableFor: RelationshipStage[], budget: BudgetLevel[]) => void;
  loadCollectedSurprises: () => void;
  getFavoriteSurprises: (preferences?: { relationshipStage: RelationshipStage; budget: BudgetLevel }) => CollectedSurprise[];
  getFilteredSurprises: () => CollectedSurprise[];
  isCollected: (content: string) => boolean;
}

function loadFromStorage(): CollectedSurprise[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as CollectedSurprise[];
    }
    const defaultCollected: CollectedSurprise[] = (initialSurprises as Surprise[]).slice(0, 3).map(s => ({
      ...s,
      isFavorite: true,
      createdAt: new Date().toISOString(),
      source: 'system',
    }));
    saveToStorage(defaultCollected);
    return defaultCollected;
  } catch (e) {
    console.error('Failed to load collected surprises:', e);
    return [];
  }
}

function saveToStorage(surprises: CollectedSurprise[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(surprises));
  } catch (e) {
    console.error('Failed to save collected surprises:', e);
  }
}

export const useSurpriseStore = create<SurpriseState>((set, get) => ({
  collectedSurprises: [],
  filterStage: 'all',
  filterBudget: 'all',
  searchQuery: '',
  showFavoritesOnly: false,

  setFilterStage: (stage) => set({ filterStage: stage }),
  setFilterBudget: (budget) => set({ filterBudget: budget }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setShowFavoritesOnly: (show) => set({ showFavoritesOnly: show }),

  collectSurprise: (surprise) => {
    set((state) => {
      const exists = state.collectedSurprises.some(s => s.content === surprise.content);
      if (exists) {
        const updatedSurprises = state.collectedSurprises.map(s => 
          s.content === surprise.content ? { ...s, isFavorite: true } : s
        );
        saveToStorage(updatedSurprises);
        return { collectedSurprises: updatedSurprises };
      }
      const newSurprise: CollectedSurprise = {
        ...surprise,
        id: `surprise-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        isFavorite: true,
        createdAt: new Date().toISOString(),
        source: 'system',
      };
      const newSurprises = [newSurprise, ...state.collectedSurprises];
      saveToStorage(newSurprises);
      return { collectedSurprises: newSurprises };
    });
  },

  toggleFavorite: (surpriseId) => {
    set((state) => {
      const updatedSurprises = state.collectedSurprises.map(s =>
        s.id === surpriseId ? { ...s, isFavorite: !s.isFavorite } : s
      );
      saveToStorage(updatedSurprises);
      return { collectedSurprises: updatedSurprises };
    });
  },

  removeSurprise: (surpriseId) => {
    set((state) => {
      const updatedSurprises = state.collectedSurprises.filter(s => s.id !== surpriseId);
      saveToStorage(updatedSurprises);
      return { collectedSurprises: updatedSurprises };
    });
  },

  addCustomSurprise: (content, suitableFor, budget) => {
    set((state) => {
      const newSurprise: CollectedSurprise = {
        id: `surprise-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        content,
        suitableFor,
        budget,
        isFavorite: true,
        createdAt: new Date().toISOString(),
        source: 'user',
      };
      const newSurprises = [newSurprise, ...state.collectedSurprises];
      saveToStorage(newSurprises);
      return { collectedSurprises: newSurprises };
    });
  },

  loadCollectedSurprises: () => {
    set({ collectedSurprises: loadFromStorage() });
  },

  getFavoriteSurprises: (preferences) => {
    const { collectedSurprises } = get();
    let favorites = collectedSurprises.filter(s => s.isFavorite);
    
    if (preferences) {
      favorites = favorites.filter(s => 
        s.suitableFor.includes(preferences.relationshipStage) &&
        s.budget.includes(preferences.budget)
      );
    }
    
    return favorites;
  },

  getFilteredSurprises: () => {
    const { collectedSurprises, filterStage, filterBudget, searchQuery, showFavoritesOnly } = get();
    
    let filtered = [...collectedSurprises];
    
    if (showFavoritesOnly) {
      filtered = filtered.filter(s => s.isFavorite);
    }
    
    if (filterStage !== 'all') {
      filtered = filtered.filter(s => s.suitableFor.includes(filterStage));
    }
    
    if (filterBudget !== 'all') {
      filtered = filtered.filter(s => s.budget.includes(filterBudget));
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(s => s.content.toLowerCase().includes(query));
    }
    
    return filtered.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  isCollected: (content) => {
    const { collectedSurprises } = get();
    return collectedSurprises.some(s => s.content === content);
  },
}));
