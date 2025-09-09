class ScooterHiredError(Exception):
    """Raised when an attempt is made to hire a scooter that is already hired."""
    pass


class Scooter:
    def __init__(self):
        self._hired: bool = False

    def hire(self) -> None:
        if self._hired:
            raise ScooterHiredError("Scooter is already hired.")
        self._hired = True
