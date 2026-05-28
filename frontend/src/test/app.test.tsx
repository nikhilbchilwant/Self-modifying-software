import { render, screen } from '@testing-library/react';
import App from '../App';
import { describe, it, expect } from 'vitest';

describe('App Component', () => {
  it('renders without crashing and contains main layout', () => {
    render(<App />);
    expect(screen.getByTestId('app-root')).not.toBeNull();
  });
});
