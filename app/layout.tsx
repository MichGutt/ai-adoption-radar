import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Adoption Radar',
  description: 'AI Adoption Radar: data upload, diagnosis and recommendations for AI adoption.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
