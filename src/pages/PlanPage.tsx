import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, RotateCcw, Share2, Cloud, Heart, Sparkles, Clock } from 'lucide-react';
import { HeartParticles } from '../components/HeartParticles';
import { TimelineItem } from '../components/TimelineItem';
import { SurpriseBox } from '../components/SurpriseBox';
import { LoadingAnimation } from '../components/LoadingAnimation';
import { HistoryModal } from '../components/HistoryModal';
import { usePlanStore } from '../store/usePlanStore';

export function PlanPage() {
  const navigate = useNavigate();
  const [showHistory, setShowHistory] = useState(false);
  const { currentPlan, isGenerating, savedPlans, loadSavedPlans, generatePlan, saveCurrentPlan, resetPreferences, clearCurrentPlan } = usePlanStore();

  const handleRegenerate = async () => {
    await generatePlan();
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

  const handleShare = async () => {
    if (navigator.share && currentPlan) {
      try {
        await navigator.share({
          title: currentPlan.title,
          text: `我们的约会方案：${currentPlan.title}，预算${currentPlan.totalBudget}`,
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

  return (
    <div className="min-h-screen relative">
      <HeartParticles />
      <HistoryModal isOpen={showHistory} onClose={() => setShowHistory(false)} />

      <div className="relative z-10">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-20 backdrop-blur-md bg-background/80 border-b border-border"
        >
          <div className="container max-w-5xl px-4 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft size={20} />
                <span>返回首页</span>
              </button>

              <div className="flex items-center gap-2">
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
                {currentPlan.title}
              </h1>

              <div className="flex flex-wrap items-center justify-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Cloud size={18} className="text-primary" />
                  <span>{currentPlan.weatherTip}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6 mt-6">
                <div className="card-elegant px-6 py-4">
                  <p className="text-sm text-muted-foreground mb-1">预算范围</p>
                  <p className="text-2xl font-bold gradient-text">{currentPlan.totalBudget}</p>
                </div>
                <div className="card-elegant px-6 py-4">
                  <p className="text-sm text-muted-foreground mb-1">预计花费</p>
                  <p className="text-2xl font-bold gradient-text">¥{currentPlan.estimatedCost}</p>
                </div>
                <div className="card-elegant px-6 py-4">
                  <p className="text-sm text-muted-foreground mb-1">行程安排</p>
                  <p className="text-2xl font-bold gradient-text">{currentPlan.activities.length} 项</p>
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
              className="flex items-center gap-3 mb-8"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Heart className="text-primary" size={20} fill="currentColor" />
              </div>
              <h2 className="text-2xl font-bold">今日行程</h2>
            </motion.div>

            <div className="space-y-2">
              {currentPlan.activities.map((activity, index) => (
                <TimelineItem
                  key={activity.id}
                  activity={activity}
                  index={index}
                  isLast={index === currentPlan.activities.length - 1}
                />
              ))}
            </div>
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
              {currentPlan.surprises.map((surprise, index) => (
                <SurpriseBox key={index} content={surprise} index={index} />
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="container max-w-5xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card p-8 md:p-12"
            >
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                对这个方案还满意吗？
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
