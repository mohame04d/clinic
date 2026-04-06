export function BaseHeader({ children }: { children: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        {children}
      </div>
    </header>
  );
}
