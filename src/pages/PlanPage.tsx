import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, Reorder } from 'framer-motion';
import { ArrowLeft, Save, RotateCcw, Share2, Cloud, Heart, Sparkles, Clock, Layers, Eye, Highlighter, Check, AlertCircle, Edit3, GripVertical } from 'lucide-react';
import { HeartParticles } from '../components/HeartParticles';
import { TimelineItem } from '../components/TimelineItem';
import { SurpriseBox } from '../components/SurpriseBox';
import { LoadingAnimation } from '../components/LoadingAnimation';
import { HistoryModal } from '../components/HistoryModal';
import { EditActivityModal } from '../components/EditActivityModal';
import { usePlanStore } from '../store/usePlanStore';
import { comparePlans, getDifferentFields } from '../utils/planDiffUtils';
import { cn } from '@/lib/utils';
import type { DiffField, Activity } from '../types';

const planColors = [
  { primary: 'from-rose-500 to-pink-500', bg: 'bg-rose-50', border: 'border-rose-200', ring: 'ring-rose-400' },
  { primary: 'from-indigo-500 to-purple-500', bg: 'bg-indigo-50', border: 'border-indigo-200', ring: 'ring-indigo-400' },
  { primary: 'from-amber-500 to-orange-500', bg: 'bg-amber-50', border: 'border-amber-200', ring: 'ring-amber-400' },
];

const diffLegend: { field: DiffField; color: string; label: string }[] = [
  { field: 'name', color: 'bg-amber-400', label: '活动名称' },
  { field: 'description', color: 'bg-blue-400', label: '活动描述' },
  { field: 'location', color: 'bg-green-400', label: '地点' },
  { field: 'cost', color: 'bg-rose-400', label: '花费' },
  { field: 'duration', color: 'bg-purple-400', label: '时长' },
  { field: 'time', color: 'bg-indigo-400', label: '时间' },
  { field: 'type', color: 'bg-orange-400', label: '类型' },
];

