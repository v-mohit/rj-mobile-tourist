import './globals.css';
import { Providers } from './providers';

export const metadata = {
  title: 'Rajasthan Ticket Booking',
  description: 'Book tickets for iconic monuments and attractions in Rajasthan. Instant bookings, no queues.',
  manifest: '/manifest.json',
  themeColor: '#ff016e',
  appleStatusBarStyle: 'black-translucent',
};

export const viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Rajasthan Tickets" />
      </head>
      <body className="bg-slate-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
