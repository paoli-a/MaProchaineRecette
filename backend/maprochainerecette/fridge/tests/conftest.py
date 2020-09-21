import pytest

from .factories import FridgeIngredientFactory


@pytest.fixture()
def fridge_ingredient():
    return FridgeIngredientFactory()
