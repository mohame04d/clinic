import {
  TopNav,
  HeroSection,
  DoctorDirectory,
  FeaturesSection,
} from '@/src/features/landing';
import { Footer } from '@/src/components/layout/footer';
export default function SmartDentalPage() {
  return (
    <div className="bg-background text-foreground antialiased min-h-screen font-sans overflow-x-hidden">
      <TopNav />
      <main className="max-w-7xl mx-auto px-6 max-xs:px-2 space-y-16 lg:space-y-32 py-16">
        <HeroSection />
        <DoctorDirectory />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
}
