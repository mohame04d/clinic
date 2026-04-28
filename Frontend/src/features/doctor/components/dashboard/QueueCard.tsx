import { ArrowRightCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';

export function QueueCard({ queuePatients }: { queuePatients: { name: string, time: string, initials: string }[] }) {
  return (
    <Card className="shadow-sm border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-bold">Next in Queue</CardTitle>
        <Badge
          variant="secondary"
          className="bg-muted text-muted-foreground text-[10px] font-bold rounded-md"
        >
          {queuePatients.length} WAITING
        </Badge>
      </CardHeader>
      <CardContent className="pt-4 space-y-6">
        {queuePatients.map((patient, i) => (
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
