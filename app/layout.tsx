import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

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

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body suppressHydrationWarning className="antialiased bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}
