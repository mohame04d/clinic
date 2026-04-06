import { Activity, Banknote, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/src/components/ui/card';

export function FeaturesSection() {
  return (
    <Card className="bg-muted animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700 fill-mode-backwards">
      <CardContent className=" py-2 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Feature 1 */}
        <div className="group space-y-4 p-4 rounded-xl hover:bg-background hover:shadow-md transition-all duration-300 cursor-default">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-primary-foreground shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
            <Activity className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-foreground leading-tight">
            Emergency Ready
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Same-day appointments for urgent cases. We prioritize your comfort
            and immediate relief.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="group space-y-4 p-4  rounded-xl hover:bg-background hover:shadow-md transition-all duration-300 cursor-default">
          <div className="w-12 h-12 bg-background rounded-lg border border-border flex items-center justify-center text-primary group-hover:scale-110 group-hover:-rotate-3 group-hover:border-primary/50 group-hover:bg-primary/5 transition-all duration-300">
            <ShieldCheck className="w-6 h-6 fill-primary/10" />
          </div>
          <h3 className="text-xl font-bold text-foreground leading-tight">
            Patient Protection
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Advanced sterilization protocols and a focus on long-term preventive
            health outcomes.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="group space-y-4 p-4 rounded-xl hover:bg-background hover:shadow-md transition-all duration-300 cursor-default">
          <div className="w-12 h-12 bg-background rounded-lg border border-border flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-3 group-hover:border-primary/50 group-hover:bg-primary/5 transition-all duration-300">
            <Banknote className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-foreground leading-tight">
            Transparent Billing
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            No hidden fees. Digital itemized estimates provided before every
            procedure for your peace of mind.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
