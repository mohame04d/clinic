'use client';

import { useState, useTransition } from 'react';
import {
  Star,
  MapPin,
  Clock,
  Info,
  CheckCircle2,
  Calendar,
  Loader2,
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { LogoutButton } from '@/src/components/LogoutButton';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent } from '@/src/components/ui/card';
import { Textarea } from '@/src/components/ui/textarea';
import Image from 'next/image';
import { createAppointment } from '@/src/features/booking/actions/booking-actions';
import { useRouter } from 'next/navigation';

// ============================================================================
// TYPES
// ============================================================================
interface Doctor {
  id: string;
  specialty: string;
  bio: string | null;
  photo: string | null;
  rating: number;
  location: string | null;
  user: { id: string; name: string; email: string };
  schedules?: {
    day: string;
    timeSlots: { start: string; end: string }[];
  }[];
}

// ============================================================================
// HELPERS
// ============================================================================
const DAY_MAP: Record<string, number> = {
  SUN: 0,
  MON: 1,
  TUE: 2,
  WED: 3,
  THU: 4,
  FRI: 5,
  SAT: 6,
};

function generateTimeSlots(
  schedules: Doctor['schedules'],
  selectedDate: Date | null,
) {
  if (!schedules || !selectedDate) return [];

  const dayName = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][
    selectedDate.getDay()
  ];
  const daySchedule = schedules.find((s) => s.day === dayName);
  if (!daySchedule) return [];

  const slots: { time: string; period: string; dateTime: string }[] = [];

  for (const slot of daySchedule.timeSlots) {
    const [startH, startM] = slot.start.split(':').map(Number);
    const [endH, endM] = slot.end.split(':').map(Number);

    let h = startH;
    let m = startM;

    while (h < endH || (h === endH && m < endM)) {
      const date = new Date(selectedDate);
      date.setHours(h, m, 0, 0);
      const period = h < 12 ? 'Morning' : 'Afternoon';
      const timeStr = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });

      slots.push({
        time: timeStr,
        period,
        dateTime: date.toISOString(),
      });

      // Advance by 30 min
      m += 30;
      if (m >= 60) {
        h += 1;
        m -= 60;
      }
    }
  }

  return slots;
}

function getAvailableDays(schedules: Doctor['schedules']): number[] {
  if (!schedules) return [];
  return schedules.map((s) => DAY_MAP[s.day]).filter((d) => d !== undefined);
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

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
            href="/patient"
          >
            Home
          </a>
          <a
            className="text-primary font-semibold border-b-2 border-primary pb-1"
            href="/Booking"
          >
            Appointments
          </a>
        </nav>
        <LogoutButton variant="ghost" />
      </div>
    </header>
  );
}

