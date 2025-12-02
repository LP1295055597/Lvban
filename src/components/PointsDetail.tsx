import { X, TrendingUp, Award, Gift, AlertCircle, ChevronRight, Crown } from 'lucide-react';
import { 
  POINTS_LEVELS, 
  POINTS_RULES, 
  POINTS_DEDUCTIONS,
  getPointsLevel,
  getNextLevel,
  getPointsToNextLevel,
  getLevelProgress,
  getAllLevels
} from '../data/pointsSystem';

interface PointsDetailProps {
  currentPoints: number;
  onClose: () => void;
}

export function PointsDetail({ currentPoints, onClose }: PointsDetailProps) {
  const currentLevel = getPointsLevel(currentPoints);
  const nextLevel = getNextLevel(currentPoints);
  const pointsToNext = getPointsToNextLevel(currentPoints);
  const progress = getLevelProgress(currentPoints);
}