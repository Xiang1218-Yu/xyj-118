import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { UserPreferences, Surprise } from '../types';

function createMockSurprise(overrides: Partial<Surprise> = {}): Surprise {
  return {
    id: `surprise-${Math.random().toString(36).substr(2, 9)}`,
    content: '测试惊喜内容',
    suitableFor: ['dating', 'passionate'],
    budget: ['low', 'medium'],
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

async function loadWithMockSurprises(mockSurprises: Surprise[]) {
  vi.resetModules();
  vi.doMock('../data/surprises.json', () => ({ default: mockSurprises }));
  const module = await import('../modules/surpriseSelector');
  return module;
}

describe('surpriseSelector - 彩蛋筛选算法模块', () => {
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('filterSurprisesByPreferences - 彩蛋筛选核心算法', () => {
    it('应该筛选出适合当前恋爱阶段的彩蛋', async () => {
      const surprises = [
        createMockSurprise({ id: 's1', suitableFor: ['dating'] }),
        createMockSurprise({ id: 's2', suitableFor: ['passionate'] }),
        createMockSurprise({ id: 's3', suitableFor: ['stable', 'longterm'] }),
      ];

      const { filterSurprisesByPreferences } = await loadWithMockSurprises(surprises);

      const preferences = createMockPreferences({
        relationshipStage: 'dating',
      });

      const result = filterSurprisesByPreferences(surprises, preferences);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('s1');
    });

    it('应该筛选出适合当前预算的彩蛋', async () => {
      const surprises = [
        createMockSurprise({ id: 's1', budget: ['low', 'medium'] }),
        createMockSurprise({ id: 's2', budget: ['high', 'luxury'] }),
      ];

      const { filterSurprisesByPreferences } = await loadWithMockSurprises(surprises);

      const preferences = createMockPreferences({
        budget: 'low',
      });

      const result = filterSurprisesByPreferences(surprises, preferences);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('s1');
    });

    it('应该同时满足恋爱阶段和预算条件', async () => {
      const surprises = [
        createMockSurprise({
          id: 's1',
          suitableFor: ['dating'],
          budget: ['low'],
        }),
        createMockSurprise({
          id: 's2',
          suitableFor: ['dating'],
          budget: ['high'],
        }),
        createMockSurprise({
          id: 's3',
          suitableFor: ['longterm'],
          budget: ['low'],
        }),
      ];

      const { filterSurprisesByPreferences } = await loadWithMockSurprises(surprises);

      const preferences = createMockPreferences({
        relationshipStage: 'dating',
        budget: 'low',
      });

      const result = filterSurprisesByPreferences(surprises, preferences);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('s1');
    });

    it('彩蛋适合多个阶段时应该正确匹配', async () => {
      const surprises = [
        createMockSurprise({
          id: 's1',
          suitableFor: ['dating', 'passionate', 'stable'],
          budget: ['medium'],
        }),
      ];

      const { filterSurprisesByPreferences } = await loadWithMockSurprises(surprises);

      const preferences1 = createMockPreferences({ relationshipStage: 'dating' });
      const preferences2 = createMockPreferences({ relationshipStage: 'passionate' });
      const preferences3 = createMockPreferences({ relationshipStage: 'stable' });

      expect(filterSurprisesByPreferences(surprises, preferences1)).toHaveLength(1);
      expect(filterSurprisesByPreferences(surprises, preferences2)).toHaveLength(1);
      expect(filterSurprisesByPreferences(surprises, preferences3)).toHaveLength(1);
    });

    it('彩蛋适合多个预算时应该正确匹配', async () => {
      const surprises = [
        createMockSurprise({
          id: 's1',
          suitableFor: ['dating'],
          budget: ['low', 'medium', 'high'],
        }),
      ];

      const { filterSurprisesByPreferences } = await loadWithMockSurprises(surprises);

      const preferences1 = createMockPreferences({ budget: 'low' });
      const preferences2 = createMockPreferences({ budget: 'medium' });
      const preferences3 = createMockPreferences({ budget: 'high' });

      expect(filterSurprisesByPreferences(surprises, preferences1)).toHaveLength(1);
      expect(filterSurprisesByPreferences(surprises, preferences2)).toHaveLength(1);
      expect(filterSurprisesByPreferences(surprises, preferences3)).toHaveLength(1);
    });

    it('没有匹配项时应该返回空数组', async () => {
      const surprises = [
        createMockSurprise({
          id: 's1',
          suitableFor: ['longterm'],
          budget: ['luxury'],
        }),
      ];

      const { filterSurprisesByPreferences } = await loadWithMockSurprises(surprises);

      const preferences = createMockPreferences({
        relationshipStage: 'dating',
        budget: 'low',
      });

      const result = filterSurprisesByPreferences(surprises, preferences);

      expect(result).toHaveLength(0);
    });

    it('空数组输入应该返回空数组', async () => {
      const { filterSurprisesByPreferences } = await loadWithMockSurprises([]);
      const preferences = createMockPreferences();
      const result = filterSurprisesByPreferences([], preferences);

      expect(result).toHaveLength(0);
    });
  });

  describe('selectSurprises - 彩蛋选择算法', () => {
    it('应该从系统彩蛋库中随机选择1-2个', async () => {
      const mockSurprises = [
        createMockSurprise({
          id: 'sys1',
          content: '系统惊喜1',
          suitableFor: ['dating', 'passionate'],
          budget: ['low', 'medium', 'high', 'luxury'],
        }),
        createMockSurprise({
          id: 'sys2',
          content: '系统惊喜2',
          suitableFor: ['dating', 'passionate'],
          budget: ['low', 'medium', 'high', 'luxury'],
        }),
        createMockSurprise({
          id: 'sys3',
          content: '系统惊喜3',
          suitableFor: ['dating', 'passionate'],
          budget: ['low', 'medium', 'high', 'luxury'],
        }),
      ];

      const { selectSurprises } = await loadWithMockSurprises(mockSurprises);

      const preferences = createMockPreferences({
        useFavoriteSurprises: false,
      });

      const result = selectSurprises(preferences);

      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(result.length).toBeLessThanOrEqual(2);
      result.forEach(content => {
        expect(typeof content).toBe('string');
        expect(content.length).toBeGreaterThan(0);
      });
    });

    it('启用收藏彩蛋且有符合条件的收藏时，应该优先使用收藏', async () => {
      const mockSurprises = [
        createMockSurprise({
          id: 'sys1',
          content: '系统惊喜1',
          suitableFor: ['dating'],
          budget: ['medium'],
        }),
      ];

      const { selectSurprises } = await loadWithMockSurprises(mockSurprises);

      const favoriteSurprises = [
        createMockSurprise({
          id: 'fav1',
          content: '收藏惊喜1',
          suitableFor: ['dating'],
          budget: ['medium'],
        }),
        createMockSurprise({
          id: 'fav2',
          content: '收藏惊喜2',
          suitableFor: ['dating'],
          budget: ['medium'],
        }),
      ];

      const preferences = createMockPreferences({
        relationshipStage: 'dating',
        budget: 'medium',
        useFavoriteSurprises: true,
      });

      const result = selectSurprises(preferences, favoriteSurprises);

      expect(result).toContain('收藏惊喜1');
      expect(result).toContain('收藏惊喜2');
    });

    it('启用收藏彩蛋但没有符合条件的收藏时，应该回退到系统彩蛋', async () => {
      const mockSurprises = [
        createMockSurprise({
          id: 'sys1',
          content: '系统惊喜1',
          suitableFor: ['dating'],
          budget: ['medium'],
        }),
      ];

      const { selectSurprises } = await loadWithMockSurprises(mockSurprises);

      const favoriteSurprises = [
        createMockSurprise({
          id: 'fav1',
          content: '收藏惊喜',
          suitableFor: ['longterm'],
          budget: ['luxury'],
        }),
      ];

      const preferences = createMockPreferences({
        relationshipStage: 'dating',
        budget: 'medium',
        useFavoriteSurprises: true,
      });

      const result = selectSurprises(preferences, favoriteSurprises);

      expect(result).toContain('系统惊喜1');
    });

    it('启用收藏彩蛋但收藏数组为空时，应该使用系统彩蛋', async () => {
      const mockSurprises = [
        createMockSurprise({
          id: 'sys1',
          content: '系统惊喜1',
          suitableFor: ['dating'],
          budget: ['medium'],
        }),
      ];

      const { selectSurprises } = await loadWithMockSurprises(mockSurprises);

      const preferences = createMockPreferences({
        useFavoriteSurprises: true,
      });

      const result = selectSurprises(preferences, []);

      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toMatch(/^系统惊喜/);
    });

    it('启用收藏彩蛋但未提供收藏参数时，应该使用系统彩蛋', async () => {
      const mockSurprises = [
        createMockSurprise({
          id: 'sys1',
          content: '系统惊喜1',
          suitableFor: ['dating'],
          budget: ['medium'],
        }),
      ];

      const { selectSurprises } = await loadWithMockSurprises(mockSurprises);

      const preferences = createMockPreferences({
        useFavoriteSurprises: true,
      });

      const result = selectSurprises(preferences);

      expect(result.length).toBeGreaterThan(0);
    });

    it('禁用收藏彩蛋时应该忽略收藏参数', async () => {
      const mockSurprises = [
        createMockSurprise({
          id: 'sys1',
          content: '系统惊喜1',
          suitableFor: ['dating'],
          budget: ['medium'],
        }),
      ];

      const { selectSurprises } = await loadWithMockSurprises(mockSurprises);

      const favoriteSurprises = [
        createMockSurprise({
          id: 'fav1',
          content: '收藏惊喜',
          suitableFor: ['dating'],
          budget: ['medium'],
        }),
      ];

      const preferences = createMockPreferences({
        useFavoriteSurprises: false,
      });

      const result = selectSurprises(preferences, favoriteSurprises);

      expect(result).not.toContain('收藏惊喜');
      expect(result[0]).toMatch(/^系统惊喜/);
    });

    it('系统彩蛋只有1个符合条件时应该返回1个', async () => {
      const mockSurprises = [
        createMockSurprise({
          id: 'sys1',
          content: '系统惊喜1',
          suitableFor: ['dating'],
          budget: ['medium'],
        }),
        createMockSurprise({
          id: 'sys2',
          content: '系统惊喜2',
          suitableFor: ['longterm'],
          budget: ['luxury'],
        }),
      ];

      const { selectSurprises } = await loadWithMockSurprises(mockSurprises);

      const preferences = createMockPreferences({
        relationshipStage: 'dating',
        budget: 'medium',
      });

      const result = selectSurprises(preferences);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe('系统惊喜1');
    });

    it('返回的应该是彩蛋内容字符串数组，不是对象数组', async () => {
      const mockSurprises = [
        createMockSurprise({
          id: 'sys1',
          content: '系统惊喜1',
          suitableFor: ['dating'],
          budget: ['medium'],
        }),
      ];

      const { selectSurprises } = await loadWithMockSurprises(mockSurprises);

      const preferences = createMockPreferences();
      const result = selectSurprises(preferences);

      result.forEach(item => {
        expect(typeof item).toBe('string');
      });
    });
  });

  describe('getAllSurprises - 获取所有彩蛋', () => {
    it('应该返回所有彩蛋', async () => {
      const mockSurprises = [
        createMockSurprise({ id: 's1' }),
        createMockSurprise({ id: 's2' }),
        createMockSurprise({ id: 's3' }),
      ];

      const { getAllSurprises } = await loadWithMockSurprises(mockSurprises);

      const result = getAllSurprises();

      expect(result).toHaveLength(3);
    });
  });
});
