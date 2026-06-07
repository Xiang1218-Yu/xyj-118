import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Heart, Trash2, Search, Plus, Filter, 
  Sparkles, AlertCircle, Check, User, Settings,
  BookOpen, TrendingUp
} from 'lucide-react';
import type { CollectedSurprise, RelationshipStage, BudgetLevel } from '../types';
import { useSurpriseStore } from '../store/useSurpriseStore';
import { cn } from '@/lib/utils';

interface SurpriseLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const stageOptions: { value: RelationshipStage | 'all'; label: string; icon: string }[] = [
  { value: 'all', label: '全部', icon: '💕' },
  { value: 'dating', label: '初识约会', icon: '🌸' },
  { value: 'passionate', label: '热恋期', icon: '🔥' },
  { value: 'stable', label: '稳定期', icon: '💑' },
  { value: 'longterm', label: '长期关系', icon: '💍' },
];

const budgetOptions: { value: BudgetLevel | 'all'; label: string; icon: string }[] = [
  { value: 'all', label: '全部', icon: '💰' },
  { value: 'low', label: '低成本', icon: '💵' },
  { value: 'medium', label: '适中', icon: '💴' },
  { value: 'high', label: '充裕', icon: '💎' },
  { value: 'luxury', label: '豪华', icon: '👑' },
];

const stageSelectOptions: { value: RelationshipStage; label: string }[] = [
  { value: 'dating', label: '初识约会' },
  { value: 'passionate', label: '热恋期' },
  { value: 'stable', label: '稳定期' },
  { value: 'longterm', label: '长期关系' },
];

const budgetSelectOptions: { value: BudgetLevel; label: string }[] = [
  { value: 'low', label: '低成本' },
  { value: 'medium', label: '适中' },
  { value: 'high', label: '充裕' },
  { value: 'luxury', label: '豪华' },
];

