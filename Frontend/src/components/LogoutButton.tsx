'use client';

import { signOutAction } from '@/src/features/auth/actions/auth-actions';
import { Button } from '@/src/components/ui/button';
import { LogOut } from 'lucide-react';
import { useTransition } from 'react';

// SECURITY: Logout must be a server action because auth cookies are httpOnly —
// they can ONLY be cleared by server-side code, never by client JavaScript.
export function LogoutButton({
  variant = 'link',
  showIcon = false,
  className = '',
}: {
  variant?: 'link' | 'ghost' | 'outline' | 'default';
  showIcon?: boolean;
  className?: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await signOutAction();
    });
  };

  return (
    <Button
      variant={variant}
      onClick={handleLogout}
      disabled={isPending}
      className={`text-muted-foreground hover:text-primary font-medium transition-colors ${className}`}
    >
      {showIcon && <LogOut className="w-4 h-4 mr-2" />}
      {isPending ? 'Logging out...' : 'Logout'}
    </Button>
  );
}
