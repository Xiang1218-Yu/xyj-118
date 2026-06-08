import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { DateType, Weather, Season, Atmosphere } from '../types';
import {
  Wine,
  Coffee,
  Music,
  Camera,
  Bike,
  Sofa,
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudSnow,
  Flower2,
  Leaf,
  Snowflake,
  Umbrella,
  Heart,
  Palette,
  Zap,
  Sparkles,
  RefreshCw,
  RotateCcw,
} from './Icons';

const DATE_TYPES: { value: DateType; label: string; icon: typeof Wine }[] = [
  { value: '正式约会', label: '正式', icon: Wine },
  { value: '休闲约会', label: '休闲', icon: Coffee },
  { value: '运动约会', label: '运动', icon: Bike },
  { value: '文艺约会', label: '文艺', icon: Music },
  { value: '旅行约会', label: '旅行', icon: Camera },
  { value: '居家约会', label: '居家', icon: Sofa },
];

const WEATHERS: { value: Weather; label: string; icon: typeof Sun }[] = [
  { value: '晴天', label: '晴天', icon: Sun },
  { value: '多云', label: '多云', icon: CloudSun },
  { value: '阴天', label: '阴天', icon: Cloud },
  { value: '雨天', label: '雨天', icon: CloudRain },
  { value: '雪天', label: '雪天', icon: CloudSnow },
];

const SEASONS: { value: Season; label: string; icon: typeof Flower2 }[] = [
  { value: '春季', label: '春季', icon: Flower2 },
  { value: '夏季', label: '夏季', icon: Sun },
  { value: '秋季', label: '秋季', icon: Leaf },
  { value: '冬季', label: '冬季', icon: Snowflake },
];

const ATMOSPHERES: { value: Atmosphere; label: string; icon: typeof Heart }[] = [
  { value: '浪漫', label: '浪漫', icon: Heart },
  { value: '休闲', label: '休闲', icon: Coffee },
  { value: '活力', label: '活力', icon: Zap },
  { value: '优雅', label: '优雅', icon: Sparkles },
  { value: '复古', label: '复古', icon: Palette },
  { value: '清新', label: '清新', icon: Umbrella },
];

interface OutfitFiltersProps {
  selectedDateType: DateType | null;
  selectedWeather: Weather | null;
  selectedSeason: Season | null;
  selectedAtmosphere: Atmosphere | null;
  onDateTypeChange: (value: DateType | null) => void;
  onWeatherChange: (value: Weather | null) => void;
  onSeasonChange: (value: Season | null) => void;
  onAtmosphereChange: (value: Atmosphere | null) => void;
  onGenerate: () => void;
  onReset: () => void;
  isGenerating: boolean;
  filteredCount: number;
}

export function OutfitFilters({
  selectedDateType,
  selectedWeather,
  selectedSeason,
  selectedAtmosphere,
  onDateTypeChange,
  onWeatherChange,
  onSeasonChange,
  onAtmosphereChange,
  onGenerate,
  onReset,
  isGenerating,
  filteredCount,
}: OutfitFiltersProps) {
  const hasSelection = selectedDateType || selectedWeather || selectedSeason || selectedAtmosphere;

  return (
    <div className="bg-card rounded-2xl shadow-soft border border-border overflow-hidden">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-foreground mb-1">选择约会场景</h3>
        <p className="text-sm text-muted-foreground">
          根据以下条件为您推荐最合适的穿搭
        </p>
      </div>

      <div className="p-4 space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary">
              1
            </span>
            约会类型
          </label>
          <div className="grid grid-cols-3 gap-2">
            {DATE_TYPES.map((item) => {
              const Icon = item.icon;
              const isSelected = selectedDateType === item.value;
              return (
                <motion.button
                  key={item.value}
                  type="button"
                  onClick={() =>
                    onDateTypeChange(isSelected ? null : item.value)
                  }
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    'flex flex-col items-center justify-center gap-2 p-3 rounded-xl transition-all',
                    isSelected
                      ? 'bg-primary text-white shadow-lg shadow-primary/30'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary">
              2
            </span>
            天气
          </label>
          <div className="grid grid-cols-5 gap-2">
            {WEATHERS.map((item) => {
              const Icon = item.icon;
              const isSelected = selectedWeather === item.value;
              return (
                <motion.button
                  key={item.value}
                  type="button"
                  onClick={() =>
                    onWeatherChange(isSelected ? null : item.value)
                  }
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    'flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-all',
                    isSelected
                      ? 'bg-primary text-white shadow-lg shadow-primary/30'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs">{item.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary">
              3
            </span>
            季节
          </label>
          <div className="grid grid-cols-4 gap-2">
            {SEASONS.map((item) => {
              const Icon = item.icon;
              const isSelected = selectedSeason === item.value;
              return (
                <motion.button
                  key={item.value}
                  type="button"
                  onClick={() =>
                    onSeasonChange(isSelected ? null : item.value)
                  }
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    'flex flex-col items-center justify-center gap-1 p-3 rounded-xl transition-all',
                    isSelected
                      ? 'bg-primary text-white shadow-lg shadow-primary/30'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary">
              4
            </span>
            氛围
          </label>
          <div className="grid grid-cols-3 gap-2">
            {ATMOSPHERES.map((item) => {
              const Icon = item.icon;
              const isSelected = selectedAtmosphere === item.value;
              return (
                <motion.button
                  key={item.value}
                  type="button"
                  onClick={() =>
                    onAtmosphereChange(isSelected ? null : item.value)
                  }
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    'flex flex-col items-center justify-center gap-1 p-3 rounded-xl transition-all',
                    isSelected
                      ? 'bg-primary text-white shadow-lg shadow-primary/30'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">
            找到 <span className="font-semibold text-primary">{filteredCount}</span> 套匹配的穿搭
          </span>
          {hasSelection && (
            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              重置
            </button>
          )}
        </div>
        <div className="flex gap-3">
          {hasSelection && (
            <button
              type="button"
              onClick={onReset}
              className="flex-1 py-3 px-4 rounded-xl border border-border text-muted-foreground font-medium hover:bg-muted/50 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              重置
            </button>
          )}
          <button
            type="button"
            onClick={onGenerate}
            disabled={isGenerating}
            className={cn(
              'flex-1 py-3 px-4 rounded-xl text-white font-medium transition-all flex items-center justify-center gap-2',
              hasSelection
                ? 'bg-primary hover:bg-primary/90'
                : 'bg-primary/60 hover:bg-primary/70',
              isGenerating && 'opacity-70 cursor-not-allowed'
            )}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                生成中...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                生成穿搭推荐
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
