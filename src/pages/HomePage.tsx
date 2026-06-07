import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Sparkles, MapPin, ArrowRight, Calendar, Wallet, Users } from 'lucide-react';
import { HeartParticles } from '../components/HeartParticles';
import { OptionCard } from '../components/OptionCard';
import { LoadingAnimation } from '../components/LoadingAnimation';
import { usePlanStore } from '../store/usePlanStore';
import type { RelationshipStage, BudgetLevel } from '../types';

const relationshipOptions: { value: RelationshipStage; icon: string; label: string; description: string }[] = [
  { value: 'dating', icon: '🌷', label: '暧昧期', description: '心动萌芽，小心翼翼' },
  { value: 'passionate', icon: '🔥', label: '热恋期', description: '浓情蜜意，如胶似漆' },
  { value: 'stable', icon: '💕', label: '稳定期', description: '相知相惜，细水长流' },
  { value: 'longterm', icon: '👫', label: '老夫老妻', description: '默契十足，温馨日常' },
];

const interestOptions: { value: string; icon: string; label: string }[] = [
  { value: '美食', icon: '🍽️', label: '美食' },
  { value: '电影', icon: '🎬', label: '电影' },
  { value: '户外', icon: '🌳', label: '户外' },
  { value: '文艺', icon: '🎨', label: '文艺' },
  { value: '运动', icon: '🚴', label: '运动' },
  { value: '探店', icon: '☕', label: '探店' },
  { value: '手作', icon: '🎁', label: '手作' },
  { value: '拍照', icon: '📸', label: '拍照' },
];

const budgetOptions: { value: BudgetLevel; icon: string; label: string; description: string }[] = [
  { value: 'low', icon: '💰', label: '¥0-200', description: '经济实惠' },
  { value: 'medium', icon: '💸', label: '¥200-500', description: '舒适自在' },
  { value: 'high', icon: '💎', label: '¥500-1000', description: '品质享受' },
  { value: 'luxury', icon: '👑', label: '¥1000+', description: '奢华体验' },
];

const steps = [
  { icon: <Users className="text-primary" size={28} />, title: '选择偏好', desc: '告诉我们你们的恋爱阶段和喜好' },
  { icon: <Sparkles className="text-primary" size={28} />, title: '一键生成', desc: 'AI为你们精心策划专属行程' },
  { icon: <MapPin className="text-primary" size={28} />, title: '甜蜜约会', desc: '跟着方案享受浪漫时光' },
];

export function HomePage() {
  const navigate = useNavigate();
  const { preferences, isGenerating, setRelationshipStage, toggleInterest, setBudget, generatePlan } = usePlanStore();

  const handleGenerate = async () => {
    await generatePlan();
    navigate('/plan');
  };

  const canGenerate = preferences.interests.length > 0;

  if (isGenerating) {
    return <LoadingAnimation />;
  }

  return (
    <div className="min-h-screen relative">
      <HeartParticles />

      <div className="relative z-10">
        <section className="pt-20 pb-16 px-4">
          <div className="container max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6"
              >
                <Heart className="text-primary" size={18} fill="currentColor" />
                <span className="text-primary-700 text-sm font-medium">让每一次约会都充满惊喜</span>
              </motion.div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="gradient-text">今天去哪儿玩？</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                选择你们的恋爱阶段、兴趣爱好和预算，<br className="hidden sm:block" />
                一键生成专属约会方案，告别选择困难
              </p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-center gap-4 mb-12"
              >
                <div className="flex -space-x-3">
                  {['💑', '👩‍❤️‍👨', '💏', '💕'].map((emoji, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-lg border-2 border-background"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      {emoji}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  已有 <span className="font-semibold text-primary">10,000+</span> 对情侣在这里找到甜蜜灵感
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="container max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                三步打造 <span className="gradient-text">完美约会</span>
              </h2>
              <p className="text-muted-foreground">简单几步，为你们的爱情添彩</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="card-elegant p-6 text-center relative overflow-hidden group"
                >
                  <div className="absolute top-4 right-4 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="container max-w-5xl">
            <div className="glass-card p-8 md:p-12">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="space-y-10"
              >
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Calendar className="text-primary" size={20} />
                    </div>
                    <h3 className="text-2xl font-bold">你们的恋爱阶段</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {relationshipOptions.map((option) => (
                      <OptionCard
                        key={option.value}
                        icon={option.icon}
                        label={option.label}
                        description={option.description}
                        selected={preferences.relationshipStage === option.value}
                        onClick={() => setRelationshipStage(option.value)}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Heart className="text-primary" size={20} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">你们的兴趣爱好</h3>
                      <p className="text-sm text-muted-foreground mt-1">至少选择一项</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {interestOptions.map((option) => (
                      <OptionCard
                        key={option.value}
                        icon={option.icon}
                        label={option.label}
                        selected={preferences.interests.includes(option.value)}
                        onClick={() => toggleInterest(option.value)}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Wallet className="text-primary" size={20} />
                    </div>
                    <h3 className="text-2xl font-bold">预算范围</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {budgetOptions.map((option) => (
                      <OptionCard
                        key={option.value}
                        icon={option.icon}
                        label={option.label}
                        description={option.description}
                        selected={preferences.budget === option.value}
                        onClick={() => setBudget(option.value)}
                      />
                    ))}
                  </div>
                </div>

                <div className="pt-6 text-center">
                  <motion.button
                    whileHover={canGenerate ? { scale: 1.05 } : {}}
                    whileTap={canGenerate ? { scale: 0.98 } : {}}
                    onClick={handleGenerate}
                    disabled={!canGenerate}
                    className={`btn-primary text-lg px-12 py-4 inline-flex items-center gap-3 ${
                      !canGenerate ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <Sparkles size={20} />
                    生成约会方案
                    <ArrowRight size={20} />
                  </motion.button>
                  {!canGenerate && (
                    <p className="text-sm text-muted-foreground mt-3">请至少选择一项兴趣爱好</p>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <footer className="py-8 px-4 text-center text-muted-foreground text-sm">
          <p className="flex items-center justify-center gap-2">
            用 <Heart className="text-primary" size={14} fill="currentColor" /> 为每对情侣创造美好回忆
          </p>
        </footer>
      </div>
    </div>
  );
}
