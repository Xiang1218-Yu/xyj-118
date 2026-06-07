const lunarInfo = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
  0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
  0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
  0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
  0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
  0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5d0, 0x14573, 0x052d0, 0x0a9a8, 0x0e950, 0x06aa0,
  0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
  0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b5a0, 0x195a6,
  0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
  0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,
  0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
  0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
  0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
  0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
  0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,
];

const Gan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const Zhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const lunarMonths = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];
const lunarDays = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];
const zodiacAnimals = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];

function lYearDays(y: number): number {
  let sum = 348;
  for (let i = 0x8000; i > 0x8; i >>= 1) {
    sum += (lunarInfo[y - 1900] & i) ? 1 : 0;
  }
  return sum + leapDays(y);
}

function leapMonth(y: number): number {
  return lunarInfo[y - 1900] & 0xf;
}

function leapDays(y: number): number {
  if (leapMonth(y)) {
    return (lunarInfo[y - 1900] & 0x10000) ? 30 : 29;
  }
  return 0;
}

function monthDays(y: number, m: number): number {
  return (lunarInfo[y - 1900] & (0x10000 >> m)) ? 30 : 29;
}

export interface LunarDate {
  year: number;
  month: number;
  day: number;
  isLeap: boolean;
  yearGanZhi: string;
  zodiac: string;
  monthName: string;
  dayName: string;
}

export interface SolarDate {
  year: number;
  month: number;
  day: number;
}

export function solarToLunar(year: number, month: number, day: number): LunarDate {
  const baseDate = new Date(1900, 0, 31);
  const currentDate = new Date(year, month - 1, day);
  let offset = Math.floor((currentDate.getTime() - baseDate.getTime()) / 86400000);

  let lunarYear = 1900;
  let daysInYear = 0;
  while (lunarYear < 2100 && offset > 0) {
    daysInYear = lYearDays(lunarYear);
    offset -= daysInYear;
    lunarYear++;
  }
  if (offset < 0) {
    offset += daysInYear;
    lunarYear--;
  }

  const leap = leapMonth(lunarYear);
  let isLeap = false;
  let lunarMonth = 1;
  let daysInMonth = 0;

  while (lunarMonth < 13 && offset > 0) {
    if (leap > 0 && lunarMonth === leap + 1 && !isLeap) {
      --lunarMonth;
      isLeap = true;
      daysInMonth = leapDays(lunarYear);
    } else {
      daysInMonth = monthDays(lunarYear, lunarMonth);
    }

    if (isLeap && lunarMonth === leap + 1) isLeap = false;
    offset -= daysInMonth;
    lunarMonth++;
  }

  if (offset === 0 && leap > 0 && lunarMonth === leap + 1) {
    if (isLeap) {
      isLeap = false;
    } else {
      isLeap = true;
      --lunarMonth;
    }
  }

  if (offset < 0) {
    offset += daysInMonth;
    --lunarMonth;
  }

  const lunarDay = offset + 1;

  const ganIndex = (lunarYear - 1900 + 36) % 10;
  const zhiIndex = (lunarYear - 1900) % 12;
  const zodiacIndex = zhiIndex;

  return {
    year: lunarYear,
    month: lunarMonth,
    day: lunarDay,
    isLeap,
    yearGanZhi: `${Gan[ganIndex]}${Zhi[zhiIndex]}`,
    zodiac: zodiacAnimals[zodiacIndex],
    monthName: `${isLeap ? '闰' : ''}${lunarMonths[lunarMonth - 1]}月`,
    dayName: lunarDays[lunarDay - 1],
  };
}

export function lunarToSolar(lunarYear: number, lunarMonth: number, lunarDay: number, isLeap: boolean = false): SolarDate {
  let offset = 0;
  for (let i = 1900; i < lunarYear; i++) {
    offset += lYearDays(i);
  }

  const leap = leapMonth(lunarYear);
  for (let i = 1; i < lunarMonth; i++) {
    if (leap > 0 && i === leap + 1 && !isLeap) {
      offset += leapDays(lunarYear);
    }
    offset += monthDays(lunarYear, i);
  }

  if (isLeap && leap > 0 && lunarMonth > leap) {
    offset += monthDays(lunarYear, lunarMonth);
  }

  if (isLeap && leap === lunarMonth) {
    offset += monthDays(lunarYear, lunarMonth);
  }

  offset += lunarDay - 1;

  const baseDate = new Date(1900, 0, 31);
  baseDate.setTime(baseDate.getTime() + offset * 86400000);

  return {
    year: baseDate.getFullYear(),
    month: baseDate.getMonth() + 1,
    day: baseDate.getDate(),
  };
}

export function formatLunarDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const lunar = solarToLunar(year, month, day);
  return `${lunar.yearGanZhi}年 ${lunar.monthName}${lunar.dayName}`;
}

export function formatSolarDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  return `${year}年${month}月${day}日`;
}

export function getDaysUntilNextAnniversary(dateStr: string, calendarType: 'solar' | 'lunar'): number {
  const today = new Date();
  const todaySolar = {
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    day: today.getDate(),
  };

  const [baseYear, baseMonth, baseDay] = dateStr.split('-').map(Number);
  
  let nextDate: SolarDate;
  
  if (calendarType === 'solar') {
    nextDate = {
      year: todaySolar.year,
      month: baseMonth,
      day: baseDay,
    };
    
    const tempNextDate = new Date(nextDate.year, nextDate.month - 1, nextDate.day);
    const tempToday = new Date(todaySolar.year, todaySolar.month - 1, todaySolar.day);
    
    if (tempNextDate < tempToday) {
      nextDate.year += 1;
    }
  } else {
    const baseLunar = solarToLunar(baseYear, baseMonth, baseDay);
    
    let targetYear = todaySolar.year;
    let nextSolar = lunarToSolar(targetYear, baseLunar.month, baseLunar.day, baseLunar.isLeap);
    const tempToday = new Date(todaySolar.year, todaySolar.month - 1, todaySolar.day);
    const tempNextDate = new Date(nextSolar.year, nextSolar.month - 1, nextSolar.day);
    
    if (tempNextDate < tempToday) {
      targetYear += 1;
      nextSolar = lunarToSolar(targetYear, baseLunar.month, baseLunar.day, baseLunar.isLeap);
    }
    
    nextDate = nextSolar;
  }

  const nextDateObj = new Date(nextDate.year, nextDate.month - 1, nextDate.day);
  const todayObj = new Date(todaySolar.year, todaySolar.month - 1, todaySolar.day);
  const diffTime = nextDateObj.getTime() - todayObj.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

export function getAnniversaryYears(dateStr: string): number {
  const [baseYear] = dateStr.split('-').map(Number);
  const today = new Date();
  return today.getFullYear() - baseYear;
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}