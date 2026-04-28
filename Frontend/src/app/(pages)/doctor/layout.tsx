import { DoctorSidebar } from '@/src/features/doctor/components/layout/DoctorSidebar';
import { DoctorTopBar } from '@/src/features/doctor/components/layout/DoctorTopBar';

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-muted/30 text-foreground flex min-h-screen font-sans antialiased">
      <DoctorSidebar />
      <main className="flex-1 ml-64 min-h-screen flex flex-col">
        <DoctorTopBar />
        <div className="flex-1 max-w-7xl  mx-auto w-full">{children}</div>
      </main>
    </div>
  );
}
