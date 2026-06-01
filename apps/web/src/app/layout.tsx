import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Railroad CV',
  description: 'Railway crossing obstacle detection frontend.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
