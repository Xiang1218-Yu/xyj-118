import { useState, useEffect } from 'react';
import { X, MapPin, Clock, DollarSign, Edit3, RefreshCw, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { TimeSlider } from './TimeSlider';
import { VenueSelectorModal } from './VenueSelectorModal';
import type { Activity, Venue } from '../types';

interface EditActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: Activity | null;
  onSave: (activityId: string, updates: Partial<Activity>) => void;
}

export function EditActivityModal({ isOpen, onClose, activity, onSave }: EditActivityModalProps) {
  const [editedActivity, setEditedActivity] = useState<Partial<Activity>>({});
  const [showVenueSelector, setShowVenueSelector] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'time' | 'cost'>('basic');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (activity) {
      setEditedActivity({
        name: activity.name,
        description: activity.description,
        location: activity.location,
        time: activity.time,
        duration: activity.duration,
        cost: activity.cost,
      });
      setHasChanges(false);
    }
  }, [activity]);

  if (!isOpen || !activity) return null;

  const handleFieldChange = (field: keyof Activity, value: string | number) => {
    setEditedActivity((prev) => {
      const updated = { ...prev, [field]: value };
      setHasChanges(true);
      return updated;
    });
  };

  const handleVenueSelect = (venue: Venue) => {
    setEditedActivity((prev) => ({
      ...prev,
      name: venue.name,
      location: venue.address,
      description: venue.description,
      cost: venue.averageCost * 2,
      image: venue.image,
      rating: venue.rating,
    }));
    setHasChanges(true);
    setShowVenueSelector(false);
  };

  const handleSave = () => {
    onSave(activity.id, editedActivity);
    onClose();
  };

  const handleReset = () => {
    setEditedActivity({
      name: activity.name,
      description: activity.description,
      location: activity.location,
      time: activity.time,
      duration: activity.duration,
      cost: activity.cost,
    });
    setHasChanges(false);
  };

  const tabs = [
    { id: 'basic', label: '基本信息', icon: Edit3 },
    { id: 'time', label: '时间调整', icon: Clock },
    { id: 'cost', label: '预算调整', icon: DollarSign },
  ] as const;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white rounded-3xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">编辑活动</h3>
                <p className="text-sm text-muted-foreground mt-1">调整活动的各项细节</p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="flex border-b border-border px-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 py-3 px-2 text-sm font-medium transition-all relative",
                    activeTab === tab.id
                      ? "text-primary"
                      : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="editTabIndicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'basic' && (
                <motion.div
                  key="basic"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-medium">活动名称</label>
                    <input
                      type="text"
                      value={editedActivity.name || ''}
                      onChange={(e) => handleFieldChange('name', e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">活动地点</label>
                      <button
                        onClick={() => setShowVenueSelector(true)}
                        className="text-xs text-primary font-medium flex items-center gap-1 hover:underline"
                      >
                        <MapPin size={12} />
                        替换地点
                      </button>
                    </div>
                    <input
                      type="text"
                      value={editedActivity.location || ''}
                      onChange={(e) => handleFieldChange('location', e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">活动描述</label>
                    <textarea
                      value={editedActivity.description || ''}
                      onChange={(e) => handleFieldChange('description', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
                    />
                  </div>
                </motion.div>
              )}

              {activeTab === 'time' && (
                <motion.div
                  key="time"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  <TimeSlider
                    currentTime={editedActivity.time || activity.time}
                    currentDuration={editedActivity.duration || activity.duration}
                    onTimeChange={(time) => handleFieldChange('time', time)}
                    onDurationChange={(duration) => handleFieldChange('duration', duration)}
                  />
                </motion.div>
              )}

              {activeTab === 'cost' && (
                <motion.div
                  key="cost"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign size={16} className="text-rose-500" />
                        <span className="font-medium">活动预算</span>
                      </div>
                      <motion.span
                        key={editedActivity.cost}
                        initial={{ scale: 1.1, color: '#e11d48' }}
                        animate={{ scale: 1, color: 'inherit' }}
                        className="font-bold text-2xl text-rose-600"
                      >
                        ¥{editedActivity.cost || 0}
                      </motion.span>
                    </div>
                    <div className="relative">
                      <input
                        type="range"
                        min="0"
                        max="2000"
                        step="10"
                        value={editedActivity.cost || 0}
                        onChange={(e) => handleFieldChange('cost', parseInt(e.target.value))}
                        className="w-full h-2 bg-gradient-to-r from-rose-200 to-pink-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-rose-500 [&::-webkit-slider-thumb]:to-pink-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:bg-gradient-to-br [&::-moz-range-thumb]:from-rose-500 [&::-moz-range-thumb]:to-pink-500 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:shadow-lg"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>¥0</span>
                        <span>¥500</span>
                        <span>¥1000</span>
                        <span>¥2000</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[100, 200, 300, 500, 800, 1000].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => handleFieldChange('cost', amount)}
                        className={cn(
                          "py-2 px-3 rounded-xl text-sm font-medium transition-all",
                          editedActivity.cost === amount
                            ? "bg-primary text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        )}
                      >
                        ¥{amount}
                      </button>
                    ))}
                  </div>

                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                    <p className="text-sm text-amber-700">
                      💡 修改预算后，总预算会实时更新哦
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="p-6 border-t border-border bg-gray-50">
            <div className="flex items-center gap-3">
              <button
                onClick={handleReset}
                className="flex-1 py-2.5 rounded-xl font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw size={16} />
                重置
              </button>
              <button
                onClick={handleSave}
                disabled={!hasChanges}
                className={cn(
                  "flex-1 py-2.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2",
                  hasChanges
                    ? "bg-primary text-white hover:bg-primary/90 active:scale-98"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                )}
              >
                <Check size={16} />
                保存修改
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <VenueSelectorModal
        isOpen={showVenueSelector}
        onClose={() => setShowVenueSelector(false)}
        onSelect={handleVenueSelect}
        currentLocation={editedActivity.location || activity.location}
        activityType={activity.type}
      />
    </AnimatePresence>
  );
}