export function SurpriseLibraryModal({ isOpen, onClose }: SurpriseLibraryModalProps) {
  const {
    collectedSurprises,
    filterStage,
    filterBudget,
    searchQuery,
    showFavoritesOnly,
    setFilterStage,
    setFilterBudget,
    setSearchQuery,
    setShowFavoritesOnly,
    toggleFavorite,
    removeSurprise,
    addCustomSurprise,
    loadCollectedSurprises,
    getFilteredSurprises,
    getFavoriteSurprises,
  } = useSurpriseStore();

  const [showAddForm, setShowAddForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [newStages, setNewStages] = useState<RelationshipStage[]>(['dating', 'passionate']);
  const [newBudgets, setNewBudgets] = useState<BudgetLevel[]>(['low', 'medium']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadCollectedSurprises();
    }
  }, [isOpen, loadCollectedSurprises]);

  const filteredSurprises = getFilteredSurprises();
  const favoriteCount = collectedSurprises.filter(s => s.isFavorite).length;
  const userAddedCount = collectedSurprises.filter(s => s.source === 'user').length;
  const matchingFavorites = getFavoriteSurprises();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
    });
  };

  const handleToggleStage = (stage: RelationshipStage) => {
    setNewStages(prev => 
      prev.includes(stage) 
        ? prev.filter(s => s !== stage)
        : [...prev, stage]
    );
  };

  const handleToggleBudget = (budget: BudgetLevel) => {
    setNewBudgets(prev => 
      prev.includes(budget) 
        ? prev.filter(b => b !== budget)
        : [...prev, budget]
    );
  };

  const handleAddSurprise = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim() || newStages.length === 0 || newBudgets.length === 0) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    addCustomSurprise(newContent.trim(), newStages, newBudgets);
    
    setNewContent('');
    setNewStages(['dating', 'passionate']);
    setNewBudgets(['low', 'medium']);
    setShowAddForm(false);
    setIsSubmitting(false);
  };

  const handleRemove = (surpriseId: string) => {
    removeSurprise(surpriseId);
    setDeleteConfirm(null);
  };

  if (!isOpen) return null;

  const isAddValid = newContent.trim().length > 10 && newStages.length > 0 && newBudgets.length > 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        >
          <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-amber-50 to-rose-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-rose-500 rounded-xl flex items-center justify-center">
                <Sparkles className="text-white" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">彩蛋收藏库</h2>
                <p className="text-sm text-muted-foreground">
                  共收藏 {collectedSurprises.length} 个彩蛋
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-xl hover:shadow-lg hover:shadow-rose-500/30 transition-all"
              >
                <Plus size={16} />
                <span className="text-sm font-medium">手动添加</span>
              </button>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full hover:bg-black/5 flex items-center justify-center transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="px-6 py-4 border-b border-border bg-muted/30">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white rounded-xl p-3 border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen size={14} className="text-amber-500" />
                  <span className="text-xs text-muted-foreground">总收藏</span>
                </div>
                <p className="text-xl font-bold">{collectedSurprises.length}</p>
              </div>
              <div className="bg-white rounded-xl p-3 border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <Heart size={14} className="text-rose-500" fill="currentColor" />
                  <span className="text-xs text-muted-foreground">已收藏</span>
                </div>
                <p className="text-xl font-bold">{favoriteCount}</p>
              </div>
              <div className="bg-white rounded-xl p-3 border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <User size={14} className="text-indigo-500" />
                  <span className="text-xs text-muted-foreground">手动添加</span>
                </div>
                <p className="text-xl font-bold">{userAddedCount}</p>
              </div>
              <div className="bg-white rounded-xl p-3 border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp size={14} className="text-green-500" />
                  <span className="text-xs text-muted-foreground">可用彩蛋</span>
                </div>
                <p className="text-xl font-bold">{matchingFavorites.length}</p>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-b border-border flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索彩蛋内容..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-all text-sm"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl border transition-all text-sm",
                showFilters 
                  ? "bg-rose-50 border-rose-300 text-rose-700" 
                  : "bg-white border-border hover:bg-muted/50"
              )}
            >
              <Filter size={16} />
              <span>筛选</span>
            </button>
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl border transition-all text-sm",
                showFavoritesOnly 
                  ? "bg-rose-100 border-rose-300 text-rose-700" 
                  : "bg-white border-border hover:bg-muted/50"
              )}
            >
              <Heart size={16} fill={showFavoritesOnly ? "currentColor" : "none"} />
              <span>仅显示收藏</span>
            </button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden px-6 border-b border-border bg-muted/20"
              >
                <div className="py-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      关系阶段
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {stageOptions.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setFilterStage(opt.value)}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-1.5",
                            filterStage === opt.value
                              ? "bg-rose-500 text-white"
                              : "bg-white border border-border hover:bg-muted/50"
                          )}
                        >
                          <span>{opt.icon}</span>
                          <span>{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      预算范围
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {budgetOptions.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setFilterBudget(opt.value)}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-1.5",
                            filterBudget === opt.value
                              ? "bg-amber-500 text-white"
                              : "bg-white border border-border hover:bg-muted/50"
                          )}
                        >
                          <span>{opt.icon}</span>
                          <span>{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex-1 overflow-y-auto p-6">
            {filteredSurprises.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-4">
                  <Sparkles className="text-amber-300" size={32} />
                </div>
                <h3 className="text-lg font-semibold mb-2">暂无符合条件的彩蛋</h3>
                <p className="text-muted-foreground max-w-sm mb-6">
                  {searchQuery || showFavoritesOnly || filterStage !== 'all' || filterBudget !== 'all'
                    ? '尝试调整筛选条件，或点击下方按钮添加新的惊喜彩蛋'
                    : '还没有收藏任何彩蛋，快去方案中收藏喜欢的惊喜吧'}
                </p>
                {!showAddForm && (
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-xl hover:shadow-lg transition-all"
                  >
                    <Plus size={18} />
                    手动添加彩蛋
                  </button>
                )}
              </motion.div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {filteredSurprises.map((surprise, index) => (
                  <SurpriseCard
                    key={surprise.id}
                    surprise={surprise}
                    index={index}
                    onToggleFavorite={toggleFavorite}
                    onRemove={handleRemove}
                    deleteConfirm={deleteConfirm}
                    setDeleteConfirm={setDeleteConfirm}
                    formatDate={formatDate}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>

        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden flex flex-col"
              >
                <div className="p-6 border-b border-border bg-gradient-to-r from-indigo-50 to-purple-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white">
                        <Settings size={20} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">添加自定义彩蛋</h3>
                        <p className="text-sm text-muted-foreground">
                          创建专属于你们的浪漫惊喜
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="w-10 h-10 rounded-full hover:bg-black/5 flex items-center justify-center transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                <form onSubmit={handleAddSurprise} className="p-6 space-y-6 overflow-y-auto">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      惊喜内容 <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      placeholder="描述这个惊喜的具体内容，越详细越有感觉哦..."
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all resize-none"
                      maxLength={300}
                    />
                    <div className="flex justify-between items-center mt-1">
                      <p className={cn(
                        "text-xs",
                        newContent.length > 10 ? "text-green-600" : "text-muted-foreground"
                      )}>
                        {newContent.length > 10 ? "✓ 内容已足够详细" : "至少输入10个字符"}
                      </p>
                      <p className="text-xs text-muted-foreground">{newContent.length}/300</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      适合的关系阶段 <span className="text-rose-500">*</span>
                      <span className="text-xs text-muted-foreground font-normal ml-2">
                        (至少选择1个)
                      </span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {stageSelectOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleToggleStage(opt.value)}
                          className={cn(
                            "px-4 py-2.5 rounded-xl text-sm transition-all text-left flex items-center gap-2",
                            newStages.includes(opt.value)
                              ? "bg-indigo-100 border-2 border-indigo-400 text-indigo-700"
                              : "bg-white border-2 border-border hover:border-indigo-200"
                          )}
                        >
                          {newStages.includes(opt.value) && <Check size={14} />}
                          <span>{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      适合的预算范围 <span className="text-rose-500">*</span>
                      <span className="text-xs text-muted-foreground font-normal ml-2">
                        (至少选择1个)
                      </span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {budgetSelectOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleToggleBudget(opt.value)}
                          className={cn(
                            "px-4 py-2.5 rounded-xl text-sm transition-all text-left flex items-center gap-2",
                            newBudgets.includes(opt.value)
                              ? "bg-amber-100 border-2 border-amber-400 text-amber-700"
                              : "bg-white border-2 border-border hover:border-amber-200"
                          )}
                        >
                          {newBudgets.includes(opt.value) && <Check size={14} />}
                          <span>{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                    <p className="text-sm text-indigo-700 flex items-start gap-2">
                      <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                      <span>
                        添加的彩蛋将自动收藏，在生成方案时选择"使用收藏的彩蛋"即可使用。
                        所有数据仅保存在本地浏览器中。
                      </span>
                    </p>
                  </div>
                </form>

                <div className="p-6 border-t border-border bg-card flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-6 py-2.5 rounded-xl border border-border hover:bg-secondary/30 transition-colors font-medium"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleAddSurprise}
                    disabled={!isAddValid || isSubmitting}
                    className={cn(
                      'flex-1 py-2.5 px-6 rounded-xl font-medium transition-all duration-300',
                      'flex items-center justify-center gap-2',
                      isAddValid && !isSubmitting
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-lg hover:shadow-indigo-500/30'
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
                        <Plus size={18} />
                        添加彩蛋
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}

interface SurpriseCardProps {
  surprise: CollectedSurprise;
  index: number;
  onToggleFavorite: (id: string) => void;
  onRemove: (id: string) => void;
  deleteConfirm: string | null;
  setDeleteConfirm: (id: string | null) => void;
  formatDate: (date: string) => string;
}

function SurpriseCard({ 
  surprise, 
  index, 
  onToggleFavorite, 
  onRemove, 
  deleteConfirm, 
  setDeleteConfirm,
  formatDate 
}: SurpriseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "relative bg-gradient-to-br rounded-2xl p-5 border transition-all group",
        surprise.source === 'user'
          ? "from-indigo-50 to-purple-50 border-indigo-200"
          : "from-amber-50 to-rose-50 border-amber-200"
      )}
    >
      {surprise.source === 'user' && (
        <div className="absolute top-3 right-3">
          <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full flex items-center gap-1">
            <User size={10} />
            自定义
          </span>
        </div>
      )}

      <div className="flex items-start gap-3 mb-3">
        <span className="text-2xl">{surprise.source === 'user' ? '💡' : '💝'}</span>
        <p className="text-foreground leading-relaxed flex-1 pr-8">
          {surprise.content}
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {surprise.suitableFor.map(stage => (
          <span key={stage} className="px-2 py-0.5 bg-white/80 text-xs text-muted-foreground rounded-full">
            {stageOptions.find(o => o.value === stage)?.label || stage}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Settings size={10} />
            {surprise.budget.map(b => budgetOptions.find(o => o.value === b)?.icon).join('')}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatDate(surprise.createdAt)}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {deleteConfirm === surprise.id ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1"
            >
              <span className="text-xs text-muted-foreground mr-1">确认删除？</span>
              <button
                onClick={() => onRemove(surprise.id)}
                className="px-2 py-1 bg-rose-500 text-white text-xs rounded-lg hover:bg-rose-600 transition-colors"
              >
                确认
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-lg hover:bg-gray-300 transition-colors"
              >
                取消
              </button>
            </motion.div>
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onToggleFavorite(surprise.id)}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                  surprise.isFavorite
                    ? "bg-rose-500 text-white"
                    : "bg-white/80 text-muted-foreground hover:text-rose-500 border border-border"
                )}
                title={surprise.isFavorite ? "取消收藏" : "加入收藏"}
              >
                <Heart size={14} fill={surprise.isFavorite ? "currentColor" : "none"} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDeleteConfirm(surprise.id)}
                className="w-8 h-8 rounded-full bg-white/80 text-muted-foreground hover:text-rose-500 hover:bg-rose-50 border border-border flex items-center justify-center transition-all"
                title="从收藏库移除"
              >
                <Trash2 size={14} />
              </motion.button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
