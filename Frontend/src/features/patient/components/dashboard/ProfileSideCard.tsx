import { Card, CardContent } from '@/src/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';
import { Button } from '@/src/components/ui/button';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  dateOfBirth: string | null;
  active: boolean;
  createdAt: string;
}

export function ProfileSideCard({ user }: { user: UserProfile | null }) {
  const name = user?.name || 'Patient';
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
  const memberId = user?.id ? `#${user.id.slice(0, 8).toUpperCase()}` : '#—';

  return (
    <Card className="shadow-sm border-border">
      <CardContent className="p-8 space-y-6">
        <div className="text-center">
          <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-background shadow-sm">
            <AvatarImage
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=f1f5f9&color=0f172a`}
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <h3 className="text-xl font-bold text-foreground">{name}</h3>
          <p className="text-sm text-muted-foreground">Patient ID: {memberId}</p>
        </div>

        <div className="space-y-3 pt-4 border-t border-border text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium text-foreground truncate ml-2 max-w-[160px]">
              {user?.email || '—'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Phone</span>
            <span className="font-medium text-foreground">
              {user?.phone || 'Not set'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Member since</span>
            <span className="font-medium text-foreground">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric',
                  })
                : '—'}
            </span>
          </div>
        </div>

        <Button variant="outline" className="w-full font-bold">
          Edit Profile
        </Button>
      </CardContent>
    </Card>
  );
}
