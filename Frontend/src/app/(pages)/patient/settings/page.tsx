import { Suspense } from 'react';
import { PatientProfileForm } from '@/src/features/patient/components/settings/PatientProfileForm';
import { getAuthCookies } from '@/src/lib/auth-cookies';
import { apiGet } from '@/src/lib/api-client';

async function PatientSettingsContent() {
  const { accessToken } = await getAuthCookies();

  let user = null;

  try {
    const res = await apiGet<any>('/userMe', accessToken);
    user = res.data?.user;
  } catch (err) {
    console.error('Failed to fetch patient settings data:', err);
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-3 text-foreground">
          Account Settings
        </h1>
        <p className="text-lg text-muted-foreground font-normal">
          Manage your personal information and contact details.
        </p>
      </header>

      <div className="max-w-2xl">
        <PatientProfileForm initialData={user} />
      </div>
    </div>
  );
}

export default function PatientSettings() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto px-6 py-12 text-muted-foreground">Loading settings...</div>}>
      <PatientSettingsContent />
    </Suspense>
  );
}
