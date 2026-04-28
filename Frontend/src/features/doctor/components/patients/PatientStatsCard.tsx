import { TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/src/components/ui/card';

export function PatientStatsCard() {
  return (
    <Card className="bg-primary border-transparent text-primary-foreground shadow-md shadow-primary/20 overflow-hidden">
      <CardContent className="p-6">
        <h4 className="text-sm font-medium text-primary-foreground/80 mb-2 uppercase tracking-wider">
          Total Active Patients
        </h4>
        <div className="text-4xl font-black mb-4 tracking-tighter">1,248</div>
        <div className="flex items-center gap-2 text-sm text-primary-foreground/90">
          <TrendingUp className="w-4 h-4" />
          <span>+12% from last month</span>
        </div>
      </CardContent>
    </Card>
  );
}
