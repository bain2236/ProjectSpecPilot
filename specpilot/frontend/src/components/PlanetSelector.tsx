import { Button, SimpleGrid } from '@mantine/core';

export interface Planet {
    name: string;
    color: string;
    radius: number;
}

interface PlanetSelectorProps {
    planets: Planet[];
    onPlanetSelect: (planet: Planet) => void;
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
