import { apiGet } from '@/src/lib/api-client';
import { getAuthCookies } from '@/src/lib/auth-cookies';
import { BookingClient } from '@/src/features/booking/components/BookingClient';

interface Doctor {
  id: string;
  specialty: string;
  bio: string | null;
  photo: string | null;
  rating: number;
  location: string | null;
  user: { id: string; name: string; email: string };
  schedules?: {
    day: string;
    timeSlots: { start: string; end: string }[];
  }[];
}

export default async function BookingDetailes({
  searchParams,
}: {
  searchParams: Promise<{ doctorId?: string }>;
}) {
  const { doctorId } = await searchParams;
  const { accessToken } = await getAuthCookies();

  let doctor: Doctor | null = null;
  let doctors: Doctor[] = [];

  try {
    if (doctorId) {
      // Fetch specific doctor with their schedule
      const res = await apiGet<{ status: string; data: Doctor }>(
        `/doctor/${doctorId}`,
        accessToken || undefined,
      );
      doctor = res.data;
    }

    // Also fetch all doctors for the selector
    const allRes = await apiGet<{ status: string; data: Doctor[] }>(
      '/doctor?limit=50',
      accessToken || undefined,
    );
    doctors = allRes.data;
  } catch (err) {
    console.error('Failed to fetch booking data:', err);
  }

  return <BookingClient doctor={doctor} doctors={doctors} />;
}
