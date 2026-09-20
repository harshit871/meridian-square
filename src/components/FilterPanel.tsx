import React from 'react';
import { PropertyFilters } from '../types/property';

export interface FilterPanelProps {
  filters: PropertyFilters;
  locations: string[];
  onFilterChange: (filters: PropertyFilters) => void;
  onReset: () => void;
  resultCount: number;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  locations,
  onFilterChange,
  onReset,
  resultCount
}) => {
  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      location: e.target.value
    });
  };

  const handleYieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    onFilterChange({
      ...filters,
      minYield: isNaN(val) ? 0 : Math.max(0, val)
    });
  };

  const isFiltered = filters.location !== 'ALL' || filters.minYield > 0;

  return (
    <div className="card shadow-sm border mb-4">
      <div className="card-body p-3 p-md-4">
        <div className="row g-3 align-items-end">
          <div className="col-12 col-md-5">
            <label htmlFor="location-select" className="form-label fw-semibold small text-dark mb-1">
              <i className="bi bi-geo-alt me-1 text-primary" aria-hidden="true"></i>
              Location
            </label>
            <select
              id="location-select"
              className="form-select"
              value={filters.location}
              onChange={handleLocationChange}
              aria-label="Filter by property location"
            >
              <option value="ALL">All Locations</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-4">
            <label htmlFor="yield-input" className="form-label fw-semibold small text-dark mb-1">
              <i className="bi bi-percent me-1 text-primary" aria-hidden="true"></i>
              Minimum Yield (%)
            </label>
            <div className="input-group">
              <input
                id="yield-input"
                type="number"
                step="0.1"
                min="0"
                max="20"
                className="form-control"
                placeholder="e.g. 7.0"
                value={filters.minYield === 0 ? '' : filters.minYield}
                onChange={handleYieldChange}
                aria-label="Filter by minimum yield percentage"
              />
              <span className="input-group-text">% APY</span>
            </div>
          </div>

          <div className="col-12 col-md-3 d-flex justify-content-between justify-content-md-end align-items-center gap-2 pt-1 pt-md-0">
            {isFiltered && (
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm text-nowrap"
                onClick={onReset}
                aria-label="Reset all filters"
              >
                <i className="bi bi-arrow-counterclockwise me-1" aria-hidden="true"></i>
                Reset
              </button>
            )}
            <div className="badge text-bg-light border text-dark py-2 px-3 text-nowrap">
              {resultCount} {resultCount === 1 ? 'Property' : 'Properties'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
