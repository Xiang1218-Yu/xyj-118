import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, MapPin, ArrowRight, Calendar, Wallet, Users, Clock, Lightbulb } from 'lucide-react';
import { HeartParticles } from '../components/HeartParticles';
import { OptionCard } from '../components/OptionCard';
import { LoadingAnimation } from '../components/LoadingAnimation';
import { HistoryModal } from '../components/HistoryModal';
import { usePlanStore } from '../store/usePlanStore';
import type { RelationshipStage, BudgetLevel } from '../types';

const relationshipStages: { value: RelationshipStage; label: string; icon: string; description: string }[] = [
  { value: 'dating', label: '初识约会', icon: '🌸', description: '刚认识，正在了解彼此' },
  { value: 'passionate', label: '热恋期', icon: '🔥', description: '浓情蜜意，每时每刻都想在一起' },
  { value: 'stable', label: '稳定期', icon: '💑', description: '关系稳定，互相了解' },
  { value: 'longterm', label: '长期关系', icon: '💍', description: '已经在一起很久了' },
];

const interests: { value: string; label: string; icon: string }[] = [
  { value: '美食', label: '美食', icon: '🍜' },
  { value: '电影', label: '电影', icon: '🎬' },
  { value: '户外', label: '户外', icon: '🌿' },
  { value: '文艺', label: '文艺', icon: '🎨' },
  { value: '运动', label: '运动', icon: '🚴' },
  { value: '探店', label: '探店', icon: '☕' },
  { value: '手作', label: '手作', icon: '🎭' },
  { value: '拍照', label: '拍照', icon: '📸' },
  { value: '游戏', label: '游戏', icon: '🎮' },
  { value: '旅行', label: '旅行', icon: '✈️' },
  { value: '居家', label: '居家', icon: '🏠' },
  { value: '音乐', label: '音乐', icon: '🎵' },
];

const budgets: { value: BudgetLevel; label: string; icon: string; description: string }[] = [
  { value: 'low', label: '低成本', icon: '💰', description: '100元以内' },
  { value: 'medium', label: '适中', icon: '💴', description: '100-500元' },
  { value: 'high', label: '充裕', icon: '💎', description: '500-1000元' },
  { value: 'luxury', label: '豪华', icon: '👑', description: '1000元以上' },
];

