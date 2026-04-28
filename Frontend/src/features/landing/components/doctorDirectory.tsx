import { Button } from '@/src/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { DoctorCard } from './doctorCard';
import { BASE_URL } from '@/src/lib/api-client';

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  location: string;
  photo?: string;
  rating?: number;
  user?: { name: string };
}
export async function DoctorDirectory() {
  let doctors = [];

  try {
    const response = await fetch(`${BASE_URL}/doctor`, { cache: 'no-store' });
    if (response.ok) {
      const json = await response.json();
      // Unwrap the secure package sent by your NestJS service
      doctors = json.status === 'success' ? json.data : json?.data || [];
    }
  } catch (err) {
    console.error('Failed to fetch doctors:', err);
  }

  return (
    <section className="space-y-8 animate-in fade-in duration-1000 delay-500 fill-mode-both">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight text-foreground leading-tight">
            Doctor Directory
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Select from our network of world-class dental specialists.
          </p>
        </div>
        <Button
          variant="ghost"
          className="group h-full cursor-pointer w-fit flex items-center gap-1 px-3 py-3 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground active:scale-95"
        >
          <Link href="/directory">View All</Link>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
        </Button>
      </div>

      {/* Grid Map Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {doctors?.map((doc: Doctor, index: number) => {
          // The Security Mapper (Adapter Pattern)
          const cleanDoctor = {
            id: doc.id,
            name: doc.user?.name || 'Unknown Doctor', // Inner Data
            specialty: doc.specialty, // Outer Data
            location: doc.location || 'Clinic Location', // Outer Data
            image:
              doc.photo ||
              'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop',
            rating: doc.rating || 5,
          };

          return (
            <div
              key={cleanDoctor.id}
              className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both"
              style={{ animationDelay: `${index * 150 + 300}ms` }}
            >
              <DoctorCard doctor={cleanDoctor} />
            </div>
          );
        })}
      </div>
    </section>
  );
}
