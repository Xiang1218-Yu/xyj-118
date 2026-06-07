import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, TrendingUp, Clock, Filter, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIdeaStore } from '../store/useIdeaStore';
import { IdeaCard } from '../components/IdeaCard';
import { IdeaForm } from '../components/IdeaForm';
import { cn } from '@/lib/utils';
import type { IdeaCategory } from '../types';

const categories: (IdeaCategory | '全部')[] = [
  '全部',
  '美食',
  '电影',
  '户外',
  '文艺',
  '运动',
  '探店',
  '手作',
  '拍照',
  '游戏',
  '旅行',
  '居家',
  '其他',
];

const categoryEmojis: Record<string, string> = {
  '全部': '🌟',
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

export function IdeasPage() {
  const navigate = useNavigate();
  const { 
    ideas, 
    filterCategory, 
    sortBy, 
    setFilterCategory, 
    setSortBy, 
    loadIdeas, 
    getFilteredIdeas 
  } = useIdeaStore();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadIdeas();
  }, [loadIdeas]);

  const filteredIdeas = getFilteredIdeas();

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-b from-primary/10 to-transparent pb-8">
        <div className="container pt-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={20} />
              <span>返回</span>
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-full shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all font-medium"
            >
              <Plus size={18} />
              <span>发布灵感</span>
            </motion.button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
              <Lightbulb size={16} />
              <span>灵感社区</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 font-display">
              约会创意灵感
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              来自世界各地情侣分享的浪漫创意，找到属于你们的独特约会方式 💖
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-8"
          >
            <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-border/50">
              <div className="text-2xl font-bold text-primary">{ideas.length}</div>
              <div className="text-xs text-muted-foreground mt-1">创意灵感</div>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-border/50">
              <div className="text-2xl font-bold text-primary">
                {ideas.reduce((sum, idea) => sum + idea.likes, 0)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">累计点赞</div>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-border/50">
              <div className="text-2xl font-bold text-primary">
                {ideas.filter((idea) => idea.isLiked).length}
              </div>
              <div className="text-xs text-muted-foreground mt-1">已收藏</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col md:flex-row gap-4 mb-6"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Filter size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">分类筛选</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={cn(
                      'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                      'flex items-center gap-1.5',
                      filterCategory === cat
                        ? 'bg-primary text-white shadow-md shadow-primary/20'
                        : 'bg-white text-muted-foreground hover:bg-primary/5 border border-border/50'
                    )}
                  >
                    <span>{categoryEmojis[cat]}</span>
                    <span>{cat}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="md:w-auto">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-medium text-foreground">排序方式</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSortBy('latest')}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                    'flex items-center gap-1.5',
                    sortBy === 'latest'
                      ? 'bg-primary text-white shadow-md shadow-primary/20'
                      : 'bg-white text-muted-foreground hover:bg-primary/5 border border-border/50'
                  )}
                >
                  <Clock size={14} />
                  <span>最新发布</span>
                </button>
                <button
                  onClick={() => setSortBy('popular')}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                    'flex items-center gap-1.5',
                    sortBy === 'popular'
                      ? 'bg-primary text-white shadow-md shadow-primary/20'
                      : 'bg-white text-muted-foreground hover:bg-primary/5 border border-border/50'
                  )}
                >
                  <TrendingUp size={14} />
                  <span>最受欢迎</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container pb-16">
        {filteredIdeas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIdeas.map((idea, index) => (
              <IdeaCard key={idea.id} idea={idea} index={index} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">💭</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              暂无相关灵感
            </h3>
            <p className="text-muted-foreground mb-6">
              换个分类看看，或者成为第一个分享灵感的人吧！
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full shadow-lg shadow-primary/30 hover:shadow-xl transition-all font-medium"
            >
              <Plus size={18} />
              <span>发布第一个灵感</span>
            </button>
          </motion.div>
        )}
      </div>

      {showForm && <IdeaForm onClose={() => setShowForm(false)} />}
    </div>
  );
}
