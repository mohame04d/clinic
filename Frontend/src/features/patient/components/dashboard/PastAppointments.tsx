import { FileText, CheckCircle } from 'lucide-react';
import { Card } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';

interface Appointment {
  id: string;
  date: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes: string | null;
  doctor: {
    specialty: string;
    photo: string | null;
    user: { name: string; email: string };
  };
}

export function PastAppointments({ appointments }: { appointments: Appointment[] }) {
  if (appointments.length === 0) return null;

  return (
    <section>
      <h2 className="text-2xl font-bold tracking-tight mb-6 text-foreground">
        Past Appointments
      </h2>
      <Card className="overflow-hidden shadow-sm border-border">
        <div className="grid grid-cols-1 divide-y divide-border">
          {appointments.map((apt) => {
            const date = new Date(apt.date);
            const statusLabel =
              apt.status === 'cancelled' ? 'Cancelled' : 'Completed';

            return (
              <div
                key={apt.id}
                className="flex items-center justify-between p-6 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-6">
                  <div className="p-3 bg-muted rounded-lg text-primary">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">
                      {apt.doctor.specialty}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {statusLabel}{' '}
                      {date.toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-muted-foreground hidden sm:inline-block">
                    {apt.doctor.user.name}
                  </span>
                  {apt.status === 'cancelled' && (
                    <Badge variant="secondary" className="bg-red-500/10 text-red-600 border-none text-[10px] font-bold">
                      CANCELLED
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-primary"
                  >
                    <FileText className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </section>
  );
}
