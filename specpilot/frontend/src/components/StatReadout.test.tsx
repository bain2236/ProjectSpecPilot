import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import StatReadout from './StatReadout';
import { describe, it, expect } from 'vitest';

describe('StatReadout', () => {
    it('should render the rover stats correctly', () => {
        // Arrange
        const mockStats = { x: 5, y: 8, direction: 'N' };
        render(
            <MantineProvider>
                <StatReadout stats={mockStats} />
            </MantineProvider>
        );

        // Act & Assert
        expect(screen.getByText(/X:/i)).toHaveTextContent('X: 5');
        expect(screen.getByText(/Y:/i)).toHaveTextContent('Y: 8');
        expect(screen.getByText(/Direction:/i)).toHaveTextContent('Direction: N');
    });
});
