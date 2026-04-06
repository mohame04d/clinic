import { BadgeCheck, Star, CalendarDays, ArrowRight } from 'lucide-react';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent } from '@/src/components/ui/card';
import Image from 'next/image';

export function HeroSection() {
  return (
    <section className="grid grid-cols-12 gap-8 items-center">
      <div className="col-span-12 lg:col-span-7 space-y-8">
        {/* Staggered entrance 1: Badge */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Badge
            variant="secondary"
            className="px-3 py-4 text-sm font-medium rounded-lg hover:bg-secondary/80 transition-colors cursor-default"
          >
            <div>
              <BadgeCheck size={20} className="mr-1 text-primary" />
            </div>
            Premium Dental Services
          </Badge>
        </div>

        {/* Staggered entrance 2: Heading (delayed) */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 fill-mode-both">
          Expert dental care, <br />
          <span className="text-primary italic font-serif">simplified.</span>
        </h1>

        {/* Staggered entrance 3: Paragraph (delayed further) */}
        <p className="text-muted-foreground max-w-xl leading-relaxed text-lg animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300 fill-mode-both">
          Experience the future of dentistry. We combine clinical precision with
          an editorial-grade patient experience, ensuring your smile receives
          the artistry and authority it deserves.
        </p>

        {/* Staggered entrance 4: Buttons */}
        <div className="flex flex-wrap gap-4 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 fill-mode-both">
          <Button
            size="lg"
            className="py-6 px-4 rounded-lg font-bold shadow-md text-base hover:shadow-lg hover:-translate-y-0.25"
          >
            <CalendarDays className="w-5 h-5 mr-2" />
            Book Consultation
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="py-6 px-4 rounded-lg font-semibold bg-muted hover:bg-accent text-base hover:shadow-md hover:-translate-y-0.25"
          >
            Get Started
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>

      {/* Image Entrance: Fade and scale in smoothly */}
      <div className="col-span-12 lg:col-span-5 relative animate-in fade-in zoom-in-95 duration-1000 delay-300 fill-mode-both">
        <div className="aspect-square rounded-2xl overflow-hidden shadow-xl group">
          <Image
            alt="Modern dental clinic"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800"
            width={400}
            height={500}
          />
        </div>

        {/* Floating Card Entrance */}
        <Card className="absolute -bottom-6 -left-6 p-2 rounded-xl shadow-md border-border max-w-xs hidden md:block animate-in fade-in slide-in-from-bottom-8 duration-700 delay-700 fill-mode-both hover:-translate-y-1 hover:shadow-xl transition-all">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-inner">
              <Star className="w-6 h-6 fill-current" />
            </div>
            <div>
              <p className="font-bold text-foreground">4.9/5 Rating</p>
              <p className="text-sm text-muted-foreground">
                From 2,500+ patients
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
