import { http } from '../http';

export interface BackendPlace {
  id: number;          // DB place id
  name: string;
  type: string;        // use union later if needed
}

export async function getBackendPlaceByStrapiId(
  strapiPlaceId: number
): Promise<BackendPlace> {
  const response = await http.get('/place/get', {
    params: {
      locationId: strapiPlaceId,
    },
  });

  return response.data;
}
