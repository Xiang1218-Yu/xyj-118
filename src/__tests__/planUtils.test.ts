import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  budgetRanges,
  budgetPriority,
  weatherTips,
  planTitles,
  randomChoice,
  shuffleArray,
  formatTime,
  generateActivityId,
  generatePlanId,
  calculateTotalCost,
  getPlanTitleWithStyle,
  interestToVenueTypes,
  transportMethods,
} from '../utils/planUtils';
import type { Activity } from '../types';

describe('planUtils - 工具函数模块', () => {
  describe('常量配置', () => {
    it('budgetRanges 应该包含所有预算等级的正确配置', () => {
      expect(budgetRanges).toEqual({
        low: { min: 0, max: 400, label: '¥0-200' },
        medium: { min: 400, max: 1000, label: '¥200-500' },
        high: { min: 1000, max: 2000, label: '¥500-1000' },
        luxury: { min: 2000, max: 99999, label: '¥1000+' },
      });
    });

    it('budgetPriority 优先级应该从低到高递增', () => {
      expect(budgetPriority.low).toBe(0);
      expect(budgetPriority.medium).toBe(1);
      expect(budgetPriority.high).toBe(2);
      expect(budgetPriority.luxury).toBe(3);
    });

    it('weatherTips 应该至少有一条天气提示', () => {
      expect(weatherTips.length).toBeGreaterThan(0);
      weatherTips.forEach(tip => {
        expect(typeof tip).toBe('string');
        expect(tip.length).toBeGreaterThan(0);
      });
    });

    it('planTitles 应该至少有一个方案标题模板', () => {
      expect(planTitles.length).toBeGreaterThan(0);
      planTitles.forEach(title => {
        expect(typeof title).toBe('string');
        expect(title.length).toBeGreaterThan(0);
      });
    });

    it('interestToVenueTypes 应该包含正确的兴趣到场所类型映射', () => {
      expect(interestToVenueTypes['美食']).toEqual(['restaurant', 'cafe']);
      expect(interestToVenueTypes['电影']).toEqual(['cinema']);
      expect(interestToVenueTypes['户外']).toEqual(['attraction', 'activity']);
    });

    it('transportMethods 应该包含四种交通方式', () => {
      expect(transportMethods).toEqual(['地铁', '打车', '骑行', '步行']);
    });
  });

  describe('randomChoice - 随机选择函数', () => {
    beforeEach(() => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5);
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('应该从数组中返回一个元素', () => {
      const arr = [1, 2, 3, 4, 5];
      const result = randomChoice(arr);
      expect(arr).toContain(result);
    });

    it('当 Math.random 返回 0 时应该返回第一个元素', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0);
      const arr = ['a', 'b', 'c'];
      expect(randomChoice(arr)).toBe('a');
    });

    it('当 Math.random 返回接近 1 时应该返回最后一个元素', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.99);
      const arr = ['a', 'b', 'c'];
      expect(randomChoice(arr)).toBe('c');
    });

    it('单元素数组应该返回该元素', () => {
      expect(randomChoice(['only'])).toBe('only');
    });
  });

  describe('shuffleArray - Fisher-Yates 洗牌算法', () => {
    it('应该返回一个新数组，不修改原数组', () => {
      const original = [1, 2, 3, 4, 5];
      const originalCopy = [...original];
      const shuffled = shuffleArray(original);
      
      expect(shuffled).not.toBe(original);
      expect(original).toEqual(originalCopy);
    });

    it('洗牌后的数组应该包含相同的元素', () => {
      const arr = [1, 2, 3, 4, 5];
      const shuffled = shuffleArray(arr);
      
      expect(shuffled.length).toBe(arr.length);
      shuffled.forEach(item => {
        expect(arr).toContain(item);
      });
    });

    it('空数组应该返回空数组', () => {
      expect(shuffleArray([])).toEqual([]);
    });

    it('单元素数组应该返回相同元素', () => {
      expect(shuffleArray([42])).toEqual([42]);
    });
  });

  describe('formatTime - 时间格式化', () => {
    it('应该正确格式化整点时间', () => {
      expect(formatTime(11)).toBe('11:00');
      expect(formatTime(14)).toBe('14:00');
      expect(formatTime(0)).toBe('00:00');
    });

    it('应该正确格式化带分钟的时间', () => {
      expect(formatTime(11.5)).toBe('11:30');
      expect(formatTime(14.25)).toBe('14:15');
      expect(formatTime(18.75)).toBe('18:45');
    });

    it('应该正确四舍五入分钟', () => {
      expect(formatTime(11.1)).toBe('11:06');
      expect(formatTime(11.9)).toBe('11:54');
    });

    it('应该补零到两位数', () => {
      expect(formatTime(9)).toBe('09:00');
      expect(formatTime(5.5)).toBe('05:30');
    });
  });

  describe('generateActivityId - 活动ID生成', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-06-07T12:00:00Z'));
      vi.spyOn(Math, 'random').mockReturnValue(0.123456789);
    });

    afterEach(() => {
      vi.useRealTimers();
      vi.restoreAllMocks();
    });

    it('应该生成正确格式的活动ID', () => {
      const id = generateActivityId();
      expect(id).toMatch(/^act-\d+-[a-z0-9]{9}$/);
    });

    it('应该包含时间戳和随机字符串', () => {
      const id = generateActivityId();
      const parts = id.split('-');
      expect(parts[0]).toBe('act');
      expect(parts[1]).toBe(String(Date.now()));
      expect(parts[2]).toHaveLength(9);
    });
  });

  describe('generatePlanId - 方案ID生成', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-06-07T12:00:00Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('无索引时应该生成基础格式ID', () => {
      const id = generatePlanId();
      expect(id).toBe(`plan-${Date.now()}`);
    });

    it('有索引时应该包含索引后缀', () => {
      const id = generatePlanId(2);
      expect(id).toBe(`plan-${Date.now()}-2`);
    });
  });

  describe('calculateTotalCost - 总花费计算', () => {
    it('应该正确计算多个活动的总花费', () => {
      const activities: Activity[] = [
        { cost: 100 } as Activity,
        { cost: 200 } as Activity,
        { cost: 300 } as Activity,
      ];
      expect(calculateTotalCost(activities)).toBe(600);
    });

    it('空活动数组应该返回 0', () => {
      expect(calculateTotalCost([])).toBe(0);
    });

    it('单个活动应该返回其花费', () => {
      const activities: Activity[] = [{ cost: 500 } as Activity];
      expect(calculateTotalCost(activities)).toBe(500);
    });

    it('应该处理零花费活动', () => {
      const activities: Activity[] = [
        { cost: 0 } as Activity,
        { cost: 100 } as Activity,
      ];
      expect(calculateTotalCost(activities)).toBe(100);
    });
  });

  describe('getPlanTitleWithStyle - 方案标题样式化', () => {
    it('应该为不同索引添加不同的风格形容词', () => {
      const baseTitle = '甜蜜一日 · 浪漫约会';
      
      expect(getPlanTitleWithStyle(baseTitle, 0, 3)).toBe('浪漫经典 · 浪漫约会');
      expect(getPlanTitleWithStyle(baseTitle, 1, 3)).toBe('活力冒险 · 浪漫约会');
      expect(getPlanTitleWithStyle(baseTitle, 2, 3)).toBe('文艺清新 · 浪漫约会');
    });

    it('索引超出范围时应该循环使用形容词', () => {
      const baseTitle = '甜蜜一日 · 浪漫约会';
      expect(getPlanTitleWithStyle(baseTitle, 6, 3)).toBe('浪漫经典 · 浪漫约会');
      expect(getPlanTitleWithStyle(baseTitle, 7, 3)).toBe('活力冒险 · 浪漫约会');
    });

    it('应该正确处理没有中间点的标题', () => {
      const baseTitle = '浪漫约会';
      expect(getPlanTitleWithStyle(baseTitle, 0, 2)).toBe('浪漫经典 · 浪漫约会');
    });
  });
});
