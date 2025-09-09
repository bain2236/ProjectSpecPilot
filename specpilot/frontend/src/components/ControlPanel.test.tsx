import { render, screen, fireEvent } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import ControlPanel from './ControlPanel';
import { describe, it, expect, vi } from 'vitest';

describe('ControlPanel', () => {
    test.each([
        ['f', 'Arrow Up'],
        ['b', 'Arrow Down'],
        ['l', 'Arrow Left'],
        ['r', 'Arrow Right'],
    ])('should call onCommand with "%s" when the %s button is clicked', (command, iconName) => {
        // Arrange
        const onCommand = vi.fn();
        render(
            <MantineProvider>
                <ControlPanel onCommand={onCommand} />
            </MantineProvider>
        );

        // The icon name is used as the accessible name for ActionIcon
        const button = screen.getByRole('button', { name: new RegExp(iconName, 'i') });

        // Act
        fireEvent.click(button);

        // Assert
        expect(onCommand).toHaveBeenCalledWith(command);
    });
});
