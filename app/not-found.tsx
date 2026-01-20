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
    <main className="min-h-screen w-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* 404 Icon */}
        <div className="mb-6 flex justify-center">
          <div className="text-8xl font-black text-[#ff016e] opacity-20 mb-4">
            404
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-bold text-white mb-3">
          Page Not Found
        </h1>

        {/* Description */}
        <p className="text-slate-300 text-lg mb-8">
          Sorry, the page you're looking for doesn't exist. It might have been removed or the URL is incorrect.
        </p>

        {/* Action Buttons */}
        <Link
          href="/"
          className="block w-full py-4 px-6 bg-[#ff016e] text-white text-lg font-bold rounded-xl transition-all hover:bg-[#e6015f] active:scale-95 shadow-xl shadow-[#ff016e]/30"
        >
          Go Back Home
        </Link>
      </div>
    </main>
  );
}
