'use client';

import { useState, useEffect } from 'react';
import TicketRow from './TicketRow';
import { getBookingTickets, type TicketType } from '@/lib/api/bookingApi';

interface BackendPlace {
  id: number;
  name: string;
  type: string;
}

interface TicketSelectorProps {
  placeName: string;
  strapiPlaceId: number;
  backendPlaceId?: number;
  bookable: boolean;
  placeImage?: string;
  description?: string;
  backendPlaceData?: BackendPlace;
}

export default function TicketSelector({
  placeName,
  strapiPlaceId,
  backendPlaceId,
  bookable,
  placeImage,
  description,
  backendPlaceData
}: TicketSelectorProps) {
  const [indian, setIndian] = useState(0);
  const [foreigner, setForeigner] = useState(0);
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch ticket data on mount
  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!backendPlaceId) {
          throw new Error('Place ID is required to fetch ticket data');
        }

        // Get current date in epoch milliseconds
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dateEpoch = today.getTime();

        const specificChargesId = '65aa27a26aebab05633bd572';

        const response = await getBookingTickets(
          backendPlaceId.toString(),
          dateEpoch,
          specificChargesId
        );

        if (response.success && response.ticketTypes) {
          setTicketTypes(response.ticketTypes);
        } else {
          throw new Error(response.message || 'Failed to fetch ticket data');
        }
      } catch (err) {
        console.error('Error fetching ticket data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load ticket prices');
        // Fallback to hardcoded prices on error
        setTicketTypes([
          { id: '1', name: 'Indian Citizen', price: 50, type: 'INDIAN' },
          { id: '2', name: 'Foreign Citizen', price: 200, type: 'FOREIGNER' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTicketData();
  }, [backendPlaceId]);

  // Find prices from fetched ticket types
  const indianPrice = ticketTypes.find(t => t.type === 'INDIAN')?.price || 50;
  const foreignerPrice = ticketTypes.find(t => t.type === 'FOREIGNER')?.price || 200;

  const total = indian * indianPrice + foreigner * foreignerPrice;
  const totalTickets = indian + foreigner;
  const isValid = total > 0 && bookable;

  const handleBooking = () => {
    if (!isValid) return;

    sessionStorage.setItem(
      'booking',
      JSON.stringify({
        placeName,
        strapiPlaceId,
        backendPlaceId: backendPlaceId || backendPlaceData?.id,
        indian,
        foreigner,
        total,
        indianPrice,
        foreignerPrice,
        date: new Date().toISOString().split('T')[0]
      })
    );
    window.location.href = '/verify';
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <section className="max-w-lg mx-auto">
        {/* Place Image Section */}
        <div className="w-full h-64 bg-slate-700 overflow-hidden">
          {placeImage ? (
            <img
              src={placeImage}
              alt={placeName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-600 to-slate-800">
              <div className="text-center text-slate-400">
                <svg className="w-16 h-16 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm">No image available</p>
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="px-4 pt-6 pb-8">
          {/* Place Name */}
          <h1 className="text-4xl font-bold text-white mb-2 leading-tight">
            {placeName}
          </h1>

          {/* Status Badge */}
          <div className="flex items-center gap-2 mb-4">
            {bookable ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-900 text-green-200 text-xs font-semibold rounded-full">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                Bookings Open
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-900 text-red-200 text-xs font-semibold rounded-full">
                <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                Closed
              </span>
            )}
          </div>

          {/* Description */}
          {description && (
            <p className="text-slate-300 text-sm mb-6 leading-relaxed">
              {description.substring(0, 150)}{description.length > 150 ? '...' : ''}
            </p>
          )}

          {/* Backend Place Info */}
          {backendPlaceData && (
            <div className="bg-slate-700 rounded-lg p-4 mb-6 border border-slate-600">
              <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-2">Location Info</p>
              <p className="text-sm text-white">
                <span className="text-slate-300">Type: </span>
                <span className="font-semibold capitalize">{backendPlaceData.type}</span>
              </p>
            </div>
          )}

          {/* Visit Date Info */}
          <div className="bg-slate-700 rounded-lg p-4 mb-6">
            <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold">Visit Date</p>
            <p className="text-lg font-semibold text-white mt-1">
              {new Date().toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            <p className="text-xs text-slate-400 mt-2">Today's visit</p>
          </div>

          {/* Ticket Section */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span>Select Tickets</span>
              <span className="text-sm font-normal text-slate-400">({totalTickets} {totalTickets === 1 ? 'ticket' : 'tickets'})</span>
            </h2>

            <TicketRow
              title="Indian Citizen"
              price={indianPrice}
              count={indian}
              onChange={setIndian}
            />

            <TicketRow
              title="Foreign Citizen"
              price={foreignerPrice}
              count={foreigner}
              onChange={setForeigner}
            />
          </div>

          {/* Price Breakdown */}
          {total > 0 && (
            <div className="bg-slate-700 rounded-lg p-4 mb-6">
              <div className="space-y-2 mb-3">
                {indian > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Indian Citizen × {indian}</span>
                    <span className="text-white font-semibold">₹{indian * indianPrice}</span>
                  </div>
                )}
                {foreigner > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Foreign Citizen × {foreigner}</span>
                    <span className="text-white font-semibold">₹{foreigner * foreignerPrice}</span>
                  </div>
                )}
              </div>
              <div className="border-t border-slate-600 pt-3 flex justify-between">
                <span className="text-white font-semibold">Total Amount</span>
                <span className="text-2xl font-bold text-[#ff016e]">
                  ₹{total}
                </span>
              </div>
            </div>
          )}

          {/* Booking Button */}
          <button
            disabled={!isValid}
            onClick={handleBooking}
            className={`w-full py-4 rounded-lg font-bold text-lg transition-all active:scale-95 ${
              isValid
                ? 'bg-[#ff016e] text-white hover:bg-[#e6015f] shadow-lg shadow-[#ff016e]/30'
                : 'bg-slate-600 text-slate-400 cursor-not-allowed'
            }`}
          >
            {!bookable ? 'Bookings Closed' : total === 0 ? 'Select Tickets to Continue' : 'Proceed to Payment'}
          </button>

          {/* Info Message */}
          {!bookable && (
            <p className="text-center text-red-400 text-xs mt-3">
              Ticket bookings are currently unavailable for this location.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
