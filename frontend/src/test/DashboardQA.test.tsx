import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import { Dashboard } from '../components/Dashboard';

describe('Dashboard QA Tests', () => {
  it('should render the dashboard widgets', () => {
    render(<Dashboard />);
    expect(screen.getByText('Analytics')).toBeDefined();
    expect(screen.getByText('Total Users')).toBeDefined();
    expect(screen.getByText('Revenue')).toBeDefined();
    expect(screen.getByPlaceholderText('Dashboard Name')).toBeDefined();
  });
});
