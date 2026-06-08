import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ExpenseCategory } from '../types';
import {
  Plus,
  X,
  Utensils,
  Car,
  Film,
  ShoppingBag,
  PartyPopper,
  BedDouble,
  Gift,
  MoreHorizontal,
} from './Icons';

const EXPENSE_CATEGORIES: { value: ExpenseCategory; label: string; icon: typeof Utensils }[] = [
  { value: '餐饮', label: '餐饮', icon: Utensils },
  { value: '交通', label: '交通', icon: Car },
  { value: '电影', label: '电影', icon: Film },
  { value: '购物', label: '购物', icon: ShoppingBag },
  { value: '娱乐', label: '娱乐', icon: PartyPopper },
  { value: '住宿', label: '住宿', icon: BedDouble },
  { value: '礼物', label: '礼物', icon: Gift },
  { value: '其他', label: '其他', icon: MoreHorizontal },
];

interface ExpenseFormProps {
  recordId: string;
  onSubmit: (amount: number, category: ExpenseCategory, description: string, date: string) => void;
}

export function ExpenseForm({ recordId, onSubmit }: ExpenseFormProps) {
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<ExpenseCategory>('餐饮');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;

    onSubmit(parseFloat(amount), category, description, date);
    setAmount('');
    setDescription('');
    setIsExpanded(false);
  };

  const quickAmounts = [50, 100, 200, 500];

  return (
    <motion.div
      layout
      className="bg-card rounded-2xl shadow-soft border border-border overflow-hidden"
    >
      <motion.div
        layout="position"
        className="p-4 flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Plus className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">记录一笔花销</h3>
            <p className="text-sm text-muted-foreground">快速添加约会消费</p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 45 : 0 }}
          transition={{ duration: 0.3 }}
          className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
        >
          <Plus className="w-4 h-4 text-muted-foreground" />
        </motion.div>
      </motion.div>

      {isExpanded && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          onSubmit={handleSubmit}
          className="px-4 pb-4 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              金额
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground font-medium">
                ¥
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-lg font-medium"
                min="0"
                step="0.01"
              />
            </div>
            <div className="flex gap-2 mt-2">
              {quickAmounts.map((quickAmount) => (
                <button
                  key={quickAmount}
                  type="button"
                  onClick={() => setAmount(quickAmount.toString())}
                  className={cn(
                    'flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all',
                    amount === quickAmount.toString()
                      ? 'bg-primary text-white'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  )}
                >
                  ¥{quickAmount}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              分类
            </label>
            <div className="grid grid-cols-4 gap-2">
              {EXPENSE_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategory(cat.value)}
                    className={cn(
                      'flex flex-col items-center justify-center gap-1 p-3 rounded-xl transition-all',
                      category === cat.value
                        ? 'bg-primary text-white shadow-lg shadow-primary/30'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              备注
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="例如：晚餐、电影票..."
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              日期
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="flex-1 py-3 px-4 rounded-xl border border-border text-muted-foreground font-medium hover:bg-muted/50 transition-all"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={!amount || parseFloat(amount) <= 0}
              className="flex-1 py-3 px-4 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              保存
            </button>
          </div>
        </motion.form>
      )}
    </motion.div>
  );
}
