from fastapi import FastAPI, HTTPException
from specpilot.models import RoverCommands, RoverResponse, RoverState
from specpilot.grid import Grid
from specpilot.rover import Rover
from specpilot.controller import RoverController

app = FastAPI(
    title="SpecPilot Mars Rover API",
    description="An API to control a Mars Rover using TDD.",
    version="1.0.0",
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Mars Rover API"}


@app.post("/rover/command", response_model=RoverResponse)
def command_rover(payload: RoverCommands):
    try:
        grid = Grid(
            width=payload.grid_width,
            height=payload.grid_height,
            obstacles=payload.obstacles
        )
        rover = Rover(
            x=payload.initial_state.x,
            y=payload.initial_state.y,
            direction=payload.initial_state.direction
        )
        grid.add_rover(rover)
        
        controller = RoverController(grid)
        controller.process_commands_for_rover(rover, payload.commands)

        final_state = RoverState(x=rover.x, y=rover.y, direction=rover.direction)
        return RoverResponse(final_state=final_state)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
