import React from 'react';
import { TrendingUp, Flame, CheckCircle2 } from 'lucide-react';

interface DashboardStatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
  description?: string;
}

const DashboardStatsCard: React.FC<DashboardStatsCardProps> = ({ title, value, icon, color = 'primary', description }) => {
  return (
    <div className={`flex flex-col bg-card shadow-lg rounded-2xl p-6 border border-border animate-fade-in hover:shadow-xl transition group`}> 
      <div className={`flex items-center justify-between mb-2`}>
        <span className="text-muted-foreground text-sm font-medium">{title}</span>
        <span className={`w-10 h-10 flex items-center justify-center rounded-full bg-${color}/20 group-hover:scale-110 transition`}>{icon}</span>
      </div>
      <div className="text-3xl font-bold text-foreground mb-1">{value}</div>
      {description && <div className="text-xs text-muted-foreground">{description}</div>}
    </div>
  );
};

export default DashboardStatsCard;
