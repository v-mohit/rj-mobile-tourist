import { http } from '../http';

export interface BackendPlace {
  id: number;          // DB place id
  name: string;
  type: string;        // use union later if needed
}

export async function getBackendPlaceByStrapiId(
  strapiPlaceId: number
): Promise<BackendPlace | null> {
  const response = await http.get('/place/get', {
    params: {
      locationId: strapiPlaceId,
    },
  });

  // Handle both direct response and result-wrapped response
  return response.data?.result || response.data;
}
