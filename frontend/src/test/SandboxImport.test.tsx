import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React, { Suspense } from 'react';

// Mock dynamic import
const MockDashboard = React.lazy(() => {
  return Promise.resolve({ default: () => <div data-testid="sandbox-dashboard">Sandbox UI</div> });
});

describe('Sandbox Dynamic Import', () => {
  it('should load the sandbox component dynamically', async () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <MockDashboard />
      </Suspense>
    );

    expect(screen.getByText('Loading...')).toBeDefined();

    await waitFor(() => {
      expect(screen.getByTestId('sandbox-dashboard')).toBeDefined();
      expect(screen.getByText('Sandbox UI')).toBeDefined();
    });
  });
});
