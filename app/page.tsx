import Link from 'next/link';

export const metadata = {
  title: 'Rajasthan Ticket Booking',
  description: 'Book tickets for forts and safari in Rajasthan',
};

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-semibold mb-2">
        Rajasthan Ticket Booking
      </h1>

      <p className="text-gray-600 mb-6">
        Scan the QR code at the monument to book your ticket instantly.
      </p>

      <Link
        href="/place-details"
        className="rounded-lg bg-slate-900 px-5 py-2.5 text-white text-sm font-medium"
      >
        Book Tickets
      </Link>
    </main>
  );
}
