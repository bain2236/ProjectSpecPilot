import { ActionIcon, Center, SimpleGrid } from '@mantine/core';
import { IconArrowUp, IconArrowDown, IconArrowLeft, IconArrowRight } from '@tabler/icons-react';

interface ControlPanelProps {
    onCommand: (command: string) => void;
}

const ControlPanel = ({ onCommand }: ControlPanelProps) => {
    return (
        <Center>
            <SimpleGrid cols={3} spacing="xs" style={{ width: 150 }}>
                <div />
                <ActionIcon size="xl" variant="outline" onClick={() => onCommand('f')} aria-label="Arrow Up">
                    <IconArrowUp />
                </ActionIcon>
                <div />
                <ActionIcon size="xl" variant="outline" onClick={() => onCommand('l')} aria-label="Arrow Left">
                    <IconArrowLeft />
                </ActionIcon>
                <div />
                <ActionIcon size="xl" variant="outline" onClick={() => onCommand('r')} aria-label="Arrow Right">
                    <IconArrowRight />
                </ActionIcon>
                <div />
                <ActionIcon size="xl" variant="outline" onClick={() => onCommand('b')} aria-label="Arrow Down">
                    <IconArrowDown />
                </ActionIcon>
                <div />
            </SimpleGrid>
        </Center>
    );
};

export default ControlPanel;
