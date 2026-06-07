import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Calendar, Plus, Trash2, Edit2, X, ChevronLeft, Sun, Moon, Palette, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HeartParticles } from '../components/HeartParticles';
import { useAnniversaryStore } from '../store/useAnniversaryStore';
import { useThemeStore, PRESET_THEMES } from '../store/useThemeStore';
import { 
  solarToLunar, 
  formatLunarDate, 
  formatSolarDate, 
  getDaysUntilNextAnniversary, 
  getAnniversaryYears 
} from '../utils/lunarUtils';
import type { Anniversary, CalendarType, AnniversaryType } from '../types';

const emojiOptions = ['💑', '💕', '💖', '💗', '💓', '💝', '💘', '🎂', '💍', '🌹', '🎉', '🎁', '⭐', '🌟', '✨', '🥰', '😍', '😘', '❤️', '🧡', '💛', '💚', '💙', '💜'];

const anniversaryTypes: { value: AnniversaryType; label: string; icon: string }[] = [
  { value: 'love', label: '恋爱纪念日', icon: '💑' },
  { value: 'birthday', label: '生日', icon: '🎂' },
  { value: 'wedding', label: '结婚纪念日', icon: '💍' },
  { value: 'other', label: '其他', icon: '🎉' },
];

export function AnniversaryPage() {
  const navigate = useNavigate();
  const { addAnniversary, updateAnniversary, deleteAnniversary, getSortedAnniversaries } = useAnniversaryStore();
  const { primaryColor, setPrimaryColor, resetTheme } = useThemeStore();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAnniversary, setEditingAnniversary] = useState<Anniversary | null>(null);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [customColor, setCustomColor] = useState(primaryColor);
  
  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    calendarType: 'solar' as CalendarType,
    type: 'love' as AnniversaryType,
    emoji: '💑',
    themeColor: primaryColor,
  });

  const sortedAnniversaries = getSortedAnniversaries();

  const resetForm = () => {
    setFormData({
      title: '',
      date: new Date().toISOString().split('T')[0],
      calendarType: 'solar',
      type: 'love',
      emoji: '💑',
      themeColor: primaryColor,
    });
  };

  const handleOpenAddModal = () => {
    resetForm();
    setEditingAnniversary(null);
    setShowAddModal(true);
  };

  const handleOpenEditModal = (anniversary: Anniversary) => {
    setEditingAnniversary(anniversary);
    setFormData({
      title: anniversary.title,
      date: anniversary.date,
      calendarType: anniversary.calendarType,
      type: anniversary.type,
      emoji: anniversary.emoji,
      themeColor: anniversary.themeColor,
    });
    setShowAddModal(true);
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) return;
    
    if (editingAnniversary) {
      updateAnniversary(editingAnniversary.id, formData);
    } else {
      addAnniversary(formData);
    }
    setShowAddModal(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个纪念日吗？')) {
      deleteAnniversary(id);
    }
  };

  const handleThemeSelect = (color: string) => {
    setPrimaryColor(color);
    setCustomColor(color);
  };

  const handleCustomColorChange = (color: string) => {
    setCustomColor(color);
    setPrimaryColor(color);
  };

  const formatDateDisplay = (dateStr: string, calendarType: CalendarType) => {
    if (calendarType === 'solar') {
      return formatSolarDate(dateStr);
    } else {
      return formatLunarDate(dateStr);
    }
  };

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const todayLunar = solarToLunar(today.getFullYear(), today.getMonth() + 1, today.getDate());

  return (
    <div className="min-h-screen relative overflow-hidden">
      <HeartParticles />
      
      <div className="relative z-10">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-20 backdrop-blur-md bg-background/80 border-b border-border"
        >
          <div className="container px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/')}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/80 hover:bg-white border border-border transition-all"
                >
                  <ChevronLeft size={20} className="text-foreground" />
                </button>
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-pink-500 rounded-xl flex items-center justify-center">
                  <Calendar className="text-white" size={20} />
                </div>
                <div>
                  <h1 className="text-xl font-bold gradient-text">纪念日</h1>
                  <p className="text-xs text-muted-foreground">记录每一个重要的日子</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowThemeModal(true)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/80 hover:bg-white border border-border hover:border-primary/30 transition-all"
                >
                  <Palette size={18} className="text-primary" />
                </button>
                <button
                  onClick={handleOpenAddModal}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-pink-500 text-white rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
                >
                  <Plus size={18} />
                  <span className="text-sm font-medium">添加</span>
                </button>
              </div>
            </div>
          </div>
        </motion.header>

        <main className="container px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">今天是</p>
                <p className="text-2xl font-bold text-foreground">{formatSolarDate(todayStr)}</p>
                <p className="text-sm text-primary mt-1">农历 {todayLunar.monthName}{todayLunar.dayName}</p>
              </div>
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center text-4xl animate-pulse-slow">
                {todayLunar.zodiac}
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {sortedAnniversaries.map((anniversary, index) => {
                const daysUntil = getDaysUntilNextAnniversary(anniversary.date, anniversary.calendarType);
                const years = getAnniversaryYears(anniversary.date);
                
                return (
                  <motion.div
                    key={anniversary.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    className="card-elegant overflow-hidden group"
                  >
                    <div 
                      className="h-2 w-full"
                      style={{ backgroundColor: anniversary.themeColor }}
                    />
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                            style={{ backgroundColor: `${anniversary.themeColor}20` }}
                          >
                            {anniversary.emoji}
                          </div>
                          <div>
                            <h3 className="font-bold text-foreground">{anniversary.title}</h3>
                            <p className="text-xs text-muted-foreground">
                              {anniversaryTypes.find(t => t.value === anniversary.type)?.label}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleOpenEditModal(anniversary)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
                          >
                            <Edit2 size={14} className="text-muted-foreground" />
                          </button>
                          <button
                            onClick={() => handleDelete(anniversary.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 size={14} className="text-rose-500" />
                          </button>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground mb-1">
                          {anniversary.calendarType === 'solar' ? '公历' : '农历'}
                        </p>
                        <p className="font-medium text-foreground">
                          {formatDateDisplay(anniversary.date, anniversary.calendarType)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div>
                          <p className="text-xs text-muted-foreground">已在一起</p>
                          <p className="text-lg font-bold text-foreground">{years} 年</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">下次还有</p>
                          <p className="text-lg font-bold" style={{ color: anniversary.themeColor }}>
                            {daysUntil === 0 ? '今天！' : `${daysUntil} 天`}
                          </p>
                        </div>
                      </div>

                      {daysUntil <= 7 && daysUntil > 0 && (
                        <div 
                          className="mt-4 px-3 py-2 rounded-xl text-sm font-medium text-center"
                          style={{ backgroundColor: `${anniversary.themeColor}15`, color: anniversary.themeColor }}
                        >
                          🎉 即将到来！还有 {daysUntil} 天
                        </div>
                      )}
                      {daysUntil === 0 && (
                        <div 
                          className="mt-4 px-3 py-2 rounded-xl text-sm font-medium text-center animate-pulse"
                          style={{ backgroundColor: `${anniversary.themeColor}20`, color: anniversary.themeColor }}
                        >
                          🎊 今天就是纪念日！
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {sortedAnniversaries.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-16"
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar size={32} className="text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">还没有纪念日</h3>
                <p className="text-muted-foreground mb-4">点击右上角添加按钮，记录你们的重要日子</p>
                <button
                  onClick={handleOpenAddModal}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <Plus size={18} />
                  添加纪念日
                </button>
              </motion.div>
            )}
          </div>
        </main>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-foreground">
                    {editingAnniversary ? '编辑纪念日' : '添加纪念日'}
                  </h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">标题</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="例如：在一起、TA的生日"
                      className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">纪念日类型</label>
                    <div className="grid grid-cols-4 gap-2">
                      {anniversaryTypes.map((type) => (
                        <button
                          key={type.value}
                          onClick={() => setFormData({ ...formData, type: type.value })}
                          className={cn(
                            "p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1",
                            formData.type === type.value
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          <span className="text-2xl">{type.icon}</span>
                          <span className="text-xs">{type.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">日期</label>
                    <div className="flex gap-2 mb-3">
                      <button
                        onClick={() => setFormData({ ...formData, calendarType: 'solar' })}
                        className={cn(
                          "flex-1 px-4 py-2 rounded-xl border-2 transition-all flex items-center justify-center gap-2",
                          formData.calendarType === 'solar'
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border text-muted-foreground"
                        )}
                      >
                        <Sun size={16} />
                        公历
                      </button>
                      <button
                        onClick={() => setFormData({ ...formData, calendarType: 'lunar' })}
                        className={cn(
                          "flex-1 px-4 py-2 rounded-xl border-2 transition-all flex items-center justify-center gap-2",
                          formData.calendarType === 'lunar'
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border text-muted-foreground"
                        )}
                      >
                        <Moon size={16} />
                        农历
                      </button>
                    </div>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                    {formData.date && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {formatDateDisplay(formData.date, formData.calendarType)}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">图标</label>
                    <div className="flex flex-wrap gap-2">
                      {emojiOptions.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => setFormData({ ...formData, emoji })}
                          className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all",
                            formData.emoji === emoji
                              ? "bg-primary/20 ring-2 ring-primary"
                              : "hover:bg-muted"
                          )}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">主题色</label>
                    <div className="grid grid-cols-8 gap-2 mb-3">
                      {PRESET_THEMES.map((theme) => (
                        <button
                          key={theme.primaryColor}
                          onClick={() => setFormData({ ...formData, themeColor: theme.primaryColor })}
                          className={cn(
                            "w-8 h-8 rounded-full transition-all",
                            formData.themeColor === theme.primaryColor
                              ? "ring-2 ring-offset-2 ring-foreground scale-110"
                              : "hover:scale-105"
                          )}
                          style={{ backgroundColor: theme.primaryColor }}
                          title={theme.name}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={formData.themeColor}
                        onChange={(e) => setFormData({ ...formData, themeColor: e.target.value })}
                        className="w-10 h-10 rounded-lg cursor-pointer border-0"
                      />
                      <input
                        type="text"
                        value={formData.themeColor}
                        onChange={(e) => setFormData({ ...formData, themeColor: e.target.value })}
                        className="flex-1 px-3 py-2 rounded-xl border border-border text-sm font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-6 py-3 rounded-xl border border-border hover:bg-secondary/30 transition-all font-medium"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!formData.title.trim()}
                    className={cn(
                      "flex-1 px-6 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2",
                      formData.title.trim()
                        ? "bg-gradient-to-r from-primary to-pink-500 text-white hover:shadow-lg hover:shadow-primary/30"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                    )}
                  >
                    <Sparkles size={18} />
                    {editingAnniversary ? '保存修改' : '添加纪念日'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showThemeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowThemeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-foreground">主题色设置</h2>
                  <button
                    onClick={() => setShowThemeModal(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">预设主题</label>
                    <div className="grid grid-cols-4 gap-3">
                      {PRESET_THEMES.map((theme) => (
                        <button
                          key={theme.primaryColor}
                          onClick={() => handleThemeSelect(theme.primaryColor)}
                          className={cn(
                            "p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2",
                            primaryColor === theme.primaryColor
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          <div 
                            className="w-10 h-10 rounded-full"
                            style={{ backgroundColor: theme.primaryColor }}
                          />
                          <span className="text-xs font-medium">{theme.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">自定义颜色</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={customColor}
                        onChange={(e) => handleCustomColorChange(e.target.value)}
                        className="w-14 h-14 rounded-2xl cursor-pointer border-0"
                      />
                      <div className="flex-1">
                        <input
                          type="text"
                          value={customColor}
                          onChange={(e) => handleCustomColorChange(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-border font-mono"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          输入十六进制颜色代码，如 #FF6B9D
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <div 
                      className="p-4 rounded-2xl text-center"
                      style={{ backgroundColor: `${primaryColor}10` }}
                    >
                      <p className="text-sm text-muted-foreground mb-2">当前主题色预览</p>
                      <div className="flex items-center justify-center gap-2">
                        <Heart size={20} style={{ color: primaryColor }} fill="currentColor" />
                        <span className="font-bold" style={{ color: primaryColor }}>
                          {PRESET_THEMES.find(t => t.primaryColor === primaryColor)?.name || '自定义'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    onClick={resetTheme}
                    className="flex-1 px-6 py-3 rounded-xl border border-border hover:bg-secondary/30 transition-all font-medium"
                  >
                    恢复默认
                  </button>
                  <button
                    onClick={() => setShowThemeModal(false)}
                    className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-pink-500 text-white font-medium hover:shadow-lg hover:shadow-primary/30 transition-all"
                  >
                    完成
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
