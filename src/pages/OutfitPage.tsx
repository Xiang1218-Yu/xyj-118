import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shirt, Sparkles } from '../components/Icons';
import { useOutfitStore } from '../store/useOutfitStore';
import { OutfitFilters } from '../components/OutfitFilters';
import { OutfitCard } from '../components/OutfitCard';
import { LoadingAnimation } from '../components/LoadingAnimation';

export function OutfitPage() {
  const navigate = useNavigate();
  const {
    filters,
    filteredOutfits,
    recommendedOutfits,
    currentOutfitIndex,
    isGenerating,
    loadOutfits,
    setDateType,
    setWeather,
    setSeason,
    setAtmosphere,
    generateRecommendations,
    nextOutfit,
    prevOutfit,
    resetFilters,
    refreshRecommendations,
  } = useOutfitStore();

  useEffect(() => {
    loadOutfits();
  }, [loadOutfits]);

  const handleGenerate = async () => {
    await generateRecommendations();
  };

  const handleRefresh = async () => {
    await refreshRecommendations();
  };

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
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
              <Shirt size={16} />
              <span>穿搭推荐</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 font-display">
              约会穿搭灵感
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              根据约会场景为你推荐最合适的穿搭，让每一次约会都光彩照人 ✨
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-8"
          >
            <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-border/50">
              <div className="text-2xl font-bold text-primary">
                {filteredOutfits.length}
              </div>
              <div className="text-xs text-muted-foreground mt-1">可穿搭数</div>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-border/50">
              <div className="text-2xl font-bold text-primary">
                {recommendedOutfits.length}
              </div>
              <div className="text-xs text-muted-foreground mt-1">已推荐</div>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-border/50">
              <div className="text-2xl font-bold text-primary">
                {recommendedOutfits.length > 0 ? currentOutfitIndex + 1 : 0}
              </div>
              <div className="text-xs text-muted-foreground mt-1">当前浏览</div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container pb-16">
        <AnimatePresence>
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <div className="text-center">
                <LoadingAnimation />
                <p className="mt-4 text-foreground font-medium flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                  正在为您挑选穿搭...
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <OutfitFilters
              selectedDateType={filters.dateType}
              selectedWeather={filters.weather}
              selectedSeason={filters.season}
              selectedAtmosphere={filters.atmosphere}
              onDateTypeChange={setDateType}
              onWeatherChange={setWeather}
              onSeasonChange={setSeason}
              onAtmosphereChange={setAtmosphere}
              onGenerate={handleGenerate}
              onReset={resetFilters}
              isGenerating={isGenerating}
              filteredCount={filteredOutfits.length}
            />
          </div>

          <div className="lg:col-span-2">
            <OutfitCard
              outfits={recommendedOutfits}
              currentIndex={currentOutfitIndex}
              onNext={nextOutfit}
              onPrev={prevOutfit}
              onRefresh={handleRefresh}
              isGenerating={isGenerating}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
