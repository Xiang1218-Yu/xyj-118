import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Copy, Check, ChevronLeft, Shuffle, HeartCrack, Sunrise, Sunset, MessageCircleHeart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HeartParticles } from '../components/HeartParticles';
import loveMessagesData from '../data/loveMessages.json';
import type { LoveMessage, LoveMessageCategory } from '../types';

const categoryConfig: { value: LoveMessageCategory; label: string; icon: React.ReactNode; description: string; color: string }[] = [
  { 
    value: 'romantic', 
    label: '浪漫情话', 
    icon: <Heart size={20} />, 
    description: '深情款款的浪漫话语',
    color: 'from-pink-500 to-rose-500'
  },
  { 
    value: 'confession', 
    label: '表白文案', 
    icon: <MessageCircleHeart size={20} />, 
    description: '勇敢说出你的心意',
    color: 'from-red-500 to-pink-500'
  },
  { 
    value: 'morning', 
    label: '早安问候', 
    icon: <Sunrise size={20} />, 
    description: '温暖的清晨祝福',
    color: 'from-amber-500 to-orange-500'
  },
  { 
    value: 'night', 
    label: '晚安问候', 
    icon: <Sunset size={20} />, 
    description: '温馨的夜晚叮咛',
    color: 'from-indigo-500 to-purple-500'
  },
  { 
    value: 'cheesy', 
    label: '土味情话', 
    icon: <HeartCrack size={20} />, 
    description: '调皮撩人的土味套路',
    color: 'from-rose-500 to-amber-500'
  },
];

export function LoveMessagesPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<LoveMessageCategory>('romantic');
  const [currentMessage, setCurrentMessage] = useState<LoveMessage | null>(null);
  const [copied, setCopied] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const allMessages: LoveMessage[] = Object.entries(loveMessagesData).flatMap(([category, messages]) =>
    (messages as Array<Omit<LoveMessage, 'category'>>).map((msg) => ({ 
      ...msg, 
      category: category as LoveMessageCategory 
    }))
  );

  const getRandomMessage = useCallback(() => {
    setIsAnimating(true);
    const categoryMessages = allMessages.filter(m => m.category === selectedCategory);
    
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * categoryMessages.length);
      setCurrentMessage(categoryMessages[randomIndex]);
      setIsAnimating(false);
    }, 300);
  }, [selectedCategory, allMessages]);

  const handleCopy = async () => {
    if (!currentMessage) return;
    
    try {
      await navigator.clipboard.writeText(currentMessage.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const handleCategoryChange = (category: LoveMessageCategory) => {
    setSelectedCategory(category);
    setCurrentMessage(null);
  };

  const currentCategoryConfig = categoryConfig.find(c => c.value === selectedCategory)!;
  const currentCategoryMessages = allMessages.filter(m => m.category === selectedCategory);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <HeartParticles />
      
      <div className="relative z-10">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-20 backdrop-blur-md bg-background/80 border-b border-border"
        >
          <div className="container px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/')}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/80 hover:bg-white border border-border transition-all"
                >
                  <ChevronLeft size={20} className="text-foreground" />
                </button>
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-pink-500 rounded-xl flex items-center justify-center">
                  <MessageCircleHeart className="text-white" size={20} />
                </div>
                <div>
                  <h1 className="text-xl font-bold gradient-text">情话生成器</h1>
                  <p className="text-xs text-muted-foreground">让爱用心表达</p>
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        <main className="container px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex flex-wrap gap-3 justify-center">
              {categoryConfig.map((category) => (
                <button
                  key={category.value}
                  onClick={() => handleCategoryChange(category.value)}
                  className={cn(
                    "px-5 py-3 rounded-2xl border-2 transition-all duration-300 flex items-center gap-2",
                    selectedCategory === category.value
                      ? `bg-gradient-to-r ${category.color} text-white border-transparent shadow-lg scale-105`
                      : "bg-white/80 border-border hover:border-primary/50 text-foreground"
                  )}
                >
                  {category.icon}
                  <span className="font-medium">{category.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="max-w-3xl mx-auto"
          >
            <div className={`glass-card p-8 md:p-12 mb-8 relative overflow-hidden bg-gradient-to-br ${currentCategoryConfig.color}`}>
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
              
              <div className="relative z-10 text-center">
                <div className="flex items-center justify-center gap-2 mb-6 text-white/90">
                  {currentCategoryConfig.icon}
                  <span className="font-medium">{currentCategoryConfig.description}</span>
                </div>

                <AnimatePresence mode="wait">
                  {currentMessage ? (
                    <motion.div
                      key={currentMessage.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-2xl md:text-3xl font-bold text-white mb-6 leading-relaxed">
                        「{currentMessage.content}」
                      </p>
                      {currentMessage.tags && currentMessage.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 justify-center mb-6">
                          {currentMessage.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white/90 text-sm rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <p className="text-2xl md:text-3xl font-bold text-white/80 mb-6">
                        点击下方按钮，生成一句{currentCategoryConfig.label}
                      </p>
                      <p className="text-white/60">
                        共 {currentCategoryMessages.length} 条精选内容
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={getRandomMessage}
                disabled={isAnimating}
                className={cn(
                  "px-8 py-4 rounded-2xl font-bold text-white text-lg transition-all duration-300 flex items-center gap-3 shadow-xl",
                  `bg-gradient-to-r ${currentCategoryConfig.color}`,
                  isAnimating && "opacity-70 cursor-not-allowed"
                )}
              >
                <Shuffle size={22} className={cn(isAnimating && "animate-spin")} />
                {currentMessage ? '换一句' : '生成'}
              </motion.button>

              {currentMessage && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopy}
                  className={cn(
                    "px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center gap-3",
                    copied
                      ? "bg-green-500 text-white"
                      : "bg-white/80 text-foreground border-2 border-border hover:border-primary/50"
                  )}
                >
                  {copied ? (
                    <>
                      <Check size={22} />
                      已复制
                    </>
                  ) : (
                    <>
                      <Copy size={22} />
                      一键复制
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-4xl mx-auto mt-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <Sparkles size={24} className="text-primary" />
              <h2 className="text-2xl font-bold text-foreground">
                精选{currentCategoryConfig.label}
              </h2>
              <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                {currentCategoryMessages.length} 条
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence>
                {currentCategoryMessages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    className="card-elegant p-5 group relative"
                  >
                    <p className="text-foreground leading-relaxed mb-4 pr-12">
                      「{message.content}」
                    </p>
                    
                    {message.tags && message.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {message.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <button
                      onClick={() => {
                        setCurrentMessage(message);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-xl bg-primary/10 text-primary opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:text-white"
                      title="使用这句"
                    >
                      <Heart size={16} fill="currentColor" />
                    </button>

                    <button
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(message.content);
                        } catch (err) {
                          console.error('复制失败:', err);
                        }
                      }}
                      className="w-full mt-2 py-2 rounded-xl bg-muted/50 text-muted-foreground text-sm font-medium opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:text-white flex items-center justify-center gap-2"
                    >
                      <Copy size={14} />
                      复制
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </main>

        <footer className="py-8 text-center text-muted-foreground text-sm">
          <p className="flex items-center justify-center gap-2">
            用心说每一句情话 <Heart className="text-primary" size={14} fill="currentColor" />
          </p>
        </footer>
      </div>
    </div>
  );
}
