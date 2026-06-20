import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChartLegend from '../components/ChartLegend';

describe('ChartLegend Component Tests', () => {
  it('renders matching legends with aria-labels successfully', () => {
    const items = [
      { label: 'Logged Mood', color: '#c2652a', value: '1-10' },
      { label: 'Stress Factor', color: '#8c3c3c' }
    ];

    render(<ChartLegend items={items} ariaLabel="Aria test legend" />);

    expect(screen.getByLabelText('Aria test legend')).toBeInTheDocument();
    expect(screen.getByText(/Logged Mood/)).toBeInTheDocument();
    expect(screen.getByText('(1-10)')).toBeInTheDocument();
    expect(screen.getByText(/Stress Factor/)).toBeInTheDocument();
  });
});
