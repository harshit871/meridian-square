import { useQuery } from '@tanstack/react-query';
import { fetchProperties, ApiSimulationMode } from '../api/propertiesApi';
import { Property, PropertyFilters } from '../types/property';

export const propertyKeys = {
  all: ['properties'] as const,
  byMode: (mode: ApiSimulationMode) => [...propertyKeys.all, mode] as const,
};

export function useProperties(filters?: PropertyFilters, apiMode: ApiSimulationMode = 'normal') {
  return useQuery<Property[], Error>({
    queryKey: propertyKeys.byMode(apiMode),
    queryFn: () => fetchProperties(apiMode),
    staleTime: apiMode === 'normal' ? 1000 * 60 * 5 : 0,
    retry: 0,
    select: (data) => {
      if (!filters) return data;

      return data.filter((p) => {
        const matchesLocation =
          !filters.location ||
          p.location.toLowerCase() === filters.location.toLowerCase();

        const matchesYield =
          filters.minYield === null ||
          p.yieldPercent >= filters.minYield;

        return matchesLocation && matchesYield;
      });
    },
  });
}
