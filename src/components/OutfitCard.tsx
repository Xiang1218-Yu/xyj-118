import { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Outfit } from '../types';
import {
  ChevronLeft,
  ChevronRight,
  Shirt,
  RefreshCw,
  Sparkles,
} from './Icons';

interface OutfitCardProps {
  outfits: Outfit[];
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onRefresh: () => void;
  isGenerating: boolean;
}

export function OutfitCard({
  outfits,
  currentIndex,
  onNext,
  onPrev,
  onRefresh,
  isGenerating,
}: OutfitCardProps) {
  const [dragStartX, setDragStartX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  const handleDragStart = (_: MouseEvent | TouchEvent | PointerEvent, info: { point: { x: number } }) => {
    setDragStartX(info.point.x);
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number }; velocity: { x: number } }) => {
    const swipeThreshold = 50;
    const velocityThreshold = 1;
    
    if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
      if (currentIndex < outfits.length - 1) {
        onNext();
      }
    } else if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
      if (currentIndex > 0) {
        onPrev();
      }
    }
    x.set(0);
  };

  if (outfits.length === 0) {
    return (
      <div className="bg-card rounded-2xl shadow-soft border border-border p-6">
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Shirt className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            还没有穿搭推荐
          </h3>
          <p className="text-muted-foreground mb-6">
            请先选择约会场景，然后点击生成穿搭推荐
          </p>
        </div>
      </div>
    );
  }

  const currentOutfit = outfits[currentIndex];

  return (
    <div className="bg-card rounded-2xl shadow-soft border border-border overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground">穿搭推荐</h3>
          <p className="text-sm text-muted-foreground">
            第 {currentIndex + 1} / {outfits.length} 套
          </p>
        </div>
        <button
          onClick={onRefresh}
          disabled={isGenerating}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={cn('w-4 h-4', isGenerating && 'animate-spin')} />
          换一批
        </button>
      </div>

      <div className="p-4">
        <div className="relative" ref={containerRef}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentOutfit.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              style={{ x }}
              className="cursor-grab active:cursor-grabbing"
            >
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground text-center">
                    上装
                  </div>
                  <div className="aspect-[3/4] rounded-xl overflow-hidden bg-muted relative group">
                    <img
                      src={currentOutfit.top.image}
                      alt={currentOutfit.top.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <div className="text-white">
                        <p className="font-medium text-sm">{currentOutfit.top.name}</p>
                        <p className="text-xs text-white/80">{currentOutfit.top.color} · {currentOutfit.top.style}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-foreground">{currentOutfit.top.name}</p>
                    <p className="text-xs text-muted-foreground">{currentOutfit.top.color}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground text-center">
                    下装
                  </div>
                  <div className="aspect-[3/4] rounded-xl overflow-hidden bg-muted relative group">
                    <img
                      src={currentOutfit.bottom.image}
                      alt={currentOutfit.bottom.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <div className="text-white">
                        <p className="font-medium text-sm">{currentOutfit.bottom.name}</p>
                        <p className="text-xs text-white/80">{currentOutfit.bottom.color} · {currentOutfit.bottom.style}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-foreground">{currentOutfit.bottom.name}</p>
                    <p className="text-xs text-muted-foreground">{currentOutfit.bottom.color}</p>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">适合场景</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentOutfit.suitableFor.dateTypes.map((type) => (
                    <span
                      key={type}
                      className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
                    >
                      {type}
                    </span>
                  ))}
                  {currentOutfit.suitableFor.weather.map((weather) => (
                    <span
                      key={weather}
                      className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-medium"
                    >
                      {weather}
                    </span>
                  ))}
                  {currentOutfit.suitableFor.seasons.map((season) => (
                    <span
                      key={season}
                      className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs font-medium"
                    >
                      {season}
                    </span>
                  ))}
                  {currentOutfit.suitableFor.atmospheres.map((atmosphere) => (
                    <span
                      key={atmosphere}
                      className="px-3 py-1 rounded-full bg-purple-100 text-purple-600 text-xs font-medium"
                    >
                      {atmosphere}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {currentIndex > 0 && (
            <button
              onClick={onPrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-all z-10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {currentIndex < outfits.length - 1 && (
            <button
              onClick={onNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-all z-10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-center gap-2 mt-6">
          {outfits.map((_, index) => (
            <button
              key={index}
              onClick={() => {}}
              className={cn(
                'w-2 h-2 rounded-full transition-all',
                index === currentIndex
                  ? 'bg-primary w-6'
                  : 'bg-muted hover:bg-primary/50'
              )}
            />
          ))}
        </div>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          <span className="md:hidden">← 左右滑动切换穿搭 →</span>
          <span className="hidden md:inline">点击左右箭头或拖动卡片切换穿搭</span>
        </div>
      </div>
    </div>
  );
}
