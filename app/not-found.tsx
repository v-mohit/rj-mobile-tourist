import Link from 'next/link';

export const metadata = {
  title: 'Page Not Found | Rajasthan Ticket Booking',
  description: 'The page you are looking for does not exist.',
};

export const viewport = {
  themeColor: '#0f172a',
};

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-3xl font-semibold mb-2">404</h1>

      <p className="text-gray-600 mb-6">
        Sorry, the page you’re looking for doesn’t exist.
      </p>

      <Link
        href="/"
        className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-2.5 text-white text-sm font-medium"
      >
        Go back home
      </Link>
    </main>
  );
}