function SuccessModal({
  isOpen,
  onClose,
  doctorName,
  dateStr,
  time,
}: {
  isOpen: boolean;
  onClose: () => void;
  doctorName: string;
  dateStr: string;
  time: string;
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
            Your appointment with{' '}
            <span className="font-bold text-foreground">{doctorName}</span> is
            scheduled for{' '}
            <span className="font-bold text-foreground">
              {dateStr} at {time}
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
        <p className="text-sm font-normal leading-relaxed text-muted-foreground">
          Smart Dental Clinic. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

// ============================================================================
// MAIN CLIENT COMPONENT
// ============================================================================
export function BookingClient({
  doctor: initialDoctor,
  doctors,
}: {
  doctor: Doctor | null;
  doctors: Doctor[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(
    initialDoctor || doctors[0] || null,
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDateTime, setSelectedDateTime] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calendar state
  const now = new Date();
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [viewYear, setViewYear] = useState(now.getFullYear());

  const availableDays = selectedDoctor
    ? getAvailableDays(selectedDoctor.schedules)
    : [];
  const timeSlots = selectedDoctor
    ? generateTimeSlots(selectedDoctor.schedules, selectedDate)
    : [];

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const monthName = new Date(viewYear, viewMonth).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const handleDateClick = (day: number) => {
    const date = new Date(viewYear, viewMonth, day);
    setSelectedDate(date);
    setSelectedTime(null);
    setSelectedDateTime(null);
  };

  const handleConfirmBooking = () => {
    if (!selectedDoctor || !selectedDateTime) return;
    setError(null);

    startTransition(async () => {
      const result = await createAppointment({
        doctorId: selectedDoctor.id,
        date: selectedDateTime,
        duration: 30,
        notes: notes || undefined,
      });

      if (result.success) {
        setShowModal(true);
      } else {
        setError(result.error || 'Failed to create appointment');
      }
    });
  };

  const handleDoctorChange = (docId: string) => {
    const doc = doctors.find((d) => d.id === docId);
    if (doc) {
      setSelectedDoctor(doc);
      setSelectedDate(null);
      setSelectedTime(null);
      setSelectedDateTime(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased flex flex-col">
      <TopNav />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full">
        {/* Doctor Selector */}
        {doctors.length > 1 && (
          <div className="mb-8">
            <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest block mb-3">
              Select Doctor
            </label>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {doctors.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => handleDoctorChange(doc.id)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl border transition-all whitespace-nowrap',
                    selectedDoctor?.id === doc.id
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                      : 'border-border hover:border-primary/40',
                  )}
                >
                  <Image
                    width={40}
                    height={40}
                    alt={doc.user.name}
                    className="w-10 h-10 rounded-full object-cover bg-muted"
                    src={
                      doc.photo ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.user.name)}&background=e2e8f0&color=0f172a&size=80`
                    }
                  />
                  <div className="text-left">
                    <p className="text-sm font-bold">{doc.user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {doc.specialty}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Sidebar: Doctor Profile */}
          <aside className="lg:col-span-4 space-y-8">
            {selectedDoctor && (
              <Card className="shadow-sm border-border">
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <Image
                      width={128}
                      height={128}
                      alt={selectedDoctor.user.name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-background shadow-sm bg-muted"
                      src={
                        selectedDoctor.photo ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedDoctor.user.name)}&background=e2e8f0&color=0f172a&size=256`
                      }
                    />
                    <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-4 border-background rounded-full"></div>
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">
                    {selectedDoctor.user.name}
                  </h1>
                  <p className="text-primary font-medium mb-4">
                    {selectedDoctor.specialty}
                  </p>
                  <div className="flex items-center gap-2 mb-6">
                    <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                    <span className="font-semibold text-foreground">
                      {selectedDoctor.rating?.toFixed(1) || '—'}
                    </span>
                  </div>
                  <div className="w-full space-y-4 text-left border-t border-border pt-6">
                    {selectedDoctor.location && (
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-muted-foreground shrink-0" />
                        <p className="text-sm text-muted-foreground">
                          {selectedDoctor.location}
                        </p>
                      </div>
                    )}
                    {selectedDoctor.schedules &&
                      selectedDoctor.schedules.length > 0 && (
                        <div className="flex items-start gap-3">
                          <Clock className="w-5 h-5 text-muted-foreground shrink-0" />
                          <p className="text-sm text-muted-foreground">
                            {selectedDoctor.schedules
                              .map((s) => s.day)
                              .join(', ')}
                          </p>
                        </div>
                      )}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-muted/50 border-border shadow-none">
              <CardContent className="p-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
                  Booking Info
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Select a date and time for your consultation. Only dates with
                  doctor availability are selectable.
                </p>
              </CardContent>
            </Card>
          </aside>

          {/* Right Area: Booking Canvas */}
          <section className="lg:col-span-8 space-y-10">
            {/* Calendar */}
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
                    onClick={() => {
                      if (viewMonth === 0) {
                        setViewMonth(11);
                        setViewYear(viewYear - 1);
                      } else {
                        setViewMonth(viewMonth - 1);
                      }
                    }}
                  >
                    ←
                  </Button>
                  <span className="font-medium text-sm min-w-[140px] text-center">
                    {monthName}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => {
                      if (viewMonth === 11) {
                        setViewMonth(0);
                        setViewYear(viewYear + 1);
                      } else {
                        setViewMonth(viewMonth + 1);
                      }
                    }}
                  >
                    →
                  </Button>
                </div>
              </div>
              <Card className="shadow-sm border-border">
                <CardContent className="p-6">
                  <div className="grid grid-cols-7 gap-3 text-center">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                      (day) => (
                        <div
                          key={day}
                          className="text-xs font-bold text-muted-foreground uppercase tracking-tighter pb-2"
                        >
                          {day}
                        </div>
                      ),
                    )}

                    {/* Empty cells for offset */}
                    {Array.from({ length: firstDay }, (_, i) => (
                      <div key={`empty-${i}`} />
                    ))}

                    {/* Days of the month */}
                    {Array.from({ length: daysInMonth }, (_, i) => {
                      const day = i + 1;
                      const date = new Date(viewYear, viewMonth, day);
                      const dayOfWeek = date.getDay();
                      const isAvailable = availableDays.includes(dayOfWeek);
                      const isPast = date < new Date(now.getFullYear(), now.getMonth(), now.getDate());
                      const isSelected =
                        selectedDate?.toDateString() === date.toDateString();
                      const isDisabled = !isAvailable || isPast;

                      return (
                        <button
                          key={day}
                          disabled={isDisabled}
                          onClick={() => handleDateClick(day)}
                          className={cn(
                            'p-3 text-sm font-medium rounded-lg transition-all',
                            isSelected
                              ? 'bg-primary text-primary-foreground shadow-md'
                              : isDisabled
                                ? 'text-muted-foreground/30 cursor-not-allowed'
                                : 'hover:bg-muted text-foreground',
                          )}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Time Slots */}
            {selectedDate && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold tracking-tight text-foreground">
                    Available Slots
                  </h2>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground font-medium">
                      {selectedDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                {timeSlots.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {timeSlots.map((slot, idx) => {
                      const isSelected = selectedTime === slot.time;
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            setSelectedTime(slot.time);
                            setSelectedDateTime(slot.dateTime);
                          }}
                          className={cn(
                            'flex flex-col items-center justify-center p-4 rounded-lg transition-all border',
                            isSelected
                              ? 'bg-primary text-primary-foreground border-primary shadow-md ring-2 ring-primary ring-offset-2 ring-offset-background'
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
                            {slot.period}
                          </span>
                          <span className="text-lg font-semibold">
                            {slot.time}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <Card className="border-dashed border-border bg-muted/30 shadow-none">
                    <CardContent className="p-8 text-center">
                      <p className="text-muted-foreground font-medium">
                        No available time slots for this date.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Notes + Confirm */}
            {selectedTime && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
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
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
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

                    {error && (
                      <div className="flex items-center gap-3 bg-destructive/10 p-4 rounded-lg border border-destructive/20">
                        <p className="text-sm text-destructive font-medium">
                          {error}
                        </p>
                      </div>
                    )}

                    <Button
                      size="lg"
                      className="w-full py-6 text-lg font-bold shadow-md transition-all active:scale-[0.98]"
                      onClick={handleConfirmBooking}
                      disabled={isPending}
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin mr-2" />
                          Booking...
                        </>
                      ) : (
                        'Confirm Booking'
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />

      <SuccessModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          router.push('/patient');
        }}
        doctorName={selectedDoctor?.user.name || ''}
        dateStr={
          selectedDate?.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          }) || ''
        }
        time={selectedTime || ''}
      />
    </div>
  );
}
