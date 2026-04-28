import { Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { DoctorProfileForm } from '@/src/features/doctor/components/settings/DoctorProfileForm';
import { DoctorScheduleForm } from '@/src/features/doctor/components/settings/DoctorScheduleForm';
import { getAuthCookies } from '@/src/lib/auth-cookies';
import { apiGet } from '@/src/lib/api-client';

async function DoctorSettingsContent() {
  const { accessToken } = await getAuthCookies();

  let doctor = null;
  let schedules = [];

  try {
    const res = await apiGet<any>('/doctor/me', accessToken);
    doctor = res.data;
    
    if (doctor?.id) {
      const scheduleRes = await apiGet<any>(`/doctor/${doctor.id}/availability`, accessToken);
      schedules = scheduleRes.data || [];
    }
  } catch (err) {
    console.error('Failed to fetch doctor settings data:', err);
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 w-full flex-1">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1 font-medium">
          Manage your public profile and weekly availability.
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Profile Information</TabsTrigger>
          <TabsTrigger value="schedule">Working Hours</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="mt-6">
          <DoctorProfileForm initialData={doctor} />
        </TabsContent>
        
        <TabsContent value="schedule" className="mt-6">
          <DoctorScheduleForm initialSchedules={schedules} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function DoctorSettings() {
  return (
    <Suspense fallback={<div className="p-8 text-muted-foreground">Loading settings...</div>}>
      <DoctorSettingsContent />
    </Suspense>
  );
}
