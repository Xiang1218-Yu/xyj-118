import { motion } from 'framer-motion';
import { MapPin, Clock, Star, Utensils, Film, Palette, Bike, Gift, AlertCircle } from 'lucide-react';
import type { Activity, DiffField } from '../types';
import { cn } from '@/lib/utils';

interface TimelineItemProps {
  activity: Activity;
  index: number;
  isLast: boolean;
  differentFields?: DiffField[];
  showDiffHighlight?: boolean;
}

const activityIcons = {
  dining: Utensils,
  activity: Film,
  transport: Bike,
  surprise: Gift,
};

const activityColors = {
  dining: 'bg-rose-500',
  activity: 'bg-pink-500',
  transport: 'bg-purple-500',
  surprise: 'bg-amber-500',
};

const diffFieldToClass: Record<DiffField, string> = {
  name: 'ring-2 ring-amber-400 bg-amber-50/50',
  description: 'ring-2 ring-blue-400 bg-blue-50/50',
  location: 'ring-2 ring-green-400 bg-green-50/50',
  cost: 'ring-2 ring-rose-400 bg-rose-50/50',
  duration: 'ring-2 ring-purple-400 bg-purple-50/50',
  time: 'ring-2 ring-indigo-400 bg-indigo-50/50',
  type: 'ring-2 ring-orange-400 bg-orange-50/50',
};

export function TimelineItem({ activity, index, isLast, differentFields = [], showDiffHighlight = false }: TimelineItemProps) {
  const Icon = activityIcons[activity.type] || Palette;
  const iconColor = activityColors[activity.type];

  const getDiffClass = (field: DiffField): string => {
    if (!showDiffHighlight) return '';
    return differentFields.includes(field) ? diffFieldToClass[field] : '';
  };

  const hasAnyDiff = showDiffHighlight && differentFields.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="relative pl-12 pb-8"
    >
      {!isLast && (
        <div className="absolute left-[19px] top-10 w-0.5 h-full bg-gradient-to-b from-primary to-primary/20" />
      )}

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: index * 0.15 + 0.1 }}
        className={cn(
          'absolute left-0 top-0 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg z-10',
          iconColor
        )}
      >
        <Icon size={18} />
      </motion.div>

      <div className={cn(
        "bg-white rounded-2xl shadow-lg overflow-hidden border border-border/50 hover:shadow-xl transition-all duration-300",
        hasAnyDiff && "ring-2 ring-amber-300 shadow-amber-100 shadow-lg"
      )}>
        {hasAnyDiff && (
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1.5 flex items-center gap-2">
            <AlertCircle size={14} />
            <span className="text-xs font-medium">此活动与其他方案不同</span>
          </div>
        )}
        <div className={cn("relative h-40 overflow-hidden", getDiffClass('name'))}>
          <img
            src={activity.image}
            alt={activity.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
            <div>
              <div className={cn("flex items-center gap-2 text-white/90 text-sm", getDiffClass('time') && "bg-amber-500/30 rounded px-1")}>
                <Clock size={14} />
                <span>{activity.time}</span>
                <span className="text-white/60">·</span>
                <span className={cn(getDiffClass('duration') && "bg-amber-500/30 rounded px-1")}>{activity.duration}</span>
              </div>
              <h3 className={cn("text-white font-semibold text-lg mt-1", getDiffClass('name') && "bg-amber-500/30 rounded px-1")}>
                {activity.name}
              </h3>
            </div>
            {activity.rating && (
              <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                <Star size={12} className="text-amber-400 fill-amber-400" />
                <span className="text-white text-sm font-medium">
                  {activity.rating}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 space-y-3">
          <p className={cn("text-sm text-muted-foreground leading-relaxed rounded-lg p-2 -mx-2", getDiffClass('description'))}>
            {activity.description}
          </p>

          <div className={cn("flex items-center gap-2 text-sm text-muted-foreground rounded-lg p-2 -mx-2", getDiffClass('location'))}>
            <MapPin size={14} className="text-primary" />
            <span>{activity.location}</span>
          </div>

          {activity.transport && (
            <div className="flex items-center gap-2 text-sm bg-primary/5 rounded-lg p-3 border border-primary/10">
              <Bike size={16} className="text-primary flex-shrink-0" />
              <span className="text-muted-foreground">
                {activity.transport.description}
              </span>
            </div>
          )}

          {activity.tips && (
            <div className="flex items-start gap-2 text-sm bg-amber-50 rounded-lg p-3 border border-amber-100">
              <Gift size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <span className="text-amber-800">{activity.tips}</span>
            </div>
          )}

          <div className={cn("flex items-center justify-between pt-2 border-t border-border rounded-lg p-2 -mx-2", getDiffClass('cost'))}>
            <span className="text-sm text-muted-foreground">预计花费</span>
            <span className="font-semibold text-primary text-lg">
              ¥{activity.cost}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
