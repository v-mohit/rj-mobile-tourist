import { http } from '../http';

export interface TicketType {
  id: number;
  name: string;
  price: number;
}

export async function getTicketTypes(placeId: number) {
  const response = await http.get(`/tickets/${placeId}`);
  return response.data;
}
