import { Button } from '@/src/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
export function TopNav() {
  return (
    <nav className="w-full sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Image src="/logo-den.webp" alt="Logo" width={50} height={50} />
          <div className="text-3xl font-bold text-primary hover:opacity-80 transition-opacity cursor-pointer">
            Smart Dental
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <Link href="/sign-in">
            <Button className="px-6 py-4 font-medium text-white">
              Sign In
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button variant="secondary" className="px-6 py-4 font-medium">
              Register
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
