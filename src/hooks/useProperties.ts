import { useQuery } from '@tanstack/react-query';
import { fetchProperties, ApiSimulationMode } from '../api/propertiesApi';
import { Property, PropertyFilters } from '../types/property';

export const propertyKeys = {
  all: ['properties'] as const,
};

export function useProperties(filters?: PropertyFilters, apiMode: ApiSimulationMode = 'normal') {
  return useQuery<Property[], Error>({
    queryKey: propertyKeys.all,
    queryFn: () => fetchProperties(apiMode),
    staleTime: 1000 * 60 * 5,
    retry: 0,
    select: (data) => {
      if (!filters) return data;

      return data.filter((p) => {
        const matchesLocation =
          !filters.location ||
          filters.location === 'ALL' ||
          p.location.toLowerCase() === filters.location.toLowerCase();

        const matchesYield =
          filters.minYield === null ||
          p.yieldPercent >= filters.minYield;

        return matchesLocation && matchesYield;
      });
    },
  });
}
