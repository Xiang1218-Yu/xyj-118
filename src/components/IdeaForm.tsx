import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Sparkles } from 'lucide-react';
import type { IdeaCategory } from '../types';
import { useIdeaStore } from '../store/useIdeaStore';
import { OptionCard } from './OptionCard';
import { cn } from '@/lib/utils';

interface IdeaFormProps {
  onClose: () => void;
}

const categories: { value: IdeaCategory; label: string; icon: string }[] = [
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
  { value: '其他', label: '其他', icon: '💡' },
];

const suggestedTags = ['浪漫', '温馨', '低成本', '有趣', '纪念', '治愈', '冒险', '甜蜜', '放松', '拍照'];

export function IdeaForm({ onClose }: IdeaFormProps) {
  const { addIdea } = useIdeaStore();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<IdeaCategory>('其他');
  const [tags, setTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag));
    } else if (tags.length < 5) {
      setTags([...tags, tag]);
    }
  };

  const handleAddCustomTag = () => {
    const trimmed = customTag.trim();
    if (trimmed && !tags.includes(trimmed) && tags.length < 5) {
      setTags([...tags, trimmed]);
      setCustomTag('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    addIdea({
      title: title.trim(),
      content: content.trim(),
      category,
      tags,
    });

    setIsSubmitting(false);
    onClose();
  };

  const isValid = title.trim().length > 0 && content.trim().length > 10;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-background rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-border flex items-center justify-between bg-gradient-to-r from-primary/10 to-secondary/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white">
                <Sparkles size={20} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">发布约会灵感</h2>
                <p className="text-sm text-muted-foreground">匿名分享你的浪漫创意 💝</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full hover:bg-foreground/10 flex items-center justify-center transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                标题 <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="给你的约会灵感起个名字..."
                className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                maxLength={50}
              />
              <p className="text-xs text-muted-foreground mt-1 text-right">{title.length}/50</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                内容 <span className="text-primary">*</span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="详细描述你的约会创意，让大家感受到那份浪漫..."
                rows={5}
                className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground mt-1 text-right">{content.length}/500</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                分类 <span className="text-primary">*</span>
              </label>
              <div className="grid grid-cols-4 gap-3">
                {categories.map((cat) => (
                  <OptionCard
                    key={cat.value}
                    icon={cat.icon}
                    label={cat.label}
                    selected={category === cat.value}
                    onClick={() => setCategory(cat.value)}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                标签 <span className="text-muted-foreground">(最多5个)</span>
              </label>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {suggestedTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleToggleTag(tag)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-sm transition-all duration-200',
                      tags.includes(tag)
                        ? 'bg-primary text-white'
                        : 'bg-secondary/50 text-secondary-foreground hover:bg-secondary/70'
                    )}
                  >
                    #{tag}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomTag())}
                  placeholder="添加自定义标签..."
                  className="flex-1 px-4 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm"
                  maxLength={10}
                />
                <button
                  type="button"
                  onClick={handleAddCustomTag}
                  disabled={!customTag.trim() || tags.length >= 5}
                  className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  添加
                </button>
              </div>

              {tags.length > 0 && (
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <span className="text-sm text-muted-foreground">已选：</span>
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full flex items-center gap-1"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleToggleTag(tag)}
                        className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/40 transition-colors"
                      >
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
              <p className="text-sm text-primary flex items-center gap-2">
                <span>🔒</span>
                所有发布均为匿名，不会显示任何个人信息
              </p>
            </div>
          </form>

          <div className="p-6 border-t border-border bg-card flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl border border-border hover:bg-secondary/30 transition-colors font-medium"
            >
              取消
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isValid || isSubmitting}
              className={cn(
                'flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300',
                'flex items-center justify-center gap-2',
                isValid && !isSubmitting
                  ? 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              )}
            >
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : (
                <>
                  <Send size={18} />
                  发布灵感
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
