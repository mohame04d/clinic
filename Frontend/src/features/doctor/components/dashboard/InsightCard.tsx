import { ClipboardList } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { Progress } from '@/src/components/ui/progress';

export function InsightCard({
  totalAppointments,
  completedCount,
  completionRate,
}: {
  totalAppointments: number;
  completedCount: number;
  completionRate: number;
}) {
  const workloadLabel =
    totalAppointments >= 8
      ? 'Heavy Workload'
      : totalAppointments >= 4
        ? 'Moderate Day'
        : 'Light Schedule';

  return (
    <Card className="relative overflow-hidden shadow-sm border-border">
      <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
        <ClipboardList className="w-24 h-24" />
      </div>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold">Daily Insight</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-3">
          <div className="w-1 h-12 bg-primary rounded-full shrink-0"></div>
          <div>
            <p className="text-xs font-bold text-primary uppercase tracking-tight">
              {workloadLabel}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {totalAppointments > 0
                ? `Schedule is ${Math.min(100, Math.round((totalAppointments / 10) * 100))}% full. ${completedCount} of ${totalAppointments} appointments completed.`
                : 'No appointments today. Consider reviewing patient notes.'}
            </p>
          </div>
        </div>

        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground mb-3 font-medium">
            Completion Rate
          </p>
          <Progress value={completionRate} className="h-2 bg-background" />
          <div className="flex justify-between mt-3">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              {completedCount}/{totalAppointments} Patients
            </span>
            <span className="text-[10px] font-bold text-primary">
              {completionRate}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
