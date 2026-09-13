import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Adoption Radar | Marketing overview',
  description: 'Understand what is holding AI adoption back. Explore a synthetic demo diagnosis, evidence and recommended intervention.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
