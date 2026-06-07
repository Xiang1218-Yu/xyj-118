import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useState } from 'react';

const loadingSteps = [
  { text: '正在为你们策划浪漫...', progress: 20 },
  { text: '筛选最适合的约会地点...', progress: 40 },
  { text: '精心安排每一个细节...', progress: 60 },
  { text: '准备惊喜彩蛋...', progress: 80 },
  { text: '马上就好啦...', progress: 100 },
];

const floatingEmojis = ['💖', '💕', '💗', '💓', '💞', '🌸', '✨', '🌹', '🎀', '💝'];

export function LoadingAnimation() {
  const [currentStep, setCurrentStep] = useState(0);
  const progress = useMotionValue(0);
  const progressPercent = useTransform(progress, [0, 100], ['0%', '100%']);

  useEffect(() => {
    const stepDuration = 2500 / loadingSteps.length;
    
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % loadingSteps.length);
    }, stepDuration);

    const animation = animate(progress, 100, {
      duration: 2.5,
      ease: 'easeInOut',
    });

    return () => {
      clearInterval(stepInterval);
      animation.stop();
    };
  }, [progress]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 flex flex-col items-center justify-center z-50 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        {floatingEmojis.map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              rotate: [0, Math.random() * 20 - 10, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'easeInOut',
            }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      <div className="relative w-64 h-64 mb-8">
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute inset-0"
        >
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-3xl"
              style={{
                left: '50%',
                top: '50%',
                transformOrigin: '0 0',
                transform: `rotate(${i * 30}deg) translateY(-80px) translateX(-50%)`,
              }}
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.1,
                ease: 'easeInOut',
              }}
            >
              {floatingEmojis[i % floatingEmojis.length]}
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-rose-200/30 to-pink-200/30 backdrop-blur-sm"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            className="text-center"
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <span className="text-7xl block mb-2">💕</span>
            </motion.div>
            <motion.span
              className="text-rose-600 font-semibold text-sm"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              甜蜜加载中
            </motion.span>
          </motion.div>
        </div>
      </div>

      <div className="relative h-10 w-80 flex items-center justify-center mb-6">
        {loadingSteps.map((step, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: i === currentStep ? 1 : 0,
              y: i === currentStep ? 0 : i < currentStep ? -20 : 20,
            }}
            transition={{
              duration: 0.4,
              ease: 'easeInOut',
            }}
            className="absolute text-center text-lg text-rose-600 font-medium whitespace-nowrap"
          >
            <span className="inline-flex items-center gap-2">
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                ✨
              </motion.span>
              {step.text}
              <motion.span
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: 0.25 }}
              >
                ✨
              </motion.span>
            </span>
          </motion.p>
        ))}
      </div>

      <div className="w-80">
        <div className="flex justify-between text-sm text-rose-500 mb-2">
          <span className="font-medium">策划进度</span>
          <motion.span
            className="font-bold"
            key={currentStep}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
          >
            {loadingSteps[currentStep].progress}%
          </motion.span>
        </div>
        <div className="h-3 bg-rose-100 rounded-full overflow-hidden shadow-inner">
          <motion.div
            className="h-full rounded-full relative overflow-hidden"
            style={{ width: progressPercent }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-rose-400 via-pink-400 to-rose-400" />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
        </div>

        <div className="flex justify-between mt-3">
          {loadingSteps.map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full"
              animate={{
                backgroundColor: i <= currentStep ? '#FF6B9D' : '#FECDD3',
                scale: i === currentStep ? [1, 1.3, 1] : 1,
              }}
              transition={{
                scale: { duration: 0.3, repeat: i === currentStep ? Infinity : 0 },
              }}
            />
          ))}
        </div>
      </div>

      <motion.div
        className="mt-10 flex items-center gap-3 text-rose-400"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-2xl">💑</span>
        <span className="text-sm">正在为你们的甜蜜时光做准备...</span>
        <span className="text-2xl">💑</span>
      </motion.div>
    </div>
  );
}
