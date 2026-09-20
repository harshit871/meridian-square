import { Property } from '../types/property';
import { mockProperties } from './mockData';

export type ApiSimulationMode = 'normal' | 'slow' | 'error';

export const fetchProperties = async (mode: ApiSimulationMode = 'normal'): Promise<Property[]> => {
  const latency = mode === 'slow' ? 2000 : 500;
  await new Promise((resolve) => setTimeout(resolve, latency));

  if (mode === 'error') {
    throw new Error('Failed to fetch properties from GET /properties. Server returned 500.');
  }

  return [...mockProperties];
};
