import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers/Providers';

export const metadata: Metadata = {
  title: 'ScrapWala — Kabadiwala Connect',
  description: 'Offline-first, voice-assisted formal e-waste platform and critical-mineral recovery tracker',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi">
      <body className="min-h-screen bg-[#E9EFEA] antialiased font-sans text-[#14181A] selection:bg-[#2E7D1F] selection:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
