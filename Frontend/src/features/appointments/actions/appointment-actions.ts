'use server';

import { revalidatePath } from 'next/cache';
import { apiPatch } from '@/src/lib/api-client';
import { getAuthCookies } from '@/src/lib/auth-cookies';

export async function updateAppointmentStatusAction(
  id: string,
  status: string,
) {
  try {
    const { accessToken } = await getAuthCookies();
    if (!accessToken) {
      return { success: false, error: 'Unauthorized' };
    }

    await apiPatch(`/appointments/${id}`, { status }, accessToken);

    // Revalidate dashboards so the UI updates
    revalidatePath('/doctor', 'page');
    revalidatePath('/patient', 'page');

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to update appointment status',
    };
  }
}

export async function cancelAppointmentAction(id: string) {
  try {
    const { accessToken } = await getAuthCookies();
    if (!accessToken) {
      return { success: false, error: 'Unauthorized' };
    }

    await apiPatch(`/appointments/${id}/cancel`, {}, accessToken);

    // Revalidate dashboards
    revalidatePath('/doctor', 'page');
    revalidatePath('/patient', 'page');

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to cancel appointment',
    };
  }
}
