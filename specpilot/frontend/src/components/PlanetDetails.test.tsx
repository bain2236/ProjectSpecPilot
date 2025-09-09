import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { describe, test, expect } from 'vitest';
import PlanetDetails from './PlanetDetails';
import { type Planet } from './PlanetSelector';

describe('PlanetDetails', () => {
    test('should render planet details correctly', () => {
        // Arrange
        const mockPlanet: Planet & { gridSize: { x: number; y: number }, scale: string, obstacleCount: number } = {
            name: 'Mars',
            color: '#FF5733',
            radius: 0.53,
            gridSize: { x: 53, y: 53 },
            scale: '1 square = 50km',
            obstacleCount: 28,
        };

        render(
            <MantineProvider>
                <PlanetDetails planet={mockPlanet} />
            </MantineProvider>
        );

        // Assert
        expect(screen.getByText(`Name: Mars`)).toBeInTheDocument();
        expect(screen.getByText(`Grid: 53 x 53`)).toBeInTheDocument();
        expect(screen.getByText(`Scale: 1 square = 50km`)).toBeInTheDocument();
        expect(screen.getByText(`Obstacles: 28`)).toBeInTheDocument();
    });
});
