'use client';

import { useState } from 'react';
import {
  Star,
  MapPin,
  Clock,
  ChevronLeft,
  ChevronRight,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

// Assume these shadcn components exist in your project
import { Button } from '@/src/components/ui/button';
import { Card, CardContent } from '@/src/components/ui/card';
import { Textarea } from '@/src/components/ui/textarea';
import Image from 'next/image';

// ============================================================================
// MOCK DATA
// ============================================================================

const DAYS_IN_MONTH = Array.from({ length: 10 }, (_, i) => i + 1); // Mock days 1-10
const PREV_MONTH_DAYS = [28, 29, 30, 31];

const TIME_SLOTS = [
  { id: 1, time: '09:00 AM', period: 'Morning', status: 'available' },
  { id: 2, time: '10:30 AM', period: 'Morning', status: 'available' },
  { id: 3, status: 'loading' },
  { id: 4, status: 'loading' },
  { id: 5, time: '01:00 PM', period: 'Afternoon', status: 'available' },
  { id: 6, time: '02:30 PM', period: 'Afternoon', status: 'available' },
  { id: 7, time: '04:00 PM', period: 'Afternoon', status: 'available' },
  { id: 8, time: '05:30 PM', period: 'Afternoon', status: 'full' },
];

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function TopNav() {
  return (
    <header className="w-full sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border shadow-sm">
      <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        <div className="text-xl font-bold text-primary tracking-tight">
          Smart Dental
        </div>
        <nav className="hidden md:flex space-x-8">
          <a
            className="text-muted-foreground hover:text-primary transition-colors"
            href="#"
          >
            Home
          </a>
          <a
            className="text-primary font-semibold border-b-2 border-primary pb-1"
            href="#"
          >
            Appointments
          </a>
        </nav>
        <Button
          variant="ghost"
          className="text-muted-foreground hover:text-primary transition-colors"
        >
          Logout
        </Button>
      </div>
    </header>
  );
}

function SuccessModal({
  isOpen,
  onClose,
  date,
  time,
}: {
  isOpen: boolean;
  onClose: () => void;
  date: number | null;
  time: string | null;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm px-6 animate-in fade-in duration-200">
      <Card className="max-w-md w-full text-center p-6 shadow-xl border-border">
        <CardContent className="space-y-6 pt-6">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="text-primary w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-foreground">
            Booking Confirmed!
          </h3>
          <p className="text-muted-foreground">
            Your appointment with Dr. Elena Rodriguez is scheduled for{' '}
            <span className="font-bold text-foreground">
              Nov {date}th, 2024 at {time}
            </span>
            .
          </p>
          <Button
            onClick={onClose}
            className="w-full py-6 text-base font-semibold"
          >
            Done
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function Footer() {
  return (
    <footer className="w-full border-t border-border bg-muted/30 mt-20">
      <div className="flex flex-col md:flex-row justify-between items-center px-8 py-12 max-w-7xl mx-auto space-y-6 md:space-y-0">
        <div className="text-lg font-semibold text-foreground">
          Smart Dental Clinic
        </div>
        <div className="flex gap-8">
          <a
            className="text-sm font-normal text-muted-foreground hover:text-primary transition-colors"
            href="#"
          >
            Privacy Policy
          </a>
          <a
            className="text-sm font-normal text-muted-foreground hover:text-primary transition-colors"
            href="#"
          >
            Terms
          </a>
          <a
            className="text-sm font-normal text-muted-foreground hover:text-primary transition-colors"
            href="#"
          >
            Social
          </a>
        </div>
        <p className="text-sm font-normal leading-relaxed text-muted-foreground">
          © {new Date().getFullYear()} Smart Dental Clinic. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function BookingPage() {
  const [selectedDate, setSelectedDate] = useState<number | null>(6);
  const [selectedTime, setSelectedTime] = useState<string | null>('09:00 AM');
  const [showModal, setShowModal] = useState(false);

  const handleConfirmBooking = () => {
    if (selectedDate && selectedTime) {
      setShowModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased flex flex-col">
      <TopNav />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Sidebar: Doctor Profile */}
          <aside className="lg:col-span-4 space-y-8">
            <Card className="shadow-sm border-border">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <Image
                    width={128}
                    height={128}
                    alt="Dr. Elena Rodriguez"
                    className="w-32 h-32 rounded-full object-cover border-4 border-background shadow-sm bg-muted"
                    src="https://ui-avatars.com/api/?name=Elena+Rodriguez&background=e2e8f0&color=0f172a&size=256"
                  />
                  <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-4 border-background rounded-full"></div>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">
                  Elena Rodriguez
                </h1>
                <p className="text-primary font-medium mb-4">
                  Senior Orthodontist
                </p>
                <div className="flex items-center gap-2 mb-6">
                  <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                  <span className="font-semibold text-foreground">4.9</span>
                  <span className="text-muted-foreground text-sm">
                    (120+ Reviews)
                  </span>
                </div>
                <div className="w-full space-y-4 text-left border-t border-border pt-6">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      Central Medical Plaza, Suite 402, New York
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-muted-foreground shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      Mon - Fri: 09:00 AM - 05:00 PM
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted/50 border-border shadow-none">
              <CardContent className="p-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
                  Booking Info
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Select a date and time for your consultation. For emergency
                  cases, please call our 24/7 hotline directly.
                </p>
              </CardContent>
            </Card>
          </aside>

          {/* Right Area: Booking Canvas */}
          <section className="lg:col-span-8 space-y-10">
            {/* Date Picker */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  Select Date
                </h2>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="font-medium text-sm">November 2024</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Card className="shadow-sm border-border">
                <CardContent className="p-6">
                  <div className="grid grid-cols-7 gap-4 text-center">
                    {/* Weekday Headers */}
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
                      (day) => (
                        <div
                          key={day}
                          className="text-xs font-bold text-muted-foreground uppercase tracking-tighter pb-2"
                        >
                          {day}
                        </div>
                      ),
                    )}

                    {/* Previous Month Days */}
                    {PREV_MONTH_DAYS.map((day) => (
                      <div
                        key={`prev-${day}`}
                        className="p-3 text-sm text-muted-foreground/40 font-medium"
                      >
                        {day}
                      </div>
                    ))}

                    {/* Current Month Days */}
                    {DAYS_IN_MONTH.map((day) => (
                      <button
                        key={day}
                        onClick={() => setSelectedDate(day)}
                        className={cn(
                          'p-3 text-sm font-medium rounded-lg transition-all',
                          selectedDate === day
                            ? 'bg-primary text-primary-foreground shadow-md'
                            : 'hover:bg-muted text-foreground',
                        )}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Time Slots */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  Available Slots
                </h2>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  <span className="text-xs text-muted-foreground font-medium">
                    Selected Slot
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {TIME_SLOTS.map((slot, idx) => {
                  if (slot.status === 'loading') {
                    return (
                      <div
                        key={`loading-${idx}`}
                        className="flex flex-col items-center justify-center p-4 bg-muted/50 rounded-lg animate-pulse border border-border"
                      >
                        <div className="w-12 h-3 bg-muted-foreground/20 rounded mb-2"></div>
                        <div className="w-16 h-5 bg-muted-foreground/20 rounded"></div>
                      </div>
                    );
                  }

                  const isSelected = selectedTime === slot.time;
                  const isFull = slot.status === 'full';

                  return (
                    <button
                      key={slot.id}
                      disabled={isFull}
                      onClick={() => setSelectedTime(slot.time!)}
                      className={cn(
                        'flex flex-col items-center justify-center p-4 rounded-lg transition-all border',
                        isSelected
                          ? 'bg-primary text-primary-foreground border-primary shadow-md ring-2 ring-primary ring-offset-2 ring-offset-background'
                          : isFull
                            ? 'bg-muted/50 text-muted-foreground opacity-50 cursor-not-allowed border-transparent'
                            : 'bg-card text-foreground border-border hover:bg-accent hover:text-accent-foreground hover:border-accent',
                      )}
                    >
                      <span
                        className={cn(
                          'text-xs font-bold uppercase tracking-tight mb-1',
                          isSelected
                            ? 'text-primary-foreground/80'
                            : 'text-muted-foreground',
                        )}
                      >
                        {isFull ? 'Full' : slot.period}
                      </span>
                      <span className="text-lg font-semibold">{slot.time}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Patient Form */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Additional Details
              </h2>
              <Card className="shadow-sm border-border">
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest block">
                      Reason for visit
                    </label>
                    <Textarea
                      className="w-full bg-muted/50 border-border rounded-lg p-4 focus-visible:ring-primary min-h-[120px] resize-y"
                      placeholder="Describe your symptoms or dental concerns (optional)..."
                    />
                  </div>

                  <div className="flex items-center gap-3 bg-primary/10 p-4 rounded-lg border border-primary/20">
                    <Info className="text-primary w-5 h-5 shrink-0" />
                    <p className="text-sm text-foreground font-medium">
                      Your appointment will be confirmed immediately after you
                      click the button below.
                    </p>
                  </div>

                  <Button
                    size="lg"
                    className="w-full py-6 text-lg font-bold shadow-md transition-all active:scale-[0.98]"
                    onClick={handleConfirmBooking}
                    disabled={!selectedDate || !selectedTime}
                  >
                    Confirm Booking
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </main>

      <Footer />

      {/* Success Modal */}
      <SuccessModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        date={selectedDate}
        time={selectedTime}
      />
    </div>
  );
}
