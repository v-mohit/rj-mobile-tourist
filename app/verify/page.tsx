'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { loginWithMobile, loginWithEmail, verifyOTPForMobile, verifyOTPForEmail } from '@/lib/api/guestAuthApi';
import BookingConfirmModal from '@/components/booking/BookingConfirmModal';

interface BookingData {
  placeName: string;
  strapiPlaceId: number;
  backendPlaceId?: number;
  indian: number;
  foreigner: number;
  total: number;
  date: string;
}

export default function VerifyPage() {
  // Form state
  const [contact, setContact] = useState('');
  const [isEmailLogin, setIsEmailLogin] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  // Booking data
  const [bookingInfo, setBookingInfo] = useState<BookingData | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Load booking info from session storage
  useEffect(() => {
    const booking = sessionStorage.getItem('booking');
    if (booking) {
      try {
        setBookingInfo(JSON.parse(booking));
      } catch (error) {
        console.error('Failed to parse booking data:', error);
      }
    }
  }, []);

  // Countdown timer for OTP
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Handle login (get OTP)
  const handleGetOtp = async () => {
    if (!contact.trim()) {
      toast.error(`Please enter your ${isEmailLogin ? 'email' : 'mobile number'}`);
      return;
    }

    // Basic validation
    if (isEmailLogin) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(contact)) {
        toast.error('Please enter a valid email');
        return;
      }
    } else {
      if (contact.length < 10) {
        toast.error('Please enter a valid mobile number');
        return;
      }
    }

    setLoading(true);
    try {
      if (isEmailLogin) {
        await loginWithEmail(contact);
      } else {
        await loginWithMobile(contact);
      }

      setOtpSent(true);
      setTimer(60);
      toast.success('OTP sent successfully');
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || 'Failed to send OTP';
      toast.error(errorMsg);
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification
  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      toast.error('Please enter OTP');
      return;
    }

    if (otp.length < 4) {
      toast.error('OTP should be at least 4 digits');
      return;
    }

    setLoading(true);
    try {
      if (isEmailLogin) {
        await verifyOTPForEmail(contact, otp);
      } else {
        await verifyOTPForMobile(contact, otp);
      }

      // If booking info exists, show confirmation modal
      if (bookingInfo) {
        setShowConfirmModal(true);
      } else {
        toast.success('Verification successful!');
        // Redirect after short delay
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      }
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || 'Verification failed';
      toast.error(errorMsg);
      console.error('Verify error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle booking confirmation
  const handleBookingConfirm = async () => {
    if (!bookingInfo) return;

    setLoading(true);
    try {
      // Here you would typically call your booking API
      // For now, we'll just show success and redirect
      
      toast.success('Booking confirmed! Redirecting to payment...');
      
      // Save booking with verification info
      sessionStorage.setItem('verifiedBooking', JSON.stringify({
        ...bookingInfo,
        contact,
        isEmailLogin,
        verifiedAt: new Date().toISOString(),
      }));

      // Redirect to payment page (you can update this to your actual payment URL)
      setTimeout(() => {
        window.location.href = '/payment';
      }, 1500);
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || 'Booking confirmation failed';
      toast.error(errorMsg);
      console.error('Booking error:', error);
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

          <h1 className="text-3xl font-bold text-white mb-1">Verify & Book</h1>
          <p className="text-slate-400">Complete your ticket booking</p>
        </div>

        {/* Booking Summary */}
        {bookingInfo && (
          <div className="bg-slate-800 rounded-xl p-4 mb-6 border border-slate-700">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-3">Booking Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Location</span>
                <span className="text-white font-semibold">{bookingInfo.placeName}</span>
              </div>
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

        {/* Login Method Toggle */}
        {!otpSent && (
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setIsEmailLogin(false)}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                !isEmailLogin
                  ? 'bg-[#ff016e] text-white shadow-lg shadow-[#ff016e]/30'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Mobile
            </button>
            <button
              onClick={() => setIsEmailLogin(true)}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                isEmailLogin
                  ? 'bg-[#ff016e] text-white shadow-lg shadow-[#ff016e]/30'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Email
            </button>
          </div>
        )}

        {/* Contact Input */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-white mb-2">
            {isEmailLogin ? 'Email Address' : 'Mobile Number'}
          </label>
          <input
            type={isEmailLogin ? 'email' : 'tel'}
            placeholder={isEmailLogin ? 'Enter your email' : 'Enter your mobile number'}
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            disabled={otpSent}
            className="w-full px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-[#ff016e] disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <p className="text-xs text-slate-400 mt-2">
            We'll send an OTP to {isEmailLogin ? 'verify your email' : 'confirm your mobile'}
          </p>
        </div>

        {/* OTP Input */}
        {otpSent && (
          <div className="mb-8">
            <label className="block text-sm font-semibold text-white mb-2">
              Enter OTP
            </label>
            <input
              type="text"
              placeholder="Enter 4-6 digit OTP"
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
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
              <p className="text-center text-xs text-slate-400">
                100% secure • No spam
              </p>
            </>
          ) : (
            <>
              <button
                onClick={handleVerifyOtp}
                disabled={loading || !otp.trim() || otp.length < 4}
                className="w-full py-4 px-6 bg-green-600 text-white text-lg font-bold rounded-xl transition-all hover:bg-green-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-green-600/30"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
              <button
                onClick={() => {
                  setOtpSent(false);
                  setOtp('');
                  setTimer(0);
                }}
                className="w-full py-3 px-6 bg-slate-700 text-white font-semibold rounded-xl transition-all hover:bg-slate-600 active:scale-95"
              >
                Change {isEmailLogin ? 'Email' : 'Mobile'}
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

      {/* Confirmation Modal */}
      <BookingConfirmModal
        isOpen={showConfirmModal}
        bookingData={bookingInfo}
        contact={contact}
        isEmailLogin={isEmailLogin}
        onConfirm={handleBookingConfirm}
        onCancel={() => setShowConfirmModal(false)}
        isLoading={loading}
      />
    </div>
  );
}
