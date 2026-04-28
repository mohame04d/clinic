'use client';

import { useState } from 'react';
import { Plus, Clock, Calendar, PlusCircle } from 'lucide-react';
import { Card, CardContent } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';
import { Badge } from '@/src/components/ui/badge';
import Link from 'next/link';
import { cancelAppointmentAction } from '@/src/features/appointments/actions/appointment-actions';

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

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  pending: { bg: 'bg-yellow-500/10', text: 'text-yellow-600', label: 'Pending' },
  confirmed: { bg: 'bg-orange-500/10', text: 'text-orange-600', label: 'Confirmed' },
};

export function UpcomingAppointments({ appointments }: { appointments: Appointment[] }) {
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const handleCancel = async (id: string) => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      setCancellingId(id);
      await cancelAppointmentAction(id);
      setCancellingId(null);
    }
  };

  return (
    <section>
      <div className="flex justify-between items-end mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Upcoming Appointments
        </h2>
        <Button
          variant="link"
          className="text-primary font-semibold p-0 h-auto flex items-center gap-1"
          asChild
        >
          <Link href="/Booking">
            <span>Book New</span>
            <Plus className="w-4 h-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {appointments.map((apt) => {
          const date = new Date(apt.date);
          const style = STATUS_STYLES[apt.status] || STATUS_STYLES.pending;
          const doctorName = apt.doctor.user.name;
          const initials = doctorName
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase();
          const endTime = new Date(date.getTime() + apt.duration * 60000);
          const isCancelling = cancellingId === apt.id;

          return (
            <Card key={apt.id} className={`transition-transform duration-300 shadow-sm border-border ${isCancelling ? 'opacity-50 pointer-events-none' : ''}`}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-4 items-center">
                    <Avatar className="w-12 h-12">
                      <AvatarImage
                        src={
                          apt.doctor.photo ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(doctorName)}&background=f1f5f9&color=0f172a`
                        }
                      />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-foreground">{doctorName}</p>
                      <p className="text-sm text-muted-foreground">
                        {apt.doctor.specialty}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className={`${style.bg} ${style.text} hover:${style.bg} border-none flex items-center gap-2`}
                  >
                    <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      {style.label}
                    </span>
                  </Badge>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Calendar className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium">
                      {date.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium">
                      {date.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}{' '}
                      —{' '}
                      {endTime.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1 font-semibold" asChild>
                    <Link href="/Booking">Reschedule</Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="px-6 font-medium"
                    onClick={() => handleCancel(apt.id)}
                    disabled={isCancelling}
                  >
                    {isCancelling ? 'Cancelling...' : 'Cancel'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {appointments.length === 0 && (
          <Card className="bg-muted/30 border-dashed border-border flex flex-col items-center justify-center text-center p-6 shadow-none col-span-full">
            <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center border border-border mb-4">
              <PlusCircle className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <div className="mb-4">
              <p className="font-bold text-muted-foreground">No upcoming appointments</p>
              <p className="text-xs text-muted-foreground/70 leading-relaxed max-w-[200px] mx-auto mt-1">
                Routine checkups every 6 months keep your smile perfect.
              </p>
            </div>
            <Button variant="link" className="text-primary font-bold text-sm" asChild>
              <Link href="/Booking">Schedule one</Link>
            </Button>
          </Card>
        )}
      </div>
    </section>
  );
}
