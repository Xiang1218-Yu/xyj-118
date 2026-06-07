import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PRESET_THEMES } from '../types';

interface ThemeState {
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  resetTheme: () => void;
}

const DEFAULT_COLOR = '#FF6B9D';

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      primaryColor: DEFAULT_COLOR,

      setPrimaryColor: (color) => {
        set({ primaryColor: color });
        document.documentElement.style.setProperty('--primary-color', color);
        const rgb = hexToRgb(color);
        if (rgb) {
          document.documentElement.style.setProperty('--primary-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
        }
      },

      resetTheme: () => {
        set({ primaryColor: DEFAULT_COLOR });
        document.documentElement.style.setProperty('--primary-color', DEFAULT_COLOR);
        const rgb = hexToRgb(DEFAULT_COLOR);
        if (rgb) {
          document.documentElement.style.setProperty('--primary-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
        }
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        if (state?.primaryColor) {
          document.documentElement.style.setProperty('--primary-color', state.primaryColor);
          const rgb = hexToRgb(state.primaryColor);
          if (rgb) {
            document.documentElement.style.setProperty('--primary-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
          }
        }
      },
    }
  )
);

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export { PRESET_THEMES };
