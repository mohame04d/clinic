import Link from 'next/link';
import { LogIn, UserPlus } from 'lucide-react';

interface AuthTabsProps {
  activeTab: 'sign-in' | 'sign-up';
}

export function AuthTabs({ activeTab }: AuthTabsProps) {
  const isSignUp = activeTab === 'sign-up';

  return (
    <div className="pt-1 flex justify-center w-[90%] mx-auto">
      <div className="flex w-full bg-muted p-1 rounded-lg">
        {/* Sign In Link */}
        <Link
          href="/sign-in"
          className={`
            flex-1 flex items-center justify-center gap-2 
            px-6 py-2.5 rounded-md text-sm whitespace-nowrap 
            ${
              !isSignUp
                ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                : 'text-muted-foreground font-semibold hover:text-foreground'
            }
          `}
        >
          <LogIn className="w-5 h-5" />
          Sign In
        </Link>

        {/* Sign Up Link */}
        <Link
          href="/sign-up"
          className={`
            flex-1 flex items-center justify-center gap-2 
            px-6 py-2.5 rounded-md text-sm whitespace-nowrap 
            ${
              isSignUp
                ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                : 'text-muted-foreground font-semibold hover:text-foreground'
            }
          `}
        >
          <UserPlus className="w-5 h-5" />
          Sign Up
        </Link>
      </div>
    </div>
  );
}
