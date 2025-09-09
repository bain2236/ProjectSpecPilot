import { Button, SimpleGrid } from '@mantine/core';

export interface Planet {
    name: string;
    color: string;
    radius: number;
}

type DetailedPlanet = Planet & { gridSize: { x: number; y: number }, scale: string };

interface PlanetSelectorProps {
    planets: DetailedPlanet[];
    onPlanetSelect: (planet: DetailedPlanet) => void;
}

export const PlanetSelector = ({ planets, onPlanetSelect }: PlanetSelectorProps) => {
    return (
        <SimpleGrid cols={2}>
            {planets.map((planet) => (
                <Button
                    key={planet.name}
                    onClick={() => onPlanetSelect(planet)}
                    variant="outline"
                >
                    {planet.name}
                </Button>
            ))}
        </SimpleGrid>
    );
};
