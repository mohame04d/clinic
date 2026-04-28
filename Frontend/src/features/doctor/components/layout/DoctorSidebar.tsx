'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, Users, BarChart3, Plus, Settings } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Button } from '@/src/components/ui/button';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/src/components/ui/avatar';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/src/components/ui/dialog';
import { Field, FieldGroup } from '@/src/components/ui/field';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';

export function DoctorSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Schedule', href: '/doctor', icon: Calendar },
    { name: 'Patients', href: '/doctor/patients', icon: Users },
    { name: 'Analytics', href: '/doctor/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/doctor/settings', icon: Settings },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-background flex flex-col border-r border-border z-50">
      <div className="px-8 py-8">
        <div className="text-2xl font-bold tracking-tighter text-primary">
          Smart Dental
        </div>
        <p className="text-xs font-medium text-muted-foreground mt-1">
          Doctor Portal
        </p>
      </div>

      <div className="flex-1 px-4 space-y-2">
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center gap-3 px-4 py-3 font-semibold transition-all rounded-lg',
                  isActive
                    ? 'text-primary border-r-4 border-primary bg-gradient-to-r from-transparent to-primary/10 rounded-l-lg hover:to-primary/20'
                    : 'text-muted-foreground hover:text-primary hover:bg-muted/50',
                )}
              >
                <Icon
                  className={cn(
                    'w-5 h-5 transition-transform duration-300 group-hover:scale-110',
                    isActive ? 'text-primary' : '',
                  )}
                />
                <span className="font-sans antialiased tracking-tight">
                  {item.name}
                </span>
              </Link>
            );
          })}
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
        <NewAppointmentButton />
      </div>
    </aside>
  );
}

export function NewAppointmentButton() {
  return (
    <Dialog>
      <form>
        <DialogTrigger>
          <Button className="w-full py-6 font-semibold flex items-center justify-center gap-2 shadow-sm">
            <Plus className="w-4 h-4" />
            New Appointment
          </Button>{' '}
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="name-1">Name</Label>
              <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
            </Field>
            <Field>
              <Label htmlFor="username-1">Username</Label>
              <Input id="username-1" name="username" defaultValue="@peduarte" />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
