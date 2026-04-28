import { Suspense } from 'react';
import { CalendarOff } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import {
  AppointmentCard,
  InsightCard,
  QueueCard,
} from '@/src/features/doctor/components/dashboard';
import { apiGet } from '@/src/lib/api-client';
import { getAuthCookies } from '@/src/lib/auth-cookies';

interface Appointment {
  id: string;
  date: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes: string | null;
  adminNotes: string | null;
  createdAt: string;
  patient: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  };
}

async function DoctorScheduleDashboardContent() {
  const { accessToken } = await getAuthCookies();

  let appointments: Appointment[] = [];
  try {
    const res = await apiGet<{
      status: string;
      data: { appointments: Appointment[] };
    }>('/appointments/doctor', accessToken || undefined);
    appointments = res.data.appointments;
  } catch (err) {
    console.error('Failed to fetch doctor appointments:', err);
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today.getTime() + 86400000);

  // Filter today's appointments
  const todayAppointments = appointments.filter((a) => {
    const d = new Date(a.date);
    return d >= today && d < tomorrow && a.status !== 'cancelled';
  });

  // Separate by AM/PM
  const morning = todayAppointments.filter(
    (a) => new Date(a.date).getHours() < 12,
  );
  const afternoon = todayAppointments.filter(
    (a) => new Date(a.date).getHours() >= 12,
  );

  // Build queue: pending/confirmed appointments sorted by time
  const queue = todayAppointments
    .filter((a) => a.status === 'pending' || a.status === 'confirmed')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)
    .map((a) => ({
      name: a.patient.name,
      time: new Date(a.date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      initials: a.patient.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase(),
    }));

  // Week day carousel
  const weekDays = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - d.getDay() + i); // Sun=0 based
    return {
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      date: d.getDate().toString(),
      active: d.toDateString() === today.toDateString(),
    };
  });

  // Stats for insight card
  const totalToday = todayAppointments.length;
  const completedToday = todayAppointments.filter(
    (a) => a.status === 'completed',
  ).length;
  const completionRate =
    totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 w-full flex-1">
      {/* Header & Date Carousel */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Daily Schedule
          </h1>
          <p className="text-muted-foreground mt-1 font-medium">
            {totalToday > 0
              ? `You have ${totalToday} appointment${totalToday > 1 ? 's' : ''} today.`
              : 'No appointments scheduled for today.'}
          </p>
        </div>

        <div className="flex gap-2 p-1 bg-background border border-border rounded-xl shadow-sm overflow-x-auto">
          {weekDays.map((dayObj, i) => (
            <div
              key={i}
              className={cn(
                'flex flex-col items-center min-w-[56px] py-2 rounded-lg transition-colors cursor-pointer',
                dayObj.active
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                  : 'hover:bg-muted text-foreground',
              )}
            >
              <span
                className={cn(
                  'text-[10px] font-bold uppercase',
                  dayObj.active ? 'opacity-80' : 'text-muted-foreground',
                )}
              >
                {dayObj.day}
              </span>
              <span className="text-sm font-bold mt-0.5">{dayObj.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12">
        {/* Left Column: Schedule List */}
        <div className="lg:col-span-8 space-y-4">
          {morning.length > 0 && (
            <>
              <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2 mt-2">
                Morning Blocks
              </h2>
              {morning.map((apt) => {
                const d = new Date(apt.date);
                return (
                  <AppointmentCard
                    key={apt.id}
                    id={apt.id}
                    status={apt.status}
                    time={d.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    })}
                    period="AM"
                    name={apt.patient.name}
                    initials={apt.patient.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()}
                    type={apt.notes || 'GENERAL'}
                    duration={`${apt.duration} Mins`}
                    isActive={apt.status === 'confirmed'}
                    isInProgress={false}
                  />
                );
              })}
            </>
          )}

          {afternoon.length > 0 && (
            <>
              <div className="h-6"></div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">
                Afternoon Blocks
              </h2>
              {afternoon.map((apt) => {
                const d = new Date(apt.date);
                return (
                  <AppointmentCard
                    key={apt.id}
                    id={apt.id}
                    status={apt.status}
                    time={d.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    })}
                    period="PM"
                    name={apt.patient.name}
                    initials={apt.patient.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()}
                    type={apt.notes || 'GENERAL'}
                    duration={`${apt.duration} Mins`}
                    isActive={apt.status === 'confirmed'}
                    isInProgress={false}
                  />
                );
              })}
            </>
          )}

          {todayAppointments.length === 0 && (
            <div className="bg-background border-2 border-dashed border-border rounded-xl p-12 flex flex-col items-center justify-center text-center opacity-70 mt-4">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <CalendarOff className="w-6 h-6 text-muted-foreground" />
              </div>
              <h4 className="font-bold text-foreground">
                No appointments scheduled
              </h4>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                Your schedule is clear for today. You can open more slots in
                settings.
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Sidebar Widgets */}
        <div className="lg:col-span-4 space-y-8">
          <InsightCard
            totalAppointments={totalToday}
            completedCount={completedToday}
            completionRate={completionRate}
          />
          <QueueCard queuePatients={queue} />
        </div>
      </div>
    </div>
  );
}

export default function DoctorScheduleDashboard() {
  return (
    <Suspense fallback={<div className="p-8 text-muted-foreground">Loading schedule...</div>}>
      <DoctorScheduleDashboardContent />
    </Suspense>
  );
}
