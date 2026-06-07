import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface SurpriseBoxProps {
  content: string;
  index: number;
}

export function SurpriseBox({ content, index }: SurpriseBoxProps) {
  const [isOpen, setIsOpen] = useState(false);

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
              <div>
                <p className="font-medium text-rose-800 mb-2">
                  给你们的小惊喜
                </p>
                <p className="text-rose-700 leading-relaxed">{content}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
