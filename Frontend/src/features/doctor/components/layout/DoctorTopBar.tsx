'use client';

import { Search, Bell, Settings } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { LogoutButton } from '@/src/components/LogoutButton';

export function DoctorTopBar() {
  return (
    <header className="w-full h-16 sticky top-0 bg-background/80 backdrop-blur-md z-40 flex items-center justify-between px-8 border-b border-border">
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
          <div className="h-8 w-px bg-border mx-2"></div>
          <LogoutButton variant="ghost" className="rounded-full !px-3 font-semibold text-rose-500 hover:bg-rose-500/10 hover:text-rose-600" showIcon />
        </div>
      </div>
    </header>
  );
}
