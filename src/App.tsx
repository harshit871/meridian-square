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
    },
  },
});

export const App = () => {
  const [kycStatus, setKycStatus] = useState<KYCStatus>('pending');
  const [apiMode, setApiMode] = useState<ApiSimulationMode>('normal');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedProperty = selectedId
    ? mockProperties.find((p) => p.id === selectedId) ?? null
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
          <PropertyListingPage apiMode={apiMode} onViewProperty={setSelectedId} />
        </main>

        {selectedProperty && (
          <div
            className="modal fade show d-block"
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="property-modal-title"
            style={{ backgroundColor: 'var(--cs-modal-backdrop)' }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content shadow border-0">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold" id="property-modal-title">
                    {selectedProperty.name}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setSelectedId(null)}
                  />
                </div>
                <div className="modal-body p-4">
                  <div className="mb-3 d-flex justify-content-between align-items-center">
                    <span className="text-muted">
                      <i className="bi bi-geo-alt-fill text-primary me-1" aria-hidden="true" />
                      {selectedProperty.location}
                    </span>
                    <span className="badge text-bg-success">
                      {selectedProperty.yieldPercent}% APY
                    </span>
                  </div>

                  <ul className="list-group list-group-flush border-top border-bottom mb-3">
                    <li className="list-group-item d-flex justify-content-between px-0">
                      <span className="text-muted">Price per token</span>
                      <span className="fw-bold">${selectedProperty.pricePerToken}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between px-0">
                      <span className="text-muted">Total supply</span>
                      <span className="fw-bold">{selectedProperty.totalSupply.toLocaleString()}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between px-0">
                      <span className="text-muted">Available tokens</span>
                      <span className="fw-bold text-primary">
                        {selectedProperty.availableTokens.toLocaleString()}
                      </span>
                    </li>
                  </ul>

                  {kycStatus !== 'approved' ? (
                    <div className="alert alert-warning small mb-0 d-flex align-items-center gap-2">
                      <i className="bi bi-shield-exclamation fs-5" aria-hidden="true" />
                      Complete KYC verification to participate in token purchasing. Current status: {kycStatus}.
                    </div>
                  ) : (
                    <button type="button" className="btn btn-primary w-100 fw-semibold">
                      Proceed to Token Order
                    </button>
                  )}
                </div>
                <div className="modal-footer bg-light">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setSelectedId(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <footer className="bg-white border-top py-3 text-center text-muted small">
          <div className="container">
            CubeSquare &bull; Real-World Asset Tokenization &bull; Dubai &amp; New York
          </div>
        </footer>
      </div>
    </QueryClientProvider>
  );
};

export default App;
