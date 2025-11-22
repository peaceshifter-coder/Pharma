import { Store } from '../types';

// Haversine formula to calculate distance between two points in km
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

export const findNearestStore = (userLat: number, userLng: number, stores: Store[]): Store | null => {
  if (stores.length === 0) return null;

  let nearest = stores[0];
  let minDistance = calculateDistance(userLat, userLng, nearest.lat, nearest.lng);

  for (let i = 1; i < stores.length; i++) {
    const d = calculateDistance(userLat, userLng, stores[i].lat, stores[i].lng);
    if (d < minDistance) {
      minDistance = d;
      nearest = stores[i];
    }
  }

  return nearest;
};