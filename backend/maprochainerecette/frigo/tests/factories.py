import datetime

import factory
import factory.fuzzy
import pytest

from frigo.models import IngredientFrigo
from catalogues.tests.factories import IngredientFactory
from units.tests.factories import UnitFactory


@pytest.fixture
def ingredientFrigo():
    return IngredientFrigoFactory()


class IngredientFrigoFactory(factory.django.DjangoModelFactory):
    ingredient = factory.SubFactory(IngredientFactory)
    quantite = factory.fuzzy.FuzzyDecimal(0)
    date_peremption = factory.fuzzy.FuzzyDate(datetime.date(2020, 1, 1))
    unit = factory.SubFactory(UnitFactory)

    class Meta:
        model = IngredientFrigo
