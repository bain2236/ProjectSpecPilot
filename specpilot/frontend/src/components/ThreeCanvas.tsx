import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { type Planet } from './PlanetSelector'; // Import the Planet type
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';

interface ThreeCanvasProps {
    selectedPlanet: Planet;
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

export const ThreeCanvas = ({ selectedPlanet }: ThreeCanvasProps) => {
    const containerRef = useRef<HTMLDivElement>(null!);
    const sceneRef = useRef(new THREE.Scene());
    const sphereRef = useRef<THREE.Mesh | null>(null);
    const gridGroupRef = useRef<THREE.Group | null>(null);
    const gridMaterialRef = useRef<LineMaterial | null>(null);

    useEffect(() => {
        if (!sphereRef.current || !gridGroupRef.current || !gridMaterialRef.current) return;

        // Update sphere color
        (sphereRef.current.material as THREE.MeshStandardMaterial).color.set(selectedPlanet.color);

        // Update sphere and grid size
        const radius = selectedPlanet.radius;
        sphereRef.current.scale.set(radius, radius, radius);
        gridGroupRef.current.scale.set(radius, radius, radius);
        
        // Update line width based on planet radius for better visibility
        gridMaterialRef.current.linewidth = 2 + selectedPlanet.radius * 2;

    }, [selectedPlanet]);


    useEffect(() => {
        const scene = sceneRef.current;
        scene.background = new THREE.Color(0x1a1b1e);
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });

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
        scene.add(sphere);

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
        scene.add(gridGroup);
        
        if (containerRef.current) {
            const { width, height } = containerRef.current.getBoundingClientRect();
            lineMaterial.resolution.set(width, height);
        }

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0xffffff, 0.8);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        camera.position.z = 3;

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
        };
    }, []); // Initial setup runs only once

    return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};
