import { useState } from 'react';
import { AppShell, MantineProvider, Title, Divider } from '@mantine/core';
import { ThreeCanvas } from './components/ThreeCanvas';
import StatReadout from './components/StatReadout';
import ControlPanel from './components/ControlPanel';
import { PlanetSelector, type Planet } from './components/PlanetSelector';
import PlanetDetails from './components/PlanetDetails';
import './App.css';

const solarSystem: (Planet & { gridSize: { x: number; y: number }, scale: string })[] = [
    { name: 'Mercury', color: '#A9A9A9', radius: 0.38, gridSize: { x: 38, y: 38 }, scale: '1 square = 64km' },
    { name: 'Venus', color: '#FFA500', radius: 0.95, gridSize: { x: 95, y: 95 }, scale: '1 square = 127km' },
    { name: 'Earth', color: '#4682B4', radius: 1.0, gridSize: { x: 100, y: 100 }, scale: '1 square = 127km' },
    { name: 'Mars', color: '#FF5733', radius: 0.53, gridSize: { x: 53, y: 53 }, scale: '1 square = 68km' },
];

function App() {
  const [roverStats, setRoverStats] = useState({ x: 0, y: 0, direction: 'N' });
  const [selectedPlanet, setSelectedPlanet] = useState<Planet>(solarSystem[3]); // Default to Mars

  const handleCommand = (command: string) => {
    console.log('Command received:', command);
    // TODO: Send command to backend and update roverStats
  };

  const handlePlanetSelect = (planet: Planet) => {
    setSelectedPlanet(planet);
    console.log('Selected Planet:', planet.name);
  };

  return (
    <MantineProvider defaultColorScheme="dark">
      <AppShell
        padding="md"
        navbar={{ width: 300, breakpoint: 'sm' }}
        header={{ height: 60 }}
        style={{ height: '100vh' }}
      >
        <AppShell.Header p="xs">
          <Title order={3}>Mars Rover Control</Title>
        </AppShell.Header>

        <AppShell.Navbar p="xs">
          <StatReadout stats={roverStats} />
          <Divider my="sm" />
          <Title order={5}>Movement</Title>
          <ControlPanel onCommand={handleCommand} />
          <Divider my="sm" />
          <Title order={5}>Planet Selection</Title>
          <PlanetSelector planets={solarSystem} onPlanetSelect={handlePlanetSelect} />
          <PlanetDetails planet={selectedPlanet} />
        </AppShell.Navbar>

        <AppShell.Main style={{ height: 'calc(100vh - 60px)', padding: 0 }}>
          <ThreeCanvas selectedPlanet={selectedPlanet} />
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}

export default App;
