'use client';

import Link from 'next/link';

export const metadata = {
  title: 'Rajasthan Ticket Booking',
  description: 'Book tickets for forts and safari in Rajasthan',
};

export default function HomePage() {
  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center px-4 py-8">
      <div className="max-w-lg w-full">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 bg-[#ff016e] rounded-full flex items-center justify-center shadow-2xl shadow-[#ff016e]/50">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 012-2h6a2 2 0 012 2v1m0 13V9a2 2 0 00-2-2h-6a2 2 0 00-2 2v12m0 0v1a2 2 0 002 2h6a2 2 0 002-2v-1m0 0h6a2 2 0 002-2v-5a2 2 0 00-2-2h-.09a2 2 0 00-1.999 1.999v3m0 0V9a2 2 0 10-4 0v3m0 0V6" />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-5xl font-black text-white mb-3 text-center leading-tight">
          Rajasthan Ticket Booking
        </h1>

        {/* Subheading */}
        <p className="text-slate-300 text-lg text-center mb-3">
          Book tickets for iconic monuments and attractions
        </p>

        {/* Description */}
        <div className="bg-slate-800 rounded-2xl p-6 mb-8 border border-slate-700">
          <p className="text-slate-300 text-center leading-relaxed">
            <span className="block mb-3 text-sm font-semibold text-[#ff016e] uppercase tracking-wide">
              How it works
            </span>
            Scan the QR code at the monument entrance to open the booking page instantly. No login required. Purchase tickets in seconds and skip the queues.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <svg className="w-8 h-8 text-[#ff016e] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h3 className="font-bold text-white text-sm">Instant Booking</h3>
            <p className="text-xs text-slate-400">Book in seconds</p>
          </div>

          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <svg className="w-8 h-8 text-[#ff016e] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="font-bold text-white text-sm">Best Prices</h3>
            <p className="text-xs text-slate-400">Transparent pricing</p>
          </div>

          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <svg className="w-8 h-8 text-[#ff016e] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h3 className="font-bold text-white text-sm">Secure</h3>
            <p className="text-xs text-slate-400">Safe payments</p>
          </div>

          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <svg className="w-8 h-8 text-[#ff016e] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <h3 className="font-bold text-white text-sm">Works Offline</h3>
            <p className="text-xs text-slate-400">Low bandwidth ready</p>
          </div>
        </div>

        {/* CTA Button - Thumb friendly */}
        <Link
          href="/place-details/Sukh-Mahal"
          className="block w-full py-4 px-6 bg-[#ff016e] text-white text-lg font-bold rounded-xl transition-all hover:bg-[#e6015f] active:scale-95 shadow-xl shadow-[#ff016e]/30 text-center mb-4"
        >
          Start Booking
        </Link>

        {/* Secondary CTA */}
        <button
          className="w-full py-3 px-6 bg-slate-700 text-white font-semibold rounded-xl transition-all hover:bg-slate-600 active:scale-95 text-center"
          onClick={() => {
            // Trigger camera for QR scan
            alert('QR Scanner: Not implemented in this demo. Use "Start Booking" to test the flow.');
          }}
        >
          Scan QR Code
        </button>
      </div>
    </main>
  );
}
