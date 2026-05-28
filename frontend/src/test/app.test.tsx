import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App Component', () => {
  it('renders without crashing and contains main layout', () => {
    render(<App />);
    expect(screen.getByText('Sandbox')).toBeDefined();
    expect(screen.getByText('Enter Sandbox')).toBeDefined();
  });
});
