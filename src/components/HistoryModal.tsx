import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Trash2, Eye, Heart, Clock, Sparkles, AlertCircle } from 'lucide-react';
import type { DatePlan } from '../types';
import { usePlanStore } from '../store/usePlanStore';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HistoryModal({ isOpen, onClose }: HistoryModalProps) {
  const navigate = useNavigate();
  const { savedPlans, loadSavedPlans, deleteSavedPlan, loadPlan, clearAllSavedPlans } = usePlanStore();
  const [selectedPlan, setSelectedPlan] = useState<DatePlan | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadSavedPlans();
    }
  }, [isOpen, loadSavedPlans]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleViewPlan = (plan: DatePlan, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    loadPlan(plan);
    onClose();
    navigate('/plan');
  };

  const handleDeletePlan = (planId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteSavedPlan(planId);
  };

  const handleClearAll = () => {
    clearAllSavedPlans();
    setShowConfirm(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-3xl max-h-[85vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        >
          <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-rose-50 to-pink-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Clock className="text-primary" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">历史方案</h2>
                <p className="text-sm text-muted-foreground">
                  共保存了 {savedPlans.length} 个方案
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {savedPlans.length > 0 && (
                <button
                  onClick={() => setShowConfirm(true)}
                  className="px-3 py-1.5 text-sm text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Trash2 size={14} />
                  清空全部
                </button>
              )}
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full hover:bg-black/5 flex items-center justify-center transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {savedPlans.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-4">
                  <Sparkles className="text-primary/50" size={32} />
                </div>
                <h3 className="text-lg font-semibold mb-2">还没有保存的方案</h3>
                <p className="text-muted-foreground max-w-sm">
                  生成方案后点击保存按钮，就可以在这里随时查看啦～
                </p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {savedPlans.map((plan, index) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative bg-card border border-border rounded-2xl p-5 hover:shadow-lg hover:border-primary/30 transition-all duration-300 cursor-pointer"
                    onClick={() => setSelectedPlan(selectedPlan?.id === plan.id ? null : plan)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg truncate">{plan.title}</h3>
                          <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full flex-shrink-0">
                            {plan.totalBudget}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                          <span className="flex items-center gap-1.5">
                            <Calendar size={14} />
                            {formatDate(plan.createdAt)}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin size={14} />
                            {plan.activities.length} 个行程
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Heart size={14} className="text-rose-500" />
                            ¥{plan.estimatedCost}
                          </span>
                        </div>

                        <AnimatePresence>
                          {selectedPlan?.id === plan.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="pt-4 mt-4 border-t border-border">
                                <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
                                  <AlertCircle size={14} className="text-amber-500" />
                                  {plan.weatherTip}
                                </p>
                                <div className="space-y-2 mb-4">
                                  {plan.activities.slice(0, 3).map((activity) => (
                                    <div
                                      key={activity.id}
                                      className="flex items-center gap-3 text-sm bg-muted/30 rounded-lg px-3 py-2"
                                    >
                                      <span className="text-primary font-medium w-12 flex-shrink-0">
                                        {activity.time}
                                      </span>
                                      <span className="truncate">{activity.name}</span>
                                    </div>
                                  ))}
                                  {plan.activities.length > 3 && (
                                    <p className="text-xs text-muted-foreground pl-15">
                                      还有 {plan.activities.length - 3} 个行程...
                                    </p>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <button
                          onClick={(e) => handleViewPlan(plan, e)}
                          className="w-10 h-10 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl flex items-center justify-center transition-colors"
                          title="查看方案"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={(e) => handleDeletePlan(plan.id, e)}
                          className="w-10 h-10 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded-xl flex items-center justify-center transition-colors"
                          title="删除方案"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        <AnimatePresence>
          {showConfirm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-white rounded-2xl p-6 max-w-sm mx-4 shadow-2xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="text-rose-500" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">确认清空</h3>
                    <p className="text-sm text-muted-foreground">此操作不可恢复</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-6">
                  确定要清空所有保存的历史方案吗？清空后将无法找回。
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className={cn(
                      'flex-1 px-4 py-2.5 rounded-xl font-medium transition-colors',
                      'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    )}
                  >
                    取消
                  </button>
                  <button
                    onClick={handleClearAll}
                    className={cn(
                      'flex-1 px-4 py-2.5 rounded-xl font-medium transition-colors',
                      'bg-rose-500 hover:bg-rose-600 text-white'
                    )}
                  >
                    确认清空
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
