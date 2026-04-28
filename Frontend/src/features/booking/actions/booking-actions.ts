'use server';

import { apiPost, apiGet, apiPatch } from '@/src/lib/api-client';
import { getAuthCookies } from '@/src/lib/auth-cookies';

// ===========================
// Types
// ===========================
interface Doctor {
  id: string;
  specialty: string;
  bio: string | null;
  photo: string | null;
  rating: number;
  location: string | null;
  user: {
    id: string;
    name: string;
    email: string;
  };
  schedules?: {
    day: string;
    timeSlots: { start: string; end: string }[];
  }[];
}

interface Appointment {
  id: string;
  date: string;
  duration: number;
  status: string;
  notes: string | null;
  doctor: {
    specialty: string;
    user: { name: string; email: string };
  };
}

// ===========================
// GET: Fetch single doctor + availability
// ===========================
export async function getDoctorWithAvailability(doctorId: string) {
  const { accessToken } = await getAuthCookies();
  try {
    const res = await apiGet<{ status: string; data: Doctor }>(
      `/doctor/${doctorId}`,
      accessToken || undefined,
    );
    return { success: true, doctor: res.data };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to fetch doctor', doctor: null };
  }
}

// ===========================
// GET: Fetch patient's own appointments
// ===========================
export async function getMyAppointments() {
  const { accessToken } = await getAuthCookies();
  try {
    const res = await apiGet<{ status: string; data: { appointments: Appointment[] } }>(
      '/appointments/my',
      accessToken || undefined,
    );
    return { success: true, appointments: res.data.appointments };
  } catch (err: any) {
    return { success: false, error: err.message, appointments: [] };
  }
}

// ===========================
// POST: Create appointment
// ===========================
export async function createAppointment(data: {
  doctorId: string;
  date: string;
  duration?: number;
  notes?: string;
}) {
  const { accessToken } = await getAuthCookies();
  try {
    const res = await apiPost<{ status: string; data: { appointment: Appointment } }>(
      '/appointments',
      data as unknown as Record<string, unknown>,
      accessToken || undefined,
    );
    return { success: true, appointment: res.data.appointment };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to create appointment' };
  }
}

// ===========================
// PATCH: Cancel appointment
// ===========================
export async function cancelAppointment(appointmentId: string) {
  const { accessToken } = await getAuthCookies();
  try {
    const res = await apiPatch<{ status: string; data: { appointment: Appointment } }>(
      `/appointments/${appointmentId}/cancel`,
      {},
      accessToken || undefined,
    );
    return { success: true, appointment: res.data.appointment };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to cancel appointment' };
  }
}
