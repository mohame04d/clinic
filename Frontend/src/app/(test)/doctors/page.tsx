'use client';

import {
  Calendar,
  Users,
  BarChart3,
  Plus,
  Search,
  Bell,
  Settings,
  MoreVertical,
  CalendarOff,
  ClipboardList,
  ArrowRightCircle,
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

// Assume these shadcn components exist in your project
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/src/components/ui/avatar';
import { Badge } from '@/src/components/ui/badge';
import { Progress } from '@/src/components/ui/progress';

// ============================================================================
// MOCK DATA
// ============================================================================

const WEEK_DAYS = [
  { day: 'Sun', date: '10', active: false },
  { day: 'Mon', date: '11', active: false },
  { day: 'Tue', date: '12', active: true },
  { day: 'Wed', date: '13', active: false },
  { day: 'Thu', date: '14', active: false },
];

const QUEUE_PATIENTS = [
  { name: 'Billy Butcher', time: '10:15 AM', initials: 'BB' },
  { name: 'Hughie S.', time: '10:28 AM', initials: 'HS' },
  { name: 'Kimiko M.', time: '10:45 AM', initials: 'KM' },
];

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-background flex flex-col border-r border-border z-50">
      <div className="px-8 py-8">
        <div className="text-2xl font-bold tracking-tighter text-primary">
          Smart Dental
        </div>
      </div>

      <div className="flex-1 px-4 space-y-2">
        <nav className="flex flex-col gap-1">
          <a
            className="flex items-center gap-3 px-4 py-3 text-primary font-semibold border-r-4 border-primary bg-primary/5"
            href="#"
          >
            <Calendar className="w-5 h-5" />
            <span className="font-sans antialiased tracking-tight">
              Schedule
            </span>
          </a>
          <a
            className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-primary hover:bg-muted/50 transition-colors rounded-r-lg"
            href="#"
          >
            <Users className="w-5 h-5" />
            <span className="font-sans antialiased tracking-tight">
              Patients
            </span>
          </a>
          <a
            className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-primary hover:bg-muted/50 transition-colors rounded-r-lg"
            href="#"
          >
            <BarChart3 className="w-5 h-5" />
            <span className="font-sans antialiased tracking-tight">
              Analytics
            </span>
          </a>
        </nav>
      </div>

      <div className="p-6 mt-auto">
        <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl mb-6">
          <Avatar className="w-10 h-10 border border-border">
            <AvatarImage src="https://ui-avatars.com/api/?name=Julianne+Moore&background=f1f5f9&color=0f172a" />
            <AvatarFallback>JM</AvatarFallback>
          </Avatar>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-foreground truncate">
              Dr. Julianne Moore
            </p>
            <p className="text-xs text-muted-foreground truncate">
              Senior Surgeon
            </p>
          </div>
        </div>
        <Button className="w-full py-6 font-semibold flex items-center justify-center gap-2 shadow-sm">
          <Plus className="w-4 h-4" />
          New Appointment
        </Button>
      </div>
    </aside>
  );
}

