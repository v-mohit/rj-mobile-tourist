'use client';

import { useState } from 'react';

interface BookingData {
  placeName: string;
  strapiPlaceId: number;
  backendPlaceId?: number;
  indian: number;
  foreigner: number;
  total: number;
  date: string;
}

interface BookingConfirmModalProps {
  isOpen: boolean;
  bookingData: BookingData | null;
  contact: string; // mobile or email
  isEmailLogin: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function BookingConfirmModal({
  isOpen,
  bookingData,
  contact,
  isEmailLogin,
  onConfirm,
  onCancel,
  isLoading = false,
}: BookingConfirmModalProps) {
  if (!isOpen || !bookingData) return null;

  const bookingDate = new Date(bookingData.date).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end z-50">
      <div className="w-full bg-slate-900 rounded-t-3xl p-6 border-t border-slate-700 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-1">Confirm Booking</h2>
          <p className="text-slate-400 text-sm">Review your ticket details before proceeding</p>
        </div>

        {/* Booking Summary */}
        <div className="bg-slate-800 rounded-xl p-5 mb-6 border border-slate-700">
          {/* Place Name */}
          <div className="mb-5 pb-5 border-b border-slate-700">
            <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-1">Location</p>
            <h3 className="text-xl font-bold text-white">{bookingData.placeName}</h3>
          </div>

          {/* Booking Date */}
          <div className="mb-5 pb-5 border-b border-slate-700">
            <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-1">Visit Date</p>
            <p className="text-lg font-semibold text-white">{bookingDate}</p>
          </div>

          {/* Tickets */}
          <div className="mb-5 pb-5 border-b border-slate-700">
            <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-3">Tickets</p>
            <div className="space-y-2">
              {bookingData.indian > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Indian Citizens</span>
                  <div className="text-right">
                    <p className="font-semibold text-white">{bookingData.indian} ticket{bookingData.indian > 1 ? 's' : ''}</p>
                    <p className="text-sm text-slate-400">₹{bookingData.indian * 50}</p>
                  </div>
                </div>
              )}
              {bookingData.foreigner > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Foreign Citizens</span>
                  <div className="text-right">
                    <p className="font-semibold text-white">{bookingData.foreigner} ticket{bookingData.foreigner > 1 ? 's' : ''}</p>
                    <p className="text-sm text-slate-400">₹{bookingData.foreigner * 200}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Contact */}
          <div className="mb-3">
            <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-1">
              {isEmailLogin ? 'Email' : 'Mobile Number'}
            </p>
            <p className="text-lg font-semibold text-white">{contact}</p>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="bg-gradient-to-r from-[#ff016e]/10 to-[#ff4d8f]/10 rounded-xl p-5 mb-6 border border-[#ff016e]/30">
          <div className="flex justify-between items-center">
            <span className="text-white font-semibold text-lg">Total Amount</span>
            <span className="text-3xl font-black text-[#ff016e]">₹{bookingData.total}</span>
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4 mb-6">
          <p className="text-xs text-blue-300">
            ✓ You'll receive a confirmation with ticket details on {isEmailLogin ? 'your email' : 'SMS'}
            <br />✓ Present this confirmation at the ticket counter
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full py-4 px-6 bg-[#ff016e] text-white text-lg font-bold rounded-xl transition-all hover:bg-[#e6015f] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-[#ff016e]/30"
          >
            {isLoading ? 'Processing...' : 'Confirm & Proceed to Payment'}
          </button>

          <button
            onClick={onCancel}
            disabled={isLoading}
            className="w-full py-3 px-6 bg-slate-700 text-white font-semibold rounded-xl transition-all hover:bg-slate-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>

        {/* Close hint for mobile */}
        <div className="mt-4 text-center">
          <p className="text-xs text-slate-500">Swipe down to close if needed</p>
        </div>
      </div>
    </div>
  );
}
