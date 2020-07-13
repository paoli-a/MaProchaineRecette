import factory
import factory.fuzzy
import pytest

from ..models import Ingredient, IngredientRecette


@pytest.fixture
def ingredient():
    return IngredientFactory()


class IngredientFactory(factory.django.DjangoModelFactory):
    nom = factory.fuzzy.FuzzyText()

    class Meta:
        model = Ingredient
