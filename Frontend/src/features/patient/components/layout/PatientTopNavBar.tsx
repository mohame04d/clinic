'use client';

import { Bell } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { LogoutButton } from '@/src/components/LogoutButton';

export function PatientTopNavBar() {
  return (
    <nav className="w-full sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-8">
          <span className="text-xl font-bold text-primary tracking-tight">
            Smart Dental
          </span>
          <div className="hidden md:flex gap-6 items-center">
            <a
              className="text-muted-foreground hover:text-primary transition-colors duration-200 py-1"
              href="/patient"
            >
              Home
            </a>
            <a
              className="text-muted-foreground hover:text-primary transition-colors duration-200 py-1"
              href="/patient/settings"
            >
              Settings
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
          <LogoutButton variant="link" />
        </div>
      </div>
    </nav>
  );
}
