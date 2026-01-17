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
 */
export async function getBookingTickets(
  placeId: string,
  dateEpoch: number,
  specificChargesId: string,
  authToken?: string
): Promise<BookingTicketsResponse> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add authorization token if available
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await http.get('/booking/tickets', {
    params: {
      placeId,
      date: dateEpoch,
      specificChargesId,
    },
    headers,
  });

  return response.data;
}
