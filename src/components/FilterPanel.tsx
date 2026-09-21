import { ChangeEvent } from 'react';
import { PropertyFilters } from '../types/property';

const LOCATIONS = ['Dubai Marina', 'Downtown Dubai', 'Jumeirah Village Circle'];

interface FilterPanelProps {
  filters: PropertyFilters;
  onFilterChange: (filters: PropertyFilters) => void;
  onReset: () => void;
  resultCount: number;
}

export const FilterPanel = ({ filters, onFilterChange, onReset, resultCount }: FilterPanelProps) => {
  const handleLocation = (e: ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, location: e.target.value });
  };

  const handleYield = (e: ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    onFilterChange({ ...filters, minYield: isNaN(val) ? null : Math.max(0, val) });
  };

  const isFiltered = filters.location !== '' || filters.minYield !== null;

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body p-3 p-md-4">
        <div className="row g-3 align-items-end">
          <div className="col-12 col-md-5">
            <label htmlFor="location-select" className="form-label fw-semibold small mb-1">
              <i className="bi bi-geo-alt me-1 text-primary" aria-hidden="true" />
              Location
            </label>
            <select
              id="location-select"
              className="form-select"
              value={filters.location}
              onChange={handleLocation}
              aria-label="Filter by property location"
            >
              <option value="">All Locations</option>
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-4">
            <label htmlFor="yield-input" className="form-label fw-semibold small mb-1">
              <i className="bi bi-percent me-1 text-primary" aria-hidden="true" />
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
                value={filters.minYield ?? ''}
                onChange={handleYield}
                aria-label="Filter by minimum yield percentage"
              />
              <span className="input-group-text">%</span>
            </div>
          </div>

          <div className="col-12 col-md-3 d-flex justify-content-between justify-content-md-end align-items-center gap-2">
            {isFiltered && (
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={onReset}
                aria-label="Reset all filters"
              >
                <i className="bi bi-arrow-counterclockwise me-1" aria-hidden="true" />
                Reset
              </button>
            )}
            <span className="badge text-bg-light border text-dark py-2 px-3">
              {resultCount} {resultCount === 1 ? 'property' : 'properties'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
