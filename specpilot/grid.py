from __future__ import annotations
from typing import List
from specpilot.rover import Rover


class Grid:
    def __init__(self, width: int, height: int, obstacles: List[tuple[int, int]] = None):
        self.width = width
        self.height = height
        self.rovers: List[Rover] = []
        self.obstacles = obstacles or []

    def add_rover(self, rover: Rover):
        self.rovers.append(rover)
