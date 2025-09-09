from __future__ import annotations
from typing import Optional
from sadiqsscooter.person import Person

class ScooterHiredError(Exception):
    """Raised when an attempt is made to hire a scooter that is already hired."""
    pass


class Scooter:
    def __init__(self) -> None:
        self._hired: bool = False
        self.hirer: Optional[Person] = None

    def hire(self, person: Person) -> None:
        if self._hired:
            raise ScooterHiredError("Scooter is already hired.")
        self._hired = True
        self.hirer = person
