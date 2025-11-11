import type { Metadata } from 'next';
import './globals.css';
import AppShell from '@/components/layout/AppShell';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'SK AutoSphere - Korean Cars for Africa',
  description: 'Premier marketplace connecting Korean automotive exporters with African buyers',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
