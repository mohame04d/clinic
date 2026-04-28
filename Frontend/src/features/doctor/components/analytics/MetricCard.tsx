import { TrendingUp, TrendingDown } from 'lucide-react';
import React from 'react';
import { Card, CardContent } from '@/src/components/ui/card';

export interface MetricCardProps {
  title: string;
  value: string | React.ReactNode;
  icon: React.ElementType;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  trendLabel?: string;
}

export function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  trendLabel,
}: MetricCardProps) {
  return (
    <Card className="flex flex-col shadow-sm border-border bg-card">
      <CardContent className="p-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-bold tracking-tight text-foreground">
            {value}
          </span>
        </div>
        <div className="flex items-center text-sm mt-auto">
          {trend === 'up' && (
            <span className="text-emerald-600 font-medium flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              {trendValue}
            </span>
          )}
          {trend === 'down' && (
            <span className="text-destructive font-medium flex items-center">
              <TrendingDown className="w-4 h-4 mr-1" />
              {trendValue}
            </span>
          )}
          {trend === 'neutral' && (
            <span className="text-muted-foreground font-medium flex items-center">
              {trendValue}
            </span>
          )}
          <span className="text-muted-foreground ml-2">{trendLabel}</span>
        </div>
      </CardContent>
    </Card>
  );
}
