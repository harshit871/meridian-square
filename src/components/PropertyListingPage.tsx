import React, { useState, useMemo } from 'react';
import { useProperties } from '../hooks/useProperties';
import { PropertyCard } from './PropertyCard';
import { FilterPanel } from './FilterPanel';
import { PropertyFilters } from '../types/property';
import { ApiSimulationMode } from '../api/propertiesApi';

export interface PropertyListingPageProps {
  apiMode?: ApiSimulationMode;
  onViewProperty?: (id: string) => void;
}

export const PropertyListingPage: React.FC<PropertyListingPageProps> = ({
  apiMode = 'normal',
  onViewProperty
}) => {
  const [filters, setFilters] = useState<PropertyFilters>({
    minYield: 0,
    location: 'ALL'
  });

  const { data: properties, isLoading, isError, error, refetch, isFetching } = useProperties(
    filters,
    apiMode
  );

  const locations = useMemo(() => {
    return ['Dubai Marina', 'Downtown Dubai', 'Jumeirah Village Circle'];
  }, []);

  const handleResetFilters = () => {
    setFilters({ minYield: 0, location: 'ALL' });
  };

  return (
    <section aria-label="Available Real-World Asset Properties">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
        <div>
          <h1 className="h3 fw-bold text-dark mb-1">Tokenized Properties</h1>
          <p className="text-muted mb-0">
            Regulated institutional-grade real estate assets in prime UAE markets.
          </p>
        </div>
        {isFetching && !isLoading && (
          <span className="badge text-bg-light border text-muted mt-2 mt-md-0 d-inline-flex align-items-center gap-1 py-2 px-3">
            <span className="spinner-border spinner-border-sm text-primary" role="status" aria-hidden="true"></span>
            Syncing market data...
          </span>
        )}
      </div>

      <FilterPanel
        filters={filters}
        locations={locations}
        onFilterChange={setFilters}
        onReset={handleResetFilters}
        resultCount={properties?.length ?? 0}
      />

      {isLoading && (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4" data-testid="loading-skeletons">
          {[1, 2, 3].map((n) => (
            <div key={n} className="col">
              <div className="card h-100 shadow-sm border p-4" aria-hidden="true">
                <div className="placeholder-glow">
                  <div className="d-flex justify-content-between mb-3">
                    <span className="placeholder col-4"></span>
                    <span className="placeholder col-2"></span>
                  </div>
                  <h5 className="card-title placeholder-glow mb-4">
                    <span className="placeholder col-8"></span>
                  </h5>
                  <div className="p-3 bg-light rounded mb-3">
                    <div className="row">
                      <div className="col-6">
                        <span className="placeholder col-8 d-block mb-1"></span>
                        <span className="placeholder col-6"></span>
                      </div>
                      <div className="col-6">
                        <span className="placeholder col-8 d-block mb-1"></span>
                        <span className="placeholder col-6"></span>
                      </div>
                    </div>
                  </div>
                  <div className="placeholder col-12 mb-3" style={{ height: '8px' }}></div>
                  <span className="btn btn-primary disabled placeholder col-12 py-2"></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isError && !isLoading && (
        <div className="card border-danger shadow-sm mb-4" data-testid="error-state">
          <div className="card-body p-4 text-center">
            <div className="display-6 text-danger mb-3">
              <i className="bi bi-exclamation-triangle-fill" aria-hidden="true"></i>
            </div>
            <h4 className="card-title text-danger fw-bold">Unable to Load Properties</h4>
            <p className="text-muted max-w-md mx-auto mb-4">
              {error?.message || 'An unexpected error occurred while fetching properties from GET /properties.'}
            </p>
            <button
              type="button"
              className="btn btn-danger px-4"
              onClick={() => refetch()}
              aria-label="Retry loading properties"
            >
              <i className="bi bi-arrow-clockwise me-2" aria-hidden="true"></i>
              Retry Fetch
            </button>
          </div>
        </div>
      )}

      {!isLoading && !isError && properties && properties.length === 0 && (
        <div className="card border shadow-sm text-center p-5 mb-4" data-testid="empty-state">
          <div className="card-body">
            <div className="display-5 text-muted mb-3">
              <i className="bi bi-building-slash" aria-hidden="true"></i>
            </div>
            <h4 className="fw-bold text-dark mb-2">No Matching Properties Found</h4>
            <p className="text-muted mb-4">
              No investment assets match your active filters (Min Yield: {filters.minYield}%
              {filters.location !== 'ALL' ? `, Location: ${filters.location}` : ''}).
            </p>
            <button
              type="button"
              className="btn btn-outline-primary px-4"
              onClick={handleResetFilters}
            >
              <i className="bi bi-filter-circle me-2" aria-hidden="true"></i>
              Clear All Filters
            </button>
          </div>
        </div>
      )}

      {!isLoading && !isError && properties && properties.length > 0 && (
        <div
          className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4"
          data-testid="properties-grid"
        >
          {properties.map((property) => (
            <div key={property.id} className="col">
              <PropertyCard
                id={property.id}
                name={property.name}
                location={property.location}
                pricePerToken={property.pricePerToken}
                totalSupply={property.totalSupply}
                availableTokens={property.availableTokens}
                yieldPercent={property.yieldPercent}
                onViewProperty={onViewProperty}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
