import { KYCStatus } from '../types/kyc';

export type ApiSimulationMode = 'normal' | 'slow' | 'error';

export interface HeaderProps {
  kycStatus: KYCStatus;
  onKycStatusChange: (status: KYCStatus) => void;
  apiMode: ApiSimulationMode;
  onApiModeChange: (mode: ApiSimulationMode) => void;
}

export const Header = ({
  kycStatus,
  onKycStatusChange,
  apiMode,
  onApiModeChange
}: HeaderProps) => {
  return (
    <header className="border-bottom bg-white sticky-top shadow-sm mb-4">
      <div className="container py-2 py-sm-3">
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2 gap-sm-3">
          <div className="d-flex align-items-center gap-2">
            {/* The 36×36 logo mark must stay as inline style: it's a fixed pixel
                dimension for a non-text icon container, not a design token. */}
            <div
              className="bg-primary text-white rounded p-2 d-flex align-items-center justify-content-center"
              style={{ width: 36, height: 36 }}
            >
              <i className="bi bi-buildings fs-5" aria-hidden="true"></i>
            </div>
            <div>
              <span className="h5 fw-bold text-dark mb-0 d-block">CubeSquare</span>
              <span className="small text-muted d-none d-md-inline">Real-World Asset Tokenization</span>
            </div>
            <span className="badge text-bg-primary-subtle text-primary border border-primary-subtle ms-2 d-none d-lg-inline">
              UAE &amp; US Regulated
            </span>
          </div>

          <div className="d-flex align-items-center gap-2 bg-light p-1 p-sm-2 rounded border w-100 w-sm-auto justify-content-between justify-content-sm-start">
            <span className="small text-muted fw-medium me-1 d-none d-md-inline">
              <i className="bi bi-sliders me-1" aria-hidden="true"></i>
              Demo Mode:
            </span>

            <div className="d-flex align-items-center gap-1">
              <label htmlFor="kyc-select" className="small text-muted mb-0">KYC:</label>
              <select
                id="kyc-select"
                className="form-select form-select-sm"
                value={kycStatus}
                onChange={(e) => onKycStatusChange(e.target.value as KYCStatus)}
                aria-label="Toggle KYC Status for demonstration"
              >
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
                <option value="approved">Approved</option>
              </select>
            </div>

            <div className="d-flex align-items-center gap-1">
              <label htmlFor="api-select" className="small text-muted mb-0">API:</label>
              <select
                id="api-select"
                className="form-select form-select-sm"
                value={apiMode}
                onChange={(e) => onApiModeChange(e.target.value as ApiSimulationMode)}
                aria-label="Toggle API state simulation"
              >
                <option value="normal">Normal</option>
                <option value="slow">Slow (2s)</option>
                <option value="error">Error (500)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
