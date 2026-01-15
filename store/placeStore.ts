import { create } from 'zustand';
import type { BackendPlace } from '@/lib/api/placeApi';

interface PlaceStore {
  backendPlace?: BackendPlace;
  setBackendPlace: (place: BackendPlace) => void;
}

export const usePlaceStore = create<PlaceStore>((set) => ({
  backendPlace: undefined,
  setBackendPlace: (place) => set({ backendPlace: place }),
}));
