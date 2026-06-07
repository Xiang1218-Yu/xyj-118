import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  buildActivity,
  getActivityDuration,
  generateActivities,
} from '../modules/activityBuilder';
import type { Venue, Activity } from '../types';

function createMockVenue(overrides: Partial<Venue> = {}): Venue {
  return {
    id: 'venue-1',
    name: '测试场所',
    type: 'cafe',
    category: '咖啡',
    address: '北京市朝阳区测试路123号',
    rating: 4.5,
    priceRange: '¥50-100',
    image: 'test.jpg',
    description: '这是一个测试场所',
    suitableFor: ['dating', 'passionate'],
    bestTime: '10:00-22:00',
    averageCost: 80,
    ...overrides,
  };
}

function createMockActivity(overrides: Partial<Activity> = {}): Activity {
  return {
    id: 'act-1',
    time: '11:00',
    type: 'activity',
    name: '前一个活动',
    description: '前一个活动描述',
    location: '前一个地点',
    duration: '1.5小时',
    cost: 100,
    image: 'prev.jpg',
    rating: 4.0,
    ...overrides,
  };
}

describe('activityBuilder - 活动构建工具模块', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-07T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe('getActivityDuration - 活动时长获取', () => {
    it('电影院应该返回2小时', () => {
      expect(getActivityDuration('cinema')).toBe(2);
    });

    it('活动场所应该返回2.5小时', () => {
      expect(getActivityDuration('activity')).toBe(2.5);
    });

    it('餐厅应该返回1.5小时', () => {
      expect(getActivityDuration('restaurant')).toBe(1.5);
    });

    it('咖啡馆应该返回1.5小时', () => {
      expect(getActivityDuration('cafe')).toBe(1.5);
    });

    it('景点应该返回默认1.5小时', () => {
      expect(getActivityDuration('attraction')).toBe(1.5);
    });
  });

  describe('buildActivity - 单个活动构建', () => {
    it('应该正确构建活动的基本信息', () => {
      const venue = createMockVenue({
        name: '浪漫咖啡馆',
        type: 'cafe',
        address: '北京市朝阳区',
        description: '温馨浪漫的咖啡馆',
        averageCost: 100,
        rating: 4.8,
      });

      const activity = buildActivity({
        venue,
        type: 'activity',
        durationHours: 1.5,
        tips: '推荐点招牌拿铁',
        time: '11:00',
      });

      expect(activity).toMatchObject({
        time: '11:00',
        type: 'activity',
        name: '浪漫咖啡馆',
        description: '温馨浪漫的咖啡馆',
        location: '北京市朝阳区',
        duration: '1.5小时',
        cost: 200,
        image: 'test.jpg',
        rating: 4.8,
        tips: '推荐点招牌拿铁',
      });

      expect(activity.id).toMatch(/^act-\d+-[a-z0-9]{9}$/);
    });

    it('第一个活动不应该有交通信息', () => {
      const venue = createMockVenue();
      const activity = buildActivity({
        venue,
        type: 'activity',
        durationHours: 1.5,
        time: '11:00',
      });

      expect(activity.transport).toBeUndefined();
    });

    it('后续活动应该生成交通信息', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.1);

      const prevActivity = createMockActivity({ name: '前一个餐厅' });
      const venue = createMockVenue({ name: '下一个景点' });

      const activity = buildActivity({
        venue,
        type: 'activity',
        durationHours: 2,
        time: '14:00',
        prevActivity,
      });

      expect(activity.transport).toBeDefined();
      expect(activity.transport?.method).toBe('地铁');
      expect(activity.transport?.duration).toBe('23分钟');
      expect(activity.transport?.description).toBe(
        '从「前一个餐厅」地铁前往，约23分钟'
      );
    });

    it('交通方式应该从预定义列表中随机选择', () => {
      const methods = ['地铁', '打车', '骑行', '步行'];
      const prevActivity = createMockActivity();
      const venue = createMockVenue();

      for (let i = 0; i < 10; i++) {
        vi.spyOn(Math, 'random').mockReturnValue(i / 10);
        const activity = buildActivity({
          venue,
          type: 'activity',
          durationHours: 1.5,
          time: '11:00',
          prevActivity,
        });
        expect(methods).toContain(activity.transport?.method);
      }
    });

    it('交通时长应该在20-50分钟之间', () => {
      const prevActivity = createMockActivity();
      const venue = createMockVenue();

      for (let i = 0; i < 100; i++) {
        vi.spyOn(Math, 'random').mockReturnValue(i / 100);
        const activity = buildActivity({
          venue,
          type: 'activity',
          durationHours: 1.5,
          time: '11:00',
          prevActivity,
        });
        const duration = parseInt(activity.transport?.duration || '0');
        expect(duration).toBeGreaterThanOrEqual(20);
        expect(duration).toBeLessThanOrEqual(49);
      }
    });

    it('花费应该是人均消费的2倍（双人）', () => {
      const venue = createMockVenue({ averageCost: 150 });
      const activity = buildActivity({
        venue,
        type: 'dining',
        durationHours: 1.5,
        time: '12:00',
      });

      expect(activity.cost).toBe(300);
    });

    it('dining 类型活动应该正确标记', () => {
      const venue = createMockVenue({ type: 'restaurant' });
      const activity = buildActivity({
        venue,
        type: 'dining',
        durationHours: 1.5,
        time: '12:00',
      });

      expect(activity.type).toBe('dining');
    });

    it('activity 类型活动应该正确标记', () => {
      const venue = createMockVenue({ type: 'attraction' });
      const activity = buildActivity({
        venue,
        type: 'activity',
        durationHours: 2,
        time: '14:00',
      });

      expect(activity.type).toBe('activity');
    });

    it('没有 tips 时应该不包含 tips 字段', () => {
      const venue = createMockVenue();
      const activity = buildActivity({
        venue,
        type: 'activity',
        durationHours: 1.5,
        time: '11:00',
      });

      expect(activity.tips).toBeUndefined();
    });
  });

  describe('generateActivities - 完整活动时间线生成', () => {
    it('应该生成正确数量的活动', () => {
      const lunch = createMockVenue({ id: 'lunch', name: '午餐餐厅', type: 'restaurant' });
      const dinner = createMockVenue({ id: 'dinner', name: '晚餐餐厅', type: 'restaurant' });
      const activityVenues = [
        createMockVenue({ id: 'act1', name: '活动1', type: 'cafe' }),
        createMockVenue({ id: 'act2', name: '活动2', type: 'attraction' }),
        createMockVenue({ id: 'act3', name: '活动3', type: 'activity' }),
      ];

      const activities = generateActivities(lunch, dinner, activityVenues, 'medium');

      expect(activities.length).toBe(5);
    });

    it('时间线应该按照正确顺序排列', () => {
      const lunch = createMockVenue({ id: 'lunch', name: '午餐餐厅', type: 'restaurant' });
      const dinner = createMockVenue({ id: 'dinner', name: '晚餐餐厅', type: 'restaurant' });
      const activityVenues = [
        createMockVenue({ id: 'act1', name: '活动1', type: 'cafe' }),
        createMockVenue({ id: 'act2', name: '活动2', type: 'cinema' }),
      ];

      const activities = generateActivities(lunch, dinner, activityVenues, 'medium');

      expect(activities[0].name).toBe('活动1');
      expect(activities[0].time).toBe('11:00');
      
      expect(activities[1].name).toBe('午餐餐厅');
      expect(activities[1].type).toBe('dining');
      expect(activities[1].time).toBe('12:30');
      
      expect(activities[2].name).toBe('活动2');
      expect(activities[2].time).toBe('14:00');
      
      expect(activities[3].name).toBe('晚餐餐厅');
      expect(activities[3].type).toBe('dining');
      expect(activities[3].time).toBe('18:00');
    });

    it('午餐应该有预约提示', () => {
      const lunch = createMockVenue({ id: 'lunch', name: '午餐餐厅', type: 'restaurant' });
      const dinner = createMockVenue({ id: 'dinner', name: '晚餐餐厅', type: 'restaurant' });
      const activityVenues = [
        createMockVenue({ id: 'act1', name: '活动1', type: 'cafe' }),
      ];

      const activities = generateActivities(lunch, dinner, activityVenues, 'medium');

      expect(activities[1].tips).toBe('建议提前电话预约，避免等位');
    });

    it('晚餐应该有重头戏提示', () => {
      const lunch = createMockVenue({ id: 'lunch', name: '午餐餐厅', type: 'restaurant' });
      const dinner = createMockVenue({ id: 'dinner', name: '晚餐餐厅', type: 'restaurant' });
      const activityVenues = [
        createMockVenue({ id: 'act1', name: '活动1', type: 'cafe' }),
      ];

      const activities = generateActivities(lunch, dinner, activityVenues, 'medium');
      const dinnerActivity = activities[activities.length - 1];

      expect(dinnerActivity.tips).toBe('这是今晚的重头戏，好好享受二人时光');
    });

    it('第一个活动（咖啡馆）应该有咖啡推荐提示', () => {
      const lunch = createMockVenue({ id: 'lunch', name: '午餐餐厅', type: 'restaurant' });
      const dinner = createMockVenue({ id: 'dinner', name: '晚餐餐厅', type: 'restaurant' });
      const activityVenues = [
        createMockVenue({ id: 'act1', name: '咖啡馆', type: 'cafe' }),
      ];

      const activities = generateActivities(lunch, dinner, activityVenues, 'medium');

      expect(activities[0].tips).toBe('推荐点一杯招牌咖啡搭配甜点');
    });

    it('第一个活动（非咖啡馆）不应该有咖啡推荐提示', () => {
      const lunch = createMockVenue({ id: 'lunch', name: '午餐餐厅', type: 'restaurant' });
      const dinner = createMockVenue({ id: 'dinner', name: '晚餐餐厅', type: 'restaurant' });
      const activityVenues = [
        createMockVenue({ id: 'act1', name: '博物馆', type: 'attraction' }),
      ];

      const activities = generateActivities(lunch, dinner, activityVenues, 'medium');

      expect(activities[0].tips).toBeUndefined();
    });

    it('只有2个活动场所时应该跳过第三个活动', () => {
      const lunch = createMockVenue({ id: 'lunch', name: '午餐餐厅', type: 'restaurant' });
      const dinner = createMockVenue({ id: 'dinner', name: '晚餐餐厅', type: 'restaurant' });
      const activityVenues = [
        createMockVenue({ id: 'act1', name: '活动1', type: 'cafe' }),
        createMockVenue({ id: 'act2', name: '活动2', type: 'attraction' }),
      ];

      const activities = generateActivities(lunch, dinner, activityVenues, 'medium');

      expect(activities.length).toBe(4);
      expect(activities[activities.length - 1].name).toBe('晚餐餐厅');
    });

    it('有3个活动场所且时间允许时应该包含第三个活动', () => {
      const lunch = createMockVenue({ id: 'lunch', name: '午餐餐厅', type: 'restaurant' });
      const dinner = createMockVenue({ id: 'dinner', name: '晚餐餐厅', type: 'restaurant' });
      const activityVenues = [
        createMockVenue({ id: 'act1', name: '活动1', type: 'cafe' }),
        createMockVenue({ id: 'act2', name: '活动2', type: 'cafe' }),
        createMockVenue({ id: 'act3', name: '活动3', type: 'attraction' }),
      ];

      const activities = generateActivities(lunch, dinner, activityVenues, 'medium');

      expect(activities.length).toBe(5);
      expect(activities[3].name).toBe('活动3');
      expect(activities[3].time).toBe('17:00');
      expect(activities[3].duration).toBe('1小时');
    });

    it('电影院活动时长应该是2小时', () => {
      const lunch = createMockVenue({ id: 'lunch', name: '午餐餐厅', type: 'restaurant' });
      const dinner = createMockVenue({ id: 'dinner', name: '晚餐餐厅', type: 'restaurant' });
      const activityVenues = [
        createMockVenue({ id: 'act1', name: '活动1', type: 'cafe' }),
        createMockVenue({ id: 'act2', name: '电影院', type: 'cinema' }),
      ];

      const activities = generateActivities(lunch, dinner, activityVenues, 'medium');

      expect(activities[2].duration).toBe('2小时');
    });

    it('活动类型场所时长应该是2.5小时', () => {
      const lunch = createMockVenue({ id: 'lunch', name: '午餐餐厅', type: 'restaurant' });
      const dinner = createMockVenue({ id: 'dinner', name: '晚餐餐厅', type: 'restaurant' });
      const activityVenues = [
        createMockVenue({ id: 'act1', name: '活动1', type: 'cafe' }),
        createMockVenue({ id: 'act2', name: '游乐场', type: 'activity' }),
      ];

      const activities = generateActivities(lunch, dinner, activityVenues, 'medium');

      expect(activities[2].duration).toBe('2.5小时');
    });

    it('除了第一个活动，其他活动都应该有交通信息', () => {
      const lunch = createMockVenue({ id: 'lunch', name: '午餐餐厅', type: 'restaurant' });
      const dinner = createMockVenue({ id: 'dinner', name: '晚餐餐厅', type: 'restaurant' });
      const activityVenues = [
        createMockVenue({ id: 'act1', name: '活动1', type: 'cafe' }),
        createMockVenue({ id: 'act2', name: '活动2', type: 'attraction' }),
      ];

      const activities = generateActivities(lunch, dinner, activityVenues, 'medium');

      expect(activities[0].transport).toBeUndefined();
      expect(activities[1].transport).toBeDefined();
      expect(activities[2].transport).toBeDefined();
      expect(activities[3].transport).toBeDefined();
    });

    it('交通描述应该包含前一个活动的名称', () => {
      const lunch = createMockVenue({ id: 'lunch', name: '午餐餐厅', type: 'restaurant' });
      const dinner = createMockVenue({ id: 'dinner', name: '晚餐餐厅', type: 'restaurant' });
      const activityVenues = [
        createMockVenue({ id: 'act1', name: '咖啡馆', type: 'cafe' }),
        createMockVenue({ id: 'act2', name: '博物馆', type: 'attraction' }),
      ];

      const activities = generateActivities(lunch, dinner, activityVenues, 'medium');

      expect(activities[1].transport?.description).toContain('咖啡馆');
      expect(activities[2].transport?.description).toContain('午餐餐厅');
      expect(activities[3].transport?.description).toContain('博物馆');
    });
  });
});
