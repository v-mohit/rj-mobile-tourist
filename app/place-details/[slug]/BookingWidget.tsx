'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface BookingWidgetProps {
  bookable: boolean;
}

export default function BookingWidget({ bookable }: BookingWidgetProps) {
  const [numTourists, setNumTourists] = useState(1);
  const [contact, setContact] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  if (!bookable) {
    return <p className="text-red-600">Booking not available for this place.</p>;
  }

  const sendOtp = () => {
    if (!contact) {
      toast.error('Enter mobile or email');
      return;
    }
    setOtpSent(true);
    toast.success('OTP sent!');
  };

  const verifyOtp = () => {
    if (otp === '1234') {
      toast.success('OTP verified! Proceed to payment.');
    } else {
      toast.error('Invalid OTP');
    }
  };

  return (
    <div className="mt-6 max-w-sm mx-auto space-y-4">
      <div>
        <label>Number of Tourists:</label>
        <input
          type="number"
          min={1}
          max={10}
          value={numTourists}
          onChange={(e) => setNumTourists(Number(e.target.value))}
          className="w-full border rounded px-2 py-1"
        />
      </div>

      {!otpSent ? (
        <>
          <input
            type="text"
            placeholder="Mobile / Email"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
          <button
            onClick={sendOtp}
            className="w-full bg-slate-900 text-white py-2 rounded"
          >
            Get OTP
          </button>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
          <button
            onClick={verifyOtp}
            className="w-full bg-green-600 text-white py-2 rounded"
          >
            Verify OTP
          </button>
        </>
      )}
    </div>
  );
}
