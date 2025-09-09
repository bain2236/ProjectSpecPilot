class Rover:
    _RIGHT_TURNS = {'N': 'E', 'E': 'S', 'S': 'W', 'W': 'N'}
    _LEFT_TURNS = {'N': 'W', 'W': 'S', 'S': 'E', 'E': 'N'}
    _MOVEMENT_VECTORS = {
        'N': (0, 1),
        'E': (1, 0),
        'S': (0, -1),
        'W': (-1, 0),
    }

    def __init__(self, x: int, y: int, direction: str):
        self.x = x
        self.y = y
        self.direction = direction
