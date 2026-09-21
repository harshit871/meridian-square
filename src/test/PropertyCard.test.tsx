import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PropertyCard } from '../components/PropertyCard';
import { Property } from '../types/property';

const marina: Property = {
  id: '1',
  name: 'Marina Tower Unit 4B',
  location: 'Dubai Marina',
  pricePerToken: 500,
  totalSupply: 1000,
  availableTokens: 180, // 18% — below 20% threshold
  yieldPercent: 7.2,
};

const downtown: Property = {
  id: '2',
  name: 'Downtown Loft 12A',
  location: 'Downtown Dubai',
  pricePerToken: 750,
  totalSupply: 500,
  availableTokens: 498, // 99.6% — well above threshold
  yieldPercent: 6.1,
};

const jvc: Property = {
  id: '3',
  name: 'JVC Studio Block C',
  location: 'Jumeirah Village Circle',
  pricePerToken: 250,
  totalSupply: 2000,
  availableTokens: 12, // 0.6% — far below threshold
  yieldPercent: 8.4,
};

describe('PropertyCard', () => {
  it('renders all required fields', () => {
    render(<PropertyCard property={marina} />);

    expect(screen.getByText('Marina Tower Unit 4B')).toBeInTheDocument();
    expect(screen.getByText('Dubai Marina')).toBeInTheDocument();
    expect(screen.getByText('$500')).toBeInTheDocument();
    expect(screen.getByText('1,000')).toBeInTheDocument();
    expect(screen.getByText('180 / 1,000')).toBeInTheDocument();
    expect(screen.getByText('7.2% Yield')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /view property/i })).toBeInTheDocument();
  });

  it('shows urgency badge when available tokens < 20%', () => {
    // 180 / 1000 = 18%
    render(<PropertyCard property={marina} />);

    const indicator = screen.getByTestId('low-availability-indicator');
    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveTextContent(/under 20% left \(18.0%\)/i);
    expect(indicator).toHaveClass('badge', 'text-bg-danger');
  });

  it('does not show urgency badge when available tokens >= 20%', () => {
    // 498 / 500 = 99.6%
    render(<PropertyCard property={downtown} />);

    expect(screen.queryByTestId('low-availability-indicator')).not.toBeInTheDocument();
    expect(screen.getByText('100% available')).toBeInTheDocument();
  });

  it('shows urgency badge for JVC Studio (12 / 2000 = 0.6%)', () => {
    render(<PropertyCard property={jvc} />);

    const indicator = screen.getByTestId('low-availability-indicator');
    expect(indicator).toHaveTextContent(/under 20% left \(0.6%\)/i);
  });

  it('calls onViewProperty with the property id when the button is clicked', () => {
    const handleView = vi.fn();
    render(<PropertyCard property={marina} onViewProperty={handleView} />);

    fireEvent.click(screen.getByRole('button', { name: /view property/i }));

    expect(handleView).toHaveBeenCalledOnce();
    expect(handleView).toHaveBeenCalledWith('1');
  });
});
