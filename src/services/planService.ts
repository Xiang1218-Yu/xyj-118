import type { UserPreferences, DatePlan, Surprise } from '../types';
import { filterVenuesByPreferences, selectVenues } from '../modules/venueSelector';
import { generateActivities } from '../modules/activityBuilder';
import { selectSurprises } from '../modules/surpriseSelector';
import {
  budgetRanges,
  weatherTips,
  planTitles,
  randomChoice,
  calculateTotalCost,
  generatePlanId,
  getPlanTitleWithStyle,
} from '../utils/planUtils';

export function generateDatePlan(
  preferences: UserPreferences,
  favoriteSurprises?: Surprise[]
): DatePlan {
  const filteredVenues = filterVenuesByPreferences(preferences);
  const { lunch, dinner, activities: activityVenues } = selectVenues(filteredVenues, preferences.budget);
  const activities = generateActivities(lunch, dinner, activityVenues, preferences.budget);
  const selectedSurprises = selectSurprises(preferences, favoriteSurprises);
  const estimatedCost = calculateTotalCost(activities);

  return {
    id: generatePlanId(),
    createdAt: new Date().toISOString(),
    title: randomChoice(planTitles),
    totalBudget: budgetRanges[preferences.budget].label,
    estimatedCost,
    activities,
    surprises: selectedSurprises,
    weatherTip: randomChoice(weatherTips),
  };
}

export function generateMultipleDatePlans(
  preferences: UserPreferences,
  count: number,
  favoriteSurprises?: Surprise[]
): DatePlan[] {
  const plans: DatePlan[] = [];
  const usedVenues = new Set<string>();

  for (let i = 0; i < count; i++) {
    let plan = generateDatePlan(preferences, favoriteSurprises);
    let attempts = 0;

    while (attempts < 10) {
      const planVenueIds = plan.activities.map(a => a.name);
      const overlap = planVenueIds.filter(id => usedVenues.has(id)).length;

      if (overlap <= 1 || i === 0) {
        break;
      }

      plan = generateDatePlan(preferences, favoriteSurprises);
      attempts++;
    }

    plan.id = generatePlanId(i);
    plan.title = getPlanTitleWithStyle(plan.title, i, count);

    plan.activities.forEach(a => usedVenues.add(a.name));

    plans.push(plan);
  }

  return plans;
}
