import type { Activity, Venue } from '../types';
import {
  formatTime,
  generateActivityId,
  randomChoice,
  transportMethods,
} from '../utils/planUtils';

export interface ActivityBuildParams {
  venue: Venue;
  type: 'dining' | 'activity';
  durationHours: number;
  tips?: string;
  time: string;
  prevActivity?: Activity;
}

export function buildActivity(params: ActivityBuildParams): Activity {
  const { venue, type, durationHours, tips, time, prevActivity } = params;

  const activity: Activity = {
    id: generateActivityId(),
    time,
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

  if (prevActivity) {
    const method = randomChoice(transportMethods);
    const duration = 20 + Math.floor(Math.random() * 30);

    activity.transport = {
      method,
      duration: `${duration}分钟`,
      description: `从「${prevActivity.name}」${method}前往，约${duration}分钟`,
    };
  }

  return activity;
}

export function getActivityDuration(venueType: Venue['type']): number {
  switch (venueType) {
    case 'cinema':
      return 2;
    case 'activity':
      return 2.5;
    case 'restaurant':
      return 1.5;
    case 'cafe':
      return 1.5;
    default:
      return 1.5;
  }
}

export function generateActivities(
  lunch: Venue,
  dinner: Venue,
  activityVenues: Venue[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  budget: string
): Activity[] {
  const activities: Activity[] = [];
  let currentTime = 11;

  const addActivity = (
    venue: Venue,
    type: 'dining' | 'activity',
    durationHours: number,
    tips?: string
  ) => {
    const activity = buildActivity({
      venue,
      type,
      durationHours,
      tips,
      time: formatTime(currentTime),
      prevActivity: activities[activities.length - 1],
    });

    activities.push(activity);
    currentTime += durationHours;
  };

  addActivity(
    activityVenues[0],
    'activity',
    1.5,
    activityVenues[0].type === 'cafe' ? '推荐点一杯招牌咖啡搭配甜点' : undefined
  );
  currentTime = Math.max(currentTime, 12);

  addActivity(lunch, 'dining', 1.5, '建议提前电话预约，避免等位');
  currentTime = Math.max(currentTime, 14);

  if (activityVenues[1]) {
    const duration = getActivityDuration(activityVenues[1].type);
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
