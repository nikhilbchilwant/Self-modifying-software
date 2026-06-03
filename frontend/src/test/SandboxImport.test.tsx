import { render, screen } from '@testing-library/react';
import React, { Suspense, lazy } from 'react';
import { describe, it, expect, vi } from 'vitest';

// DynamicDashboardLoader mimics the dynamic import switching in App.tsx
const DynamicDashboardLoader = ({ isSandbox }: { isSandbox: boolean }) => {
  const LazyComponent = lazy(() => {
    if (isSandbox) {
      const sandboxPath = '../components/Dashboard.sandbox';
      return import(/* @vite-ignore */ sandboxPath).catch((err) => {
        console.error('Failed to load sandbox, falling back', err);
        return import('../components/Dashboard');
      });
    } else {
      return import('../components/Dashboard');
    }
  });

  return (
    <Suspense fallback={<div data-testid="loading">Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
};

// Mock components
vi.mock('../components/Dashboard', () => ({
  default: () => <div data-testid="production-view">Production Dashboard View</div>,
}));

vi.mock('../components/Dashboard.sandbox', () => ({
  default: () => <div data-testid="sandbox-view">Sandbox Dashboard View</div>,
}));

describe('Dynamic Import Component Switcher', () => {
  it('should load production Dashboard by default', async () => {
    render(<DynamicDashboardLoader isSandbox={false} />);
    
    expect(screen.getByTestId('loading')).toBeDefined();
    
    const view = await screen.findByTestId('production-view');
    expect(view).toBeDefined();
    expect(screen.queryByTestId('sandbox-view')).toBeNull();
  });

  it('should dynamically import sandbox Dashboard when in sandbox mode', async () => {
    render(<DynamicDashboardLoader isSandbox={true} />);
    
    expect(screen.getByTestId('loading')).toBeDefined();
    
    const view = await screen.findByTestId('sandbox-view');
    expect(view).toBeDefined();
    expect(screen.queryByTestId('production-view')).toBeNull();
  });

  it('should fall back to production Dashboard if sandbox fails to load', async () => {
    // Override sandbox mock to simulate a missing file or loading error
    vi.doMock('../components/Dashboard.sandbox', () => {
      throw new Error('Module loading failed');
    });

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<DynamicDashboardLoader isSandbox={true} />);
    
    const view = await screen.findByTestId('production-view');
    expect(view).toBeDefined();
    expect(consoleSpy).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });
});
