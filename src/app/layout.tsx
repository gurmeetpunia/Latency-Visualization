import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: 'Latency Visualizer',
  description: 'Crypto Trading Infrastructure Latency',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Add suppressHydrationWarning to the html tag
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetBrainsMono.variable}`}>
      <body className="font-sans">
        {/* Wrap your children with the Providers component */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}