function TopNavBar() {
  return (
    <header className="w-full h-16 sticky top-0 bg-background/80 backdrop-blur-md z-40 flex items-center justify-between px-8 border-b border-border lg:border-none">
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            className="w-full pl-9 pr-4 py-5 bg-muted/50 border-none focus-visible:ring-primary/20 text-sm shadow-none"
            placeholder="Search patients..."
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="outline" className="hidden md:flex font-medium">
          Print Daily List
        </Button>
        <Button className="font-semibold hidden sm:flex">Status Update</Button>
        <div className="h-8 w-px bg-border mx-2 hidden sm:block"></div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-muted-foreground hover:bg-muted"
          >
            <Bell className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-muted-foreground hover:bg-muted"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}

function AppointmentCard({
  time,
  period,
  name,
  type,
  room,
  duration,
  isActive = false,
  isInProgress = false,
  initials,
}: {
  time: string;
  period: string;
  name: string;
  type: string;
  room?: string;
  duration: string;
  isActive?: boolean;
  isInProgress?: boolean;
  initials: string;
}) {
  return (
    <Card
      className={cn(
        'flex items-stretch overflow-hidden group transition-all',
        isActive
          ? 'ring-2 ring-primary ring-offset-2 ring-offset-background border-transparent'
          : 'border-border shadow-sm hover:border-border/80',
      )}
    >
      <div
        className={cn(
          'w-24 flex flex-col items-center justify-center border-r',
          isActive
            ? 'bg-primary text-primary-foreground border-transparent'
            : 'bg-muted/50 text-foreground border-border',
        )}
      >
        <span className="text-sm font-bold">{time}</span>
        <span
          className={cn(
            'text-[10px] font-medium',
            isActive ? 'text-primary-foreground/80' : 'text-muted-foreground',
          )}
        >
          {period}
        </span>
      </div>

      <div className="flex-1 p-5 flex items-center justify-between bg-card">
        <div className="flex items-center gap-4">
          <Avatar className="w-12 h-12 rounded-lg rounded-xl">
            <AvatarImage
              src={`https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=f8fafc&color=0f172a`}
            />
            <AvatarFallback className="rounded-xl">{initials}</AvatarFallback>
          </Avatar>

          <div>
            <h3 className="font-bold text-foreground">{name}</h3>
            <div className="flex flex-wrap gap-2 mt-1">
              <Badge
                variant="secondary"
                className={cn(
                  'text-[10px] font-bold rounded-md tracking-wide px-2 py-0.5 border-none',
                  isActive
                    ? 'bg-orange-100 text-orange-700 hover:bg-orange-100'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-50',
                )}
              >
                {type}
              </Badge>

              {room && (
                <Badge
                  variant="outline"
                  className="bg-muted text-muted-foreground text-[10px] font-bold rounded-md tracking-wide px-2 py-0.5 border-none"
                >
                  {room}
                </Badge>
              )}

              {isInProgress && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 hover:bg-green-50 text-[10px] font-bold rounded-md border-none"
                >
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  IN PROGRESS
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-muted-foreground font-medium">
              Duration
            </p>
            <p className="text-sm font-semibold text-foreground">{duration}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-primary"
          >
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

function InsightCard() {
  return (
    <Card className="relative overflow-hidden shadow-sm border-border">
      <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
        <ClipboardList className="w-24 h-24" />
      </div>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold">Daily Insight</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-3">
          <div className="w-1 h-12 bg-primary rounded-full shrink-0"></div>
          <div>
            <p className="text-xs font-bold text-primary uppercase tracking-tight">
              Heavy Workload
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Schedule is 85% full. Focus on surgical prep for the 10:30 slot.
            </p>
          </div>
        </div>

        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground mb-3 font-medium">
            Completion Rate
          </p>
          <Progress value={66} className="h-2 bg-background" />
          <div className="flex justify-between mt-3">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              12/18 Patient Notes
            </span>
            <span className="text-[10px] font-bold text-primary">66%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function QueueCard() {
  return (
    <Card className="shadow-sm border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-bold">Next in Queue</CardTitle>
        <Badge
          variant="secondary"
          className="bg-muted text-muted-foreground text-[10px] font-bold rounded-md"
        >
          3 WAITING
        </Badge>
      </CardHeader>
      <CardContent className="pt-4 space-y-6">
        {QUEUE_PATIENTS.map((patient, i) => (
          <div key={i} className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 rounded-lg">
                <AvatarImage
                  src={`https://ui-avatars.com/api/?name=${patient.name.replace(' ', '+')}&background=f1f5f9&color=0f172a`}
                />
                <AvatarFallback className="rounded-lg">
                  {patient.initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-bold text-foreground">
                  {patient.name}
                </p>
                <p className="text-[10px] font-medium text-muted-foreground">
                  Arrived {patient.time}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 rounded-lg bg-muted/50 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <ArrowRightCircle className="w-4 h-4" />
            </Button>
          </div>
        ))}

        <Button
          variant="outline"
          className="w-full mt-6 text-xs font-bold text-primary border-primary/20 hover:bg-primary/5 hover:text-primary transition-colors"
        >
          View Full Queue
        </Button>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function DoctorScheduleDashboard() {
  return (
    <div className="bg-muted/30 text-foreground flex min-h-screen font-sans antialiased">
      <Sidebar />

      <main className="flex-1 ml-64 min-h-screen flex flex-col">
        <TopNavBar />

        <div className="p-8 max-w-7xl mx-auto space-y-8 w-full flex-1">
          {/* Header & Date Carousel */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Daily Schedule
              </h1>
              <p className="text-muted-foreground mt-1 font-medium">
                You have 8 appointments today.
              </p>
            </div>

            <div className="flex gap-2 p-1 bg-background border border-border rounded-xl shadow-sm overflow-x-auto">
              {WEEK_DAYS.map((dayObj, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex flex-col items-center min-w-[56px] py-2 rounded-lg transition-colors cursor-pointer',
                    dayObj.active
                      ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                      : 'hover:bg-muted text-foreground',
                  )}
                >
                  <span
                    className={cn(
                      'text-[10px] font-bold uppercase',
                      dayObj.active ? 'opacity-80' : 'text-muted-foreground',
                    )}
                  >
                    {dayObj.day}
                  </span>
                  <span className="text-sm font-bold mt-0.5">
                    {dayObj.date}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12">
            {/* Left Column: Schedule List */}
            <div className="lg:col-span-8 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2 mt-2">
                Morning Blocks
              </h2>

              <AppointmentCard
                time="09:00"
                period="AM"
                name="Arthur Morgan"
                initials="AM"
                type="ROUTINE CHECKUP"
                room="ROOM 04"
                duration="45 Mins"
              />

              <AppointmentCard
                time="10:30"
                period="AM"
                name="Sadie Linton"
                initials="SL"
                type="SURGERY PREP"
                duration="120 Mins"
                isActive={true}
                isInProgress={true}
              />

              <div className="h-6"></div>

              <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">
                Afternoon Blocks
              </h2>

              <AppointmentCard
                time="02:15"
                period="PM"
                name="John Marston"
                initials="JM"
                type="CONSULTATION"
                room="ROOM 12"
                duration="30 Mins"
              />

              {/* Empty State */}
              <div className="bg-background border-2 border-dashed border-border rounded-xl p-12 flex flex-col items-center justify-center text-center opacity-70 mt-4">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <CalendarOff className="w-6 h-6 text-muted-foreground" />
                </div>
                <h4 className="font-bold text-foreground">
                  No appointments scheduled
                </h4>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                  The evening block is currently clear. You can open more slots
                  in settings.
                </p>
              </div>
            </div>

            {/* Right Column: Sidebar Widgets */}
            <div className="lg:col-span-4 space-y-8">
              <InsightCard />
              <QueueCard />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
