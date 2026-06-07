import type { UserPreferences, Venue } from '../types';
import venuesData from '../data/venues.json';
import {
  budgetRanges,
  budgetPriority,
  interestToVenueTypes,
  shuffleArray,
  randomChoice,
} from '../utils/planUtils';

const venues = venuesData as Venue[];

export function filterVenuesByPreferences(preferences: UserPreferences): Venue[] {
  const { relationshipStage, interests, budget } = preferences;

  return venues.filter(venue => {
    const isSuitableStage = venue.suitableFor.includes(relationshipStage);

    const isBudgetMatch = venue.averageCost * 2 <= budgetRanges[budget].max;
    if (!isBudgetMatch && budgetPriority[budget] < 2) {
      return false;
    }

    const categoryMatch = interests.some(interest => {
      const types = interestToVenueTypes[interest] || [];
      return types.includes(venue.type) || venue.category.includes(interest);
    });

    return isSuitableStage && (categoryMatch || interests.length === 0);
  });
}

export interface SelectedVenues {
  lunch: Venue;
  dinner: Venue;
  activities: Venue[];
}

export function selectVenues(filteredVenues: Venue[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  budget: string
): SelectedVenues {
  const restaurants = filteredVenues.filter(v => v.type === 'restaurant');
  const cafes = filteredVenues.filter(v => v.type === 'cafe');
  const attractions = filteredVenues.filter(v => v.type === 'attraction');
  const activities = filteredVenues.filter(v => v.type === 'activity');
  const cinemas = filteredVenues.filter(v => v.type === 'cinema');

  const shuffledRestaurants = shuffleArray(restaurants);
  const lunch = shuffledRestaurants[0] || randomChoice(venues.filter(v => v.type === 'restaurant'));
  const dinnerOptions = shuffledRestaurants.filter(r => r.id !== lunch.id);
  const dinner = dinnerOptions[0] || lunch;

  const allActivityVenues = [...cafes, ...attractions, ...activities, ...cinemas];
  const shuffledActivities = shuffleArray(allActivityVenues);
  const selectedActivities = shuffledActivities.slice(0, Math.min(3, shuffledActivities.length));

  if (selectedActivities.length < 2) {
    const fallback = shuffleArray([...venues.filter(v => v.type !== 'restaurant')]).slice(0, 2);
    selectedActivities.push(...fallback);
  }

  return { lunch, dinner, activities: selectedActivities };
}

export function getAllVenues(): Venue[] {
  return venues;
}

export function getVenuesByType(type: Venue['type']): Venue[] {
  return venues.filter(v => v.type === type);
}
