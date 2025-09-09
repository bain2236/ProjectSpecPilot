from specpilot.grid import Grid
from specpilot.rover import Rover
from specpilot.controller import RoverController


def test_grid_creation():
    # Arrange
    grid = Grid(width=10, height=10)

    # Assert
    assert grid.width == 10
    assert grid.height == 10


def test_grid_can_add_rover():
    # Arrange
    grid = Grid(width=10, height=10)
    rover = Rover(x=0, y=0, direction='N')

    # Act
    grid.add_rover(rover)

    # Assert
    assert rover in grid.rovers


def test_grid_can_be_created_with_obstacles():
    # Arrange
    obstacles = [(1, 1), (2, 3)]
    grid = Grid(width=10, height=10, obstacles=obstacles)

    # Assert
    assert grid.obstacles == obstacles
