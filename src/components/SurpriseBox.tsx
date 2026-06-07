import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Check } from 'lucide-react';
import { useSurpriseStore } from '../store/useSurpriseStore';
import type { Surprise } from '../types';

interface SurpriseBoxProps {
  content: string;
  index: number;
  surprise?: Surprise;
}

export function SurpriseBox({ content, index, surprise }: SurpriseBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { collectSurprise, isCollected, loadCollectedSurprises } = useSurpriseStore();
  const [collected, setCollected] = useState(false);

  useEffect(() => {
    loadCollectedSurprises();
  }, [loadCollectedSurprises]);

  useEffect(() => {
    setCollected(isCollected(content));
  }, [content, isCollected]);

  const handleCollect = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (surprise) {
      collectSurprise(surprise);
    } else {
      collectSurprise({
        id: `temp-${Date.now()}`,
        content,
        suitableFor: ['dating', 'passionate', 'stable', 'longterm'],
        budget: ['low', 'medium', 'high', 'luxury'],
      });
    }
    setCollected(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 + index * 0.2 }}
      className="relative"
    >
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.button
            key="closed"
            initial={{ rotate: -5 }}
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{
              rotate: {
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              },
            }}
            onClick={() => setIsOpen(true)}
            className="w-full p-6 bg-gradient-to-br from-amber-100 to-pink-100 rounded-2xl border-2 border-dashed border-amber-300 hover:border-amber-400 transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-center gap-3">
              <span className="text-4xl group-hover:scale-110 transition-transform">
                🎁
              </span>
              <div className="text-left">
                <p className="font-semibold text-amber-800">
                  惊喜彩蛋 #{index + 1}
                </p>
                <p className="text-sm text-amber-600">点击打开</p>
              </div>
              <Sparkles className="text-amber-500 animate-pulse" size={20} />
            </div>
          </motion.button>
        ) : (
          <motion.div
            key="open"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="p-6 bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl border border-rose-200"
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl">💝</span>
              <div className="flex-1">
                <p className="font-medium text-rose-800 mb-2">
                  给你们的小惊喜
                </p>
                <p className="text-rose-700 leading-relaxed">{content}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCollect}
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  collected
                    ? 'bg-rose-500 text-white'
                    : 'bg-white/80 hover:bg-white text-rose-400 hover:text-rose-500 border border-rose-200'
                }`}
                title={collected ? '已收藏' : '收藏到彩蛋库'}
              >
                <AnimatePresence mode="wait">
                  {collected ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Check size={18} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="heart"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Heart size={18} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
            {collected && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-rose-500 mt-3 flex items-center gap-1"
              >
                <Heart size={12} fill="currentColor" />
                已收藏到彩蛋库，下次可以直接使用
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
