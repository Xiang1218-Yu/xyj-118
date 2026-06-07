import { create } from 'zustand';
import type { Idea, IdeaCategory } from '../types';
import initialIdeas from '../data/ideas.json';

const STORAGE_KEY = 'dateIdeas';
const LIKED_KEY = 'likedIdeas';

interface IdeaState {
  ideas: Idea[];
  filterCategory: IdeaCategory | '全部';
  sortBy: 'latest' | 'popular';
  setFilterCategory: (category: IdeaCategory | '全部') => void;
  setSortBy: (sort: 'latest' | 'popular') => void;
  addIdea: (idea: Omit<Idea, 'id' | 'createdAt' | 'likes' | 'isLiked'>) => void;
  toggleLike: (ideaId: string) => void;
  loadIdeas: () => void;
  getFilteredIdeas: () => Idea[];
}

function loadFromStorage(): Idea[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const storedIdeas = JSON.parse(stored) as Idea[];
      const likedIds = JSON.parse(localStorage.getItem(LIKED_KEY) || '[]') as string[];
      return storedIdeas.map(idea => ({
        ...idea,
        isLiked: likedIds.includes(idea.id),
      }));
    }
    return initialIdeas as Idea[];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_e) {
    return initialIdeas as Idea[];
  }
}

function saveToStorage(ideas: Idea[]): void {
  try {
    const ideasToStore = ideas.map(idea => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { isLiked: _isLiked, ...rest } = idea;
      return rest;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ideasToStore));
  } catch (e) {
    console.error('Failed to save ideas:', e);
  }
}

function saveLikedToStorage(likedIds: string[]): void {
  try {
    localStorage.setItem(LIKED_KEY, JSON.stringify(likedIds));
  } catch (e) {
    console.error('Failed to save liked ideas:', e);
  }
}

function getLikedIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem(LIKED_KEY) || '[]') as string[];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_e) {
    return [];
  }
}

export const useIdeaStore = create<IdeaState>((set, get) => ({
  ideas: [],
  filterCategory: '全部',
  sortBy: 'latest',

  setFilterCategory: (category) => {
    set({ filterCategory: category });
  },

  setSortBy: (sort) => {
    set({ sortBy: sort });
  },

  addIdea: (idea) => {
    const newIdea: Idea = {
      ...idea,
      id: `idea-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false,
    };
    set((state) => {
      const newIdeas = [newIdea, ...state.ideas];
      saveToStorage(newIdeas);
      return { ideas: newIdeas };
    });
  },

  toggleLike: (ideaId) => {
    set((state) => {
      const newIdeas = state.ideas.map((idea) => {
        if (idea.id === ideaId) {
          const newIsLiked = !idea.isLiked;
          return {
            ...idea,
            isLiked: newIsLiked,
            likes: newIsLiked ? idea.likes + 1 : idea.likes - 1,
          };
        }
        return idea;
      });

      const likedIds = getLikedIds();
      const newLikedIds = likedIds.includes(ideaId)
        ? likedIds.filter((id) => id !== ideaId)
        : [...likedIds, ideaId];

      saveToStorage(newIdeas);
      saveLikedToStorage(newLikedIds);

      return { ideas: newIdeas };
    });
  },

  loadIdeas: () => {
    set({ ideas: loadFromStorage() });
  },

  getFilteredIdeas: () => {
    const { ideas, filterCategory, sortBy } = get();
    
    let filtered = ideas;
    if (filterCategory !== '全部') {
      filtered = ideas.filter((idea) => idea.category === filterCategory);
    }

    if (sortBy === 'latest') {
      return [...filtered].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else {
      return [...filtered].sort((a, b) => b.likes - a.likes);
    }
  },
}));
