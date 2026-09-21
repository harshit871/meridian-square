export interface PropertyCardProps {
  id: string;
  name: string;
  location: string;
  pricePerToken: number;
  totalSupply: number;
  availableTokens: number;
  yieldPercent: number;
  onViewProperty?: (id: string) => void;
}

export const PropertyCard = ({
  id,
  name,
  location,
  pricePerToken,
  totalSupply,
  availableTokens,
  yieldPercent,
  onViewProperty
}: PropertyCardProps) => {
  const remainingPercentage = totalSupply > 0 ? (availableTokens / totalSupply) * 100 : 0;
  const isLowAvailability = remainingPercentage < 20;

  return (
    <div className="card h-100 shadow-sm border" data-testid={`property-card-${id}`}>
      <div className="card-body d-flex flex-column p-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="text-muted small d-flex align-items-center">
            <i className="bi bi-geo-alt-fill text-primary me-1" aria-hidden="true"></i>
            {location}
          </span>
          <span className="badge text-bg-success-subtle text-success border border-success-subtle fw-semibold">
            {yieldPercent.toFixed(1)}% Yield
          </span>
        </div>

        <h5 className="card-title text-dark fw-bold mb-3">{name}</h5>

        <div className="row g-2 py-2 mb-3 bg-light rounded border px-2">
          <div className="col-6">
            <span className="text-muted d-block small">Token Price</span>
            <span className="fw-bold text-dark fs-6">${pricePerToken.toLocaleString()}</span>
          </div>
          <div className="col-6">
            <span className="text-muted d-block small">Total Supply</span>
            <span className="fw-bold text-dark fs-6">{totalSupply.toLocaleString()}</span>
          </div>
        </div>

        <div className="mb-4 mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <span className="small text-muted">Availability</span>
            <span className="small fw-semibold text-dark">
              {availableTokens.toLocaleString()} / {totalSupply.toLocaleString()}
            </span>
          </div>

          <div
            className="progress mb-2"
            style={{ height: '6px' }}
            role="progressbar"
            aria-valuenow={remainingPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Available tokens percentage"
          >
            <div
              className={`progress-bar ${isLowAvailability ? 'bg-danger' : 'bg-primary'}`}
              style={{ width: `${Math.min(100, Math.max(0, remainingPercentage))}%` }}
            ></div>
          </div>

          {isLowAvailability ? (
            <div
              className="badge text-bg-danger d-flex align-items-center gap-1 justify-content-center py-2 w-100"
              data-testid="low-availability-indicator"
            >
              <i className="bi bi-fire" aria-hidden="true"></i>
              <span>High Demand: Under 20% left ({remainingPercentage.toFixed(1)}%)</span>
            </div>
          ) : (
            <div className="small text-muted text-center">
              <span>{remainingPercentage.toFixed(0)}% available</span>
            </div>
          )}
        </div>

        <button
          type="button"
          className="btn btn-primary w-100 fw-semibold mt-auto"
          onClick={() => onViewProperty?.(id)}
          aria-label={`View Property details for ${name}`}
        >
          View Property
          <i className="bi bi-arrow-right ms-2" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  );
};
