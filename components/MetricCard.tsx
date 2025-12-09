import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  status?: 'success' | 'warning' | 'danger' | 'neutral';
  subtext?: string;
  className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  label, 
  value, 
  icon: Icon, 
  status = 'neutral', 
  subtext,
  className = ''
}) => {
  const statusColors = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    neutral: 'bg-white text-slate-700 border-slate-200',
  };

  const iconColors = {
    success: 'text-emerald-500',
    warning: 'text-amber-500',
    danger: 'text-rose-500',
    neutral: 'text-slate-500',
  };

  return (
    <div className={`p-4 rounded-xl border ${statusColors[status]} ${className} transition-all duration-200 hover:shadow-md`}>
      <div className="flex items-start justify-between mb-2">
        <span className="text-sm font-medium opacity-80">{label}</span>
        <Icon className={`w-5 h-5 ${iconColors[status]}`} />
      </div>
      <div className="text-xl font-bold">{value}</div>
      {subtext && <div className="text-xs mt-1 opacity-75">{subtext}</div>}
    </div>
  );
};

export default MetricCard;