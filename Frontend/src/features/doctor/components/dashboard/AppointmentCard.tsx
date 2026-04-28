'use client';

import { useState } from 'react';
import { MoreVertical, CheckCircle2, XCircle, CheckSquare } from 'lucide-react';
import { Card } from '@/src/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { cn } from '@/src/lib/utils';
import { updateAppointmentStatusAction, cancelAppointmentAction } from '@/src/features/appointments/actions/appointment-actions';

export function AppointmentCard({
  id,
  time,
  period,
  name,
  type,
  room,
  duration,
  isActive = false,
  isInProgress = false,
  status = 'pending',
  initials,
}: {
  id: string;
  time: string;
  period: string;
  name: string;
  type: string;
  room?: string;
  duration: string;
  isActive?: boolean;
  isInProgress?: boolean;
  status?: string;
  initials: string;
}) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const handleUpdate = async (newStatus: string) => {
    setIsUpdating(true);
    await updateAppointmentStatusAction(id, newStatus);
    setIsUpdating(false);
    setShowActions(false);
  };

  const handleCancel = async () => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      setIsUpdating(true);
      await cancelAppointmentAction(id);
      setIsUpdating(false);
      setShowActions(false);
    }
  };

  return (
    <Card
      className={cn(
        'flex flex-col sm:flex-row items-stretch overflow-hidden group transition-all',
        isActive
          ? 'ring-2 ring-primary ring-offset-background border-transparent'
          : 'border-border shadow-sm hover:border-border/80',
        isUpdating && 'opacity-50 pointer-events-none'
      )}
    >
      <div
        className={cn(
          'w-full sm:w-24 flex flex-row sm:flex-col items-center justify-between sm:justify-center px-4 sm:px-0 py-2 sm:py-0 border-b sm:border-b-0 sm:border-r sm:rounded-r-xl',
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

      <div className="flex-1 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-card gap-4">
        <div className="flex items-center gap-4 w-full">
          <Avatar className="w-12 h-12 rounded-xl">
            <AvatarImage
              src={`https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=f8fafc&color=0f172a`}
            />
            <AvatarFallback className="rounded-xl">{initials}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
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
              
              <Badge variant="outline" className="text-[10px] uppercase">
                {status}
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

        <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-muted-foreground font-medium">
              Duration
            </p>
            <p className="text-sm font-semibold text-foreground">{duration}</p>
          </div>
          
          {showActions ? (
             <div className="flex gap-2">
               {status === 'pending' && (
                 <Button size="sm" variant="outline" onClick={() => handleUpdate('confirmed')} className="h-8">
                   <CheckCircle2 className="w-4 h-4 mr-1 text-green-600" /> Confirm
                 </Button>
               )}
               {status === 'confirmed' && (
                 <Button size="sm" variant="outline" onClick={() => handleUpdate('completed')} className="h-8">
                   <CheckSquare className="w-4 h-4 mr-1 text-blue-600" /> Complete
                 </Button>
               )}
               <Button size="sm" variant="outline" onClick={handleCancel} className="h-8">
                 <XCircle className="w-4 h-4 mr-1 text-red-600" /> Cancel
               </Button>
               <Button size="sm" variant="ghost" onClick={() => setShowActions(false)} className="h-8">
                 Close
               </Button>
             </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowActions(true)}
              className="text-muted-foreground hover:text-primary"
            >
              <MoreVertical className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
