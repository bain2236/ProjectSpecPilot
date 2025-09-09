from pydantic import BaseModel, Field
from typing import List, Tuple

class RoverState(BaseModel):
    x: int
    y: int
    direction: str = Field(pattern="^[NESW]$")

class RoverCommands(BaseModel):
    grid_width: int = 10
    grid_height: int = 10
    obstacles: List[Tuple[int, int]] = []
    initial_state: RoverState
    commands: str = Field(pattern="^[flrb]+$")

class RoverResponse(BaseModel):
    final_state: RoverState
    message: str = "Commands executed successfully."
