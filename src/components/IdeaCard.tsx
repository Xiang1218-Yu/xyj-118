import { motion } from 'framer-motion';
import { Heart, Calendar, Tag } from 'lucide-react';
import type { Idea } from '../types';
import { cn } from '@/lib/utils';
import { useIdeaStore } from '../store/useIdeaStore';

interface IdeaCardProps {
  idea: Idea;
  index: number;
}

const categoryEmojis: Record<string, string> = {
  '美食': '🍜',
  '电影': '🎬',
  '户外': '🌿',
  '文艺': '🎨',
  '运动': '🚴',
  '探店': '☕',
  '手作': '🎭',
  '拍照': '📸',
  '游戏': '🎮',
  '旅行': '✈️',
  '居家': '🏠',
  '其他': '💡',
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const diffMs = nowOnly.getTime() - dateOnly.getTime();
  const diffDays = Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)));
  
  if (diffDays === 0) return '今天';
  if (diffDays === 1) return '昨天';
  if (diffDays < 7) return `${diffDays}天前`;
  
  return date.toLocaleDateString('zh-CN', {
    month: 'long',
    day: 'numeric',
  });
}

export function IdeaCard({ idea, index }: IdeaCardProps) {
  const { toggleLike } = useIdeaStore();
  const emoji = categoryEmojis[idea.category] || '💡';

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden border border-border/50 hover:shadow-xl transition-all duration-300 flex flex-col"
    >
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{emoji}</span>
            <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
              {idea.category}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Calendar size={14} />
            <span>{formatDate(idea.createdAt)}</span>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
          {idea.title}
        </h3>

        <p className="text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-4">
          {idea.content}
        </p>

        {idea.tags.length > 0 && (
          <div className="flex items-center gap-1.5 mt-4 flex-wrap">
            <Tag size={14} className="text-muted-foreground flex-shrink-0" />
            {idea.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-secondary/50 text-secondary-foreground text-xs rounded-md"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <button
            onClick={() => toggleLike(idea.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300',
              'hover:bg-primary/5 active:scale-95',
              idea.isLiked ? 'text-primary' : 'text-muted-foreground hover:text-primary'
            )}
          >
            <motion.div
              key={idea.id + '-' + idea.isLiked}
              animate={idea.isLiked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Heart
                size={20}
                className={cn('transition-colors duration-300', idea.isLiked && 'fill-primary')}
              />
            </motion.div>
            <span className="text-sm font-medium">{idea.likes}</span>
          </button>

          <span className="text-xs text-muted-foreground">
            匿名发布
          </span>
        </div>
      </div>
    </motion.article>
  );
}
