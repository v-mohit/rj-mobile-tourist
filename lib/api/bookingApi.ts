import { http } from '../http';

// v2.1: Updated to filter zero-price tickets and improve API response handling

// Frontend normalized ticket type (for UI consumption)
export interface TicketType {
  id: string;
  name: string; // e.g., "Indian Citizen", "Foreign Citizen"
  price: number;
  type: string; // e.g., "INDIAN", "FOREIGNER"
}

// Raw API response structure from /booking/tickets/mobile
export interface ShiftDto {
  id: string;
  name: string;
  startTime: number;
  endTime: number;
  placeId: string;
  createdBy?: string;
  updatedDate: number;
  updatedBy: string;
  startOnlineTime: number;
  endOnlineTime: number;
  active: boolean;
  delete: boolean;
}

export interface TicketTypeDto {
  id: string;
  seasonId: string;
  masterTicketTypeId: string | null;
  masterTicketTypeName: string;
  inventoryId: string | null;
  inventoryQuotaId: string | null;
  ticketConfig: string;
  note: string;
  amount: number;
  cancellationPolicyId: string | null;
  masterActive: boolean;
  percentage: number;
  createdDate: number;
  createdBy: string;
  updatedDate: number;
  updatedBy: string;
  capacity: number;
  remaining: number;
  dayPlusOne: boolean;
  bookingDate: boolean;
  dayBefore: boolean;
  startDate: number;
  endDate: number;
  day: number;
  headAamount: number;
  default: boolean;
  active: boolean;
  delete: boolean;
  custom: boolean;
  config: boolean;
  increase: boolean;
}

export interface BookingTicketsResponse {
  id: string;
  name: string;
  startTime: number;
  endTime: number;
  placeId: string;
  seasonConfig: string;
  maxAllowedTickets: number;
  shiftDtos: ShiftDto[];
  ticketTypeDtos: TicketTypeDto[];
  createdDate: number;
  createdBy: string;
  updatedDate: number;
  updatedBy: string;
  nameRequired: boolean;
  active: boolean;
  delete: boolean;
  roundOff: boolean;
  message?: string;
  success?: boolean;
}

/**
 * Normalize the raw API response to frontend format
 * Maps TicketTypeDto[] to TicketType[] for UI consumption
 * Filters out inactive, deleted, and zero-price tickets
 */
export function normalizeTicketResponse(
  response: any
): TicketType[] {
  // Ensure we have a valid response with ticketTypeDtos
  if (!response || typeof response !== 'object') {
    console.warn('Invalid response object:', response);
    return [];
  }

  const ticketTypeDtos = response.ticketTypeDtos;

  if (!ticketTypeDtos || !Array.isArray(ticketTypeDtos)) {
    console.warn('No ticketTypeDtos array found in response');
    return [];
  }

  console.log(`Processing ${ticketTypeDtos.length} tickets from API`);

  const filtered = ticketTypeDtos.filter(dto => {
    const isActive = dto.active === true;
    const isNotDeleted = dto.delete !== true;
    const hasPriceSet = typeof dto.amount === 'number' && dto.amount > 0;

    console.log(`Ticket "${dto.masterTicketTypeName}": active=${isActive}, deleted=${!isNotDeleted}, amount=${dto.amount}, passing=${isActive && isNotDeleted && hasPriceSet}`);

    return isActive && isNotDeleted && hasPriceSet;
  });

  console.log(`Filtered down to ${filtered.length} tickets with price > 0`);

  return filtered.map(dto => {
    // Map ticket type based on masterTicketTypeName
    let type = 'OTHER';
    const name = dto.masterTicketTypeName.toLowerCase();

    if (name.includes('indian')) {
      type = 'INDIAN';
    } else if (name.includes('foreign') || name.includes('foreigner')) {
      type = 'FOREIGNER';
    }

    return {
      id: dto.id,
      name: dto.masterTicketTypeName,
      price: dto.amount,
      type,
    };
  });
}

/**
 * Fetch ticket types and pricing for a specific place and date
 * Uses token-free mobile endpoint: /booking/tickets/mobile
 */
export async function getBookingTickets(
  placeId: string,
  dateEpoch: number,
  specificChargesId: string = '65aa27a26aebab05633bd572'
): Promise<{ ticketTypes: TicketType[]; raw?: BookingTicketsResponse }> {
  try {
    const response = await http.get('/booking/tickets/mobile', {
      params: {
        placeId,
        date: dateEpoch,
        specificChargesId,
      },
    });

    console.log('=== BOOKING TICKETS API RESPONSE ===');
    console.log('Full response:', response);
    console.log('response.data:', response?.data);
    console.log('response.data.result:', response?.data?.result);

    // Handle both wrapped (response.data.result) and direct (response.data) response formats
    let responseData = response?.data?.result || response?.data;

    // If responseData is wrapped in another layer, unwrap it
    if (responseData && responseData.result) {
      console.log('Found nested result object, using it...');
      responseData = responseData.result;
    }

    console.log('Final responseData to normalize:', responseData);

    if (responseData?.ticketTypeDtos) {
      console.log(`Found ${responseData.ticketTypeDtos.length} tickets in response`);
      console.log('TicketTypeDtos before filter:', responseData.ticketTypeDtos.map((t: any) => ({
        id: t.id,
        name: t.masterTicketTypeName,
        amount: t.amount,
        active: t.active,
        delete: t.delete
      })));
    } else {
      console.warn('No ticketTypeDtos found in response!');
    }

    const normalized = normalizeTicketResponse(responseData);

    console.log('Normalized TicketTypes (after filter):', normalized);
    console.log('=== END API RESPONSE ===\n');

    return {
      ticketTypes: normalized,
      raw: response.data,
    };
  } catch (error) {
    console.error('Error fetching booking tickets:', error);
    throw error;
  }
}
