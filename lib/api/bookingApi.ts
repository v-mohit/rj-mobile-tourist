import { http } from '../http';

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
 */
export function normalizeTicketResponse(
  response: BookingTicketsResponse
): TicketType[] {
  if (!response.ticketTypeDtos || !Array.isArray(response.ticketTypeDtos)) {
    return [];
  }

  return response.ticketTypeDtos
    .filter(dto => dto.active && !dto.delete && dto.amount > 0)
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
): Promise<{ ticketTypes: TicketType[]; raw?: BookingTicketsResponse }> {
  const response = await http.get('/booking/tickets/mobile', {
    params: {
      placeId,
      date: dateEpoch,
      specificChargesId,
    },
  });

  // Handle both wrapped (response.data.result) and direct (response.data) response formats
  const responseData = response?.data?.result || response?.data;

  console.log('API Response Data:', responseData);
  console.log('TicketTypeDtos before filter:', responseData?.ticketTypeDtos?.map((t: any) => ({ id: t.id, name: t.masterTicketTypeName, amount: t.amount, active: t.active, delete: t.delete })));

  const normalized = normalizeTicketResponse(responseData);

  console.log('Normalized TicketTypes (after filter):', normalized);

  return {
    ticketTypes: normalized,
    raw: response.data,
  };
}
