import datetime

import factory
import factory.fuzzy
from catalogs.tests.factories import IngredientFactory
from fridge.models import FridgeIngredient
from units.tests.factories import UnitFactory


class FridgeIngredientFactory(factory.django.DjangoModelFactory):
    ingredient = factory.SubFactory(IngredientFactory)
    amount = factory.fuzzy.FuzzyDecimal(0)
    expiration_date = factory.fuzzy.FuzzyDate(datetime.date(2020, 1, 1))
    unit = factory.SubFactory(UnitFactory)

    class Meta:
        model = FridgeIngredient
