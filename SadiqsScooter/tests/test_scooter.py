import pytest

from sadiqsscooter.scooter import Scooter, ScooterHiredError
from sadiqsscooter.person import Person


def test_hired_scooter_cannot_be_hired_again():
    """
    Verify that hiring a scooter that is already hired raises an exception.
    """
    # Arrange
    scooter = Scooter()
    person = Person(name="Sadiq")
    scooter.hire(person)

    # Act & Assert
    with pytest.raises(ScooterHiredError, match="Scooter is already hired."):
        scooter.hire(person)


def test_hire_scooter_assigns_hirer():
    """
    Verify that hiring a scooter assigns the person to the scooter.
    """
    # Arrange
    scooter = Scooter()
    person = Person(name="Sadiq")

    # Act
    scooter.hire(person)

    # Assert
    assert scooter.hirer == person
