import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { type Planet } from './PlanetSelector'; // Import the Planet type
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';

interface RoverPosition {
    lat: number;
    lon: number;
}

interface ObstaclePosition {
    lat: number;
    lon: number;
}

interface ThreeCanvasProps {
    selectedPlanet: Planet;
    onObstacleCountChange: (count: number) => void;
    onZoomChange: (zoom: number) => void;
}

const createGridLines = (radius: number, segments: number) => {
    const group = new THREE.Group();
    const divisions = segments * 2;

    // Latitudinal lines
    for (let i = 1; i < segments; i++) {
        const phi = (i / segments) * Math.PI;
        const ringRadius = radius * Math.sin(phi);
        const y = radius * Math.cos(phi);
        
        const points = [];
        for (let j = 0; j <= divisions; j++) {
            const theta = (j / divisions) * 2 * Math.PI;
            points.push(
                ringRadius * Math.cos(theta),
                y,
                ringRadius * Math.sin(theta)
            );
        }
        
        const lineGeom = new LineGeometry();
        lineGeom.setPositions(points);
        const line = new Line2(lineGeom);
        group.add(line);
    }
    
    // Longitudinal lines
    const semiCirclePoints = [];
    for (let i = 0; i <= divisions; i++) {
        const phi = (i / divisions) * Math.PI; // from 0 to PI (pole to pole)
        semiCirclePoints.push(
            radius * Math.sin(phi),
            radius * Math.cos(phi),
            0
        );
    }
    
    for (let i = 0; i < segments; i++) {
        const theta = (i / segments) * 2 * Math.PI; // Full rotation
        
        const rotatedPoints = [];
        for (let k = 0; k < semiCirclePoints.length; k += 3) {
            const p = new THREE.Vector3(semiCirclePoints[k], semiCirclePoints[k+1], semiCirclePoints[k+2]);
            p.applyAxisAngle(new THREE.Vector3(0, 1, 0), theta);
            rotatedPoints.push(p.x, p.y, p.z);
        }
        
        const lineGeom = new LineGeometry();
        lineGeom.setPositions(rotatedPoints);
        const line = new Line2(lineGeom);
        group.add(line);
    }

    return group;
}

const getCellCenterOnSphere = (latIndex: number, lonIndex: number, radius: number, segments: number): THREE.Vector3 => {
    // Offset by 0.5 to get the center of the grid cell
    const phi = ((latIndex + 0.5) / segments) * Math.PI;
    const theta = ((lonIndex + 0.5) / segments) * 2 * Math.PI;

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);

    return new THREE.Vector3(x, y, z);
}

