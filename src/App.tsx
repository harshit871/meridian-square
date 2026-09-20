import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Header, ApiSimulationMode } from './components/Header';
import { KYCStatusBanner } from './components/KYCStatusBanner';
import { PropertyListingPage } from './components/PropertyListingPage';
import { KYCStatus } from './types/kyc';
import { mockProperties } from './api/mockData';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

export const App = () => {
  const [kycStatus, setKycStatus] = useState<KYCStatus>('pending');
  const [apiMode, setApiMode] = useState<ApiSimulationMode>('normal');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

  const selectedProperty = selectedPropertyId
    ? mockProperties.find((p) => p.id === selectedPropertyId)
    : null;

  return (
    <QueryClientProvider client={queryClient}>
      <div className="d-flex flex-column min-vh-100 bg-light">
        <Header
          kycStatus={kycStatus}
          onKycStatusChange={setKycStatus}
          apiMode={apiMode}
          onApiModeChange={setApiMode}
        />

        <main className="container pb-5 flex-grow-1">
          <KYCStatusBanner status={kycStatus} />

          <PropertyListingPage
            apiMode={apiMode}
            onViewProperty={(id) => setSelectedPropertyId(id)}
          />
        </main>

        {selectedProperty && (
          <div
            className="modal fade show d-block"
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="property-modal-title"
            // --cs-modal-backdrop is defined in theme.scss so no hex leaks into components
            style={{ backgroundColor: 'var(--cs-modal-backdrop)' }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content shadow border-0">
                <div className="modal-header border-bottom">
                  <h5 className="modal-title fw-bold text-dark" id="property-modal-title">
                    {selectedProperty.name}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setSelectedPropertyId(null)}
                  ></button>
                </div>
                <div className="modal-body p-4">
                  <div className="mb-3 d-flex justify-content-between align-items-center">
                    <span className="text-muted">
                      <i className="bi bi-geo-alt-fill text-primary me-1"></i>
                      {selectedProperty.location}
                    </span>
                    <span className="badge text-bg-success">
                      {selectedProperty.yieldPercent}% Projected APY
                    </span>
                  </div>
                  <ul className="list-group list-group-flush border-top border-bottom mb-3">
                    <li className="list-group-item d-flex justify-content-between px-0">
                      <span className="text-muted">Price Per Token:</span>
                      <span className="fw-bold">${selectedProperty.pricePerToken}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between px-0">
                      <span className="text-muted">Total Token Supply:</span>
                      <span className="fw-bold">{selectedProperty.totalSupply.toLocaleString()}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between px-0">
                      <span className="text-muted">Available Tokens:</span>
                      <span className="fw-bold text-primary">
                        {selectedProperty.availableTokens.toLocaleString()}
                      </span>
                    </li>
                  </ul>

                  {kycStatus !== 'approved' ? (
                    <div className="alert alert-warning small mb-0 d-flex align-items-center gap-2">
                      <i className="bi bi-shield-exclamation fs-5"></i>
                      <div>
                        Investment locked. Complete your KYC verification (currently {kycStatus}) to participate in token purchasing.
                      </div>
                    </div>
                  ) : (
                    <button type="button" className="btn btn-primary w-100 fw-semibold">
                      Proceed to Token Order
                    </button>
                  )}
                </div>
                <div className="modal-footer border-top bg-light">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setSelectedPropertyId(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <footer className="bg-white border-top py-3 mt-auto text-center text-muted small">
          <div className="container">
            <p className="mb-0">
              CubeSquare Real-World Asset Tokenization &bull; Dubai &amp; New York
            </p>
          </div>
        </footer>
      </div>
    </QueryClientProvider>
  );
};

export default App;
