'use client';

import {
  Bell,
  Plus,
  Calendar,
  Clock,
  PlusCircle,
  ShieldPlus,
  Activity,
  FileText,
  Check,
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

// Assume these shadcn components exist in your project
import { Button } from '@/src/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/src/components/ui/avatar';
import { Progress } from '@/src/components/ui/progress';

// ============================================================================
// MOCK DATA
// ============================================================================

const PAST_APPOINTMENTS = [
  {
    id: 1,
    title: 'Teeth Whitening',
    date: 'Completed March 12, 2024',
    doctor: 'Dr. David Chen',
    icon: ShieldPlus,
  },
  {
    id: 2,
    title: 'Annual Checkup',
    date: 'Completed Jan 08, 2024',
    doctor: 'Dr. Elena Rodriguez',
    icon: Activity,
  },
];

const TIMELINE_STEPS = [
  {
    id: 1,
    title: 'Consultation',
    status: 'Completed Dec 15, 2023',
    state: 'completed',
  },
  {
    id: 2,
    title: 'X-Ray Scans',
    status: 'Completed Jan 08, 2024',
    state: 'completed',
  },
  {
    id: 3,
    title: 'Orthodontic Prep',
    status: 'Current Phase',
    state: 'current',
  },
  {
    id: 4,
    title: 'Alignment Phase 1',
    status: 'Estimated July 2024',
    state: 'upcoming',
  },
];

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function TopNavBar() {
  return (
    <nav className="w-full sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-8">
          <span className="text-xl font-bold text-primary tracking-tight">
            Smart Dental
          </span>
          <div className="hidden md:flex gap-6 items-center">
            <a
              className="text-primary font-semibold border-b-2 border-primary transition-colors duration-200 py-1"
              href="#"
            >
              Home
            </a>
            <a
              className="text-muted-foreground hover:text-primary transition-colors duration-200 py-1"
              href="#"
            >
              Appointments
            </a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:bg-muted rounded-full"
          >
            <Bell className="w-5 h-5" />
          </Button>
          <div className="h-8 w-[1px] bg-border"></div>
          <Button
            variant="link"
            className="text-muted-foreground hover:text-primary font-medium transition-colors"
          >
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}

function DashboardHeader() {
  return (
    <header className="mb-12">
      <h1 className="text-5xl font-extrabold tracking-tight mb-3 text-foreground">
        Welcome back, Sarah.
      </h1>
      <p className="text-lg text-muted-foreground font-normal">
        Your oral health journey is looking bright today.
      </p>
    </header>
  );
}

function UpcomingAppointments() {
  return (
    <section>
      <div className="flex justify-between items-end mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Upcoming Appointments
        </h2>
        <Button
          variant="link"
          className="text-primary font-semibold p-0 h-auto flex items-center gap-1"
        >
          <span>Book New</span>
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Appointment Card */}
        <Card className="transition-transform duration-300 shadow-sm border-border">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-4 items-center">
                <Avatar className="w-12 h-12">
                  <AvatarImage src="https://ui-avatars.com/api/?name=Elena+Rodriguez&background=f1f5f9&color=0f172a" />
                  <AvatarFallback>ER</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-foreground">
                    Dr. Elena Rodriguez
                  </p>
                  <p className="text-sm text-muted-foreground">
                    General Dentistry
                  </p>
                </div>
              </div>
              <Badge
                variant="secondary"
                className="bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 border-none flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Confirmed
                </span>
              </Badge>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">
                  Monday, June 24, 2024
                </span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Clock className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">10:30 AM — 11:15 AM</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button className="flex-1 font-semibold">Reschedule</Button>
              <Button variant="outline" className="px-6 font-medium">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Empty State Card */}
        <Card className="bg-muted/30 border-dashed border-border flex flex-col items-center justify-center text-center p-6 shadow-none">
          <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center border border-border mb-4">
            <PlusCircle className="w-8 h-8 text-muted-foreground/50" />
          </div>
          <div className="mb-4">
            <p className="font-bold text-muted-foreground">No other sessions</p>
            <p className="text-xs text-muted-foreground/70 leading-relaxed max-w-[200px] mx-auto mt-1">
              Routine checkups every 6 months keep your smile perfect.
            </p>
          </div>
          <Button variant="link" className="text-primary font-bold text-sm">
            Schedule more
          </Button>
        </Card>
      </div>
    </section>
  );
}

