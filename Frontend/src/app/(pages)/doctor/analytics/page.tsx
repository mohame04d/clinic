'use client';

import React, { useState } from 'react';
import { cn } from '@/src/lib/utils';
import { DollarSign, CalendarCheck, UserPlus, Star } from 'lucide-react';

import { MetricCard, ChartArea, TopProcedures } from '@/src/features/doctor/components/analytics';

export default function AnalyticsDashboard() {
  const [activeFilter, setActiveFilter] = useState('30days');

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto space-y-12 w-full pt-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pt-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
            Practice Analytics
          </h1>
          <p className="text-muted-foreground font-medium">
            Performance overview for Surgery Dept.
          </p>
        </div>

        {/* Time Filters */}
        <div className="flex items-center gap-1 bg-muted p-1 rounded-lg shadow-sm w-fit">
          <button
            onClick={() => setActiveFilter('30days')}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-md transition-colors',
              activeFilter === '30days'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-background/50',
            )}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => setActiveFilter('quarter')}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-md transition-colors',
              activeFilter === 'quarter'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-background/50',
            )}
          >
            Quarter
          </button>
          <button
            onClick={() => setActiveFilter('year')}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-md transition-colors',
              activeFilter === 'year'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-background/50',
            )}
          >
            Year
          </button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value="$142,500"
          icon={DollarSign}
          trend="up"
          trendValue="+12.5%"
          trendLabel="vs last month"
        />
        <MetricCard
          title="Appointments Completed"
          value="384"
          icon={CalendarCheck}
          trend="up"
          trendValue="+5.2%"
          trendLabel="vs last month"
        />
        <MetricCard
          title="New Patient Growth"
          value="42"
          icon={UserPlus}
          trend="down"
          trendValue="-2.1%"
          trendLabel="vs last month"
        />
        <MetricCard
          title="Average Rating"
          value={
            <>
              4.9{' '}
              <span className="text-muted-foreground text-sm font-medium">
                / 5.0
              </span>
            </>
          }
          icon={Star}
          trend="neutral"
          trendLabel="Based on 128 reviews"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartArea />
        <TopProcedures />
      </div>
    </div>
  );
}
