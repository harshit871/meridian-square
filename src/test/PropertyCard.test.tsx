import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PropertyCard } from '../components/PropertyCard';

describe('PropertyCard Component', () => {
  const baseProps = {
    id: '1',
    name: 'Marina Tower Unit 4B',
    location: 'Dubai Marina',
    pricePerToken: 500,
    totalSupply: 1000,
    availableTokens: 180, // 18.0% (< 20%)
    yieldPercent: 7.2,
    onViewProperty: vi.fn(),
  };

  it('renders all required fields correctly', () => {
    render(<PropertyCard {...baseProps} />);

    expect(screen.getByText('Marina Tower Unit 4B')).toBeInTheDocument();
    expect(screen.getByText('Dubai Marina')).toBeInTheDocument();
    expect(screen.getByText('$500')).toBeInTheDocument();
    expect(screen.getByText('1,000')).toBeInTheDocument();
    expect(screen.getByText('180 / 1,000')).toBeInTheDocument();
    expect(screen.getByText('7.2% Yield')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /view property/i })).toBeInTheDocument();
  });

  it('displays visual urgency indicator when available tokens are below 20%', () => {
    // 180 / 1000 = 18% (< 20%)
    render(<PropertyCard {...baseProps} />);

    const indicator = screen.getByTestId('low-availability-indicator');
    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveTextContent(/under 20% left \(18.0%\)/i);
    expect(indicator).toHaveClass('badge', 'text-bg-danger');
  });

  it('does NOT display visual urgency indicator when available tokens are >= 20%', () => {
    // 498 / 500 = 99.6% (>= 20%)
    render(
      <PropertyCard
        {...baseProps}
        id="2"
        name="Downtown Loft 12A"
        location="Downtown Dubai"
        pricePerToken={750}
        totalSupply={500}
        availableTokens={498}
        yieldPercent={6.1}
      />
    );

    expect(screen.queryByTestId('low-availability-indicator')).not.toBeInTheDocument();
    expect(screen.getByText('100% available')).toBeInTheDocument();
  });

  it('triggers visual indicator for JVC Studio Block C (12 / 2000 = 0.6%)', () => {
    render(
      <PropertyCard
        {...baseProps}
        id="3"
        name="JVC Studio Block C"
        location="Jumeirah Village Circle"
        pricePerToken={250}
        totalSupply={2000}
        availableTokens={12}
        yieldPercent={8.4}
      />
    );

    const indicator = screen.getByTestId('low-availability-indicator');
    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveTextContent(/under 20% left \(0.6%\)/i);
  });

  it('calls onViewProperty when the action button is clicked', () => {
    const handleView = vi.fn();
    render(<PropertyCard {...baseProps} onViewProperty={handleView} />);

    const button = screen.getByRole('button', { name: /view property/i });
    fireEvent.click(button);

    expect(handleView).toHaveBeenCalledTimes(1);
    expect(handleView).toHaveBeenCalledWith('1');
  });
});