export function PlanPage() {
  const navigate = useNavigate();
  const [showHistory, setShowHistory] = useState(false);
  const [showDiffHighlight, setShowDiffHighlight] = useState(true);
  const [viewMode, setViewMode] = useState<'compare' | 'single'>('compare');
  const [editMode, setEditMode] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const { 
    currentPlan, 
    currentPlans, 
    selectedPlanIndex,
    isGenerating, 
    savedPlans, 
    loadSavedPlans, 
    generateMultiplePlans, 
    saveCurrentPlan, 
    resetPreferences, 
    clearCurrentPlan,
    selectPlan,
    reorderActivities,
    updateActivity,
  } = usePlanStore();

  const hasMultiplePlans = currentPlans.length > 1;

  const diffData = useMemo(() => {
    if (currentPlans.length < 2) return null;
    return comparePlans(currentPlans);
  }, [currentPlans]);

  const handleRegenerate = async () => {
    await generateMultiplePlans();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    resetPreferences();
    clearCurrentPlan();
    navigate('/');
  };

  const handleSave = () => {
    saveCurrentPlan();
    alert('方案已保存！可以在历史记录中查看');
  };

  const handleEditActivity = (activity: Activity) => {
    setEditingActivity(activity);
    setShowEditModal(true);
  };

  const handleSaveActivity = (activityId: string, updates: Partial<Activity>) => {
    updateActivity(activityId, updates);
  };

  const handleReorderActivities = (newOrder: Activity[]) => {
    reorderActivities(newOrder);
  };

  const handleShare = async () => {
    const planToShare = currentPlans[selectedPlanIndex] || currentPlan;
    if (navigator.share && planToShare) {
      try {
        await navigator.share({
          title: planToShare.title,
          text: `我们的约会方案：${planToShare.title}，预算${planToShare.totalBudget}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('分享取消');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('链接已复制到剪贴板');
    }
  };

  if (isGenerating) {
    return <LoadingAnimation />;
  }

  if (!currentPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">还没有生成方案哦</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            去生成方案
          </button>
        </div>
      </div>
    );
  }

  const activePlan = currentPlans[selectedPlanIndex] || currentPlan;

  return (
    <div className="min-h-screen relative">
      <HeartParticles />
      <HistoryModal isOpen={showHistory} onClose={() => setShowHistory(false)} />
      <EditActivityModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        activity={editingActivity}
        onSave={handleSaveActivity}
      />

      <div className="relative z-10">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-20 backdrop-blur-md bg-background/80 border-b border-border"
        >
          <div className="container max-w-7xl px-4 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft size={20} />
                <span>返回首页</span>
              </button>

              <div className="flex items-center gap-2">
                {hasMultiplePlans && (
                  <>
                    <button
                      onClick={() => setViewMode(viewMode === 'compare' ? 'single' : 'compare')}
                      className={cn(
                        "btn-secondary flex items-center gap-2 transition-all",
                        viewMode === 'compare' && "bg-primary/10 border-primary/30"
                      )}
                    >
                      {viewMode === 'compare' ? <Layers size={16} /> : <Eye size={16} />}
                      <span className="hidden sm:inline">{viewMode === 'compare' ? '对比视图' : '单方案视图'}</span>
                    </button>
                    <button
                      onClick={() => setShowDiffHighlight(!showDiffHighlight)}
                      className={cn(
                        "btn-secondary flex items-center gap-2 transition-all",
                        showDiffHighlight && "bg-amber-100 border-amber-300 text-amber-700"
                      )}
                    >
                      <Highlighter size={16} />
                      <span className="hidden sm:inline">差异高亮</span>
                    </button>
                  </>
                )}
                {viewMode === 'single' && (
                  <button
                    onClick={() => setEditMode(!editMode)}
                    className={cn(
                      "btn-secondary flex items-center gap-2 transition-all",
                      editMode && "bg-primary/10 border-primary/30 text-primary"
                    )}
                  >
                    {editMode ? <Check size={16} /> : <Edit3 size={16} />}
                    <span className="hidden sm:inline">{editMode ? '完成编辑' : '编辑方案'}</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    loadSavedPlans();
                    setShowHistory(true);
                  }}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Clock size={16} />
                  <span className="hidden sm:inline">历史</span>
                  {savedPlans.length > 0 && (
                    <span className="px-1.5 h-4 min-w-[16px] flex items-center justify-center bg-primary text-white text-xs font-bold rounded-full">
                      {savedPlans.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={handleSave}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Save size={16} />
                  <span className="hidden sm:inline">保存</span>
                </button>
                <button
                  onClick={handleShare}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Share2 size={16} />
                  <span className="hidden sm:inline">分享</span>
                </button>
              </div>
            </div>
          </div>
        </motion.header>

        {hasMultiplePlans && viewMode === 'compare' && showDiffHighlight && diffData && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100 py-3"
          >
            <div className="container max-w-7xl px-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 text-amber-700">
                  <AlertCircle size={18} />
                  <span className="text-sm font-medium">差异图例：</span>
                </div>
                {diffLegend.map((item) => (
                  <div key={item.field} className="flex items-center gap-1.5">
                    <div className={cn("w-3 h-3 rounded", item.color)} />
                    <span className="text-xs text-muted-foreground">{item.label}</span>
                  </div>
                ))}
                {diffData.summaryDiffs.hasDifference && (
                  <div className="ml-auto flex items-center gap-2 text-amber-600 text-sm">
                    <Sparkles size={14} />
                    <span>共发现 {diffData.activityDiffs.filter(d => d.hasDifference).length} 处差异</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {hasMultiplePlans && viewMode === 'compare' ? (
          <div className="pb-16">
            <section className="py-8 px-4">
              <div className="container max-w-7xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-center mb-8"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
                    <Layers className="text-primary" size={16} />
                    <span className="text-primary-700 text-sm font-medium">
                      {currentPlans.length} 个方案对比
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">选择最适合你们的方案</h1>
                  <p className="text-muted-foreground">点击下方方案卡片选择偏好，或查看差异对比后决定</p>
                </motion.div>

                <div className={cn(
                  "grid gap-6 mb-8",
                  currentPlans.length === 2 ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1 lg:grid-cols-3"
                )}>
                  {currentPlans.map((plan, planIndex) => (
                    <motion.div
                      key={plan.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: planIndex * 0.1 }}
                      whileHover={{ y: -4 }}
                      onClick={() => selectPlan(planIndex)}
                      className={cn(
                        "cursor-pointer rounded-3xl overflow-hidden border-2 transition-all duration-300",
                        selectedPlanIndex === planIndex
                          ? cn(planColors[planIndex].ring, "ring-4 shadow-2xl scale-[1.02]")
                          : "border-border hover:border-primary/30",
                        "bg-white"
                      )}
                    >
                      <div className={cn(
                        "p-4 text-white bg-gradient-to-r",
                        planColors[planIndex].primary
                      )}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold">
                              {planIndex + 1}
                            </span>
                            <div>
                              <h3 className="font-bold text-lg">{plan.title}</h3>
                              <p className="text-xs text-white/80">方案 {planIndex + 1}</p>
                            </div>
                          </div>
                          {selectedPlanIndex === planIndex && (
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                              <Check className="text-green-500" size={18} />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="flex items-center justify-center gap-4 mb-4">
                          <div className={cn("px-4 py-2 rounded-xl text-center", planColors[planIndex].bg)}>
                            <p className="text-xs text-muted-foreground">预算范围</p>
                            <p className="font-bold">{plan.totalBudget}</p>
                          </div>
                          <div className={cn(
                            "px-4 py-2 rounded-xl text-center", 
                            planColors[planIndex].bg,
                            showDiffHighlight && diffData?.summaryDiffs.totalCost.isDifferent && "ring-2 ring-rose-400"
                          )}>
                            <p className="text-xs text-muted-foreground">预计花费</p>
                            <p className="font-bold">¥{plan.estimatedCost}</p>
                          </div>
                          <div className={cn(
                            "px-4 py-2 rounded-xl text-center", 
                            planColors[planIndex].bg,
                            showDiffHighlight && diffData?.summaryDiffs.activityCount.isDifferent && "ring-2 ring-purple-400"
                          )}>
                            <p className="text-xs text-muted-foreground">行程</p>
                            <p className="font-bold">{plan.activities.length} 项</p>
                          </div>
                        </div>

                        <div className="text-center text-sm text-muted-foreground mb-3">
                          <Cloud size={14} className="inline mr-1" />
                          {plan.weatherTip}
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            selectPlan(planIndex);
                            setViewMode('single');
                          }}
                          className={cn(
                            "w-full py-2.5 rounded-xl font-medium text-sm transition-all",
                            selectedPlanIndex === planIndex
                              ? "bg-primary text-white"
                              : "bg-secondary hover:bg-secondary/70"
                          )}
                        >
                          查看详情
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
                    <Heart className="text-pink-600" size={20} fill="currentColor" />
                  </div>
                  <h2 className="text-2xl font-bold">行程对比</h2>
                </div>

                <div className="space-y-6">
                  {diffData?.activityDiffs.map((activityDiff, globalIndex) => {
                    const maxActivities = Math.max(...currentPlans.map(p => p.activities.length));
                    return (
                      <div key={globalIndex} className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-muted-foreground">第 {globalIndex + 1} 项活动</span>
                          {activityDiff.hasDifference && showDiffHighlight && (
                            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                              存在差异
                            </span>
                          )}
                        </div>
                        <div className={cn(
                          "grid gap-4",
                          currentPlans.length === 2 ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1 lg:grid-cols-3"
                        )}>
                          {currentPlans.map((plan, planIndex) => {
                            const activity = plan.activities[globalIndex];
                            if (!activity) {
                              return (
                                <div
                                  key={`${plan.id}-empty-${globalIndex}`}
                                  className="h-full min-h-[200px] rounded-2xl border-2 border-dashed border-border flex items-center justify-center text-muted-foreground"
                                >
                                  <span className="text-sm">此方案不包含该活动</span>
                                </div>
                              );
                            }
                            const differentFields = showDiffHighlight 
                              ? getDifferentFields(activityDiff)
                              : [];
                            return (
                              <div key={`${plan.id}-${activity.id}`}>
                                <TimelineItem
                                  activity={activity}
                                  index={globalIndex}
                                  isLast={globalIndex === maxActivities - 1}
                                  differentFields={differentFields}
                                  showDiffHighlight={showDiffHighlight}
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>
        ) : (
          <>
            <section className="py-12 px-4">
              <div className="container max-w-5xl">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center mb-12"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4"
                  >
                    <Sparkles className="text-primary" size={16} />
                    <span className="text-primary-700 text-sm font-medium">为你们专属定制</span>
                  </motion.div>

                  <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    {activePlan.title}
                  </h1>

                  <div className="flex flex-wrap items-center justify-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Cloud size={18} className="text-primary" />
                      <span>{activePlan.weatherTip}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-6 mt-6">
                    <div className="card-elegant px-6 py-4">
                      <p className="text-sm text-muted-foreground mb-1">预算范围</p>
                      <p className="text-2xl font-bold gradient-text">{activePlan.totalBudget}</p>
                    </div>
                    <motion.div 
                      key={activePlan.estimatedCost}
                      initial={{ scale: 1 }}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 0.3 }}
                      className="card-elegant px-6 py-4 relative overflow-hidden"
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute inset-0 bg-gradient-to-r from-rose-500/5 to-pink-500/5"
                      />
                      <p className="text-sm text-muted-foreground mb-1 relative z-10">预计花费</p>
                      <motion.p 
                        key={activePlan.estimatedCost}
                        initial={{ scale: 1.2, color: '#e11d48' }}
                        animate={{ scale: 1, color: 'inherit' }}
                        className="text-2xl font-bold gradient-text relative z-10"
                      >
                        ¥{activePlan.estimatedCost}
                      </motion.p>
                    </motion.div>
                    <div className="card-elegant px-6 py-4">
                      <p className="text-sm text-muted-foreground mb-1">行程安排</p>
                      <p className="text-2xl font-bold gradient-text">{activePlan.activities.length} 项</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </section>

            <section className="pb-12 px-4">
              <div className="container max-w-4xl">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center justify-between mb-8"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Heart className="text-primary" size={20} fill="currentColor" />
                    </div>
                    <h2 className="text-2xl font-bold">今日行程</h2>
                  </div>
                  {editMode && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-2 text-sm text-muted-foreground bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200"
                    >
                      <GripVertical size={14} className="text-amber-500" />
                      <span>拖拽手柄可调整顺序</span>
                    </motion.div>
                  )}
                </motion.div>

                {editMode ? (
                  <Reorder.Group
                    axis="y"
                    values={activePlan.activities}
                    onReorder={handleReorderActivities}
                    className="space-y-2"
                  >
                    {activePlan.activities.map((activity, index) => (
                      <Reorder.Item
                        key={activity.id}
                        value={activity}
                        id={activity.id}
                        className="group"
                      >
                        <TimelineItem
                          activity={activity}
                          index={index}
                          isLast={index === activePlan.activities.length - 1}
                          showEditControls={true}
                          onClick={() => handleEditActivity(activity)}
                          onEditClick={() => handleEditActivity(activity)}
                        />
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>
                ) : (
                  <div className="space-y-2">
                    {activePlan.activities.map((activity, index) => (
                      <TimelineItem
                        key={activity.id}
                        activity={activity}
                        index={index}
                        isLast={index === activePlan.activities.length - 1}
                        onClick={() => handleEditActivity(activity)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>

            <section className="py-12 px-4 bg-gradient-to-b from-transparent to-primary/5">
              <div className="container max-w-4xl">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3 mb-8"
                >
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                    <Sparkles className="text-amber-500" size={20} />
                  </div>
                  <h2 className="text-2xl font-bold">惊喜彩蛋</h2>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-6">
                  {activePlan.surprises.map((surprise, index) => (
                    <SurpriseBox key={index} content={surprise} index={index} />
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        <section className="py-16 px-4">
          <div className="container max-w-5xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card p-8 md:p-12"
            >
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                {hasMultiplePlans && viewMode === 'compare' 
                  ? `对方案 ${selectedPlanIndex + 1} 还满意吗？`
                  : '对这个方案还满意吗？'
                }
              </h3>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                不满意也没关系，点击重新生成，我们会为你们策划全新的约会方案
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRegenerate}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <RotateCcw size={18} />
                  重新生成方案
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  className="btn-secondary inline-flex items-center gap-2"
                >
                  <Save size={18} />
                  保存这个方案
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>

        <footer className="py-8 px-4 text-center text-muted-foreground text-sm">
          <p className="flex items-center justify-center gap-2">
            祝你们有个甜蜜的约会 <Heart className="text-primary" size={14} fill="currentColor" />
          </p>
        </footer>
      </div>
    </div>
  );
}
