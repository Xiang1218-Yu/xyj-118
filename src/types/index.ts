export type RelationshipStage = 'dating' | 'passionate' | 'stable' | 'longterm';

export type BudgetLevel = 'low' | 'medium' | 'high' | 'luxury';

export type ActivityType = 'dining' | 'activity' | 'transport' | 'surprise';

export type VenueType = 'restaurant' | 'cafe' | 'attraction' | 'activity' | 'cinema';

export interface UserPreferences {
  relationshipStage: RelationshipStage;
  interests: string[];
  budget: BudgetLevel;
}

export interface Activity {
  id: string;
  time: string;
  type: ActivityType;
  name: string;
  description: string;
  location: string;
  duration: string;
  cost: number;
  image: string;
  rating?: number;
  tips?: string;
  transport?: {
    method: string;
    duration: string;
    description: string;
  };
}

export interface DatePlan {
  id: string;
  createdAt: string;
  title: string;
  totalBudget: string;
  estimatedCost: number;
  activities: Activity[];
  surprises: string[];
  weatherTip: string;
}

export interface Venue {
  id: string;
  name: string;
  type: VenueType;
  category: string;
  address: string;
  rating: number;
  priceRange: string;
  image: string;
  description: string;
  suitableFor: string[];
  bestTime: string;
  averageCost: number;
}

export interface Surprise {
  id: string;
  content: string;
  suitableFor: RelationshipStage[];
  budget: BudgetLevel[];
}

export interface ActivityTemplate {
  id: string;
  type: ActivityType;
  name: string;
  duration: string;
  description: string;
  category: string;
  suitableFor: string[];
  minBudget: BudgetLevel;
}
