import { PatientTopNavBar } from "@/src/features/patient/components/layout/PatientTopNavBar";
import { PatientFooter } from "@/src/features/patient/components/layout/PatientFooter";

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/20 text-foreground font-sans antialiased flex flex-col">
      <PatientTopNavBar />
      <main className="flex-1">
        {children}
      </main>
      <PatientFooter />
    </div>
  );
}
