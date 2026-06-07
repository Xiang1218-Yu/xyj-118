import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { UserPreferences, Venue } from '../types';

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

async function loadWithMockVenues(mockVenues: Venue[]) {
  vi.resetModules();
  vi.doMock('../data/venues.json', () => ({ default: mockVenues }));
  const module = await import('../modules/venueSelector');
  return module;
}

describe('venueSelector - 场所筛选算法模块', () => {
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('filterVenuesByPreferences - 场所筛选核心算法', () => {
    it('应该筛选出适合当前恋爱阶段的场所', async () => {
      const venues = [
        createMockVenue({ id: 'v1', suitableFor: ['dating'] }),
        createMockVenue({ id: 'v2', suitableFor: ['passionate'] }),
        createMockVenue({ id: 'v3', suitableFor: ['stable', 'longterm'] }),
      ];

      const { filterVenuesByPreferences } = await loadWithMockVenues(venues);

      const preferences = createMockPreferences({
        relationshipStage: 'dating',
        interests: [],
      });

      const result = filterVenuesByPreferences(preferences);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('v1');
    });

    it('低预算应该严格过滤超出预算的场所', async () => {
      const venues = [
        createMockVenue({ id: 'v1', averageCost: 100, suitableFor: ['dating'] }),
        createMockVenue({ id: 'v2', averageCost: 300, suitableFor: ['dating'] }),
      ];

      const { filterVenuesByPreferences } = await loadWithMockVenues(venues);

      const preferences = createMockPreferences({
        relationshipStage: 'dating',
        budget: 'low',
        interests: [],
      });

      const result = filterVenuesByPreferences(preferences);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('v1');
      expect(result[0].averageCost * 2).toBeLessThanOrEqual(400);
    });

    it('高预算应该放宽预算限制', async () => {
      const venues = [
        createMockVenue({ id: 'v1', averageCost: 100, suitableFor: ['dating'] }),
        createMockVenue({ id: 'v2', averageCost: 3000, suitableFor: ['dating'] }),
      ];

      const { filterVenuesByPreferences } = await loadWithMockVenues(venues);

      const preferences = createMockPreferences({
        relationshipStage: 'dating',
        budget: 'high',
        interests: [],
      });

      const result = filterVenuesByPreferences(preferences);

      expect(result).toHaveLength(2);
    });

    it('luxury预算应该接受所有预算的场所', async () => {
      const venues = [
        createMockVenue({ id: 'v1', averageCost: 50, suitableFor: ['dating'] }),
        createMockVenue({ id: 'v2', averageCost: 5000, suitableFor: ['dating'] }),
      ];

      const { filterVenuesByPreferences } = await loadWithMockVenues(venues);

      const preferences = createMockPreferences({
        relationshipStage: 'dating',
        budget: 'luxury',
        interests: [],
      });

      const result = filterVenuesByPreferences(preferences);

      expect(result).toHaveLength(2);
    });

    it('应该根据兴趣爱好筛选场所类型', async () => {
      const venues = [
        createMockVenue({ id: 'v1', type: 'restaurant', suitableFor: ['dating'] }),
        createMockVenue({ id: 'v2', type: 'cinema', suitableFor: ['dating'] }),
        createMockVenue({ id: 'v3', type: 'attraction', suitableFor: ['dating'] }),
      ];

      const { filterVenuesByPreferences } = await loadWithMockVenues(venues);

      const preferences = createMockPreferences({
        relationshipStage: 'dating',
        interests: ['美食', '电影'],
      });

      const result = filterVenuesByPreferences(preferences);

      expect(result).toHaveLength(2);
      expect(result.map(v => v.id)).toContain('v1');
      expect(result.map(v => v.id)).toContain('v2');
    });

    it('应该根据兴趣爱好筛选场所分类', async () => {
      const venues = [
        createMockVenue({ id: 'v1', type: 'attraction', category: '运动', suitableFor: ['dating'] }),
        createMockVenue({ id: 'v2', type: 'attraction', category: '手作', suitableFor: ['dating'] }),
        createMockVenue({ id: 'v3', type: 'attraction', category: '其他', suitableFor: ['dating'] }),
      ];

      const { filterVenuesByPreferences } = await loadWithMockVenues(venues);

      const preferences = createMockPreferences({
        relationshipStage: 'dating',
        interests: ['运动'],
      });

      const result = filterVenuesByPreferences(preferences);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('v1');
    });

    it('没有兴趣爱好时应该返回所有适合阶段的场所', async () => {
      const venues = [
        createMockVenue({ id: 'v1', suitableFor: ['dating'] }),
        createMockVenue({ id: 'v2', suitableFor: ['dating'] }),
      ];

      const { filterVenuesByPreferences } = await loadWithMockVenues(venues);

      const preferences = createMockPreferences({
        relationshipStage: 'dating',
        interests: [],
      });

      const result = filterVenuesByPreferences(preferences);

      expect(result).toHaveLength(2);
    });

    it('兴趣爱好不匹配时应该返回空数组', async () => {
      const venues = [
        createMockVenue({ id: 'v1', type: 'restaurant', suitableFor: ['dating'] }),
      ];

      const { filterVenuesByPreferences } = await loadWithMockVenues(venues);

      const preferences = createMockPreferences({
        relationshipStage: 'dating',
        interests: ['运动'],
      });

      const result = filterVenuesByPreferences(preferences);

      expect(result).toHaveLength(0);
    });

    it('恋爱阶段不匹配时应该返回空数组', async () => {
      const venues = [
        createMockVenue({ id: 'v1', suitableFor: ['longterm'] }),
      ];

      const { filterVenuesByPreferences } = await loadWithMockVenues(venues);

      const preferences = createMockPreferences({
        relationshipStage: 'dating',
        interests: [],
      });

      const result = filterVenuesByPreferences(preferences);

      expect(result).toHaveLength(0);
    });

    it('应该同时满足多个筛选条件', async () => {
      const venues = [
        createMockVenue({
          id: 'v1',
          type: 'restaurant',
          averageCost: 100,
          suitableFor: ['dating'],
        }),
        createMockVenue({
          id: 'v2',
          type: 'restaurant',
          averageCost: 100,
          suitableFor: ['passionate'],
        }),
        createMockVenue({
          id: 'v3',
          type: 'cinema',
          averageCost: 100,
          suitableFor: ['dating'],
        }),
        createMockVenue({
          id: 'v4',
          type: 'restaurant',
          averageCost: 300,
          suitableFor: ['dating'],
        }),
      ];

      const { filterVenuesByPreferences } = await loadWithMockVenues(venues);

      const preferences = createMockPreferences({
        relationshipStage: 'dating',
        interests: ['美食'],
        budget: 'low',
      });

      const result = filterVenuesByPreferences(preferences);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('v1');
    });

    it('户外兴趣应该匹配景点和活动类型', async () => {
      const venues = [
        createMockVenue({ id: 'v1', type: 'attraction', suitableFor: ['dating'] }),
        createMockVenue({ id: 'v2', type: 'activity', suitableFor: ['dating'] }),
        createMockVenue({ id: 'v3', type: 'cinema', suitableFor: ['dating'] }),
      ];

      const { filterVenuesByPreferences } = await loadWithMockVenues(venues);

      const preferences = createMockPreferences({
        relationshipStage: 'dating',
        interests: ['户外'],
      });

      const result = filterVenuesByPreferences(preferences);

      expect(result).toHaveLength(2);
      expect(result.map(v => v.type)).toContain('attraction');
      expect(result.map(v => v.type)).toContain('activity');
    });

    it('探店兴趣应该匹配咖啡馆和餐厅', async () => {
      const venues = [
        createMockVenue({ id: 'v1', type: 'cafe', suitableFor: ['dating'] }),
        createMockVenue({ id: 'v2', type: 'restaurant', suitableFor: ['dating'] }),
        createMockVenue({ id: 'v3', type: 'cinema', suitableFor: ['dating'] }),
      ];

      const { filterVenuesByPreferences } = await loadWithMockVenues(venues);

      const preferences = createMockPreferences({
        relationshipStage: 'dating',
        interests: ['探店'],
      });

      const result = filterVenuesByPreferences(preferences);

      expect(result).toHaveLength(2);
      expect(result.map(v => v.type)).toContain('cafe');
      expect(result.map(v => v.type)).toContain('restaurant');
    });

    it('文艺兴趣应该匹配景点', async () => {
      const venues = [
        createMockVenue({ id: 'v1', type: 'attraction', suitableFor: ['dating'] }),
        createMockVenue({ id: 'v2', type: 'restaurant', suitableFor: ['dating'] }),
      ];

      const { filterVenuesByPreferences } = await loadWithMockVenues(venues);

      const preferences = createMockPreferences({
        relationshipStage: 'dating',
        interests: ['文艺'],
      });

      const result = filterVenuesByPreferences(preferences);

      expect(result).toHaveLength(1);
      expect(result[0].type).toBe('attraction');
    });

    it('运动兴趣应该匹配活动类型', async () => {
      const venues = [
        createMockVenue({ id: 'v1', type: 'activity', suitableFor: ['dating'] }),
        createMockVenue({ id: 'v2', type: 'restaurant', suitableFor: ['dating'] }),
      ];

      const { filterVenuesByPreferences } = await loadWithMockVenues(venues);

      const preferences = createMockPreferences({
        relationshipStage: 'dating',
        interests: ['运动'],
      });

      const result = filterVenuesByPreferences(preferences);

      expect(result).toHaveLength(1);
      expect(result[0].type).toBe('activity');
    });

    it('手作兴趣应该匹配活动类型', async () => {
      const venues = [
        createMockVenue({ id: 'v1', type: 'activity', category: '手作', suitableFor: ['dating'] }),
        createMockVenue({ id: 'v2', type: 'restaurant', suitableFor: ['dating'] }),
      ];

      const { filterVenuesByPreferences } = await loadWithMockVenues(venues);

      const preferences = createMockPreferences({
        relationshipStage: 'dating',
        interests: ['手作'],
      });

      const result = filterVenuesByPreferences(preferences);

      expect(result).toHaveLength(1);
      expect(result[0].category).toBe('手作');
    });

    it('拍照兴趣应该匹配景点和活动', async () => {
      const venues = [
        createMockVenue({ id: 'v1', type: 'attraction', suitableFor: ['dating'] }),
        createMockVenue({ id: 'v2', type: 'activity', suitableFor: ['dating'] }),
        createMockVenue({ id: 'v3', type: 'restaurant', suitableFor: ['dating'] }),
      ];

      const { filterVenuesByPreferences } = await loadWithMockVenues(venues);

      const preferences = createMockPreferences({
        relationshipStage: 'dating',
        interests: ['拍照'],
      });

      const result = filterVenuesByPreferences(preferences);

      expect(result).toHaveLength(2);
    });
  });

  describe('selectVenues - 场所选择算法', () => {
    it('应该正确选择午餐和晚餐餐厅', async () => {
      const venues = [
        createMockVenue({ id: 'r1', type: 'restaurant', name: '餐厅1' }),
        createMockVenue({ id: 'r2', type: 'restaurant', name: '餐厅2' }),
        createMockVenue({ id: 'c1', type: 'cafe', name: '咖啡馆1' }),
      ];

      const { selectVenues } = await loadWithMockVenues(venues);

      const result = selectVenues(venues, 'medium');

      expect(result.lunch).toBeDefined();
      expect(result.lunch.type).toBe('restaurant');
      expect(result.dinner).toBeDefined();
      expect(result.dinner.type).toBe('restaurant');
      expect(result.lunch.id).not.toBe(result.dinner.id);
    });

    it('午餐和晚餐应该是不同的餐厅（如果有多个选项）', async () => {
      const venues = [
        createMockVenue({ id: 'r1', type: 'restaurant', name: '餐厅1' }),
        createMockVenue({ id: 'r2', type: 'restaurant', name: '餐厅2' }),
      ];

      const { selectVenues } = await loadWithMockVenues(venues);

      const result = selectVenues(venues, 'medium');

      expect(result.lunch.id).not.toBe(result.dinner.id);
    });

    it('只有一个餐厅时午餐和晚餐应该相同', async () => {
      const venues = [
        createMockVenue({ id: 'r1', type: 'restaurant', name: '唯一餐厅' }),
      ];

      const { selectVenues } = await loadWithMockVenues(venues);

      const result = selectVenues(venues, 'medium');

      expect(result.lunch.id).toBe(result.dinner.id);
    });

    it('应该选择2-3个活动场所', async () => {
      const venues = [
        createMockVenue({ id: 'r1', type: 'restaurant' }),
        createMockVenue({ id: 'c1', type: 'cafe' }),
        createMockVenue({ id: 'a1', type: 'attraction' }),
        createMockVenue({ id: 'a2', type: 'activity' }),
        createMockVenue({ id: 'cin1', type: 'cinema' }),
      ];

      const { selectVenues } = await loadWithMockVenues(venues);

      const result = selectVenues(venues, 'medium');

      expect(result.activities.length).toBeGreaterThanOrEqual(2);
      expect(result.activities.length).toBeLessThanOrEqual(3);
    });

    it('活动场所不应该包含餐厅类型', async () => {
      const venues = [
        createMockVenue({ id: 'r1', type: 'restaurant' }),
        createMockVenue({ id: 'c1', type: 'cafe' }),
        createMockVenue({ id: 'a1', type: 'attraction' }),
      ];

      const { selectVenues } = await loadWithMockVenues(venues);

      const result = selectVenues(venues, 'medium');

      result.activities.forEach(activity => {
        expect(activity.type).not.toBe('restaurant');
      });
    });

    it('活动场所不足时应该使用回退机制', async () => {
      const venues = [
        createMockVenue({ id: 'r1', type: 'restaurant', suitableFor: ['dating'] }),
        createMockVenue({ id: 'r2', type: 'restaurant', suitableFor: ['dating'] }),
        createMockVenue({ id: 'r3', type: 'restaurant', suitableFor: ['dating'] }),
        createMockVenue({ id: 'r4', type: 'restaurant', suitableFor: ['dating'] }),
      ];

      const { selectVenues } = await loadWithMockVenues(venues);

      const result = selectVenues(venues, 'medium');

      expect(result.activities.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('getAllVenues - 获取所有场所', () => {
    it('应该返回所有场所', async () => {
      const venues = [
        createMockVenue({ id: 'v1' }),
        createMockVenue({ id: 'v2' }),
      ];

      const { getAllVenues } = await loadWithMockVenues(venues);

      const result = getAllVenues();
      expect(result).toHaveLength(2);
    });
  });

  describe('getVenuesByType - 按类型获取场所', () => {
    it('应该返回指定类型的场所', async () => {
      const venues = [
        createMockVenue({ id: 'v1', type: 'restaurant' }),
        createMockVenue({ id: 'v2', type: 'cafe' }),
        createMockVenue({ id: 'v3', type: 'restaurant' }),
      ];

      const { getVenuesByType } = await loadWithMockVenues(venues);

      const result = getVenuesByType('restaurant');

      expect(result).toHaveLength(2);
      result.forEach(v => expect(v.type).toBe('restaurant'));
    });

    it('没有匹配类型时应该返回空数组', async () => {
      const venues = [
        createMockVenue({ id: 'v1', type: 'restaurant' }),
      ];

      const { getVenuesByType } = await loadWithMockVenues(venues);

      const result = getVenuesByType('cinema');

      expect(result).toHaveLength(0);
    });
  });
});
