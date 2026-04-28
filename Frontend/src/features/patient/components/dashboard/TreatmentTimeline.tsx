import { Check } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { cn } from '@/src/lib/utils';

interface Appointment {
  id: string;
  date: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  doctor: {
    specialty: string;
    user: { name: string };
  };
}

export function TreatmentTimeline({ appointments }: { appointments: Appointment[] }) {
  // Build timeline from completed appointments (most recent first)
  const completed = appointments
    .filter((a) => a.status === 'completed')
    .slice(0, 5);

  if (completed.length === 0) {
    return (
      <Card className="shadow-sm border-border">
        <CardHeader className="p-8 pb-4">
          <CardTitle className="text-lg font-bold">Treatment Progress</CardTitle>
        </CardHeader>
        <CardContent className="p-8 pt-0">
          <p className="text-sm text-muted-foreground">
            No completed treatments yet. Your treatment history will appear here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border-border">
      <CardHeader className="p-8 pb-4">
        <CardTitle className="text-lg font-bold">Treatment Progress</CardTitle>
      </CardHeader>
      <CardContent className="p-8 pt-0">
        <div className="relative space-y-8 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-muted">
          {completed.map((apt) => {
            const date = new Date(apt.date);

            return (
              <div key={apt.id} className="relative flex gap-4 items-start">
                <div className="w-6 h-6 rounded-full flex items-center justify-center z-10 shrink-0 bg-primary">
                  <Check className="w-3 h-3 text-primary-foreground stroke-[3]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">
                    {apt.doctor.specialty}
                  </p>
                  <p className="text-xs font-medium text-muted-foreground">
                    Completed{' '}
                    {date.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
