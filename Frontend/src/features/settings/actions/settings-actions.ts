'use server';

import { revalidatePath } from 'next/cache';
import { apiPatch, apiPost } from '@/src/lib/api-client';
import { getAuthCookies } from '@/src/lib/auth-cookies';

export async function updateUserAction(data: { name?: string; phone?: string; dateOfBirth?: string }) {
  try {
    const { accessToken } = await getAuthCookies();
    if (!accessToken) return { success: false, error: 'Unauthorized' };

    await apiPatch('/userMe', data, accessToken);
    
    revalidatePath('/doctor');
    revalidatePath('/patient');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update user' };
  }
}

export async function updateDoctorProfileAction(data: { specialty?: string; bio?: string; location?: string }) {
  try {
    const { accessToken } = await getAuthCookies();
    if (!accessToken) return { success: false, error: 'Unauthorized' };

    await apiPatch('/doctor/profile', data, accessToken);
    
    revalidatePath('/doctor');
    revalidatePath('/Booking'); // Revalidate booking to update doctor info
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update doctor profile' };
  }
}

export async function setDoctorScheduleAction(schedulePayload: any) {
  try {
    const { accessToken } = await getAuthCookies();
    if (!accessToken) return { success: false, error: 'Unauthorized' };

    await apiPost('/doctor/schedule', schedulePayload, accessToken);
    
    revalidatePath('/doctor');
    revalidatePath('/Booking'); // Revalidate booking so new slots appear
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to save schedule' };
  }
}
