import pytest

from .factories import (
    CategoryFactory,
    IngredientFactory,
    RecipeFactory,
    RecipeIngredientFactory,
)


@pytest.fixture()
def ingredient():
    return IngredientFactory()


@pytest.fixture()
def recipe():
    ingredients, categories = [], []
    for _ in range(10):
        ingredients.append(RecipeIngredientFactory())
        categories.append(CategoryFactory())
    return RecipeFactory(ingredients=ingredients, categories=categories)