export function HomePage() {
  const navigate = useNavigate();
  const { preferences, setRelationshipStage, toggleInterest, setBudget, generatePlan, isGenerating, savedPlans, loadSavedPlans } = usePlanStore();
  const [step, setStep] = useState(1);
  const [showHistory, setShowHistory] = useState(false);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleGenerate = async () => {
    await generatePlan();
    navigate('/plan');
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return !!preferences.relationshipStage;
      case 2:
        return preferences.interests.length >= 3;
      case 3:
        return !!preferences.budget;
      default:
        return false;
    }
  };

  if (isGenerating) {
    return <LoadingAnimation />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <HeartParticles />
      <HistoryModal isOpen={showHistory} onClose={() => setShowHistory(false)} />

      <div className="relative z-10">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-20 backdrop-blur-md bg-background/80 border-b border-border"
        >
          <div className="container px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-pink-500 rounded-xl flex items-center justify-center">
                  <Heart className="text-white" size={20} fill="currentColor" />
                </div>
                <div>
                  <h1 className="text-xl font-bold gradient-text">约会策划师</h1>
                  <p className="text-xs text-muted-foreground">为你们定制专属浪漫</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/ideas')}
                  className="flex items-center gap-2 px-4 py-2 bg-white/80 hover:bg-white rounded-xl border border-border hover:border-primary/30 transition-all duration-300 group"
                >
                  <Lightbulb size={18} className="text-primary" />
                  <span className="text-sm font-medium text-foreground">灵感社区</span>
                </button>
                <button
                  onClick={() => {
                    loadSavedPlans();
                    setShowHistory(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-white/80 hover:bg-white rounded-xl border border-border hover:border-primary/30 transition-all duration-300"
                >
                  <Clock size={18} className="text-primary" />
                  <span className="text-sm font-medium text-foreground hidden sm:inline">历史记录</span>
                  {savedPlans.length > 0 && (
                    <span className="px-1.5 h-4 min-w-[16px] flex items-center justify-center bg-primary text-white text-xs font-bold rounded-full">
                      {savedPlans.length}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.header>

        <main className="container px-4 py-8 md:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <Sparkles className="text-primary" size={16} />
              <span className="text-primary text-sm font-medium">AI 智能生成</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display">
              告诉我们你们的故事
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              只需回答几个简单问题，我们将为你们量身定制独一无二的约会方案 💖
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <div className="flex items-center justify-center mb-12">
              {[1, 2, 3].map((s, index) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                      step >= s
                        ? 'bg-primary text-white shadow-lg shadow-primary/30'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {step > s ? '✓' : s}
                  </div>
                  {index < 2 && (
                    <div
                      className={`w-16 md:w-24 h-1 mx-2 rounded transition-all duration-300 ${
                        step > s ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {step === 1 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
                        <Users className="text-pink-600" size={20} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">你们的关系阶段</h2>
                        <p className="text-sm text-muted-foreground">选择最符合你们现状的选项</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {relationshipStages.map((stage) => (
                        <OptionCard
                          key={stage.value}
                          icon={stage.icon}
                          label={stage.label}
                          description={stage.description}
                          selected={preferences.relationshipStage === stage.value}
                          onClick={() => setRelationshipStage(stage.value)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                        <Heart className="text-purple-600" size={20} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">你们的共同爱好</h2>
                        <p className="text-sm text-muted-foreground">
                          至少选择 3 个 <span className="text-primary">({preferences.interests.length}/12)</span>
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {interests.map((interest) => (
                        <OptionCard
                          key={interest.value}
                          icon={interest.icon}
                          label={interest.label}
                          selected={preferences.interests.includes(interest.value)}
                          onClick={() => toggleInterest(interest.value)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                        <Wallet className="text-amber-600" size={20} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">预算范围</h2>
                        <p className="text-sm text-muted-foreground">选择你们期望的约会预算</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {budgets.map((budget) => (
                        <OptionCard
                          key={budget.value}
                          icon={budget.icon}
                          label={budget.label}
                          description={budget.description}
                          selected={preferences.budget === budget.value}
                          onClick={() => setBudget(budget.value)}
                        />
                      ))}
                    </div>

                    <div className="bg-gradient-to-r from-primary/5 to-pink-50 rounded-2xl p-6 border border-primary/10 mt-8">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Calendar className="text-primary" size={24} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-2">即将为你们生成专属方案</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            我们的 AI 将根据你们的关系阶段、兴趣爱好和预算范围，智能生成一份包含多个活动、时间安排和惊喜彩蛋的完整约会方案。
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <MapPin size={14} className="text-primary" />
                              <span>本地推荐</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock size={14} className="text-primary" />
                              <span>约需 3 秒</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Sparkles size={14} className="text-primary" />
                              <span>专属定制</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-between mt-12">
              <button
                onClick={handleBack}
                disabled={step === 1}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  step === 1
                    ? 'opacity-0 pointer-events-none'
                    : 'border border-border hover:bg-secondary/30'
                }`}
              >
                上一步
              </button>

              {step < 3 ? (
                <button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                    canProceed()
                      ? 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/30 hover:shadow-xl'
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                  }`}
                >
                  下一步
                  <ArrowRight size={18} />
                </button>
              ) : (
                <button
                  onClick={handleGenerate}
                  disabled={!canProceed()}
                  className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                    canProceed()
                      ? 'bg-gradient-to-r from-primary to-pink-500 text-white hover:shadow-lg hover:shadow-primary/40 hover:scale-105'
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                  }`}
                >
                  <Sparkles size={18} />
                  生成约会方案
                </button>
              )}
            </div>
          </motion.div>
        </main>

        <footer className="py-8 text-center text-muted-foreground text-sm">
          <p className="flex items-center justify-center gap-2">
            用心策划每一次约会 <Heart className="text-primary" size={14} fill="currentColor" />
          </p>
        </footer>
      </div>
    </div>
  );
}
