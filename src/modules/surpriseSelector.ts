import type { UserPreferences, Surprise } from '../types';
import surprisesData from '../data/surprises.json';
import { shuffleArray } from '../utils/planUtils';

const surprises = surprisesData as Surprise[];

export function filterSurprisesByPreferences(
  surprisesList: Surprise[],
  preferences: UserPreferences
): Surprise[] {
  const { relationshipStage, budget } = preferences;

  return surprisesList.filter(s =>
    s.suitableFor.includes(relationshipStage) &&
    s.budget.includes(budget)
  );
}

export function selectSurprises(
  preferences: UserPreferences,
  favoriteSurprises?: Surprise[]
): string[] {
  const { useFavoriteSurprises } = preferences;

  if (useFavoriteSurprises && favoriteSurprises && favoriteSurprises.length > 0) {
    const filteredFavorites = filterSurprisesByPreferences(favoriteSurprises, preferences);

    if (filteredFavorites.length > 0) {
      const shuffled = shuffleArray(filteredFavorites);
      const count = Math.min(2, shuffled.length);
      return shuffled.slice(0, count).map(s => s.content);
    }
  }

  const suitableSurprises = filterSurprisesByPreferences(surprises, preferences);

  const shuffled = shuffleArray(suitableSurprises);
  const count = Math.min(2, shuffled.length);

  return shuffled.slice(0, count).map(s => s.content);
}

export function getAllSurprises(): Surprise[] {
  return surprises;
}
