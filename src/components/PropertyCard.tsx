import { Property } from '../types/property';

interface PropertyCardProps {
  property: Property;
  onViewProperty?: (id: string) => void;
}

export const PropertyCard = ({ property, onViewProperty }: PropertyCardProps) => {
  const { id, name, location, pricePerToken, totalSupply, availableTokens, yieldPercent } = property;

  const remaining = totalSupply > 0 ? (availableTokens / totalSupply) * 100 : 0;
  const isLowAvailability = remaining < 20;

  return (
    <div className="card h-100 shadow-sm" data-testid={`property-card-${id}`}>
      <div className="card-body d-flex flex-column p-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="text-muted small">
            <i className="bi bi-geo-alt-fill text-primary me-1" aria-hidden="true" />
            {location}
          </span>
          <span className="badge text-bg-success">{yieldPercent.toFixed(1)}% Yield</span>
        </div>

        <h5 className="card-title fw-bold mb-3">{name}</h5>

        <div className="row g-2 py-2 mb-3 bg-light rounded px-2">
          <div className="col-6">
            <span className="text-muted d-block small">Token Price</span>
            <span className="fw-bold">${pricePerToken}</span>
          </div>
          <div className="col-6">
            <span className="text-muted d-block small">Total Supply</span>
            <span className="fw-bold">{totalSupply.toLocaleString()}</span>
          </div>
        </div>

        <div className="mb-4 mt-auto">
          <div className="d-flex justify-content-between mb-1">
            <span className="small text-muted">Availability</span>
            <span className="small fw-semibold">
              {availableTokens.toLocaleString()} / {totalSupply.toLocaleString()}
            </span>
          </div>

          <div
            className="progress mb-2"
            style={{ height: '6px' }}
            role="progressbar"
            aria-valuenow={remaining}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Available tokens percentage"
          >
            <div
              className={`progress-bar ${isLowAvailability ? 'bg-danger' : 'bg-primary'}`}
              style={{ width: `${Math.min(100, Math.max(0, remaining))}%` }}
            />
          </div>

          {isLowAvailability ? (
            <span
              className="badge text-bg-danger d-flex align-items-center gap-1 justify-content-center py-2 w-100"
              data-testid="low-availability-indicator"
            >
              <i className="bi bi-fire" aria-hidden="true" />
              High Demand: Under 20% left ({remaining.toFixed(1)}%)
            </span>
          ) : (
            <p className="small text-muted text-center mb-0">
              {Math.round(remaining)}% available
            </p>
          )}
        </div>

        <button
          type="button"
          className="btn btn-primary w-100 fw-semibold"
          onClick={() => onViewProperty?.(id)}
          aria-label={`View Property details for ${name}`}
        >
          View Property
          <i className="bi bi-arrow-right ms-2" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

// re-export the props type so the tests/parent can import it
export type { PropertyCardProps };
