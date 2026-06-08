import { create } from 'zustand';
import type { DateRecord, Expense, ExpenseCategory } from '../types';
import {
  getDateRecords,
  saveDateRecordToStorage,
  updateDateRecordInStorage,
  deleteDateRecordFromStorage,
  addExpenseToRecord,
  deleteExpenseFromStorage,
  clearAllDateRecords,
} from '../modules/dateRecordStorage';

interface DateRecordState {
  records: DateRecord[];
  currentRecordId: string | null;
  loadRecords: () => void;
  createRecord: (title: string, date: string) => DateRecord;
  selectRecord: (recordId: string | null) => void;
  addExpense: (
    recordId: string,
    amount: number,
    category: ExpenseCategory,
    description: string,
    date: string
  ) => void;
  deleteExpense: (recordId: string, expenseId: string) => void;
  deleteRecord: (recordId: string) => void;
  clearAllRecords: () => void;
  getCurrentRecord: () => DateRecord | null;
}

export const useDateRecordStore = create<DateRecordState>((set, get) => ({
  records: [],
  currentRecordId: null,

  loadRecords: () => {
    set({ records: getDateRecords() });
  },

  createRecord: (title: string, date: string) => {
    const newRecord: DateRecord = {
      id: `record-${Date.now()}`,
      date,
      title,
      expenses: [],
      totalAmount: 0,
      createdAt: new Date().toISOString(),
    };
    saveDateRecordToStorage(newRecord);
    get().loadRecords();
    return newRecord;
  },

  selectRecord: (recordId) => {
    set({ currentRecordId: recordId });
  },

  addExpense: (recordId, amount, category, description, date) => {
    const newExpense: Expense = {
      id: `expense-${Date.now()}`,
      amount,
      category,
      description,
      date,
      createdAt: new Date().toISOString(),
    };
    addExpenseToRecord(recordId, newExpense);
    get().loadRecords();
  },

  deleteExpense: (recordId, expenseId) => {
    deleteExpenseFromStorage(recordId, expenseId);
    get().loadRecords();
  },

  deleteRecord: (recordId) => {
    deleteDateRecordFromStorage(recordId);
    if (get().currentRecordId === recordId) {
      set({ currentRecordId: null });
    }
    get().loadRecords();
  },

  clearAllRecords: () => {
    clearAllDateRecords();
    set({ records: [], currentRecordId: null });
  },

  getCurrentRecord: () => {
    const { records, currentRecordId } = get();
    return records.find((r) => r.id === currentRecordId) || null;
  },
}));
