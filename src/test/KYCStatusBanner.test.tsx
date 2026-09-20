import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { KYCStatusBanner } from '../components/KYCStatusBanner';

describe('KYCStatusBanner Component', () => {
  it('renders amber warning banner when status is pending with exact required copy', () => {
    render(<KYCStatusBanner status="pending" />);

    const banner = screen.getByTestId('kyc-banner-pending');
    expect(banner).toBeInTheDocument();
    expect(banner).toHaveClass('alert', 'alert-warning');
    expect(banner).toHaveTextContent(
      'Your identity verification is in progress. You can browse but cannot invest yet.'
    );
  });

  it('renders red danger banner when status is rejected with exact required copy', () => {
    render(<KYCStatusBanner status="rejected" />);

    const banner = screen.getByTestId('kyc-banner-rejected');
    expect(banner).toBeInTheDocument();
    expect(banner).toHaveClass('alert', 'alert-danger');
    expect(banner).toHaveTextContent(
      'Your identity verification was unsuccessful. Please contact support.'
    );
  });

  it('renders nothing (null) when status is approved', () => {
    const { container } = render(<KYCStatusBanner status="approved" />);
    expect(container.firstChild).toBeNull();
  });
});
