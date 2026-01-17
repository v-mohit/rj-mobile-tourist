import { http } from '../http';

export interface TicketType {
  id: string;
  name: string; // e.g., "Indian Citizen", "Foreign Citizen"
  price: number;
  type: string; // e.g., "INDIAN", "FOREIGNER"
}

export interface BookingTicketsResponse {
  placeId: string;
  date: number;
  ticketTypes: TicketType[];
  message?: string;
  success: boolean;
}

/**
 * Fetch ticket types and pricing for a specific place and date
 * Uses token-free mobile endpoint: /booking/tickets/mobile
 */
export async function getBookingTickets(
  placeId: string,
  dateEpoch: number
): Promise<BookingTicketsResponse> {
  const response = await http.get('/booking/tickets/mobile', {
    params: {
      placeId,
      date: dateEpoch,
    },
  });

  return response.data;
}
