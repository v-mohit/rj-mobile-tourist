'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function VerifyPage() {
  const [contact, setContact] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  return (
    <main className="max-w-md mx-auto px-4 py-6 bg-black min-h-screen">
      <h1 className="text-xl font-semibold text-white mb-4">
        Verify Details
      </h1>

      <input
        placeholder="Mobile / Email"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        className="w-full mb-3 px-3 py-2 rounded bg-transparent border border-gray-600 text-white"
      />

      {!otpSent ? (
        <button
          onClick={() => {
            setOtpSent(true);
            toast.success('OTP Sent');
          }}
          className="w-full bg-[#ff016e] py-3 rounded text-white"
        >
          Get OTP
        </button>
      ) : (
        <>
          <input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full mt-4 px-3 py-2 rounded bg-transparent border border-gray-600 text-white"
          />

          <button
            onClick={() => toast.success('Verified → Payment')}
            className="mt-4 w-full bg-green-600 py-3 rounded text-white"
          >
            Verify & Pay
          </button>
        </>
      )}
    </main>
  );
}
