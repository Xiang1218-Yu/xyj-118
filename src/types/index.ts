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

export type IdeaCategory = 
  | '美食' 
  | '电影' 
  | '户外' 
  | '文艺' 
  | '运动' 
  | '探店' 
  | '手作' 
  | '拍照' 
  | '游戏' 
  | '旅行' 
  | '居家' 
  | '其他';

export interface Idea {
  id: string;
  title: string;
  content: string;
  category: IdeaCategory;
  tags: string[];
  likes: number;
  createdAt: string;
  isLiked: boolean;
}
