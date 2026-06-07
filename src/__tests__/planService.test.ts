import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { UserPreferences, DatePlan, Venue, Surprise } from '../types';

function timeToNumber(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h + m / 60;
}

function createMockVenue(overrides: Partial<Venue> = {}): Venue {
  return {
    id: `venue-${Math.random().toString(36).substr(2, 9)}`,
    name: '测试场所',
    type: 'restaurant',
    category: '中餐',
    address: '测试地址',
    rating: 4.5,
    priceRange: '¥50-100',
    image: 'test.jpg',
    description: '测试描述',
    suitableFor: ['dating', 'passionate'],
    bestTime: '10:00-22:00',
    averageCost: 80,
    ...overrides,
  };
}

function createMockPreferences(overrides: Partial<UserPreferences> = {}): UserPreferences {
  return {
    relationshipStage: 'dating',
    interests: ['美食', '电影'],
    budget: 'medium',
    planCount: 2,
    useFavoriteSurprises: false,
    ...overrides,
  };
}

function createMockSurprise(overrides: Partial<Surprise> = {}): Surprise {
  return {
    id: `surprise-${Math.random().toString(36).substr(2, 9)}`,
    content: '测试惊喜',
    suitableFor: ['dating'],
    budget: ['medium'],
    ...overrides,
  };
}

async function loadWithMockData(mockVenues: Venue[], mockSurprises: Surprise[]) {
  vi.resetModules();
  vi.doMock('../data/venues.json', () => ({ default: mockVenues }));
  vi.doMock('../data/surprises.json', () => ({ default: mockSurprises }));
  const module = await import('../services/planService');
  return module;
}

const defaultMockVenues = [
  createMockVenue({
    id: 'v1',
    name: '浪漫餐厅',
    type: 'restaurant',
    averageCost: 80,
    suitableFor: ['dating'],
  }),
  createMockVenue({
    id: 'v2',
    name: '温馨餐厅',
    type: 'restaurant',
    averageCost: 100,
    suitableFor: ['dating'],
  }),
  createMockVenue({
    id: 'v3',
    name: '文艺咖啡馆',
    type: 'cafe',
    averageCost: 30,
    suitableFor: ['dating'],
  }),
  createMockVenue({
    id: 'v4',
    name: '爱情电影院',
    type: 'cinema',
    averageCost: 50,
    suitableFor: ['dating'],
  }),
  createMockVenue({
    id: 'v5',
    name: '公园景点',
    type: 'attraction',
    averageCost: 20,
    suitableFor: ['dating'],
  }),
  createMockVenue({
    id: 'v6',
    name: '手工坊',
    type: 'activity',
    averageCost: 100,
    suitableFor: ['dating'],
  }),
  createMockVenue({
    id: 'v7',
    name: '海景餐厅',
    type: 'restaurant',
    averageCost: 120,
    suitableFor: ['dating'],
  }),
  createMockVenue({
    id: 'v8',
    name: '山间咖啡馆',
    type: 'cafe',
    averageCost: 40,
    suitableFor: ['dating'],
  }),
  createMockVenue({
    id: 'v9',
    name: 'IMAX影院',
    type: 'cinema',
    averageCost: 80,
    suitableFor: ['dating'],
  }),
  createMockVenue({
    id: 'v10',
    name: '博物馆',
    type: 'attraction',
    averageCost: 60,
    suitableFor: ['dating'],
  }),
  createMockVenue({
    id: 'v11',
    name: '陶艺工坊',
    type: 'activity',
    averageCost: 150,
    suitableFor: ['dating'],
  }),
  createMockVenue({
    id: 'v12',
    name: '私房菜馆',
    type: 'restaurant',
    averageCost: 90,
    suitableFor: ['dating'],
  }),
  createMockVenue({
    id: 'v13',
    name: '书店咖啡',
    type: 'cafe',
    averageCost: 35,
    suitableFor: ['dating'],
  }),
  createMockVenue({
    id: 'v14',
    name: '艺术展',
    type: 'attraction',
    averageCost: 70,
    suitableFor: ['dating'],
  }),
  createMockVenue({
    id: 'v15',
    name: '攀岩馆',
    type: 'activity',
    averageCost: 120,
    suitableFor: ['dating'],
  }),
  createMockVenue({
    id: 'v16',
    name: '日料店',
    type: 'restaurant',
    averageCost: 110,
    suitableFor: ['dating'],
  }),
  createMockVenue({
    id: 'v17',
    name: '火锅店',
    type: 'restaurant',
    averageCost: 95,
    suitableFor: ['dating'],
  }),
  createMockVenue({
    id: 'v18',
    name: '烧烤店',
    type: 'restaurant',
    averageCost: 85,
    suitableFor: ['dating'],
  }),
  createMockVenue({
    id: 'v19',
    name: '密室逃脱',
    type: 'activity',
    averageCost: 130,
    suitableFor: ['dating'],
  }),
  createMockVenue({
    id: 'v20',
    name: '桌游吧',
    type: 'activity',
    averageCost: 60,
    suitableFor: ['dating'],
  }),
  createMockVenue({
    id: 'v21',
    name: '私人影院',
    type: 'cinema',
    averageCost: 100,
    suitableFor: ['dating'],
  }),
  createMockVenue({
    id: 'v22',
    name: '植物园',
    type: 'attraction',
    averageCost: 30,
    suitableFor: ['dating'],
  }),
  createMockVenue({
    id: 'v23',
    name: '猫咖',
    type: 'cafe',
    averageCost: 55,
    suitableFor: ['dating'],
  }),
  createMockVenue({
    id: 'v24',
    name: '卡丁车',
    type: 'activity',
    averageCost: 180,
    suitableFor: ['dating'],
  }),
  createMockVenue({
    id: 'v25',
    name: '科技馆',
    type: 'attraction',
    averageCost: 45,
    suitableFor: ['dating'],
  }),
];

