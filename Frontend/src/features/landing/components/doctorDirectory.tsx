import { Button } from '@/src/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { DOCTORS } from '../constants/mockData';
import { DoctorCard } from './doctorCard';

export function DoctorDirectory() {
  return (
    <section className="space-y-8 animate-in fade-in duration-1000 delay-500 fill-mode-both">
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
          className="group h-full cursor-pointer w-fit flex items-center gap-1 px-3 py-3 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground active:scale-95 "
        >
          <Link href="/directory">View All</Link>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {DOCTORS.map((doctor, index) => (
          <div
            key={doctor.id}
            className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both"
            style={{ animationDelay: `${index * 150 + 300}ms` }}
          >
            <DoctorCard doctor={doctor} />
          </div>
        ))}
      </div>
    </section>
  );
}
