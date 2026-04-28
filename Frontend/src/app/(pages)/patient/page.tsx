import { Suspense } from 'react';
import {
  UpcomingAppointments,
  PastAppointments,
  ProfileSideCard,
  TreatmentTimeline,
} from '@/src/features/patient/components/dashboard';
import { apiGet } from '@/src/lib/api-client';
import { getAuthCookies } from '@/src/lib/auth-cookies';

// Types matching the backend response
interface Appointment {
  id: string;
  date: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes: string | null;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
  doctor: {
    specialty: string;
    photo: string | null;
    user: { name: string; email: string };
  };
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  dateOfBirth: string | null;
  active: boolean;
  createdAt: string;
}

async function PatientDashboardContent() {
  const { accessToken } = await getAuthCookies();

  let appointments: Appointment[] = [];
  let user: UserProfile | null = null;

  try {
    const [appointmentRes, userRes] = await Promise.all([
      apiGet<{ status: string; data: { appointments: Appointment[] } }>(
        '/appointments/my',
        accessToken || undefined,
      ),
      apiGet<{ status: string; data: { user: UserProfile } }>(
        '/userMe',
        accessToken || undefined,
      ),
    ]);
    appointments = appointmentRes.data.appointments;
    user = userRes.data.user;
  } catch (err) {
    console.error('Failed to fetch patient dashboard data:', err);
  }

  const now = new Date();
  const upcoming = appointments.filter(
    (a) =>
      new Date(a.date) >= now &&
      a.status !== 'cancelled' &&
      a.status !== 'completed',
  );
  const past = appointments.filter(
    (a) =>
      new Date(a.date) < now || a.status === 'completed' || a.status === 'cancelled',
  );

  const firstName = user?.name?.split(' ')[0] || 'Patient';

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-5xl font-extrabold tracking-tight mb-3 text-foreground">
          Welcome back, {firstName}.
        </h1>
        <p className="text-lg text-muted-foreground font-normal">
          {upcoming.length > 0
            ? `You have ${upcoming.length} upcoming appointment${upcoming.length > 1 ? 's' : ''}.`
            : 'Your oral health journey is looking bright today.'}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
        <div className="space-y-12 min-w-0">
          <UpcomingAppointments appointments={upcoming} />
          <PastAppointments appointments={past} />
        </div>

        <aside className="space-y-8">
          <ProfileSideCard user={user} />
          <TreatmentTimeline appointments={past} />
        </aside>
      </div>
    </div>
  );
}

export default function PatientDashboard() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-6 py-12 text-muted-foreground">Loading dashboard...</div>}>
      <PatientDashboardContent />
    </Suspense>
  );
}
