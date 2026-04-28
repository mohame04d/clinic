import { LucideIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';

export function ActivityCard({
  recentActivity,
}: {
  recentActivity: { title: string; subtitle: string; icon: LucideIcon }[];
}) {
  return (
    <Card className="bg-muted/30 border-border shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-bold tracking-tight uppercase text-foreground">
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {recentActivity.map((activity, index) => (
          <div key={index} className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-background flex flex-shrink-0 items-center justify-center text-primary shadow-sm border border-border/50">
              <activity.icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {activity.title}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {activity.subtitle}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
