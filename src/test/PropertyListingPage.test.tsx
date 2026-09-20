import { describe, it, expect } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropertyListingPage } from '../components/PropertyListingPage';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

describe('PropertyListingPage Component', () => {
  it('renders loading skeletons initially, then renders properties in responsive grid', async () => {
    const queryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <PropertyListingPage apiMode="normal" />
      </QueryClientProvider>
    );

    // Initial loading skeletons
    expect(screen.getByTestId('loading-skeletons')).toBeInTheDocument();

    // Data resolves
    await waitFor(() => {
      expect(screen.getByTestId('properties-grid')).toBeInTheDocument();
    });

    expect(screen.getByText('Marina Tower Unit 4B')).toBeInTheDocument();
    expect(screen.getByText('Downtown Loft 12A')).toBeInTheDocument();
    expect(screen.getByText('JVC Studio Block C')).toBeInTheDocument();
  });

  it('filters properties by location select', async () => {
    const queryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <PropertyListingPage apiMode="normal" />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('properties-grid')).toBeInTheDocument();
    });

    const locationSelect = screen.getByLabelText(/filter by property location/i);
    fireEvent.change(locationSelect, { target: { value: 'Dubai Marina' } });

    expect(screen.getByText('Marina Tower Unit 4B')).toBeInTheDocument();
    expect(screen.queryByText('Downtown Loft 12A')).not.toBeInTheDocument();
    expect(screen.queryByText('JVC Studio Block C')).not.toBeInTheDocument();
  });

  it('filters properties by minimum yield percentage', async () => {
    const queryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <PropertyListingPage apiMode="normal" />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('properties-grid')).toBeInTheDocument();
    });

    // Enter min yield of 8.0 -> Only JVC Studio Block C (8.4%) qualifies
    const yieldInput = screen.getByLabelText(/filter by minimum yield percentage/i);
    fireEvent.change(yieldInput, { target: { value: '8.0' } });

    expect(screen.getByText('JVC Studio Block C')).toBeInTheDocument();
    expect(screen.queryByText('Marina Tower Unit 4B')).not.toBeInTheDocument();
    expect(screen.queryByText('Downtown Loft 12A')).not.toBeInTheDocument();
  });

  it('shows explicit empty state when filters match zero properties', async () => {
    const queryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <PropertyListingPage apiMode="normal" />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('properties-grid')).toBeInTheDocument();
    });

    const yieldInput = screen.getByLabelText(/filter by minimum yield percentage/i);
    fireEvent.change(yieldInput, { target: { value: '15.0' } });

    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.getByText(/no matching properties found/i)).toBeInTheDocument();

    // Click Reset Filters
    const resetButton = screen.getByRole('button', { name: /clear all filters/i });
    fireEvent.click(resetButton);

    expect(screen.getByText('Marina Tower Unit 4B')).toBeInTheDocument();
  });

  it('renders explicit error state when API fails with functional retry button', async () => {
    const queryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <PropertyListingPage apiMode="error" />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('error-state')).toBeInTheDocument();
    });

    expect(screen.getByText(/unable to load properties/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry loading properties/i })).toBeInTheDocument();
  });
});
