import { useState } from 'react';
import { Clock, Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TimeSliderProps {
  currentTime: string;
  currentDuration: string;
  onTimeChange: (time: string) => void;
  onDurationChange: (duration: string) => void;
}

const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60) % 24;
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

const durationToMinutes = (duration: string): number => {
  const match = duration.match(/(\d+)/);
  if (duration.includes('小时')) {
    return (parseInt(match?.[1] || '0')) * 60;
  }
  return parseInt(match?.[1] || '0');
};

const minutesToDuration = (minutes: number): string => {
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainMins = minutes % 60;
    if (remainMins === 0) {
      return `${hours}小时`;
    }
    return `${hours}小时${remainMins}分钟`;
  }
  return `${minutes}分钟`;
};

export function TimeSlider({ currentTime, currentDuration, onTimeChange, onDurationChange }: TimeSliderProps) {
  const timeMinutes = timeToMinutes(currentTime);
  const durationMinutes = durationToMinutes(currentDuration);
  
  const [timeValue, setTimeValue] = useState(timeMinutes);
  const [durationValue, setDurationValue] = useState(durationMinutes);

  const handleTimeChange = (value: number) => {
    setTimeValue(value);
    onTimeChange(minutesToTime(value));
  };

  const handleDurationChange = (value: number) => {
    setDurationValue(value);
    onDurationChange(minutesToDuration(value));
  };

  const adjustDuration = (delta: number) => {
    const newValue = Math.max(15, Math.min(480, durationValue + delta));
    handleDurationChange(newValue);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-primary" />
            <span className="font-medium">开始时间</span>
          </div>
          <motion.span 
            key={timeValue}
            initial={{ scale: 1.1, color: '#e11d48' }}
            animate={{ scale: 1, color: 'inherit' }}
            className="font-bold text-lg text-primary"
          >
            {minutesToTime(timeValue)}
          </motion.span>
        </div>
        <div className="relative">
          <input
            type="range"
            min="420"
            max="1320"
            step="15"
            value={timeValue}
            onChange={(e) => handleTimeChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gradient-to-r from-blue-200 via-orange-200 to-purple-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-primary [&::-webkit-slider-thumb]:to-pink-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:bg-gradient-to-br [&::-moz-range-thumb]:from-primary [&::-moz-range-thumb]:to-pink-500 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:shadow-lg"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>07:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>22:00</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-purple-500" />
            <span className="font-medium">活动时长</span>
          </div>
          <div className="flex items-center gap-2">
            <motion.span 
              key={durationValue}
              initial={{ scale: 1.1, color: '#7c3aed' }}
              animate={{ scale: 1, color: 'inherit' }}
              className="font-bold text-lg text-purple-600"
            >
              {minutesToDuration(durationValue)}
            </motion.span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => adjustDuration(-15)}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-all",
              durationValue <= 15 
                ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                : "bg-primary/10 text-primary hover:bg-primary/20 active:scale-95"
            )}
            disabled={durationValue <= 15}
          >
            <Minus size={18} />
          </button>
          <div className="flex-1 relative">
            <input
              type="range"
              min="15"
              max="480"
              step="15"
              value={durationValue}
              onChange={(e) => handleDurationChange(parseInt(e.target.value))}
              className="w-full h-2 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-purple-500 [&::-webkit-slider-thumb]:to-pink-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:bg-gradient-to-br [&::-moz-range-thumb]:from-purple-500 [&::-moz-range-thumb]:to-pink-500 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:shadow-lg"
            />
          </div>
          <button
            onClick={() => adjustDuration(15)}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-all",
              durationValue >= 480 
                ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                : "bg-purple-100 text-purple-600 hover:bg-purple-200 active:scale-95"
            )}
            disabled={durationValue >= 480}
          >
            <Plus size={18} />
          </button>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>15分钟</span>
          <span>2小时</span>
          <span>4小时</span>
          <span>8小时</span>
        </div>
      </div>
    </div>
  );
}
