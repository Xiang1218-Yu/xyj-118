import type { DateRecord, Expense } from '../types';

const STORAGE_KEY = 'dateRecords';

function safeParse<T>(data: string | null, defaultValue: T): T {
  if (!data) return defaultValue;
  try {
    return JSON.parse(data) as T;
  } catch (e) {
    console.error('Failed to parse data:', e);
    return defaultValue;
  }
}

export function getDateRecords(): DateRecord[] {
  try {
    return safeParse<DateRecord[]>(localStorage.getItem(STORAGE_KEY), []);
  } catch {
    return [];
  }
}

export function saveDateRecordToStorage(record: DateRecord): void {
  try {
    const records = getDateRecords();
    records.unshift(record);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (e) {
    console.error('Failed to save date record:', e);
  }
}

export function updateDateRecordInStorage(record: DateRecord): void {
  try {
    const records = getDateRecords();
    const index = records.findIndex((r) => r.id === record.id);
    if (index !== -1) {
      records[index] = record;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    }
  } catch (e) {
    console.error('Failed to update date record:', e);
  }
}

export function deleteDateRecordFromStorage(recordId: string): void {
  try {
    const records = getDateRecords();
    const filteredRecords = records.filter((r) => r.id !== recordId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredRecords));
  } catch (e) {
    console.error('Failed to delete date record:', e);
  }
}

export function addExpenseToRecord(recordId: string, expense: Expense): void {
  try {
    const records = getDateRecords();
    const record = records.find((r) => r.id === recordId);
    if (record) {
      record.expenses.push(expense);
      record.totalAmount = record.expenses.reduce((sum, e) => sum + e.amount, 0);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    }
  } catch (e) {
    console.error('Failed to add expense:', e);
  }
}

export function deleteExpenseFromStorage(recordId: string, expenseId: string): void {
  try {
    const records = getDateRecords();
    const record = records.find((r) => r.id === recordId);
    if (record) {
      record.expenses = record.expenses.filter((e) => e.id !== expenseId);
      record.totalAmount = record.expenses.reduce((sum, e) => sum + e.amount, 0);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    }
  } catch (e) {
    console.error('Failed to delete expense:', e);
  }
}

export function clearAllDateRecords(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear date records:', e);
  }
}
