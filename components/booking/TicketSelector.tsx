'use client';

import { useState, useEffect } from 'react';
import TicketRow from './TicketRow';
import { getBookingTickets, type TicketType, type BookingTicketsResponse, type ShiftDto } from '@/lib/api/bookingApi';

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
  const [ticketCounts, setTicketCounts] = useState<Record<string, number>>({});
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiResponse, setApiResponse] = useState<BookingTicketsResponse | null>(null);
  const [selectedShiftId, setSelectedShiftId] = useState<string>('');

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

        if (response.ticketTypes && Array.isArray(response.ticketTypes)) {
          setTicketTypes(response.ticketTypes);
          // Initialize counts for each ticket type to 0
          const initialCounts: Record<string, number> = {};
          response.ticketTypes.forEach(ticket => {
            initialCounts[ticket.id] = 0;
          });
          setTicketCounts(initialCounts);
        } else {
          throw new Error('Failed to fetch ticket data');
        }
      } catch (err) {
        console.error('Error fetching ticket data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load ticket prices');
        // Fallback to hardcoded prices on error
        const fallbackTickets: TicketType[] = [
          { id: '1', name: 'Indian Citizen', price: 50, type: 'INDIAN' },
          { id: '2', name: 'Foreign Citizen', price: 200, type: 'FOREIGNER' }
        ];
        setTicketTypes(fallbackTickets);
        const initialCounts: Record<string, number> = {};
        fallbackTickets.forEach(ticket => {
          initialCounts[ticket.id] = 0;
        });
        setTicketCounts(initialCounts);
      } finally {
        setLoading(false);
      }
    };

    fetchTicketData();
  }, [backendPlaceId]);

  // Calculate total from all selected tickets
  const total = Object.entries(ticketCounts).reduce((sum, [ticketId, count]) => {
    const ticketType = ticketTypes.find(t => t.id === ticketId);
    return sum + (ticketType ? ticketType.price * count : 0);
  }, 0);

  const totalTickets = Object.values(ticketCounts).reduce((sum, count) => sum + count, 0);
  const isValid = total > 0 && bookable;

  const handleBooking = () => {
    if (!isValid) return;

    // Build selected tickets array with count and price info
    const selectedTickets = ticketTypes
      .filter(ticket => ticketCounts[ticket.id] > 0)
      .map(ticket => ({
        id: ticket.id,
        name: ticket.name,
        type: ticket.type,
        price: ticket.price,
        count: ticketCounts[ticket.id],
        subtotal: ticket.price * ticketCounts[ticket.id]
      }));

    sessionStorage.setItem(
      'booking',
      JSON.stringify({
        placeName,
        strapiPlaceId,
        backendPlaceId: backendPlaceId || backendPlaceData?.id,
        selectedTickets,
        total,
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

            {ticketTypes.length > 0 ? (
              <div className="space-y-3">
                {ticketTypes.map((ticket) => (
                  <TicketRow
                    key={ticket.id}
                    title={ticket.name}
                    price={ticket.price}
                    count={ticketCounts[ticket.id] || 0}
                    onChange={(newCount) =>
                      setTicketCounts(prev => ({
                        ...prev,
                        [ticket.id]: newCount
                      }))
                    }
                  />
                ))}
              </div>
            ) : (
              loading && (
                <div className="space-y-3">
                  {[1, 2].map(i => (
                    <div key={i} className="h-20 bg-slate-700 rounded-xl animate-pulse" />
                  ))}
                </div>
              )
            )}
          </div>

          {/* Price Breakdown */}
          {total > 0 && (
            <div className="bg-slate-700 rounded-lg p-4 mb-6">
              <div className="space-y-2 mb-3">
                {ticketTypes
                  .filter(ticket => ticketCounts[ticket.id] > 0)
                  .map(ticket => (
                    <div key={ticket.id} className="flex justify-between text-sm">
                      <span className="text-slate-300">{ticket.name} × {ticketCounts[ticket.id]}</span>
                      <span className="text-white font-semibold">₹{ticket.price * ticketCounts[ticket.id]}</span>
                    </div>
                  ))}
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
