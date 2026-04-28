import { Card, CardContent } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { MapPin } from 'lucide-react';
import Image from 'next/image';
import type { Doctor } from '../types';

export function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <Card className="group rounded-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-border hover:border-primary/30 overflow-hidden cursor-pointer">
      <CardContent className="p-6">
        <div className="relative mb-6">
          <div className="aspect-[4/5] rounded-lg overflow-hidden bg-muted">
            <Image
              alt={doctor.name}
              src={doctor.image}
              width={400}
              height={500}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
            />
          </div>

          {/* Pulsing dot with added ARIA labels for accessibility */}
          <div
            className="absolute top-4 right-4 h-3 w-3 bg-chart-2 rounded-full ring-4 ring-background animate-pulse"
            title="Available for booking"
            aria-label="Available for booking"
          />
        </div>

        <div className="space-y-1 mb-6">
          <h3 className="text-lg font-bold text-foreground leading-tight group-hover:text-primary transition-colors duration-300">
            {doctor.name}
          </h3>
          <p className="text-muted-foreground text-sm font-medium leading-relaxed">
            {doctor.specialty}
          </p>
          <div className="flex items-center gap-2 text-primary pt-2">
            <MapPin className="w-4 h-4" />
            <span className="text-xs font-semibold">{doctor.location}</span>
          </div>
        </div>

        <Button className="w-full font-bold text-sm tracking-wide group-hover:shadow-md active:scale-95">
          Check Availability
        </Button>
      </CardContent>
    </Card>
  );
}
