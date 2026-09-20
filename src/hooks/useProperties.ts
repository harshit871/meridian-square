import { useQuery } from '@tanstack/react-query';
import { fetchProperties, ApiSimulationMode } from '../api/propertiesApi';
import { Property, PropertyFilters } from '../types/property';

export const propertyKeys = {
  all: ['properties'] as const,
  lists: () => [...propertyKeys.all, 'list'] as const,
  list: (mode: ApiSimulationMode) => [...propertyKeys.lists(), mode] as const,
};

export function useProperties(filters?: PropertyFilters, apiMode: ApiSimulationMode = 'normal') {
  return useQuery<Property[], Error>({
    queryKey: propertyKeys.list(apiMode),
    queryFn: () => fetchProperties(apiMode),
    staleTime: apiMode === 'normal' ? 1000 * 60 * 5 : 0,
    retry: 0,
    select: (data) => {
      if (!filters) return data;
      return data.filter((property) => {
        const matchesLocation =
          !filters.location ||
          filters.location === 'ALL' ||
          property.location.toLowerCase() === filters.location.toLowerCase();

        const matchesYield =
          filters.minYield === undefined ||
          filters.minYield === null ||
          property.yieldPercent >= filters.minYield;

        return matchesLocation && matchesYield;
      });
    },
  });
}
