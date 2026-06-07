import type { Activity } from '../types';

export const budgetRanges = {
  low: { min: 0, max: 400, label: '¥0-200' },
  medium: { min: 400, max: 1000, label: '¥200-500' },
  high: { min: 1000, max: 2000, label: '¥500-1000' },
  luxury: { min: 2000, max: 99999, label: '¥1000+' },
};

export const budgetPriority: Record<string, number> = {
  low: 0,
  medium: 1,
  high: 2,
  luxury: 3,
};

export const weatherTips = [
  '今天天气晴朗，适合户外活动，记得涂防晒哦～',
  '今天微风习习，最适合散步漫游了',
  '今天有点小冷，出门记得多穿一件外套',
  '今天可能会下雨，记得带伞，雨天也有别样浪漫',
  '今天阳光正好，拍照一定会很好看',
];

export const planTitles = [
  '甜蜜一日 · 浪漫约会',
  '心动时刻 · 专属行程',
  '爱的旅程 · 精心策划',
  '浓情蜜意 · 完美约会',
  '怦然心动 · 浪漫之旅',
  '缱绻时光 · 二人世界',
];

const styleAdjectives = [
  '浪漫经典',
  '活力冒险',
  '文艺清新',
  '温馨舒适',
  '奢华尊享',
  '创意独特',
];

export function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function formatTime(hour: number): string {
  const h = Math.floor(hour);
  const m = Math.round((hour - h) * 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export function generateActivityId(): string {
  return `act-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function generatePlanId(index?: number): string {
  return index !== undefined ? `plan-${Date.now()}-${index}` : `plan-${Date.now()}`;
}

export function calculateTotalCost(activities: Activity[]): number {
  return activities.reduce((sum, act) => sum + act.cost, 0);
}

export function getPlanTitleWithStyle(baseTitle: string, index: number,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  total: number
): string {
  const adj = styleAdjectives[index % styleAdjectives.length];
  return `${adj} · ${baseTitle.replace(/^.*·\s*/, '')}`;
}

export const interestToVenueTypes: Record<string, string[]> = {
  '美食': ['restaurant', 'cafe'],
  '电影': ['cinema'],
  '户外': ['attraction', 'activity'],
  '文艺': ['attraction'],
  '运动': ['activity'],
  '探店': ['cafe', 'restaurant'],
  '手作': ['activity'],
  '拍照': ['attraction', 'activity'],
};

export const transportMethods = ['地铁', '打车', '骑行', '步行'];
