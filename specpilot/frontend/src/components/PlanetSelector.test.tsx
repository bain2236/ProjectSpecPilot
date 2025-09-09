import { render, screen, fireEvent } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { PlanetSelector, type Planet } from './PlanetSelector';
import { describe, it, expect, vi } from 'vitest';

const mockPlanets: Planet[] = [
    { name: 'Mercury', color: '#A9A9A9', radius: 0.38 },
    { name: 'Venus', color: '#FFA500', radius: 0.95 },
    { name: 'Earth', color: '#4682B4', radius: 1.0 },
    { name: 'Mars', color: '#FF5733', radius: 0.53 },
];

describe('PlanetSelector', () => {
    it('should render a button for each planet', () => {
        // Arrange
        render(
            <MantineProvider>
                <PlanetSelector planets={mockPlanets} onPlanetSelect={() => {}} />
            </MantineProvider>
        );

        // Act & Assert
        mockPlanets.forEach(planet => {
            expect(screen.getByRole('button', { name: planet.name })).toBeInTheDocument();
        });
    });

    it('should call onPlanetSelect with the correct planet when a button is clicked', () => {
        // Arrange
        const onPlanetSelectMock = vi.fn();
        render(
            <MantineProvider>
                <PlanetSelector planets={mockPlanets} onPlanetSelect={onPlanetSelectMock} />
            </MantineProvider>
        );
        const marsButton = screen.getByRole('button', { name: 'Mars' });

        // Act
        fireEvent.click(marsButton);

        // Assert
        expect(onPlanetSelectMock).toHaveBeenCalledWith(mockPlanets[3]);
    });
});
