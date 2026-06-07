import { describe, it, expect } from 'vitest';
import {
  comparePlans,
  getFieldLabel,
  getDifferentFields,
  hasAnyDifference,
} from '../utils/planDiffUtils';
import type { DatePlan, Activity, PlanActivityDiff, DiffField } from '../types';

function createMockActivity(overrides: Partial<Activity> = {}): Activity {
  return {
    id: 'act-1',
    time: '11:00',
    type: 'activity',
    name: '测试活动',
    description: '活动描述',
    location: '活动地点',
    duration: '1.5小时',
    cost: 200,
    image: 'test.jpg',
    rating: 4.5,
    ...overrides,
  };
}

function createMockPlan(overrides: Partial<DatePlan> = {}): DatePlan {
  return {
    id: 'plan-1',
    createdAt: '2026-06-07T12:00:00Z',
    title: '测试方案',
    totalBudget: '¥200-500',
    estimatedCost: 500,
    activities: [
      createMockActivity({ id: 'act-1', time: '11:00', name: '活动1' }),
      createMockActivity({ id: 'act-2', time: '12:30', name: '午餐', type: 'dining' }),
      createMockActivity({ id: 'act-3', time: '14:00', name: '活动2' }),
    ],
    surprises: ['惊喜1', '惊喜2'],
    weatherTip: '天气晴朗',
    ...overrides,
  };
}

