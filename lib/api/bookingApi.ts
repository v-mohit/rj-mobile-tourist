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
  if (!response || typeof response !== 'object') {
    return [];
  }

  const ticketTypeDtos = response.ticketTypeDtos;

  if (!ticketTypeDtos || !Array.isArray(ticketTypeDtos)) {
    return [];
  }

  return ticketTypeDtos
    .filter(dto => dto.active === true && dto.delete !== true && typeof dto.amount === 'number' && dto.amount > 0)
    .map(dto => {
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
): Promise<{ ticketTypes: TicketType[]; result?: BookingTicketsResponse }> {
  const response = await http.get('/booking/tickets/mobile', {
    params: {
      placeId,
      date: dateEpoch,
      specificChargesId,
    },
  });

  // Handle both wrapped (response.data.result) and direct (response.data) response formats
  const responseData = response?.data?.result || response?.data;
  const normalized = normalizeTicketResponse(responseData);

  return {
    ticketTypes: normalized,
    result: response?.data?.result || response?.data,
  };
}

/**
 * Ticket user DTO for booking creation
 */
export interface TicketUserDto {
  ticketTypeId: string;
  qty: number;
  addOnList: any[];
}

/**
 * Booking creation request payload
 */
export interface CreateBookingRequest {
  bookingDate: number; // Epoch milliseconds
  placeId: string;
  device: string; // "Web"
  seasonId: string;
  ticketUserDtoClone: TicketUserDto[];
  shiftId: string;
  vip: boolean; // false
  deviceId: string; // "WHoWer"
}

/**
 * Booking creation response
 */
export interface CreateBookingResponse {
  success: boolean;
  message: string;
  result?: {
    bookingId?: string;
    referenceNumber?: string;
    [key: string]: any;
  };
}

/**
 * Create a new booking with selected tickets
 * POST /booking/create/v2?onSite=false
 */
export async function createBooking(
  placeId: string,
  selectedTickets: Array<{ id: string; count: number }>,
  seasonId: string,
  shiftId: string,
  bookingDate: number,
  authToken?: string
): Promise<CreateBookingResponse> {
  const ticketUserDtoClone: TicketUserDto[] = selectedTickets.map(ticket => ({
    ticketTypeId: ticket.id,
    qty: ticket.count,
    addOnList: [],
  }));

  const payload: CreateBookingRequest = {
    bookingDate,
    placeId,
    device: 'Web',
    seasonId,
    ticketUserDtoClone,
    shiftId,
    vip: false,
    deviceId: 'WHoWer',
  };

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add auth token if provided
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await http.post('/booking/create/v2?onSite=false', payload, {
    headers,
  });

  return response.data;
}

/**
 * Confirm booking and get payment gateway details
 * GET /booking/confirm/v2?bookingId=<id>
 */
export interface ConfirmBookingResponse {
  success: boolean;
  message: string;
  ENCDATA?: string;
  MERCHANTCODE?: string;
  SERVICEID?: string;
  [key: string]: any;
}

export async function confirmBooking(
  bookingId: string,
  authToken?: string
): Promise<ConfirmBookingResponse> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add auth token if provided
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await http.get(`/booking/confirm/v2?bookingId=${bookingId}`, {
    headers,
  });

  return response.data;
}
