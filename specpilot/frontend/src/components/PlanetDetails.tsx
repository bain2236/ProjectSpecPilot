import { Paper, Text } from '@mantine/core';
import { type Planet } from './PlanetSelector';

// Extend the Planet type to include the new properties
interface PlanetDetailsProps {
    planet: Planet & { gridSize: { x: number; y: number }, scale: string };
}

const PlanetDetails = ({ planet }: PlanetDetailsProps) => {
    return (
        <Paper withBorder p="md" shadow="sm">
            <Text>Name: {planet.name}</Text>
            <Text>Grid: {planet.gridSize.x} x {planet.gridSize.y}</Text>
            <Text>Scale: {planet.scale}</Text>
        </Paper>
    );
};

export default PlanetDetails;
