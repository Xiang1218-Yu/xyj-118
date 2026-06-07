import type { UserPreferences, DatePlan, Activity, Venue, Surprise } from '../types';
import venuesData from '../data/venues.json';
import surprisesData from '../data/surprises.json';

const venues = venuesData as Venue[];
const surprises = surprisesData as Surprise[];

const budgetRanges = {
  low: { min: 0, max: 400, label: '¥0-200' },
  medium: { min: 400, max: 1000, label: '¥200-500' },
  high: { min: 1000, max: 2000, label: '¥500-1000' },
  luxury: { min: 2000, max: 99999, label: '¥1000+' },
};

const budgetPriority: Record<string, number> = {
  low: 0,
  medium: 1,
  high: 2,
  luxury: 3,
};

const weatherTips = [
  '今天天气晴朗，适合户外活动，记得涂防晒哦～',
  '今天微风习习，最适合散步漫游了',
  '今天有点小冷，出门记得多穿一件外套',
  '今天可能会下雨，记得带伞，雨天也有别样浪漫',
  '今天阳光正好，拍照一定会很好看',
];

const planTitles = [
  '甜蜜一日 · 浪漫约会',
  '心动时刻 · 专属行程',
  '爱的旅程 · 精心策划',
  '浓情蜜意 · 完美约会',
  '怦然心动 · 浪漫之旅',
  '缱绻时光 · 二人世界',
];

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function filterVenuesByPreferences(preferences: UserPreferences): Venue[] {
  const { relationshipStage, interests, budget } = preferences;
  
  return venues.filter(venue => {
    const isSuitableStage = venue.suitableFor.includes(relationshipStage);
    
    const venueBudget = budgetPriority[budget];
    const isBudgetMatch = venue.averageCost * 2 <= budgetRanges[budget].max;
    if (!isBudgetMatch && budgetPriority[budget] < 2) {
      return false;
    }
    
    const categoryMatch = interests.some(interest => {
      const interestMap: Record<string, string[]> = {
        '美食': ['restaurant', 'cafe'],
        '电影': ['cinema'],
        '户外': ['attraction', 'activity'],
        '文艺': ['attraction'],
        '运动': ['activity'],
        '探店': ['cafe', 'restaurant'],
        '手作': ['activity'],
        '拍照': ['attraction', 'activity'],
      };
      const types = interestMap[interest] || [];
      return types.includes(venue.type) || venue.category.includes(interest);
    });
    
    return isSuitableStage && (categoryMatch || interests.length === 0);
  });
}

function selectVenues(filteredVenues: Venue[], budget: string): {
  lunch: Venue;
  dinner: Venue;
  activities: Venue[];
} {
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

function generateActivities(
  lunch: Venue,
  dinner: Venue,
  activityVenues: Venue[],
  budget: string
): Activity[] {
  const activities: Activity[] = [];
  let currentTime = 11;
  
  const formatTime = (hour: number): string => {
    const h = Math.floor(hour);
    const m = Math.round((hour - h) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };
  
  const addActivity = (
    venue: Venue,
    type: 'dining' | 'activity',
    durationHours: number,
    tips?: string
  ) => {
    const activity: Activity = {
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      time: formatTime(currentTime),
      type,
      name: venue.name,
      description: venue.description,
      location: venue.address,
      duration: `${durationHours}小时`,
      cost: venue.averageCost * 2,
      image: venue.image,
      rating: venue.rating,
      tips,
    };
    
    if (activities.length > 0) {
      const prevActivity = activities[activities.length - 1];
      const transportMethods = ['地铁', '打车', '骑行', '步行'];
      const method = randomChoice(transportMethods);
      const duration = 20 + Math.floor(Math.random() * 30);
      
      activity.transport = {
        method,
        duration: `${duration}分钟`,
        description: `从「${prevActivity.name}」${method}前往，约${duration}分钟`,
      };
    }
    
    activities.push(activity);
    currentTime += durationHours;
  };
  
  addActivity(activityVenues[0], 'activity', 1.5, activityVenues[0].type === 'cafe' ? '推荐点一杯招牌咖啡搭配甜点' : undefined);
  currentTime = Math.max(currentTime, 12);
  
  addActivity(lunch, 'dining', 1.5, '建议提前电话预约，避免等位');
  currentTime = Math.max(currentTime, 14);
  
  if (activityVenues[1]) {
    const duration = activityVenues[1].type === 'cinema' ? 2 : 
                     activityVenues[1].type === 'activity' ? 2.5 : 1.5;
    addActivity(activityVenues[1], 'activity', duration);
  }
  
  currentTime = Math.max(currentTime, 17);
  
  if (activityVenues[2] && currentTime < 18) {
    addActivity(activityVenues[2], 'activity', 1);
  }
  
  currentTime = Math.max(currentTime, 18);
  
  addActivity(dinner, 'dining', 2, '这是今晚的重头戏，好好享受二人时光');
  
  return activities;
}

function selectSurprises(preferences: UserPreferences): string[] {
  const { relationshipStage, budget } = preferences;
  
  const suitableSurprises = surprises.filter(s => 
    s.suitableFor.includes(relationshipStage) && 
    s.budget.includes(budget)
  );
  
  const shuffled = shuffleArray(suitableSurprises);
  const count = Math.min(2, shuffled.length);
  
  return shuffled.slice(0, count).map(s => s.content);
}

function calculateTotalCost(activities: Activity[]): number {
  return activities.reduce((sum, act) => sum + act.cost, 0);
}

export function generateDatePlan(preferences: UserPreferences): DatePlan {
  const filteredVenues = filterVenuesByPreferences(preferences);
  const { lunch, dinner, activities: activityVenues } = selectVenues(filteredVenues, preferences.budget);
  const activities = generateActivities(lunch, dinner, activityVenues, preferences.budget);
  const selectedSurprises = selectSurprises(preferences);
  const estimatedCost = calculateTotalCost(activities);
  
  return {
    id: `plan-${Date.now()}`,
    createdAt: new Date().toISOString(),
    title: randomChoice(planTitles),
    totalBudget: budgetRanges[preferences.budget].label,
    estimatedCost,
    activities,
    surprises: selectedSurprises,
    weatherTip: randomChoice(weatherTips),
  };
}

export function savePlanToStorage(plan: DatePlan): void {
  try {
    const savedPlans = JSON.parse(localStorage.getItem('datePlans') || '[]');
    savedPlans.unshift(plan);
    if (savedPlans.length > 10) {
      savedPlans.pop();
    }
    localStorage.setItem('datePlans', JSON.stringify(savedPlans));
  } catch (e) {
    console.error('Failed to save plan:', e);
  }
}

export function getSavedPlans(): DatePlan[] {
  try {
    return JSON.parse(localStorage.getItem('datePlans') || '[]');
  } catch (e) {
    return [];
  }
}
