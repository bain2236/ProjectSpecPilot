import pytest
from specpilot.rover import Rover
from specpilot.grid import Grid
from specpilot.controller import RoverController


def test_rover_creation():
    # Arrange
    rover = Rover(x=1, y=2, direction='N')

    # Assert
    assert rover.x == 1
    assert rover.y == 2
    assert rover.direction == 'N'


@pytest.mark.parametrize("initial_direction, expected_direction", [
    ('N', 'E'), ('E', 'S'), ('S', 'W'), ('W', 'N'),
])
def test_controller_can_turn_rover_right(initial_direction, expected_direction):
    grid = Grid(width=10, height=10)
    rover = Rover(x=0, y=0, direction=initial_direction)
    grid.add_rover(rover)
    controller = RoverController(grid)

    controller.process_commands_for_rover(rover, 'r')

    assert rover.direction == expected_direction


@pytest.mark.parametrize("initial_direction, expected_direction", [
    ('N', 'W'), ('W', 'S'), ('S', 'E'), ('E', 'N'),
])
def test_controller_can_turn_rover_left(initial_direction, expected_direction):
    grid = Grid(width=10, height=10)
    rover = Rover(x=0, y=0, direction=initial_direction)
    grid.add_rover(rover)
    controller = RoverController(grid)

    controller.process_commands_for_rover(rover, 'l')

    assert rover.direction == expected_direction


@pytest.mark.parametrize("initial_direction, expected_x, expected_y", [
    ('N', 0, 1), ('E', 1, 0), ('S', 0, 9), ('W', 9, 0),
])
def test_controller_can_move_rover_forward(initial_direction, expected_x, expected_y):
    grid = Grid(width=10, height=10)
    rover = Rover(x=0, y=0, direction=initial_direction)
    grid.add_rover(rover)
    controller = RoverController(grid)

    controller.process_commands_for_rover(rover, 'f')

    assert rover.x == expected_x
    assert rover.y == expected_y


@pytest.mark.parametrize("initial_direction, expected_x, expected_y", [
    ('N', 0, 9), ('E', 9, 0), ('S', 0, 1), ('W', 1, 0),
])
def test_controller_can_move_rover_backward(initial_direction, expected_x, expected_y):
    grid = Grid(width=10, height=10)
    rover = Rover(x=0, y=0, direction=initial_direction)
    grid.add_rover(rover)
    controller = RoverController(grid)

    controller.process_commands_for_rover(rover, 'b')

    assert rover.x == expected_x
    assert rover.y == expected_y


def test_controller_wraps_rover_from_north_to_south():
    grid = Grid(width=10, height=10)
    rover = Rover(x=0, y=9, direction='N')
    grid.add_rover(rover)
    controller = RoverController(grid)

    controller.process_commands_for_rover(rover, 'f')

    assert rover.y == 0


def test_rover_stops_at_obstacle():
    # Arrange
    obstacles = [(0, 1)]
    grid = Grid(width=10, height=10, obstacles=obstacles)
    rover = Rover(x=0, y=0, direction='N')
    grid.add_rover(rover)
    controller = RoverController(grid)

    # Act
    controller.process_commands_for_rover(rover, 'f')

    # Assert
    assert rover.x == 0
    assert rover.y == 0
