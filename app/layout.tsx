import './globals.css';

export const metadata = {
  title: 'Rajasthan Ticket Booking',
  description: 'Book tickets for forts and safari',
  manifest: '/manifest.json',
};

export const viewport = {
  themeColor: '#0f172a',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
