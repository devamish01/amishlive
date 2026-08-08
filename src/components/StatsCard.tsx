import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  trend?: 'up' | 'down';
  description?: string;
  color?: 'red' | 'blue' | 'green' | 'orange' | 'purple' | 'pink';
}

const colorMap = {
  red: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    icon: 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400',
    badge: 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400',
    glow: 'shadow-red-100 dark:shadow-red-900/20',
  },
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    icon: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400',
    badge: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400',
    glow: 'shadow-blue-100 dark:shadow-blue-900/20',
  },
  green: {
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    icon: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400',
    badge: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400',
    glow: 'shadow-emerald-100 dark:shadow-emerald-900/20',
  },
  orange: {
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    icon: 'bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400',
    badge: 'bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400',
    glow: 'shadow-orange-100 dark:shadow-orange-900/20',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    icon: 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400',
    badge: 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400',
    glow: 'shadow-purple-100 dark:shadow-purple-900/20',
  },
  pink: {
    bg: 'bg-pink-50 dark:bg-pink-900/20',
    icon: 'bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-400',
    badge: 'bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-400',
    glow: 'shadow-pink-100 dark:shadow-pink-900/20',
  },
};

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  change,
  trend = 'up',
  description,
  color = 'blue',
}) => {
  const colors = colorMap[color];
  return (
    <div className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm hover:shadow-md transition-shadow duration-200`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl ${colors.icon}`}>
          <Icon className="w-5 h-5" />
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
            trend === 'up'
              ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
              : 'bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400'
          }`}>
            {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {change}
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mb-0.5">{value}</p>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        {description && (
          <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">{description}</p>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