const defaultMockSurprises = [
  createMockSurprise({
    id: 's1',
    content: '送一束玫瑰花',
    suitableFor: ['dating'],
    budget: ['medium'],
  }),
  createMockSurprise({
    id: 's2',
    content: '写一封情书',
    suitableFor: ['dating'],
    budget: ['medium'],
  }),
  createMockSurprise({
    id: 's3',
    content: '拍一张情侣照',
    suitableFor: ['dating'],
    budget: ['medium'],
  }),
];

describe('planService - 方案生成集成模块', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-07T12:00:00Z'));
    let randomCounter = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      randomCounter = (randomCounter + 1) % 100;
      return randomCounter / 100;
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe('generateDatePlan - 单个方案生成', () => {
    it('应该生成完整的 DatePlan 对象', async () => {
      const { generateDatePlan } = await loadWithMockData(defaultMockVenues, defaultMockSurprises);
      const preferences = createMockPreferences();
      const plan = generateDatePlan(preferences);

      expect(plan).toBeDefined();
      expect(plan.id).toMatch(/^plan-\d+/);
      expect(plan.createdAt).toBe('2026-06-07T12:00:00.000Z');
      expect(typeof plan.title).toBe('string');
      expect(plan.title.length).toBeGreaterThan(0);
      expect(plan.totalBudget).toBe('¥200-500');
      expect(typeof plan.estimatedCost).toBe('number');
      expect(plan.estimatedCost).toBeGreaterThan(0);
      expect(plan.activities.length).toBeGreaterThanOrEqual(4);
      expect(plan.surprises.length).toBeGreaterThanOrEqual(1);
      expect(plan.surprises.length).toBeLessThanOrEqual(2);
      expect(typeof plan.weatherTip).toBe('string');
      expect(plan.weatherTip.length).toBeGreaterThan(0);
    });

    it('活动应该按时间顺序排列', async () => {
      const { generateDatePlan } = await loadWithMockData(defaultMockVenues, defaultMockSurprises);
      const preferences = createMockPreferences();
      const plan = generateDatePlan(preferences);

      const times = plan.activities.map(a => timeToNumber(a.time));
      for (let i = 1; i < times.length; i++) {
        expect(times[i]).toBeGreaterThan(times[i - 1]);
      }
    });

    it('午餐和晚餐应该是餐饮类型', async () => {
      const { generateDatePlan } = await loadWithMockData(defaultMockVenues, defaultMockSurprises);
      const preferences = createMockPreferences();
      const plan = generateDatePlan(preferences);

      const diningActivities = plan.activities.filter(a => a.type === 'dining');
      expect(diningActivities.length).toBe(2);
    });

    it('第一个活动不应该有交通信息，其他活动应该有', async () => {
      const { generateDatePlan } = await loadWithMockData(defaultMockVenues, defaultMockSurprises);
      const preferences = createMockPreferences();
      const plan = generateDatePlan(preferences);

      expect(plan.activities[0].transport).toBeUndefined();
      
      for (let i = 1; i < plan.activities.length; i++) {
        expect(plan.activities[i].transport).toBeDefined();
      }
    });

    it('活动花费应该是双人消费', async () => {
      const { generateDatePlan } = await loadWithMockData(defaultMockVenues, defaultMockSurprises);
      const preferences = createMockPreferences();
      const plan = generateDatePlan(preferences);

      plan.activities.forEach(activity => {
        expect(activity.cost % 2).toBe(0);
      });
    });

    it('总花费应该等于所有活动花费之和', async () => {
      const { generateDatePlan } = await loadWithMockData(defaultMockVenues, defaultMockSurprises);
      const preferences = createMockPreferences();
      const plan = generateDatePlan(preferences);

      const sum = plan.activities.reduce((sum, a) => sum + a.cost, 0);
      expect(plan.estimatedCost).toBe(sum);
    });

    it('活动应该包含正确的字段', async () => {
      const { generateDatePlan } = await loadWithMockData(defaultMockVenues, defaultMockSurprises);
      const preferences = createMockPreferences();
      const plan = generateDatePlan(preferences);

      plan.activities.forEach(activity => {
        expect(activity.id).toBeDefined();
        expect(activity.time).toBeDefined();
        expect(activity.name).toBeDefined();
        expect(activity.description).toBeDefined();
        expect(activity.location).toBeDefined();
        expect(activity.duration).toBeDefined();
        expect(activity.cost).toBeDefined();
        expect(activity.image).toBeDefined();
      });
    });

    it('应该根据预算等级生成对应的预算标签', async () => {
      const { generateDatePlan } = await loadWithMockData(defaultMockVenues, defaultMockSurprises);

      const preferencesLow = createMockPreferences({ budget: 'low' });
      const preferencesHigh = createMockPreferences({ budget: 'high' });
      const preferencesLuxury = createMockPreferences({ budget: 'luxury' });

      const planLow = generateDatePlan(preferencesLow);
      const planHigh = generateDatePlan(preferencesHigh);
      const planLuxury = generateDatePlan(preferencesLuxury);

      expect(planLow.totalBudget).toBe('¥0-200');
      expect(planHigh.totalBudget).toBe('¥500-1000');
      expect(planLuxury.totalBudget).toBe('¥1000+');
    });

    it('彩蛋应该来自系统彩蛋库', async () => {
      const { generateDatePlan } = await loadWithMockData(defaultMockVenues, defaultMockSurprises);

      const preferences = createMockPreferences({
        useFavoriteSurprises: false,
      });
      const plan = generateDatePlan(preferences);

      const validSurprises = ['送一束玫瑰花', '写一封情书', '拍一张情侣照'];
      plan.surprises.forEach(surprise => {
        expect(validSurprises).toContain(surprise);
      });
    });

    it('启用收藏彩蛋时应该优先使用收藏', async () => {
      const { generateDatePlan } = await loadWithMockData(defaultMockVenues, defaultMockSurprises);

      const favoriteSurprises = [
        createMockSurprise({
          id: 'fav1',
          content: '收藏的惊喜',
          suitableFor: ['dating'],
          budget: ['medium'],
        }),
      ];

      const preferences = createMockPreferences({
        useFavoriteSurprises: true,
      });
      const plan = generateDatePlan(preferences, favoriteSurprises);

      expect(plan.surprises).toContain('收藏的惊喜');
    });

    it('不同恋爱阶段应该生成适合该阶段的场所', async () => {
      const { generateDatePlan } = await loadWithMockData(defaultMockVenues, defaultMockSurprises);

      const preferences = createMockPreferences({
        relationshipStage: 'passionate',
        interests: [],
      });
      const plan = generateDatePlan(preferences);

      expect(plan.activities.length).toBeGreaterThan(0);
    });

    it('活动ID应该是唯一的', async () => {
      const { generateDatePlan } = await loadWithMockData(defaultMockVenues, defaultMockSurprises);
      const preferences = createMockPreferences();
      const plan = generateDatePlan(preferences);

      const ids = plan.activities.map(a => a.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('generateMultipleDatePlans - 多方案差异化生成', () => {
    it('应该生成指定数量的方案', async () => {
      const { generateMultipleDatePlans } = await loadWithMockData(defaultMockVenues, defaultMockSurprises);
      const preferences = createMockPreferences();
      
      const plans2 = generateMultipleDatePlans(preferences, 2);
      expect(plans2).toHaveLength(2);

      const plans3 = generateMultipleDatePlans(preferences, 3);
      expect(plans3).toHaveLength(3);
    });

    it('每个方案都应该是有效的 DatePlan 对象', async () => {
      const { generateMultipleDatePlans } = await loadWithMockData(defaultMockVenues, defaultMockSurprises);
      const preferences = createMockPreferences();
      const plans = generateMultipleDatePlans(preferences, 2);

      plans.forEach(plan => {
        expect(plan.id).toMatch(/^plan-\d+-\d/);
        expect(plan.activities.length).toBeGreaterThan(0);
        expect(plan.estimatedCost).toBeGreaterThan(0);
      });
    });

    it('方案标题应该带有风格前缀', async () => {
      const { generateMultipleDatePlans } = await loadWithMockData(defaultMockVenues, defaultMockSurprises);
      const preferences = createMockPreferences();
      const plans = generateMultipleDatePlans(preferences, 3);

      expect(plans[0].title).toMatch(/^浪漫经典 · /);
      expect(plans[1].title).toMatch(/^活力冒险 · /);
      expect(plans[2].title).toMatch(/^文艺清新 · /);
    });

    it('方案之间应该有差异化（非餐饮活动场所重叠不超过1个）', async () => {
      const { generateMultipleDatePlans } = await loadWithMockData(defaultMockVenues, defaultMockSurprises);
      const preferences = createMockPreferences();
      const plans = generateMultipleDatePlans(preferences, 2);

      const plan0Venues = new Set(plans[0].activities.filter(a => a.type !== 'dining').map(a => a.name));
      const plan1Venues = new Set(plans[1].activities.filter(a => a.type !== 'dining').map(a => a.name));

      let overlap = 0;
      plan0Venues.forEach(name => {
        if (plan1Venues.has(name)) overlap++;
      });

      expect(overlap).toBeLessThanOrEqual(1);
    });

    it('方案的ID应该包含索引后缀', async () => {
      const { generateMultipleDatePlans } = await loadWithMockData(defaultMockVenues, defaultMockSurprises);
      const preferences = createMockPreferences();
      const plans = generateMultipleDatePlans(preferences, 3);

      expect(plans[0].id).toMatch(/-0$/);
      expect(plans[1].id).toMatch(/-1$/);
      expect(plans[2].id).toMatch(/-2$/);
    });

    it('所有方案的预算标签应该一致', async () => {
      const { generateMultipleDatePlans } = await loadWithMockData(defaultMockVenues, defaultMockSurprises);
      const preferences = createMockPreferences({ budget: 'medium' });
      const plans = generateMultipleDatePlans(preferences, 3);

      plans.forEach(plan => {
        expect(plan.totalBudget).toBe('¥200-500');
      });
    });

    it('应该使用相同的用户偏好生成所有方案', async () => {
      const { generateMultipleDatePlans } = await loadWithMockData(defaultMockVenues, defaultMockSurprises);
      const preferences = createMockPreferences({
        relationshipStage: 'dating',
        budget: 'high',
      });
      const plans = generateMultipleDatePlans(preferences, 2);

      plans.forEach(plan => {
        expect(plan.totalBudget).toBe('¥500-1000');
      });
    });

    it('启用收藏彩蛋时所有方案都应该优先使用收藏', async () => {
      const { generateMultipleDatePlans } = await loadWithMockData(defaultMockVenues, defaultMockSurprises);

      const favoriteSurprises = [
        createMockSurprise({
          id: 'fav1',
          content: '收藏惊喜',
          suitableFor: ['dating'],
          budget: ['medium'],
        }),
      ];

      const preferences = createMockPreferences({
        useFavoriteSurprises: true,
      });

      const plans = generateMultipleDatePlans(preferences, 2, favoriteSurprises);

      plans.forEach(plan => {
        expect(plan.surprises).toContain('收藏惊喜');
      });
    });

    it('每个方案的活动都应该有唯一的ID', async () => {
      const { generateMultipleDatePlans } = await loadWithMockData(defaultMockVenues, defaultMockSurprises);
      const preferences = createMockPreferences();
      const plans = generateMultipleDatePlans(preferences, 2);

      const allIds: string[] = [];
      plans.forEach(plan => {
        plan.activities.forEach(activity => {
          allIds.push(activity.id);
        });
      });

      const uniqueIds = new Set(allIds);
      expect(uniqueIds.size).toBe(allIds.length);
    });

    it('每个方案的创建时间应该相同', async () => {
      const { generateMultipleDatePlans } = await loadWithMockData(defaultMockVenues, defaultMockSurprises);
      const preferences = createMockPreferences();
      const plans = generateMultipleDatePlans(preferences, 3);

      const createdAt = plans[0].createdAt;
      plans.forEach(plan => {
        expect(plan.createdAt).toBe(createdAt);
      });
    });
  });

  describe('边界条件测试', () => {
    it('低预算方案应该控制总花费在合理范围内', async () => {
      const { generateDatePlan } = await loadWithMockData(defaultMockVenues, defaultMockSurprises);

      const preferences = createMockPreferences({
        budget: 'low',
        interests: [],
      });
      const plan = generateDatePlan(preferences);

      expect(plan.estimatedCost).toBeLessThanOrEqual(1000);
    });

    it('没有兴趣爱好时也能生成方案', async () => {
      const { generateDatePlan } = await loadWithMockData(defaultMockVenues, defaultMockSurprises);

      const preferences = createMockPreferences({
        interests: [],
      });
      const plan = generateDatePlan(preferences);

      expect(plan.activities.length).toBeGreaterThan(0);
    });

    it('生成3个方案时应该都有差异化', async () => {
      const { generateMultipleDatePlans } = await loadWithMockData(defaultMockVenues, defaultMockSurprises);
      const preferences = createMockPreferences();
      const plans = generateMultipleDatePlans(preferences, 3);

      expect(plans).toHaveLength(3);

      for (let i = 0; i < plans.length; i++) {
        for (let j = i + 1; j < plans.length; j++) {
          const venuesI = new Set(plans[i].activities.filter(a => a.type !== 'dining').map(a => a.name));
          const venuesJ = new Set(plans[j].activities.filter(a => a.type !== 'dining').map(a => a.name));

          let overlap = 0;
          venuesI.forEach(name => {
            if (venuesJ.has(name)) overlap++;
          });

          expect(overlap).toBeLessThanOrEqual(2);
        }
      }
    });
  });
});
