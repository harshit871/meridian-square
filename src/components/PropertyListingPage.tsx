import { useState } from 'react';
import { useProperties } from '../hooks/useProperties';
import { PropertyCard } from './PropertyCard';
import { FilterPanel } from './FilterPanel';
import { PropertyFilters } from '../types/property';
import { ApiSimulationMode } from '../api/propertiesApi';

const DEFAULT_FILTERS: PropertyFilters = { minYield: null, location: '' };

interface PropertyListingPageProps {
  apiMode?: ApiSimulationMode;
  onViewProperty?: (id: string) => void;
}

export const PropertyListingPage = ({
  apiMode = 'normal',
  onViewProperty,
}: PropertyListingPageProps) => {
  const [filters, setFilters] = useState<PropertyFilters>(DEFAULT_FILTERS);

  const { data: properties, isLoading, isError, error, refetch, isFetching } = useProperties(
    filters,
    apiMode
  );

  return (
    <section aria-label="Available Real-World Asset Properties">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1">Tokenized Properties</h1>
          <p className="text-muted mb-0">
            Institutional-grade real estate assets in prime UAE markets.
          </p>
        </div>
        {isFetching && !isLoading && (
          <span className="badge text-bg-light border text-muted mt-2 mt-md-0 d-inline-flex align-items-center gap-1 py-2 px-3">
            <span className="spinner-border spinner-border-sm text-primary" role="status" aria-hidden="true" />
            Refreshing...
          </span>
        )}
      </div>

      <FilterPanel
        filters={filters}
        onFilterChange={setFilters}
        onReset={() => setFilters(DEFAULT_FILTERS)}
        resultCount={properties?.length ?? 0}
      />

      {isLoading && (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4" data-testid="loading-skeletons">
          {[1, 2, 3].map((n) => (
            <div key={n} className="col">
              <div className="card h-100 shadow-sm p-4" aria-hidden="true">
                <div className="placeholder-glow">
                  <div className="d-flex justify-content-between mb-3">
                    <span className="placeholder col-4" />
                    <span className="placeholder col-2" />
                  </div>
                  <span className="placeholder col-8 d-block mb-4" />
                  <div className="p-3 bg-light rounded mb-3">
                    <div className="row">
                      <div className="col-6">
                        <span className="placeholder col-8 d-block mb-1" />
                        <span className="placeholder col-6" />
                      </div>
                      <div className="col-6">
                        <span className="placeholder col-8 d-block mb-1" />
                        <span className="placeholder col-6" />
                      </div>
                    </div>
                  </div>
                  <span className="btn btn-primary disabled placeholder col-12 py-2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isError && !isLoading && (
        <div className="card border-danger shadow-sm" data-testid="error-state">
          <div className="card-body p-4 text-center">
            <i className="bi bi-exclamation-triangle-fill display-6 text-danger mb-3 d-block" aria-hidden="true" />
            <h4 className="card-title text-danger fw-bold">Unable to Load Properties</h4>
            <p className="text-muted mb-4">
              {error?.message ?? 'Something went wrong while fetching properties. Please try again.'}
            </p>
            <button
              type="button"
              className="btn btn-danger px-4"
              onClick={() => refetch()}
              aria-label="Retry loading properties"
            >
              <i className="bi bi-arrow-clockwise me-2" aria-hidden="true" />
              Retry
            </button>
          </div>
        </div>
      )}

      {!isLoading && !isError && properties?.length === 0 && (
        <div className="card border text-center p-5" data-testid="empty-state">
          <div className="card-body">
            <i className="bi bi-building-slash display-5 text-muted mb-3 d-block" aria-hidden="true" />
            <h4 className="fw-bold mb-2">No Matching Properties Found</h4>
            <p className="text-muted mb-4">
              Try adjusting your filters to see available investments.
            </p>
            <button
              type="button"
              className="btn btn-outline-primary px-4"
              onClick={() => setFilters(DEFAULT_FILTERS)}
              aria-label="Clear all filters"
            >
              <i className="bi bi-filter-circle me-2" aria-hidden="true" />
              Clear All Filters
            </button>
          </div>
        </div>
      )}

      {!isLoading && !isError && properties && properties.length > 0 && (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4" data-testid="properties-grid">
          {properties.map((property) => (
            <div key={property.id} className="col">
              <PropertyCard property={property} onViewProperty={onViewProperty} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
