import { Info } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';

export function TopProcedures() {
  const procedures = [
    { name: 'Appendectomy', percentage: 45, opacityClass: 'bg-primary' },
    { name: 'Hernia Repair', percentage: 30, opacityClass: 'bg-primary/80' },
    { name: 'Gallbladder Removal', percentage: 15, opacityClass: 'bg-primary/60' },
    { name: 'Other Consultations', percentage: 10, opacityClass: 'bg-primary/40' },
  ];

  return (
    <Card className="shadow-sm border-border flex flex-col bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-6">
        <CardTitle className="text-lg font-semibold text-foreground">
          Top Procedures
        </CardTitle>
        <Info className="w-4 h-4 text-muted-foreground" />
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-6">
        {procedures.map((proc, idx) => (
          <div key={idx}>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-foreground">{proc.name}</span>
              <span className="text-muted-foreground">{proc.percentage}%</span>
            </div>
            {/* Using a custom progress bar to handle specific visual opacities requested in the original layout */}
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className={cn('h-full rounded-full transition-all', proc.opacityClass)}
                style={{ width: `${proc.percentage}%` }}
              />
            </div>
          </div>
        ))}

        <div className="mt-auto pt-4">
          <Button
            variant="secondary"
            className="w-full text-primary bg-primary/10 hover:bg-primary/20"
          >
            View Detailed Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