export const ThreeCanvas = ({ selectedPlanet, onObstacleCountChange, onZoomChange }: ThreeCanvasProps) => {
    const containerRef = useRef<HTMLDivElement>(null!);
    const sceneRef = useRef(new THREE.Scene());
    const sphereRef = useRef<THREE.Mesh | null>(null);
    const gridGroupRef = useRef<THREE.Group | null>(null);
    const gridMaterialRef = useRef<LineMaterial | null>(null);
    const roverRef = useRef<THREE.Mesh | null>(null);
    const obstaclesRef = useRef<THREE.Group | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const planetGroupRef = useRef<THREE.Group | null>(null);

    const [roverPosition, setRoverPosition] = useState<RoverPosition | null>(null);
    const [obstaclePositions, setObstaclePositions] = useState<ObstaclePosition[]>([]);
    
    // Recalculate positions when planet changes
    useEffect(() => {
        const segments = 16;
        const roverStartLat = Math.floor(segments / 2);
        const roverStartLon = Math.floor(segments / 2);
        
        setRoverPosition({ lat: roverStartLat, lon: roverStartLon });

        const numObstacles = Math.floor(segments * segments * 0.1); // 10% of grid cells
        
        const possiblePositions = new Set<string>();
        for (let i = 0; i < segments; i++) {
            for (let j = 0; j < segments; j++) {
                possiblePositions.add(`${i},${j}`);
            }
        }
        
        // Remove rover's starting position from possible obstacle locations
        possiblePositions.delete(`${roverStartLat},${roverStartLon}`);
        
        const newObstacles: ObstaclePosition[] = [];
        for (let i = 0; i < numObstacles; i++) {
            const posArray = Array.from(possiblePositions);
            const randomIndex = Math.floor(Math.random() * posArray.length);
            const [lat, lon] = posArray[randomIndex].split(',').map(Number);
            newObstacles.push({ lat, lon });
            possiblePositions.delete(posArray[randomIndex]);
        }
        setObstaclePositions(newObstacles);
        onObstacleCountChange(newObstacles.length);

    }, [selectedPlanet, onObstacleCountChange]);

    // Update Planet Objects
    useEffect(() => {
        if (!sphereRef.current || !gridGroupRef.current || !gridMaterialRef.current || !obstaclesRef.current || !planetGroupRef.current) return;

        // Update sphere color
        (sphereRef.current.material as THREE.MeshStandardMaterial).color.set(selectedPlanet.color);

        // Update sphere and grid size
        const radius = selectedPlanet.radius;
        planetGroupRef.current.scale.set(radius, radius, radius);
        
        // Update line width based on planet radius for better visibility
        gridMaterialRef.current.linewidth = 2 + selectedPlanet.radius * 2;

    }, [selectedPlanet]);

    // Update Rover Mesh & Camera
    useEffect(() => {
        const scene = sceneRef.current;
        const camera = cameraRef.current;
        if (!roverPosition || !scene || !sphereRef.current || !camera) return;

        // Clean up previous rover
        if (roverRef.current) {
            scene.remove(roverRef.current);
            roverRef.current.geometry.dispose();
            (roverRef.current.material as THREE.Material).dispose();
        }

        // Create a custom triangle geometry
        const roverGeometry = new THREE.BufferGeometry();
        const points = [
            new THREE.Vector3(0, 0.5, 0),    // Top point (larger base size)
            new THREE.Vector3(-0.25, 0, 0), // Bottom-left
            new THREE.Vector3(0.25, 0, 0),  // Bottom-right
        ];
        roverGeometry.setFromPoints(points);
        roverGeometry.computeVertexNormals();
        
        const roverMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
        const rover = new THREE.Mesh(roverGeometry, roverMaterial);

        const position = getCellCenterOnSphere(roverPosition.lat, roverPosition.lon, 1.01, 16);
        rover.position.copy(position);
        
        // --- Correct Orientation Logic ---
        // 1. Align the cone's default up-axis (Y) with the sphere's surface normal
        const surfaceNormal = position.clone().normalize();
        const up = new THREE.Vector3(0, 1, 0);
        rover.quaternion.setFromUnitVectors(up, surfaceNormal);

        // 2. Apply a heading rotation to point "North"
        const headingQuaternion = new THREE.Quaternion();
        // The angle is calculated to make the rover's "front" point up on the screen initially
        const angle = Math.atan2(camera.position.x - rover.position.x, camera.position.z - rover.position.z);
        headingQuaternion.setFromAxisAngle(surfaceNormal, angle);
        rover.quaternion.multiplyQuaternions(headingQuaternion, rover.quaternion);
        
        // Scale rover to a fixed, visible size
        const scale = 1.0;
        rover.scale.set(scale, scale, scale);

        console.log('Rover created at position:', position);
        console.log('Rover scale:', scale);

        roverRef.current = rover;
        scene.add(rover);

        // Update camera to look at the rover
        const cameraPosition = position.clone().normalize().multiplyScalar(3);
        camera.position.copy(cameraPosition);
        camera.lookAt(position);
        console.log('Camera positioned at:', cameraPosition, 'looking at:', position);

    }, [roverPosition, selectedPlanet.radius]); // Rerun when radius changes to rescale

    // Update Obstacle Meshes
    useEffect(() => {
        const scene = sceneRef.current;
        const group = obstaclesRef.current;
        if (!obstaclePositions.length || !scene || !group) return;

        // Clear old obstacles
        while (group.children.length) {
            const child = group.children[0];
            group.remove(child);
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose();
                (child.material as THREE.Material).dispose();
            }
        }
        
        obstaclePositions.forEach(pos => {
            const obstacleGeometry = new THREE.BoxGeometry(1, 1, 1);
            const obstacleMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
            const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);

            const position = getCellCenterOnSphere(pos.lat, pos.lon, 1.01, 16);
            obstacle.position.copy(position);
            obstacle.lookAt(new THREE.Vector3(0,0,0)); // Orient to sphere center
            
            // Scale obstacles with planet
            const scale = selectedPlanet.radius * 0.05;
            obstacle.scale.set(scale, scale, scale);

            group.add(obstacle);
        });

    }, [obstaclePositions, selectedPlanet.radius]); // Rerun when radius changes to rescale

    // Handle Wheel/Zoom Events
    useEffect(() => {
        const handleWheel = (event: WheelEvent) => {
            if (!cameraRef.current) return;
            const camera = cameraRef.current;
            
            const minZoom = 0.5 / selectedPlanet.radius;
            const maxZoom = 5 / selectedPlanet.radius;
            
            const newZoom = camera.zoom - event.deltaY * 0.005;
            camera.zoom = Math.max(minZoom, Math.min(newZoom, maxZoom));
            camera.updateProjectionMatrix();
            onZoomChange(camera.zoom);
        };

        const currentRef = containerRef.current;
        if (currentRef) {
            currentRef.addEventListener('wheel', handleWheel);
        }

        return () => {
            if (currentRef) {
                currentRef.removeEventListener('wheel', handleWheel);
            }
        };
    }, [selectedPlanet.radius, onZoomChange]); // Re-attach listener when planet changes


    useEffect(() => {
        const scene = sceneRef.current;
        scene.background = new THREE.Color(0x1a1b1e);
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        cameraRef.current = camera;
        const renderer = new THREE.WebGLRenderer({ antialias: true });

        // Create a group to hold all planet-related objects
        const planetGroup = new THREE.Group();
        planetGroupRef.current = planetGroup;
        scene.add(planetGroup);

        const handleResize = () => {
            if (containerRef.current) {
                const { width, height } = containerRef.current.getBoundingClientRect();
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
                renderer.setSize(width, height);
                if (gridMaterialRef.current) {
                    gridMaterialRef.current.resolution.set(width, height);
                }
            }
        };

        if (containerRef.current) {
            containerRef.current.appendChild(renderer.domElement);
            handleResize();
        }

        const geometry = new THREE.SphereGeometry(1, 32, 32);
        const material = new THREE.MeshStandardMaterial({ color: selectedPlanet.color });
        const sphere = new THREE.Mesh(geometry, material);
        sphereRef.current = sphere; // Store sphere in ref
        planetGroup.add(sphere);

        // Add Obstacles Group
        obstaclesRef.current = new THREE.Group();
        planetGroup.add(obstaclesRef.current);

        // Add wireframe grid
        const lineMaterial = new LineMaterial({
            color: 0xffffff,
            linewidth: 2 + selectedPlanet.radius * 2, // Initial width
            transparent: true,
            opacity: 0.4,
        });
        gridMaterialRef.current = lineMaterial;

        const gridGroup = createGridLines(1.001, 16);
        gridGroup.children.forEach(line => {
            if (line instanceof Line2) {
                line.material = lineMaterial;
            }
        });
        gridGroupRef.current = gridGroup;
        planetGroup.add(gridGroup);
        
        if (containerRef.current) {
            const { width, height } = containerRef.current.getBoundingClientRect();
            lineMaterial.resolution.set(width, height);
        }

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0xffffff, 0.8);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };

        animate();

        window.addEventListener('resize', handleResize);

        const currentRef = containerRef.current;

        return () => {
            window.removeEventListener('resize', handleResize);
            if (currentRef && renderer.domElement) {
                currentRef.removeChild(renderer.domElement);
            }
            // Dispose of all created objects
            renderer.dispose();
            geometry.dispose();
            material.dispose();
            gridGroup.children.forEach(line => {
                if (line instanceof Line2) {
                    line.geometry.dispose();
                }
            });
            lineMaterial.dispose();
            // Also dispose rover and obstacles if they exist
            if (roverRef.current) {
                roverRef.current.geometry.dispose();
                (roverRef.current.material as THREE.Material).dispose();
            }
            if (obstaclesRef.current) {
                obstaclesRef.current.children.forEach(child => {
                    if (child instanceof THREE.Mesh) {
                        child.geometry.dispose();
                        (child.material as THREE.Material).dispose();
                    }
                });
            }
        };
    }, []); // Initial setup runs only once

    return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};
