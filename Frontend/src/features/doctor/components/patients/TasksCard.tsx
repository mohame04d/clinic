import { Checkbox } from '@/src/components/ui/checkbox';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';

export function TasksCard({
  pendingTasks,
}: {
  pendingTasks: { id: string; label: string }[];
}) {
  return (
    <Card className="bg-muted/30 border-border shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-bold tracking-tight uppercase text-foreground">
          Pending Tasks
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {pendingTasks.map((task) => (
          <div key={task.id} className="flex items-start gap-3 group">
            <Checkbox
              id={task.id}
              className="mt-0.5 border-muted-foreground/50 data-[state=checked]:bg-primary"
            />
            <label
              htmlFor={task.id}
              className="text-sm text-foreground leading-snug cursor-pointer group-hover:text-primary transition-colors"
            >
              {task.label}
            </label>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
