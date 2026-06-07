import { useState, useMemo } from 'react';
import { X, MapPin, Star, Search, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import venuesData from '../data/venues.json';
import type { Venue, ActivityType } from '../types';

const typedVenuesData = venuesData as Venue[];

interface VenueSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (venue: Venue) => void;
  currentLocation: string;
  activityType?: ActivityType;
}

const venueTypeMap: Record<ActivityType, string[]> = {
  dining: ['restaurant', 'cafe'],
  activity: ['activity', 'attraction', 'cinema'],
  transport: [],
  surprise: [],
};

export function VenueSelectorModal({ isOpen, onClose, onSelect, currentLocation, activityType }: VenueSelectorModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredVenues = useMemo(() => {
    const allowedTypes = activityType ? venueTypeMap[activityType] || [] : [];
    return typedVenuesData.filter((venue) => {
      const matchesSearch = venue.name.includes(searchQuery) ||
        venue.address.includes(searchQuery) ||
        venue.category.includes(searchQuery);
      const matchesType = allowedTypes.length === 0 || allowedTypes.includes(venue.type);
      const matchesCategory = selectedCategory === 'all' || venue.category === selectedCategory;
      return matchesSearch && matchesType && matchesCategory;
    });
  }, [searchQuery, activityType, selectedCategory]);

  const categories = useMemo(() => {
    const cats = new Set(typedVenuesData.map((v) => v.category));
    return ['all', ...Array.from(cats)];
  }, []);

  if (!isOpen) return null;

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
          className="bg-white rounded-3xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold">选择地点</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  当前: <span className="text-primary">{currentLocation}</span>
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="relative mb-4">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="搜索地点..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-all",
                    selectedCategory === cat
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {cat === 'all' ? '全部' : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 pt-4">
            {filteredVenues.length === 0 ? (
              <div className="text-center py-12">
                <MapPin size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-muted-foreground">没有找到匹配的地点</p>
              </div>
            ) : (
                <div className="space-y-3">
                  {filteredVenues.map((venue) => (
                    <motion.div
                      key={venue.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => onSelect(venue)}
                      className="flex gap-4 p-4 rounded-2xl border border-border hover:border-primary/30 hover:bg-primary/5 cursor-pointer transition-all group"
                    >
                      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={venue.image}
                          alt={venue.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-base group-hover:text-primary transition-colors">
                              {venue.name}
                            </h4>
                            <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full mt-1">
                              {venue.category}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                            <Star size={12} className="text-amber-400 fill-amber-400" />
                            <span className="text-xs font-medium text-amber-600">{venue.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                          <MapPin size={14} className="text-primary" />
                          <span className="truncate">{venue.address}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm text-primary font-medium">{venue.priceRange}</span>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="inline-flex items-center gap-1 text-xs text-primary font-medium">
                              <Check size={14} />
                              选择
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
