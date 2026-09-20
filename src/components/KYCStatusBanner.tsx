import { KYCStatus } from '../types/kyc';

export interface KYCStatusBannerProps {
  status: KYCStatus;
}

export const KYCStatusBanner = ({ status }: KYCStatusBannerProps) => {
  if (status === 'approved') {
    return null;
  }

  if (status === 'pending') {
    return (
      <div
        className="alert alert-warning d-flex align-items-center shadow-sm mb-4"
        role="alert"
        data-testid="kyc-banner-pending"
      >
        <i className="bi bi-clock-history me-2 fs-5 flex-shrink-0" aria-hidden="true"></i>
        <div>Your identity verification is in progress. You can browse but cannot invest yet.</div>
      </div>
    );
  }

  if (status === 'rejected') {
    return (
      <div
        className="alert alert-danger d-flex align-items-center shadow-sm mb-4"
        role="alert"
        data-testid="kyc-banner-rejected"
      >
        <i className="bi bi-exclamation-octagon-fill me-2 fs-5 flex-shrink-0" aria-hidden="true"></i>
        <div>Your identity verification was unsuccessful. Please contact support.</div>
      </div>
    );
  }

  return null;
};
