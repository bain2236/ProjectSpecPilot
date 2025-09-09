import { render } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { ThreeCanvas } from './ThreeCanvas';
import { type Planet } from './PlanetSelector';
import { fireEvent } from '@testing-library/react';

// Mock Three.js
const mockSet = vi.fn();
vi.mock('three', async () => {
    const THREE = await vi.importActual('three');
    return {
        ...THREE,
        WebGLRenderer: vi.fn().mockReturnValue({
            domElement: document.createElement('canvas'),
            setSize: vi.fn(),
            render: vi.fn(),
            dispose: vi.fn(),
        }),
        PerspectiveCamera: vi.fn().mockImplementation(() => ({
            aspect: 1,
            zoom: 1,
            updateProjectionMatrix: vi.fn(),
            position: { set: vi.fn(), copy: vi.fn() },
            lookAt: vi.fn(),
        })),
        Scene: vi.fn().mockImplementation(() => ({
            add: vi.fn(),
            remove: vi.fn(),
        })),
        Mesh: vi.fn().mockImplementation(() => ({
            scale: {
                set: mockSet,
            },
            position: { copy: vi.fn() },
            lookAt: vi.fn(),
            quaternion: { setFromUnitVectors: vi.fn(), multiplyQuaternions: vi.fn() },
            geometry: { dispose: vi.fn() },
            material: { dispose: vi.fn() },
        })),
    };
});

describe('ThreeCanvas', () => {
    test('should render without crashing', () => {
        // Arrange
        const mockPlanet: Planet & { gridSize: { x: number; y: number }, scale: string } = {
            name: 'Mars',
            color: '#FF5733',
            radius: 0.53,
            gridSize: { x: 53, y: 53 },
            scale: '1 square = 68km'
        };
        const onObstacleCountChange = vi.fn();
        const onZoomChange = vi.fn();

        // Act & Assert
        expect(() => render(
            <ThreeCanvas 
                selectedPlanet={mockPlanet}
                onObstacleCountChange={onObstacleCountChange}
                onZoomChange={onZoomChange}
            />
        )).not.toThrow();
    });

    test('should create a rover with a visible scale', () => {
        // Arrange
        const mockPlanet = { name: 'Earth', radius: 1.0, color: '#0000ff', gridSize: { x: 100, y: 100 }, scale: '1' };
        
        // Act
        render(
            <ThreeCanvas 
                selectedPlanet={mockPlanet}
                onObstacleCountChange={vi.fn()}
                onZoomChange={vi.fn()}
            />
        );
        
        // Assert
        // The scale should be a simple, reasonably large number, not a tiny fraction.
        expect(mockSet).toHaveBeenCalledWith(expect.any(Number), expect.any(Number), expect.any(Number));
        const scaleArg = mockSet.mock.calls[0][0];
        expect(scaleArg).toBeGreaterThan(0.5); 
    });

    test('should smoothly update camera zoom on wheel event', () => {
        // Arrange
        const onZoomChange = vi.fn();
        const mockPlanet = { name: 'Earth', radius: 1.0, color: '#0000ff', gridSize: { x: 100, y: 100 }, scale: '1' };
        vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
            cb(0);
            return 0;
        });

        const { container } = render(
            <ThreeCanvas
                selectedPlanet={mockPlanet}
                onObstacleCountChange={vi.fn()}
                onZoomChange={onZoomChange}
            />
        );

        // Act
        const canvasContainer = container.firstChild;
        if (!canvasContainer) throw new Error("Canvas container not found");
        fireEvent.wheel(canvasContainer, { deltaY: -100 }); // Zoom in

        // Assert
        // After one animation frame, the zoom should have moved towards the target, but not reached it yet.
        const initialZoom = 1.0;
        const targetZoom = 1 + (100 * 0.005);
        expect(onZoomChange).toHaveBeenCalled();
        const lastZoomCall = onZoomChange.mock.calls[onZoomChange.mock.calls.length - 1][0];
        expect(lastZoomCall).toBeGreaterThan(initialZoom);
        expect(lastZoomCall).toBeLessThan(targetZoom);

        window.requestAnimationFrame.mockRestore();
    });
});
