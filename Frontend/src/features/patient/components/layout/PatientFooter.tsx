export function PatientFooter() {
  return (
    <footer className="w-full border-t border-border bg-background mt-12">
      <div className="flex flex-col md:flex-row justify-between items-center px-8 py-12 max-w-7xl mx-auto">
        <div className="mb-6 md:mb-0 text-center md:text-left">
          <span className="text-lg font-bold text-foreground">
            Smart Dental Clinic
          </span>
          <p className="text-sm font-normal text-muted-foreground mt-2">
            Smart Dental Clinic. All rights reserved.
          </p>
        </div>
        <div className="flex gap-8">
          <a
            className="text-sm font-normal text-muted-foreground hover:text-primary transition-colors"
            href="#"
          >
            Privacy Policy
          </a>
          <a
            className="text-sm font-normal text-muted-foreground hover:text-primary transition-colors"
            href="#"
          >
            Terms
          </a>
          <a
            className="text-sm font-normal text-muted-foreground hover:text-primary transition-colors"
            href="#"
          >
            Social
          </a>
        </div>
      </div>
    </footer>
  );
}
