export function Footer() {
  return (
    <footer className="bg-muted/30 w-full border-t border-border mt-16">
      <div className="flex flex-col md:flex-row justify-between items-center px-8 py-12 max-w-7xl mx-auto gap-8">
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="text-lg font-semibold text-foreground">
            Smart Dental Clinic
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed text-center md:text-left max-w-xs">
            Leading the way in modern dentistry with clinical precision and
            patient care.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          <a
            className="text-muted-foreground hover:text-primary transition-colors text-sm"
            href="#"
          >
            Privacy Policy
          </a>
          <a
            className="text-muted-foreground hover:text-primary transition-colors text-sm"
            href="#"
          >
            Terms
          </a>
          <a
            className="text-muted-foreground hover:text-primary transition-colors text-sm"
            href="#"
          >
            Social
          </a>
        </div>

        <div className="text-muted-foreground text-sm">
          Smart Dental Clinic. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
