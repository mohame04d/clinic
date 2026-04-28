import { MoreHorizontal } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';

export function ChartArea() {
  const chartData = [40, 55, 45, 70, 60, 85, 75, 95];

  return (
    <Card className="lg:col-span-2 shadow-sm border-border flex flex-col min-h-[400px] bg-card">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-semibold text-foreground">
            Revenue & Growth Trend
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Daily progression over the last 30 days
          </p>
        </div>
        <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10">
          <MoreHorizontal className="w-5 h-5" />
        </Button>
      </CardHeader>

      <CardContent className="flex-1 relative w-full h-full flex items-end gap-2 pt-10 pb-6 px-8">
        {/* Y-Axis Labels */}
        <div className="absolute left-6 top-10 bottom-14 flex flex-col justify-between text-xs text-muted-foreground py-4">
          <span>$6k</span>
          <span>$4k</span>
          <span>$2k</span>
          <span>$0</span>
        </div>

        {/* Chart Content Area */}
        <div className="flex-1 h-full ml-10 border-b border-border relative flex items-end justify-between px-2">
          {/* Background Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none py-4">
            <div className="w-full h-[1px] bg-border/50"></div>
            <div className="w-full h-[1px] bg-border/50"></div>
            <div className="w-full h-[1px] bg-border/50"></div>
            <div className="w-full h-[1px] bg-border/50"></div>
          </div>

          {/* Mock Data Bars */}
          {chartData.map((height, idx) => (
            <div
              key={idx}
              className="w-8 bg-primary/20 rounded-t-md relative group cursor-pointer transition-all hover:bg-primary/40 z-10"
              style={{ height: `${height}%` }}
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-primary rounded-t-md"></div>
            </div>
          ))}
        </div>

        {/* X-Axis Labels */}
        <div className="absolute bottom-6 left-16 right-8 flex justify-between text-xs text-muted-foreground px-2">
          <span>Week 1</span>
          <span>Week 2</span>
          <span>Week 3</span>
          <span>Week 4</span>
        </div>
      </CardContent>
    </Card>
  );
}