function PastAppointments() {
  return (
    <section>
      <h2 className="text-2xl font-bold tracking-tight mb-6 text-foreground">
        Past Appointments
      </h2>
      <Card className="overflow-hidden shadow-sm border-border">
        <div className="grid grid-cols-1 divide-y divide-border">
          {PAST_APPOINTMENTS.map((apt) => (
            <div
              key={apt.id}
              className="flex items-center justify-between p-6 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-6">
                <div className="p-3 bg-muted rounded-lg text-primary">
                  <apt.icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">{apt.title}</h4>
                  <p className="text-sm text-muted-foreground">{apt.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground hidden sm:inline-block">
                  {apt.doctor}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-primary"
                >
                  <FileText className="w-5 h-5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}

function ProfileSideCard() {
  return (
    <Card className="shadow-sm border-border">
      <CardContent className="p-8 space-y-6">
        <div className="text-center">
          <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-background shadow-sm">
            <AvatarImage src="https://ui-avatars.com/api/?name=Sarah+Jenkins&background=f1f5f9&color=0f172a" />
            <AvatarFallback>SJ</AvatarFallback>
          </Avatar>
          <h3 className="text-xl font-bold text-foreground">Sarah Jenkins</h3>
          <p className="text-sm text-muted-foreground">Patient ID: #SD-9921</p>
        </div>

        <div className="space-y-4 pt-4 border-t border-border">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Next Cleaning
            </span>
            <span className="text-sm font-semibold text-primary">84 Days</span>
          </div>
          <Progress value={66} className="h-2 bg-muted" />
        </div>

        <Button variant="outline" className="w-full font-bold">
          Edit Profile
        </Button>
      </CardContent>
    </Card>
  );
}

function TreatmentTimeline() {
  return (
    <Card className="shadow-sm border-border">
      <CardHeader className="p-8 pb-4">
        <CardTitle className="text-lg font-bold">Treatment Progress</CardTitle>
      </CardHeader>
      <CardContent className="p-8 pt-0">
        <div className="relative space-y-8 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-muted">
          {TIMELINE_STEPS.map((step) => (
            <div
              key={step.id}
              className={cn(
                'relative flex gap-4 items-start',
                step.state === 'upcoming' && 'opacity-40',
              )}
            >
              {/* Step Indicator */}
              <div
                className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center z-10 shrink-0',
                  step.state === 'completed' && 'bg-primary',
                  step.state === 'current' &&
                    'bg-background border-2 border-primary',
                  step.state === 'upcoming' && 'bg-muted',
                )}
              >
                {step.state === 'completed' && (
                  <Check className="w-3 h-3 text-primary-foreground stroke-[3]" />
                )}
                {step.state === 'current' && (
                  <div className="w-2 h-2 rounded-full bg-primary" />
                )}
              </div>

              {/* Step Content */}
              <div>
                <p className="text-sm font-bold text-foreground">
                  {step.title}
                </p>
                <p
                  className={cn(
                    'text-xs font-medium',
                    step.state === 'current'
                      ? 'text-primary font-semibold'
                      : 'text-muted-foreground',
                  )}
                >
                  {step.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background mt-12">
      <div className="flex flex-col md:flex-row justify-between items-center px-8 py-12 max-w-7xl mx-auto">
        <div className="mb-6 md:mb-0 text-center md:text-left">
          <span className="text-lg font-bold text-foreground">
            Smart Dental Clinic
          </span>
          <p className="text-sm font-normal text-muted-foreground mt-2">
            © {new Date().getFullYear()} Smart Dental Clinic. All rights
            reserved.
          </p>
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
      </div>
    </footer>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function PatientDashboard() {
  return (
    <div className="min-h-screen bg-muted/20 text-foreground font-sans antialiased">
      <TopNavBar />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <DashboardHeader />

        {/* Asymmetric Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
          {/* Left Column: Main Dashboard Content */}
          <div className="space-y-12 min-w-0">
            <UpcomingAppointments />
            <PastAppointments />
          </div>

          {/* Right Column: Contextual Side Info */}
          <aside className="space-y-8">
            <ProfileSideCard />
            <TreatmentTimeline />
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
