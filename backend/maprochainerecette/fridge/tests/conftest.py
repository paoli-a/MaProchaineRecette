import pytest
from catalogs.tests.factories import RecipeFactory

from .factories import FridgeIngredientFactory


@pytest.fixture()
def fridge_ingredient():
    return FridgeIngredientFactory()


@pytest.fixture()
def recipe_id():
    return RecipeFactory().id
