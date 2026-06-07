import { motion } from 'framer-motion';

const loadingTexts = [
  '正在为你们策划浪漫...',
  '筛选最适合的约会地点...',
  '精心安排每一个细节...',
  '准备惊喜彩蛋...',
  '马上就好啦...',
];

export function LoadingAnimation() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 flex flex-col items-center justify-center z-50">
      <div className="relative w-48 h-48">
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute inset-0"
        >
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl"
              style={{
                left: '50%',
                top: '50%',
                transformOrigin: '0 0',
                transform: `rotate(${i * 45}deg) translateY(-60px) translateX(-50%)`,
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.15,
              }}
            >
              💖
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <span className="text-6xl">💕</span>
        </motion.div>
      </div>

      <div className="mt-8 h-8 overflow-hidden">
        {loadingTexts.map((text, i) => (
          <motion.p
            key={text}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: [0, 1, 1, 0], y: [20, 0, 0, -20] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: i * 2.5,
              times: [0, 0.2, 0.8, 1],
            }}
            className="absolute w-full text-center text-lg text-rose-600 font-medium"
          >
            {text}
          </motion.p>
        ))}
      </div>

      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '200px' }}
        transition={{ duration: 2.5, repeat: Infinity }}
        className="mt-6 h-1.5 bg-rose-200 rounded-full overflow-hidden"
      >
        <motion.div
          className="h-full bg-gradient-to-r from-rose-400 to-pink-400 rounded-full"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </motion.div>
    </div>
  );
}
