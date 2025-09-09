from __future__ import annotations
from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from specpilot.grid import Grid
    from specpilot.rover import Rover

class RoverController:
    def __init__(self, grid: Grid):
        self.grid = grid

    def process_commands_for_rover(self, rover: Rover, commands: str):
        for command in commands:
            if command in ('r', 'l'):
                self._turn(rover, command)
            elif command in ('f', 'b'):
                self._move(rover, command)

    def _turn(self, rover: Rover, command: str):
        if command == 'r':
            rover.direction = rover._RIGHT_TURNS[rover.direction]
        elif command == 'l':
            rover.direction = rover._LEFT_TURNS[rover.direction]
    
    def _move(self, rover: Rover, command: str):
        dx, dy = rover._MOVEMENT_VECTORS[rover.direction]
        
        next_x, next_y = 0, 0

        if command == 'f':
            next_x = (rover.x + dx) % self.grid.width
            next_y = (rover.y + dy) % self.grid.height
        elif command == 'b':
            next_x = (rover.x - dx) % self.grid.width
            next_y = (rover.y - dy) % self.grid.height

        if (next_x, next_y) not in self.grid.obstacles:
            rover.x = next_x
            rover.y = next_y
