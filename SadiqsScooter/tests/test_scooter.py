import pytest

from sadiqsscooter.scooter import Scooter, ScooterHiredError


def test_hired_scooter_cannot_be_hired_again():
    """
    Verify that hiring a scooter that is already hired raises an exception.
    """
    # Arrange
    scooter = Scooter()
    scooter.hire()

    # Act & Assert
    with pytest.raises(ScooterHiredError, match="Scooter is already hired."):
        scooter.hire()
