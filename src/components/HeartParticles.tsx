import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Heart {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  delay: number;
}

export function HeartParticles() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heartsRef = useRef<Heart[]>([]);

  useEffect(() => {
    const hearts: Heart[] = [];
    for (let i = 0; i < 20; i++) {
      hearts.push({
        id: i,
        x: Math.random() * 100,
        y: 100 + Math.random() * 20,
        size: 12 + Math.random() * 24,
        speed: 15 + Math.random() * 25,
        opacity: 0.1 + Math.random() * 0.4,
        delay: Math.random() * 5,
      });
    }
    heartsRef.current = hearts;
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
    >
      {heartsRef.current.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute"
          style={{
            left: `${heart.x}%`,
            fontSize: `${heart.size}px`,
            opacity: heart.opacity,
          }}
          animate={{
            y: ['100vh', '-10vh'],
            x: [0, 20, -20, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            y: {
              duration: heart.speed,
              repeat: Infinity,
              delay: heart.delay,
              ease: 'linear',
            },
            x: {
              duration: 3,
              repeat: Infinity,
              delay: heart.delay,
              ease: 'easeInOut',
            },
            rotate: {
              duration: 4,
              repeat: Infinity,
              delay: heart.delay,
              ease: 'easeInOut',
            },
          }}
        >
          💖
        </motion.div>
      ))}
    </div>
  );
}
