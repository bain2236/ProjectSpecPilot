import { Paper, Text } from '@mantine/core';

interface RoverStats {
    x: number;
    y: number;
    direction: string;
}

interface StatReadoutProps {
    stats: RoverStats;
}

const StatReadout = ({ stats }: StatReadoutProps) => {
    return (
        <Paper withBorder p="md" shadow="sm">
            <Text>X: {stats.x}</Text>
            <Text>Y: {stats.y}</Text>
            <Text>Direction: {stats.direction}</Text>
        </Paper>
    );
};

export default StatReadout;
