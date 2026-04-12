'use client';

import React, { useState } from 'react';
import {
  Activity,
  AlertCircle,
  EyeOff,
  Eye,
  Lock,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

// Assume these shadcn components exist in your project
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Card, CardContent } from '@/src/components/ui/card';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/src/components/ui/tabs';
// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function BrandIdentity() {
  return (
    <div className="flex flex-col items-center mb-10 text-center">
      <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-6 shadow-sm">
        <Activity className="text-primary-foreground w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-2">
        Smart Dental
      </h1>
      <p className="text-muted-foreground max-w-xs leading-relaxed">
        Precision dental care managed with clinical expertise.
      </p>
    </div>
  );
}

function SocialLogins() {
  return (
    <div className="space-y-6">
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-4 bg-card text-muted-foreground font-semibold uppercase tracking-widest">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          className="py-6 flex items-center gap-3 group"
        >
          {/* Fallback Google Icon SVG */}
          <svg
            className="w-5 h-5 grayscale group-hover:grayscale-0 transition-all"
            viewBox="0 0 24 24"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <span className="font-bold">Google</span>
        </Button>
        <Button variant="outline" className="py-6 flex items-center gap-3">
          {/* Fallback Apple Icon SVG */}
          <svg className="w-5 h-5 fill-foreground" viewBox="0 0 24 24">
            <path d="M12 2C12 2 12 2 12 2C12 2 12 2 12 2C12 2 12 2 12 2C12 2 12 2 12 2ZM12 2C12 2 12 2 12 2Z" />
            <path d="M17.05 13.92C17.06 16.51 19.34 17.39 19.38 17.4C19.35 17.51 19.01 18.7 18.15 19.95C17.4 21.03 16.63 22.12 15.42 22.14C14.24 22.16 13.86 21.43 12.52 21.43C11.19 21.43 10.76 22.12 9.64 22.16C8.45 22.2 7.57 20.97 6.8 19.86C5.23 17.6 4.07 14.19 5.67 11.41C6.46 10.03 7.84 9.14 9.38 9.11C10.51 9.09 11.58 9.87 12.27 9.87C12.96 9.87 14.25 8.93 15.63 9.06C16.21 9.11 17.84 9.29 18.9 10.83C18.82 10.88 17.03 11.92 17.05 13.92ZM14.93 6.42C15.6 5.62 16.03 4.54 15.9 3.46C14.95 3.5 13.81 4.1 13.11 4.9C12.48 5.61 11.96 6.72 12.12 7.78C13.17 7.86 14.26 7.23 14.93 6.42Z" />
          </svg>
          <span className="font-bold">Apple</span>
        </Button>
      </div>
    </div>
  );
}

function TrustBadges() {
  return (
    <div className="mt-8 flex items-center justify-center gap-6 text-muted-foreground">
      <div className="flex items-center gap-2">
        <Lock className="w-4 h-4" />
        <span className="text-[10px] font-bold uppercase tracking-widest">
          256-bit SSL
        </span>
      </div>
      <div className="w-1 h-1 rounded-full bg-border"></div>
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-4 h-4" />
        <span className="text-[10px] font-bold uppercase tracking-widest">
          HIPAA Ready
        </span>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="w-full border-t border-border bg-card mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center px-8 py-10 max-w-7xl mx-auto">
        <span className="text-lg font-bold text-foreground mb-6 md:mb-0">
          Smart Dental
        </span>
        <div className="flex gap-8">
          <a
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            href="#"
          >
            Privacy Policy
          </a>
          <a
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            href="#"
          >
            Terms
          </a>
          <a
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            href="#"
          >
            Support
          </a>
        </div>
        <p className="mt-8 md:mt-0 text-sm font-medium text-muted-foreground">
          © {new Date().getFullYear()} Smart Dental Clinic. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function AuthenticationPage() {
  const [email, setEmail] = useState('patient@example');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Simple mock validation state to recreate the visual intent from the HTML
  const isError = email === 'patient@example';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isError) return;

    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="bg-muted/30 text-foreground antialiased min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]"></div>
      </div>

      <main className="flex-grow flex flex-col items-center justify-center px-4 py-16 z-10">
        <div className="w-full max-w-[480px]">
          <BrandIdentity />

          <Card className="rounded-xl shadow-sm border-border overflow-hidden">
            <CardContent className="p-8 md:p-10">
              <Tabs defaultValue="signin" className="w-full mb-8">
                <TabsList className="grid w-full grid-cols-2 p-1 bg-muted/50 rounded-lg">
                  <TabsTrigger
                    value="signin"
                    className="font-semibold rounded-md"
                  >
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger
                    value="signup"
                    className="font-medium rounded-md"
                  >
                    Create Account
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="signin">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Input */}
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={cn(
                            'w-full px-4 py-6 transition-all placeholder:text-muted-foreground/50',
                            isError &&
                              'bg-destructive/10 border-destructive/30 text-destructive focus-visible:ring-destructive/20',
                          )}
                        />
                        {isError && (
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <AlertCircle className="w-5 h-5 text-destructive" />
                          </div>
                        )}
                      </div>
                      {isError && (
                        <p className="text-destructive text-xs font-medium flex items-center gap-1">
                          Invalid email address
                        </p>
                      )}
                    </div>

                    {/* Password Input */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Password
                        </Label>
                        <Button
                          variant="link"
                          className="h-auto p-0 text-xs font-bold text-primary hover:underline"
                        >
                          Forgot?
                        </Button>
                      </div>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-4 py-6 transition-all pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? (
                            <Eye className="w-5 h-5" />
                          ) : (
                            <EyeOff className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Primary CTA */}
                    <div className="pt-2">
                      <Button
                        type="submit"
                        disabled={isLoading || isError}
                        className={cn(
                          'w-full py-6 text-base font-bold tracking-wide transition-all duration-300',
                          (isLoading || isError) && 'opacity-80',
                        )}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Authenticating...
                          </>
                        ) : (
                          'Sign In'
                        )}
                      </Button>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  {/* Placeholder for Signup Form Content */}
                  <div className="py-8 text-center text-muted-foreground">
                    Create account form elements go here.
                  </div>
                </TabsContent>
              </Tabs>

              <SocialLogins />
            </CardContent>
          </Card>

          <TrustBadges />
        </div>
      </main>

      <Footer />
    </div>
  );
}
