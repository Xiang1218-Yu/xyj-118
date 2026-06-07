import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface RadarChartProps {
  data: {
    dimension: string;
    score: number;
  }[];
  size?: number;
  color?: string;
}

export function RadarChart({ data, size = 300, color = '#ec4899' }: RadarChartProps) {
  const center = size / 2;
  const radius = size * 0.35;
  const sides = data.length;
  const angleStep = (Math.PI * 2) / sides;

  const points = useMemo(() => {
    return data.map((item, index) => {
      const angle = angleStep * index - Math.PI / 2;
      const r = (item.score / 100) * radius;
      return {
        x: center + Math.cos(angle) * r,
        y: center + Math.sin(angle) * r,
        labelX: center + Math.cos(angle) * (radius + 35),
        labelY: center + Math.sin(angle) * (radius + 35),
        dimension: item.dimension,
        score: item.score,
      };
    });
  }, [data, center, radius, angleStep]);

  const gridLevels = [0.25, 0.5, 0.75, 1];

  const pathD = useMemo(() => {
    if (points.length === 0) return '';
    return points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
      .join(' ') + ' Z';
  }, [points]);

  return (
    <div className="relative" style={{ width: size, height: size + 40 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.1" />
          </radialGradient>
        </defs>

        {gridLevels.map((level, i) => (
          <polygon
            key={i}
            points={data
              .map((_, index) => {
                const angle = angleStep * index - Math.PI / 2;
                const r = level * radius;
                return `${center + Math.cos(angle) * r},${center + Math.sin(angle) * r}`;
              })
              .join(' ')}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}

        {data.map((_, index) => {
          const angle = angleStep * index - Math.PI / 2;
          return (
            <line
              key={index}
              x1={center}
              y1={center}
              x2={center + Math.cos(angle) * radius}
              y2={center + Math.sin(angle) * radius}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          );
        })}

        <motion.path
          d={pathD}
          fill="url(#radarGradient)"
          stroke={color}
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />

        {points.map((point, index) => (
          <motion.g key={index}>
            <motion.circle
              cx={point.x}
              cy={point.y}
              r="6"
              fill={color}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1 + index * 0.1, duration: 0.3 }}
            />
            <motion.circle
              cx={point.x}
              cy={point.y}
              r="3"
              fill="white"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.1 + index * 0.1, duration: 0.3 }}
            />
          </motion.g>
        ))}
      </svg>

      {points.map((point, index) => (
        <motion.div
          key={`label-${index}`}
          className="absolute text-center"
          style={{
            left: point.labelX,
            top: point.labelY,
            transform: 'translate(-50%, -50%)',
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 + index * 0.1, duration: 0.3 }}
        >
          <div className="text-sm font-medium text-gray-700 whitespace-nowrap">
            {point.dimension}
          </div>
          <div className="text-xs text-gray-500">{point.score}分</div>
        </motion.div>
      ))}
    </div>
  );
}
