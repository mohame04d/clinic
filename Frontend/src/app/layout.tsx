import type { Metadata } from 'next';
import { Inter, Roboto_Mono } from 'next/font/google'; // Changed to Inter
import './globals.css';

// Configure the Inter font
const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap', // Good practice for faster text rendering
});

const robotoMono = Roboto_Mono({
  variable: '--font-roboto-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Smart Dental Clinic',
  description: 'Premium dental care and scheduling.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // Inject the Inter variable here
      className={`${inter.variable} ${robotoMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
