import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Wallet,
  Trash2,
  Calendar,
  TrendingUp,
  Utensils,
  Car,
  Film,
  ShoppingBag,
  PartyPopper,
  BedDouble,
  Gift,
  MoreHorizontal,
  X,
} from '../components/Icons';
import { useDateRecordStore } from '../store/useDateRecordStore';
import { ExpenseForm } from '../components/ExpenseForm';
import { ExpenseChart } from '../components/ExpenseChart';
import { cn } from '@/lib/utils';
import type { ExpenseCategory, DateRecord } from '../types';

const CATEGORY_ICONS: Record<ExpenseCategory, typeof Utensils> = {
  '餐饮': Utensils,
  '交通': Car,
  '电影': Film,
  '购物': ShoppingBag,
  '娱乐': PartyPopper,
  '住宿': BedDouble,
  '礼物': Gift,
  '其他': MoreHorizontal,
};

export function DateRecordPage() {
  const navigate = useNavigate();
  const {
    records,
    currentRecordId,
    loadRecords,
    createRecord,
    selectRecord,
    addExpense,
    deleteExpense,
    deleteRecord,
    getCurrentRecord,
  } = useDateRecordStore();

  const [showNewRecordModal, setShowNewRecordModal] = useState(false);
  const [newRecordTitle, setNewRecordTitle] = useState('');
  const [newRecordDate, setNewRecordDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [activeTab, setActiveTab] = useState<'records' | 'chart'>('records');

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  const currentRecord = getCurrentRecord();

  const allExpenses = useMemo(() => {
    return records.flatMap((r) => r.expenses);
  }, [records]);

  const totalSpending = useMemo(() => {
    return allExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [allExpenses]);

  const handleCreateRecord = () => {
    if (!newRecordTitle.trim()) return;
    const record = createRecord(newRecordTitle.trim(), newRecordDate);
    selectRecord(record.id);
    setShowNewRecordModal(false);
    setNewRecordTitle('');
    setNewRecordDate(new Date().toISOString().split('T')[0]);
  };

  const handleAddExpense = (
    amount: number,
    category: ExpenseCategory,
    description: string,
    date: string
  ) => {
    if (currentRecordId) {
      addExpense(currentRecordId, amount, category, description, date);
    }
  };

  const handleDeleteRecord = (recordId: string) => {
    if (confirm('确定要删除这条约会记录吗？')) {
      deleteRecord(recordId);
    }
  };

  const handleDeleteExpense = (expenseId: string) => {
    if (confirm('确定要删除这笔花销吗？') && currentRecordId) {
      deleteExpense(currentRecordId, expenseId);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-b from-primary/10 to-transparent pb-8">
        <div className="container pt-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={20} />
              <span>返回</span>
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNewRecordModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-full shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all font-medium"
            >
              <Plus size={18} />
              <span>新建记录</span>
            </motion.button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
              <Wallet size={16} />
              <span>约会记录</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 font-display">
              约会花销记录
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              记录每一次约会的美好瞬间和消费，让回忆更加清晰 💝
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-8"
          >
            <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-border/50">
              <div className="text-2xl font-bold text-primary">{records.length}</div>
              <div className="text-xs text-muted-foreground mt-1">约会次数</div>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-border/50">
              <div className="text-2xl font-bold text-primary">
                {allExpenses.length}
              </div>
              <div className="text-xs text-muted-foreground mt-1">消费笔数</div>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-border/50">
              <div className="text-2xl font-bold text-primary">
                ¥{totalSpending.toFixed(0)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">累计消费</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex bg-white rounded-full p-1 max-w-md mx-auto shadow-sm border border-border/50"
          >
            <button
              onClick={() => setActiveTab('records')}
              className={cn(
                'flex-1 py-3 px-4 rounded-full text-sm font-medium transition-all flex items-center justify-center gap-2',
                activeTab === 'records'
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Calendar size={16} />
              记录列表
            </button>
            <button
              onClick={() => setActiveTab('chart')}
              className={cn(
                'flex-1 py-3 px-4 rounded-full text-sm font-medium transition-all flex items-center justify-center gap-2',
                activeTab === 'chart'
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <TrendingUp size={16} />
              统计图表
            </button>
          </motion.div>
        </div>
      </div>

      <div className="container pb-16">
        <AnimatePresence mode="wait">
          {activeTab === 'records' ? (
            <motion.div
              key="records"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              <div className="lg:col-span-1 space-y-4">
                <h3 className="font-semibold text-foreground mb-4">约会记录</h3>
                {records.length === 0 ? (
                  <div className="bg-card rounded-2xl p-6 text-center border border-border">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h4 className="font-medium text-foreground mb-2">
                      暂无约会记录
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      点击右上角按钮创建第一条记录
                    </p>
                    <button
                      onClick={() => setShowNewRecordModal(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full text-sm font-medium"
                    >
                      <Plus size={14} />
                      新建记录
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {records.map((record) => (
                      <motion.div
                        key={record.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() =>
                          selectRecord(
                            currentRecordId === record.id ? null : record.id
                          )
                        }
                        className={cn(
                          'bg-card rounded-xl p-4 border cursor-pointer transition-all',
                          currentRecordId === record.id
                            ? 'border-primary shadow-lg shadow-primary/20'
                            : 'border-border hover:border-primary/50'
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground">
                              {record.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              {record.date}
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-lg font-bold text-primary">
                                ¥{record.totalAmount.toFixed(2)}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {record.expenses.length} 笔
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteRecord(record.id);
                            }}
                            className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              <div className="lg:col-span-2 space-y-4">
                <h3 className="font-semibold text-foreground mb-4">
                  {currentRecord ? currentRecord.title : '请选择一条记录'}
                </h3>
                {currentRecord ? (
                  <>
                    <ExpenseForm
                      recordId={currentRecord.id}
                      onSubmit={handleAddExpense}
                    />

                    <div className="bg-card rounded-2xl border border-border overflow-hidden">
                      <div className="p-4 border-b border-border">
                        <h4 className="font-medium text-foreground">
                          花销明细
                        </h4>
                      </div>
                      {currentRecord.expenses.length === 0 ? (
                        <div className="p-8 text-center">
                          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                            <Wallet className="w-6 h-6 text-muted-foreground" />
                          </div>
                          <p className="text-muted-foreground">
                            还没有花销记录，点击上方按钮添加
                          </p>
                        </div>
                      ) : (
                        <div className="divide-y divide-border">
                          {[...currentRecord.expenses]
                            .sort(
                              (a, b) =>
                                new Date(b.date).getTime() -
                                new Date(a.date).getTime()
                            )
                            .map((expense) => {
                              const Icon = CATEGORY_ICONS[expense.category];
                              return (
                                <motion.div
                                  key={expense.id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors"
                                >
                                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Icon className="w-5 h-5 text-primary" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <span className="font-medium text-foreground">
                                        {expense.description ||
                                          expense.category}
                                      </span>
                                      <span className="font-semibold text-foreground">
                                        ¥{expense.amount.toFixed(2)}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="px-2 py-0.5 rounded-full bg-muted text-xs text-muted-foreground">
                                        {expense.category}
                                      </span>
                                      <span className="text-xs text-muted-foreground">
                                        {expense.date}
                                      </span>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => handleDeleteExpense(expense.id)}
                                    className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </motion.div>
                              );
                            })}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="bg-card rounded-2xl p-12 text-center border border-border">
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h4 className="text-lg font-medium text-foreground mb-2">
                      选择一条记录查看详情
                    </h4>
                    <p className="text-muted-foreground">
                      从左侧列表选择或创建新的约会记录
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="chart"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ExpenseChart expenses={allExpenses} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showNewRecordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowNewRecordModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-2xl p-6 w-full max-w-md shadow-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-foreground">
                  新建约会记录
                </h3>
                <button
                  onClick={() => setShowNewRecordModal(false)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    约会标题
                  </label>
                  <input
                    type="text"
                    value={newRecordTitle}
                    onChange={(e) => setNewRecordTitle(e.target.value)}
                    placeholder="例如：周末约会、纪念日..."
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    日期
                  </label>
                  <input
                    type="date"
                    value={newRecordDate}
                    onChange={(e) => setNewRecordDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowNewRecordModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl border border-border text-muted-foreground font-medium hover:bg-muted/50 transition-all"
                >
                  取消
                </button>
                <button
                  onClick={handleCreateRecord}
                  disabled={!newRecordTitle.trim()}
                  className="flex-1 py-3 px-4 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  创建
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
