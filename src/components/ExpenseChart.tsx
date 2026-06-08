import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Expense, ExpenseCategory } from '../types';
import { PieChart, BarChart3, Filter, Calendar, TrendingUp } from './Icons';

type ChartType = 'pie' | 'bar';
type TimeRange = 'week' | 'month' | 'all';

interface ExpenseChartProps {
  expenses: Expense[];
}

const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  '餐饮': '#FF6B9D',
  '交通': '#60A5FA',
  '电影': '#34D399',
  '购物': '#A78BFA',
  '娱乐': '#FB923C',
  '住宿': '#F43F5E',
  '礼物': '#FBBF24',
  '其他': '#6B7280',
};

export function ExpenseChart({ expenses }: ExpenseChartProps) {
  const [chartType, setChartType] = useState<ChartType>('pie');
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | null>(null);

  const filteredExpenses = useMemo(() => {
    const now = new Date();
    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      if (timeRange === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return expenseDate >= weekAgo;
      } else if (timeRange === 'month') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return expenseDate >= monthAgo;
      }
      return true;
    });
  }, [expenses, timeRange]);

  const categoryData = useMemo(() => {
    const data: Record<ExpenseCategory, number> = {
      '餐饮': 0,
      '交通': 0,
      '电影': 0,
      '购物': 0,
      '娱乐': 0,
      '住宿': 0,
      '礼物': 0,
      '其他': 0,
    };
    filteredExpenses.forEach((expense) => {
      data[expense.category] += expense.amount;
    });
    return Object.entries(data)
      .filter(([, amount]) => amount > 0)
      .map(([category, amount]) => ({
        category: category as ExpenseCategory,
        amount,
        percentage: filteredExpenses.length > 0
          ? (amount / filteredExpenses.reduce((sum, e) => sum + e.amount, 0)) * 100
          : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [filteredExpenses]);

  const totalAmount = useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [filteredExpenses]);

  const piePaths = useMemo(() => {
    if (categoryData.length === 0) return [];
    
    const total = categoryData.reduce((sum, d) => sum + d.amount, 0);
    let currentAngle = -90;
    const centerX = 100;
    const centerY = 100;
    const radius = 80;

    return categoryData.map((item) => {
      const angle = (item.amount / total) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      currentAngle = endAngle;

      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      const x1 = centerX + radius * Math.cos(startRad);
      const y1 = centerY + radius * Math.sin(startRad);
      const x2 = centerX + radius * Math.cos(endRad);
      const y2 = centerY + radius * Math.sin(endRad);

      const largeArcFlag = angle > 180 ? 1 : 0;

      const path =
        categoryData.length === 1
          ? `M ${centerX} ${centerY - radius} A ${radius} ${radius} 0 1 1 ${centerX - 0.001} ${centerY - radius} Z`
          : `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

      return {
        path,
        color: CATEGORY_COLORS[item.category],
        category: item.category,
        amount: item.amount,
        percentage: item.percentage,
      };
    });
  }, [categoryData]);

  const maxBarAmount = useMemo(() => {
    return Math.max(...categoryData.map((d) => d.amount), 1);
  }, [categoryData]);

  if (filteredExpenses.length === 0) {
    return (
      <div className="bg-card rounded-2xl shadow-soft border border-border p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <PieChart className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">暂无数据</h3>
          <p className="text-muted-foreground">记录一些花销后即可查看统计图表</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl shadow-soft border border-border overflow-hidden">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-foreground">消费统计</h3>
            <p className="text-2xl font-bold text-primary mt-1">
              ¥{totalAmount.toFixed(2)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-muted rounded-lg p-1">
              <button
                onClick={() => setChartType('pie')}
                className={cn(
                  'p-2 rounded-md transition-all',
                  chartType === 'pie'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <PieChart className="w-4 h-4" />
              </button>
              <button
                onClick={() => setChartType('bar')}
                className={cn(
                  'p-2 rounded-md transition-all',
                  chartType === 'bar'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <BarChart3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {(['week', 'month', 'all'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={cn(
                'flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all',
                timeRange === range
                  ? 'bg-primary text-white'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              {range === 'week' ? '本周' : range === 'month' ? '本月' : '全部'}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        {chartType === 'pie' ? (
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative w-48 h-48">
              <svg width="200" height="200" viewBox="0 0 200 200">
                {piePaths.map((item, index) => (
                  <motion.path
                    key={item.category}
                    d={item.path}
                    fill={item.color}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: selectedCategory && selectedCategory !== item.category ? 0.3 : 1,
                      scale: selectedCategory === item.category ? 1.05 : 1,
                    }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="cursor-pointer"
                    onMouseEnter={() => setSelectedCategory(item.category)}
                    onMouseLeave={() => setSelectedCategory(null)}
                    onClick={() =>
                      setSelectedCategory(
                        selectedCategory === item.category ? null : item.category
                      )
                    }
                  />
                ))}
                <circle cx="100" cy="100" r="50" fill="white" />
                <text
                  x="100"
                  y="95"
                  textAnchor="middle"
                  className="text-sm fill-muted-foreground"
                >
                  总计
                </text>
                <text
                  x="100"
                  y="115"
                  textAnchor="middle"
                  className="text-base font-bold fill-primary"
                >
                  ¥{totalAmount.toFixed(0)}
                </text>
              </svg>
            </div>

            <div className="flex-1 space-y-2">
              {categoryData.map((item) => (
                <motion.div
                  key={item.category}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{
                    opacity: selectedCategory && selectedCategory !== item.category ? 0.4 : 1,
                    x: 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    'flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all',
                    selectedCategory === item.category && 'bg-primary/10'
                  )}
                  onClick={() =>
                    setSelectedCategory(
                      selectedCategory === item.category ? null : item.category
                    )
                  }
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: CATEGORY_COLORS[item.category] }}
                    />
                    <span className="text-sm text-foreground">{item.category}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-foreground">
                      ¥{item.amount.toFixed(2)}
                    </span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {item.percentage.toFixed(1)}%
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-end justify-between h-48 gap-2 mb-4">
              {categoryData.map((item, index) => (
                <motion.div
                  key={item.category}
                  className="flex-1 flex flex-col items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: selectedCategory && selectedCategory !== item.category ? 0.4 : 1,
                    y: 0,
                  }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <span className="text-xs font-medium text-foreground mb-1">
                    ¥{item.amount.toFixed(0)}
                  </span>
                  <motion.div
                    className="w-full rounded-t-lg cursor-pointer transition-all"
                    style={{ backgroundColor: CATEGORY_COLORS[item.category] }}
                    initial={{ height: 0 }}
                    animate={{
                      height: `${(item.amount / maxBarAmount) * 160}px`,
                      scale: selectedCategory === item.category ? 1.05 : 1,
                    }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    onClick={() =>
                      setSelectedCategory(
                        selectedCategory === item.category ? null : item.category
                      )
                    }
                    whileHover={{ opacity: 0.8 }}
                  />
                  <span className="text-xs text-muted-foreground mt-2 truncate w-full text-center">
                    {item.category}
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-border">
              <div className="bg-muted/50 rounded-xl p-3">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs">单笔最高</span>
                </div>
                <p className="text-lg font-bold text-foreground">
                  ¥{Math.max(...filteredExpenses.map((e) => e.amount), 0).toFixed(2)}
                </p>
              </div>
              <div className="bg-muted/50 rounded-xl p-3">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs">消费笔数</span>
                </div>
                <p className="text-lg font-bold text-foreground">
                  {filteredExpenses.length}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
