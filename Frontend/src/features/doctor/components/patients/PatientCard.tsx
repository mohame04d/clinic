import { MoreVertical } from 'lucide-react';
import { Card, CardContent } from '@/src/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';
import { Button } from '@/src/components/ui/button';
import { cn } from '@/src/lib/utils';
import { LucideIcon } from 'lucide-react';

export function PatientCard({
  patient,
}: {
  patient: {
    id: string;
    name: string;
    avatar: string;
    initials: string;
    detailOne: string;
    detailOneIcon: LucideIcon | null;
    detailOneClass?: string;
    detailTwo: string;
    detailTwoIcon: LucideIcon;
    status: string;
  };
}) {
  return (
    <Card className="relative group overflow-hidden border-border bg-card shadow-sm hover:shadow-md transition-shadow">
      {patient.status === 'active' && (
        <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-primary/50 to-primary"></div>
      )}

      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <Avatar
              className={cn(
                'w-12 h-12',
                patient.status === 'active'
                  ? 'bg-primary text-primary-foreground font-bold'
                  : ''
              )}
            >
              <AvatarImage src={patient.avatar} />
              <AvatarFallback
                className={
                  patient.status === 'active'
                    ? 'bg-primary text-primary-foreground'
                    : ''
                }
              >
                {patient.initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-bold text-foreground">{patient.name}</h4>
              <p className="text-sm text-muted-foreground font-mono mt-0.5">
                ID: {patient.id}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-primary -mt-2 -mr-2"
          >
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex flex-col gap-2 mb-6">
          <div
            className={cn(
              'flex items-center gap-2 text-sm',
              patient.detailOneClass || 'text-muted-foreground'
            )}
          >
            {patient.status === 'active' ? (
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse ml-1 mr-0.5"></div>
            ) : (
              patient.detailOneIcon && (
                <patient.detailOneIcon className="w-4 h-4" />
              )
            )}
            <span className={patient.status !== 'normal' ? 'font-medium' : ''}>
              {patient.detailOne}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {patient.detailTwoIcon && (
              <patient.detailTwoIcon className="w-4 h-4" />
            )}
            <span>{patient.detailTwo}</span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full bg-muted/30 text-primary border-transparent hover:bg-muted hover:text-primary transition-colors group-hover:border-primary/20"
        >
          View Profile
        </Button>
      </CardContent>
    </Card>
  );
}