describe('planDiffUtils - 方案差异比较算法', () => {
  describe('comparePlans - 方案比较核心函数', () => {
    it('少于2个方案时应该返回无差异结果', () => {
      const result = comparePlans([createMockPlan()]);
      
      expect(result.activityDiffs).toEqual([]);
      expect(result.summaryDiffs.hasDifference).toBe(false);
      expect(result.summaryDiffs.totalCost.isDifferent).toBe(false);
      expect(result.summaryDiffs.activityCount.isDifferent).toBe(false);
    });

    it('空方案数组应该返回无差异结果', () => {
      const result = comparePlans([]);
      
      expect(result.activityDiffs).toEqual([]);
      expect(result.summaryDiffs.hasDifference).toBe(false);
    });

    it('两个完全相同的方案应该返回无差异', () => {
      const plan1 = createMockPlan();
      const plan2 = createMockPlan();
      
      const result = comparePlans([plan1, plan2]);
      
      expect(result.summaryDiffs.hasDifference).toBe(false);
      result.activityDiffs.forEach(diff => {
        expect(diff.hasDifference).toBe(false);
      });
    });

    it('应该检测到活动名称差异', () => {
      const plan1 = createMockPlan({
        activities: [
          createMockActivity({ id: 'act-1', name: '咖啡馆' }),
        ],
      });
      const plan2 = createMockPlan({
        activities: [
          createMockActivity({ id: 'act-1', name: '博物馆' }),
        ],
      });
      
      const result = comparePlans([plan1, plan2]);
      
      expect(result.activityDiffs[0].hasDifference).toBe(true);
      const nameDiff = result.activityDiffs[0].diffs.find(d => d.field === 'name');
      expect(nameDiff?.isDifferent).toBe(true);
      expect(nameDiff?.values).toEqual(['咖啡馆', '博物馆']);
    });

    it('应该检测到花费差异', () => {
      const plan1 = createMockPlan({
        activities: [createMockActivity({ cost: 200 })],
        estimatedCost: 200,
      });
      const plan2 = createMockPlan({
        activities: [createMockActivity({ cost: 500 })],
        estimatedCost: 500,
      });
      
      const result = comparePlans([plan1, plan2]);
      
      expect(result.summaryDiffs.totalCost.isDifferent).toBe(true);
      expect(result.summaryDiffs.totalCost.values).toEqual([200, 500]);
    });

    it('应该检测到活动数量差异', () => {
      const plan1 = createMockPlan({
        activities: [createMockActivity(), createMockActivity()],
      });
      const plan2 = createMockPlan({
        activities: [createMockActivity(), createMockActivity(), createMockActivity()],
      });
      
      const result = comparePlans([plan1, plan2]);
      
      expect(result.summaryDiffs.activityCount.isDifferent).toBe(true);
      expect(result.summaryDiffs.activityCount.values).toEqual([2, 3]);
    });

    it('应该正确处理某个方案缺少活动的情况', () => {
      const plan1 = createMockPlan({
        activities: [
          createMockActivity({ id: 'act-1', name: '活动A' }),
          createMockActivity({ id: 'act-2', name: '活动B' }),
        ],
      });
      const plan2 = createMockPlan({
        activities: [
          createMockActivity({ id: 'act-1', name: '活动A' }),
        ],
      });
      
      const result = comparePlans([plan1, plan2]);
      
      expect(result.activityDiffs).toHaveLength(2);
      expect(result.activityDiffs[1].activityExists).toEqual([true, false]);
      expect(result.activityDiffs[1].hasDifference).toBe(true);
    });

    it('应该检测到多个字段的差异', () => {
      const plan1 = createMockPlan({
        activities: [
          createMockActivity({
            name: '咖啡馆',
            location: '朝阳区',
            cost: 150,
            time: '11:00',
          }),
        ],
      });
      const plan2 = createMockPlan({
        activities: [
          createMockActivity({
            name: '电影院',
            location: '海淀区',
            cost: 300,
            time: '14:00',
          }),
        ],
      });
      
      const result = comparePlans([plan1, plan2]);
      const diffs = result.activityDiffs[0].diffs;
      
      expect(diffs.find(d => d.field === 'name')?.isDifferent).toBe(true);
      expect(diffs.find(d => d.field === 'location')?.isDifferent).toBe(true);
      expect(diffs.find(d => d.field === 'cost')?.isDifferent).toBe(true);
      expect(diffs.find(d => d.field === 'time')?.isDifferent).toBe(true);
    });

    it('三个方案的比较应该正确返回所有差异', () => {
      const plan1 = createMockPlan({
        activities: [createMockActivity({ name: '活动A', cost: 100 })],
        estimatedCost: 100,
      });
      const plan2 = createMockPlan({
        activities: [createMockActivity({ name: '活动B', cost: 200 })],
        estimatedCost: 200,
      });
      const plan3 = createMockPlan({
        activities: [createMockActivity({ name: '活动C', cost: 300 })],
        estimatedCost: 300,
      });
      
      const result = comparePlans([plan1, plan2, plan3]);
      
      expect(result.activityDiffs[0].diffs.find(d => d.field === 'name')?.values)
        .toEqual(['活动A', '活动B', '活动C']);
      expect(result.summaryDiffs.totalCost.values).toEqual([100, 200, 300]);
      expect(result.summaryDiffs.hasDifference).toBe(true);
    });

    it('所有方案都没有某个活动时，该字段应该无差异', () => {
      const plan1 = createMockPlan({ activities: [] });
      const plan2 = createMockPlan({ activities: [] });
      
      const result = comparePlans([plan1, plan2]);
      
      expect(result.activityDiffs).toEqual([]);
      expect(result.summaryDiffs.hasDifference).toBe(false);
    });

    it('应该正确检测活动类型差异', () => {
      const plan1 = createMockPlan({
        activities: [createMockActivity({ type: 'dining' })],
      });
      const plan2 = createMockPlan({
        activities: [createMockActivity({ type: 'activity' })],
      });
      
      const result = comparePlans([plan1, plan2]);
      const typeDiff = result.activityDiffs[0].diffs.find(d => d.field === 'type');
      
      expect(typeDiff?.isDifferent).toBe(true);
      expect(typeDiff?.values).toEqual(['dining', 'activity']);
    });

    it('应该正确检测时长差异', () => {
      const plan1 = createMockPlan({
        activities: [createMockActivity({ duration: '1小时' })],
      });
      const plan2 = createMockPlan({
        activities: [createMockActivity({ duration: '2小时' })],
      });
      
      const result = comparePlans([plan1, plan2]);
      const durationDiff = result.activityDiffs[0].diffs.find(d => d.field === 'duration');
      
      expect(durationDiff?.isDifferent).toBe(true);
      expect(durationDiff?.values).toEqual(['1小时', '2小时']);
    });

    it('应该正确检测描述差异', () => {
      const plan1 = createMockPlan({
        activities: [createMockActivity({ description: '描述A' })],
      });
      const plan2 = createMockPlan({
        activities: [createMockActivity({ description: '描述B' })],
      });
      
      const result = comparePlans([plan1, plan2]);
      const descDiff = result.activityDiffs[0].diffs.find(d => d.field === 'description');
      
      expect(descDiff?.isDifferent).toBe(true);
      expect(descDiff?.values).toEqual(['描述A', '描述B']);
    });
  });

  describe('getFieldLabel - 字段标签获取', () => {
    it('应该返回正确的中文字段标签', () => {
      expect(getFieldLabel('name')).toBe('活动名称');
      expect(getFieldLabel('description')).toBe('活动描述');
      expect(getFieldLabel('location')).toBe('地点');
      expect(getFieldLabel('cost')).toBe('花费');
      expect(getFieldLabel('duration')).toBe('时长');
      expect(getFieldLabel('time')).toBe('时间');
      expect(getFieldLabel('type')).toBe('类型');
    });

    it('应该覆盖所有 DiffField 类型', () => {
      const fields: DiffField[] = ['name', 'description', 'location', 'cost', 'duration', 'time', 'type'];
      fields.forEach(field => {
        expect(typeof getFieldLabel(field)).toBe('string');
        expect(getFieldLabel(field).length).toBeGreaterThan(0);
      });
    });
  });

  describe('getDifferentFields - 获取差异字段', () => {
    it('应该返回所有有差异的字段', () => {
      const diff: PlanActivityDiff = {
        activityIndex: 0,
        diffs: [
          { field: 'name', isDifferent: true, values: ['A', 'B'] },
          { field: 'cost', isDifferent: true, values: [100, 200] },
          { field: 'time', isDifferent: false, values: ['11:00', '11:00'] },
        ],
        hasDifference: true,
        activityExists: [true, true],
      };
      
      expect(getDifferentFields(diff)).toEqual(['name', 'cost']);
    });

    it('没有差异时应该返回空数组', () => {
      const diff: PlanActivityDiff = {
        activityIndex: 0,
        diffs: [
          { field: 'name', isDifferent: false, values: ['A', 'A'] },
          { field: 'cost', isDifferent: false, values: [100, 100] },
        ],
        hasDifference: false,
        activityExists: [true, true],
      };
      
      expect(getDifferentFields(diff)).toEqual([]);
    });
  });

  describe('hasAnyDifference - 是否有任何差异', () => {
    it('有任何活动差异时应该返回 true', () => {
      const diffs: PlanActivityDiff[] = [
        {
          activityIndex: 0,
          diffs: [],
          hasDifference: false,
          activityExists: [true, true],
        },
        {
          activityIndex: 1,
          diffs: [],
          hasDifference: true,
          activityExists: [true, false],
        },
      ];
      
      expect(hasAnyDifference(diffs)).toBe(true);
    });

    it('没有任何差异时应该返回 false', () => {
      const diffs: PlanActivityDiff[] = [
        {
          activityIndex: 0,
          diffs: [],
          hasDifference: false,
          activityExists: [true, true],
        },
        {
          activityIndex: 1,
          diffs: [],
          hasDifference: false,
          activityExists: [true, true],
        },
      ];
      
      expect(hasAnyDifference(diffs)).toBe(false);
    });

    it('空数组应该返回 false', () => {
      expect(hasAnyDifference([])).toBe(false);
    });
  });
});
