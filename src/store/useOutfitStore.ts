import { create } from 'zustand';
import type { Outfit, OutfitFilters, DateType, Weather, Season, Atmosphere } from '../types';
import outfitsData from '../data/outfits.json';

const OUTFIT_COUNT = 3;

interface OutfitState {
  allOutfits: Outfit[];
  filteredOutfits: Outfit[];
  recommendedOutfits: Outfit[];
  currentOutfitIndex: number;
  filters: OutfitFilters;
  isGenerating: boolean;
  loadOutfits: () => void;
  setDateType: (dateType: DateType | null) => void;
  setWeather: (weather: Weather | null) => void;
  setSeason: (season: Season | null) => void;
  setAtmosphere: (atmosphere: Atmosphere | null) => void;
  filterOutfits: () => void;
  generateRecommendations: () => Promise<void>;
  nextOutfit: () => void;
  prevOutfit: () => void;
  goToOutfit: (index: number) => void;
  resetFilters: () => void;
  refreshRecommendations: () => Promise<void>;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const useOutfitStore = create<OutfitState>((set, get) => ({
  allOutfits: outfitsData as Outfit[],
  filteredOutfits: outfitsData as Outfit[],
  recommendedOutfits: [],
  currentOutfitIndex: 0,
  filters: {
    dateType: null,
    weather: null,
    season: null,
    atmosphere: null,
  },
  isGenerating: false,

  loadOutfits: () => {
    set({ allOutfits: outfitsData as Outfit[], filteredOutfits: outfitsData as Outfit[] });
  },

  setDateType: (dateType) => {
    set((state) => ({
      filters: { ...state.filters, dateType },
    }));
    get().filterOutfits();
  },

  setWeather: (weather) => {
    set((state) => ({
      filters: { ...state.filters, weather },
    }));
    get().filterOutfits();
  },

  setSeason: (season) => {
    set((state) => ({
      filters: { ...state.filters, season },
    }));
    get().filterOutfits();
  },

  setAtmosphere: (atmosphere) => {
    set((state) => ({
      filters: { ...state.filters, atmosphere },
    }));
    get().filterOutfits();
  },

  filterOutfits: () => {
    const { allOutfits, filters } = get();
    const filtered = allOutfits.filter((outfit) => {
      if (filters.dateType && !outfit.suitableFor.dateTypes.includes(filters.dateType)) {
        return false;
      }
      if (filters.weather && !outfit.suitableFor.weather.includes(filters.weather)) {
        return false;
      }
      if (filters.season && !outfit.suitableFor.seasons.includes(filters.season)) {
        return false;
      }
      if (filters.atmosphere && !outfit.suitableFor.atmospheres.includes(filters.atmosphere)) {
        return false;
      }
      return true;
    });
    set({ filteredOutfits: filtered });
  },

  generateRecommendations: async () => {
    set({ isGenerating: true });

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const { filteredOutfits } = get();
    const outfitsToUse = filteredOutfits.length > 0 ? filteredOutfits : get().allOutfits;
    const shuffled = shuffleArray(outfitsToUse);
    const recommendations = shuffled.slice(0, Math.min(OUTFIT_COUNT, shuffled.length));

    set({
      recommendedOutfits: recommendations,
      currentOutfitIndex: 0,
      isGenerating: false,
    });
  },

  nextOutfit: () => {
    const { currentOutfitIndex, recommendedOutfits } = get();
    if (currentOutfitIndex < recommendedOutfits.length - 1) {
      set({ currentOutfitIndex: currentOutfitIndex + 1 });
    }
  },

  prevOutfit: () => {
    const { currentOutfitIndex } = get();
    if (currentOutfitIndex > 0) {
      set({ currentOutfitIndex: currentOutfitIndex - 1 });
    }
  },

  goToOutfit: (index) => {
    const { recommendedOutfits } = get();
    if (index >= 0 && index < recommendedOutfits.length) {
      set({ currentOutfitIndex: index });
    }
  },

  resetFilters: () => {
    set({
      filters: {
        dateType: null,
        weather: null,
        season: null,
        atmosphere: null,
      },
    });
    get().filterOutfits();
  },

  refreshRecommendations: async () => {
    await get().generateRecommendations();
  },
}));
