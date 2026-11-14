import type { Metadata } from 'next';
import { Playfair_Display, DM_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-playfair',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: 'Samadhan360 | Smart Approval & Compliance Management System',
  description: 'Intelligent surveillance, deadline risk radar, smart document checker, next best action assistant, and institutional compliance passport.',
  openGraph: {
    title: 'Samadhan360 | Smart Approval & Compliance Management System',
    description: 'Intelligent approval workflows and institutional compliance monitoring.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Samadhan360 | Smart Approval & Compliance Management System',
    description: 'Automated approval workflows, deadline risk surveillance, and compliance management.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${playfair.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body
        suppressHydrationWarning
        className="antialiased bg-[#F3EBDD] text-[#263B32] font-sans"
      >
        {children}
      </body>
    </html>
  );
}
