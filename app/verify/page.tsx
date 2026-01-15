'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function VerifyPage() {
  const [contact, setContact] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [bookingInfo, setBookingInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    // Get booking info from session storage
    const booking = sessionStorage.getItem('booking');
    if (booking) {
      setBookingInfo(JSON.parse(booking));
    }
  }, []);

  // Countdown timer for OTP
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleGetOtp = async () => {
    if (!contact.trim()) {
      toast.error('Please enter your mobile or email');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOtpSent(true);
      setTimer(60);
      toast.success('OTP sent successfully');
    } catch (error) {
      toast.error('Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndPay = async () => {
    if (!otp.trim()) {
      toast.error('Please enter OTP');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Verification successful!');
      // In real implementation, redirect to payment
      toast.success('Redirecting to payment...');
    } catch (error) {
      toast.error('Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-slate-300 hover:text-white transition-colors mb-6">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>

          <h1 className="text-3xl font-bold text-white mb-1">Verify & Pay</h1>
          <p className="text-slate-400">Complete your ticket booking</p>
        </div>

        {/* Booking Summary */}
        {bookingInfo && (
          <div className="bg-slate-800 rounded-xl p-4 mb-6 border border-slate-700">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-3">Booking Summary</h2>
            <div className="space-y-2">
              {bookingInfo.placeName && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Location</span>
                  <span className="text-white font-semibold">{bookingInfo.placeName}</span>
                </div>
              )}
              {bookingInfo.indian > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Indian Tickets</span>
                  <span className="text-white font-semibold">{bookingInfo.indian} × ₹50</span>
                </div>
              )}
              {bookingInfo.foreigner > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Foreign Tickets</span>
                  <span className="text-white font-semibold">{bookingInfo.foreigner} × ₹200</span>
                </div>
              )}
              <div className="border-t border-slate-700 pt-2 mt-2 flex justify-between">
                <span className="text-white font-semibold">Total</span>
                <span className="text-[#ff016e] font-bold text-lg">₹{bookingInfo.total}</span>
              </div>
            </div>
          </div>
        )}

        {/* Contact Form */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-white mb-2">
            Mobile Number or Email
          </label>
          <input
            type="text"
            placeholder="Enter your mobile or email"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            disabled={otpSent}
            className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-[#ff016e] disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <p className="text-xs text-slate-400 mt-2">We'll use this for ticket confirmation</p>
        </div>

        {/* OTP Section */}
        {otpSent && (
          <div className="mb-8">
            <label className="block text-sm font-semibold text-white mb-2">
              Enter OTP
            </label>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.slice(0, 6))}
              maxLength={6}
              className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-[#ff016e] text-center text-2xl tracking-widest font-bold"
            />
            <p className="text-xs text-slate-400 mt-2">
              {timer > 0 ? (
                <>Resend OTP in <span className="text-[#ff016e] font-semibold">{timer}s</span></>
              ) : (
                <button
                  onClick={handleGetOtp}
                  className="text-[#ff016e] hover:text-[#ff4d8f] font-semibold"
                >
                  Resend OTP
                </button>
              )}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {!otpSent ? (
            <>
              <button
                onClick={handleGetOtp}
                disabled={loading || !contact.trim()}
                className="w-full py-4 px-6 bg-[#ff016e] text-white text-lg font-bold rounded-xl transition-all hover:bg-[#e6015f] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-[#ff016e]/30"
              >
                {loading ? 'Sending...' : 'Get OTP'}
              </button>
              <p className="text-center text-xs text-slate-400">
                100% secure • No spam
              </p>
            </>
          ) : (
            <>
              <button
                onClick={handleVerifyAndPay}
                disabled={loading || !otp.trim() || otp.length < 6}
                className="w-full py-4 px-6 bg-green-600 text-white text-lg font-bold rounded-xl transition-all hover:bg-green-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-green-600/30"
              >
                {loading ? 'Processing...' : 'Verify & Continue to Payment'}
              </button>
              <button
                onClick={() => {
                  setOtpSent(false);
                  setOtp('');
                  setTimer(0);
                }}
                className="w-full py-3 px-6 bg-slate-700 text-white font-semibold rounded-xl transition-all hover:bg-slate-600 active:scale-95"
              >
                Change Contact
              </button>
            </>
          )}
        </div>

        {/* Security Notice */}
        <div className="mt-8 p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <p className="text-xs text-blue-300">
              Your personal information is encrypted and secure. We never share your details with third parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
