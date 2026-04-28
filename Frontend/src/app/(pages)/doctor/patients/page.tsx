'use client';

import {
  Calendar,
  Stethoscope,
  AlertTriangle,
  MapPin,
  Syringe,
  FlaskConical,
  CalendarCheck,
  FileText,
  Filter,
  Plus,
} from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { PatientCard, ActivityCard, TasksCard, PatientStatsCard } from '@/src/features/doctor/components/patients';

const PATIENTS = [
  {
    id: 'P-84729',
    name: 'Sarah Jenkins',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Jenkins&background=f1f5f9&color=0f172a',
    initials: 'SJ',
    detailOne: 'Next: Oct 12, 10:30 AM',
    detailOneIcon: Calendar,
    detailTwo: 'Treatment: Post-op Review',
    detailTwoIcon: Stethoscope,
    status: 'normal',
  },
  {
    id: 'P-93110',
    name: 'Marcus Chen',
    avatar: 'https://ui-avatars.com/api/?name=Marcus+Chen&background=f1f5f9&color=0f172a',
    initials: 'MC',
    detailOne: 'Overdue: Bloodwork',
    detailOneIcon: AlertTriangle,
    detailOneClass: 'text-destructive',
    detailTwo: 'Treatment: Annual Physical',
    detailTwoIcon: Stethoscope,
    status: 'warning',
  },
  {
    id: 'P-10294',
    name: 'Elena Rodriguez',
    avatar: '',
    initials: 'ER',
    detailOne: 'In Clinic Now',
    detailOneIcon: null, // Custom pulse icon used instead
    detailOneClass: 'text-primary',
    detailTwo: 'Room 3',
    detailTwoIcon: MapPin,
    status: 'active',
  },
  {
    id: 'P-55219',
    name: 'David Miller',
    avatar: 'https://ui-avatars.com/api/?name=David+Miller&background=f1f5f9&color=0f172a',
    initials: 'DM',
    detailOne: 'Next: Nov 05, 2:00 PM',
    detailOneIcon: Calendar,
    detailTwo: 'Treatment: Vaccination',
    detailTwoIcon: Syringe,
    status: 'normal',
  },
];

const RECENT_ACTIVITY = [
  {
    title: 'Lab results uploaded',
    subtitle: 'Sarah Jenkins • 10 mins ago',
    icon: FlaskConical,
  },
  {
    title: 'Appointment scheduled',
    subtitle: 'Marcus Chen • 1 hr ago',
    icon: CalendarCheck,
  },
  {
    title: 'Clinical notes updated',
    subtitle: 'Elena Rodriguez • 2 hrs ago',
    icon: FileText,
  },
];

const PENDING_TASKS = [
  { id: 'task-1', label: 'Review bloodwork for M. Chen' },
  { id: 'task-2', label: 'Authorize prescription refill (D. Miller)' },
  { id: 'task-3', label: 'Sign off daily charts' },
];

export default function PatientDirectory() {
  return (
    <div className="p-8 lg:p-12 w-full max-w-7xl mx-auto flex flex-col pt-8">
      <div className="flex flex-col xl:flex-row gap-12 pt-4">
        {/* Left Side: Patient Grid */}
        <div className="flex-1 space-y-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-foreground tracking-tight">
              All Patients
            </h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="bg-muted/50 text-foreground border-transparent hover:bg-muted font-medium flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filter
              </Button>
              <Button className="font-medium flex items-center gap-2 shadow-sm shadow-primary/20">
                <Plus className="w-4 h-4" />
                New Patient
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {PATIENTS.map((patient) => (
              <PatientCard key={patient.id} patient={patient} />
            ))}
          </div>
        </div>

        {/* Right Side: Info Panel */}
        <div className="w-full xl:w-80 flex flex-col gap-6 shrink-0 mt-8 mt-xl-0">
          <PatientStatsCard />
          <ActivityCard recentActivity={RECENT_ACTIVITY} />
          <TasksCard pendingTasks={PENDING_TASKS} />
        </div>
      </div>
    </div>
  );
}
