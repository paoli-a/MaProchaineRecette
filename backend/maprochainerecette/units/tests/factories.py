import factory
import factory.fuzzy

from units.models import Unit, UnitType


class UnitTypeFactory(factory.django.DjangoModelFactory):
    name = factory.fuzzy.FuzzyText()

    class Meta:
        model = UnitType


class UnitFactory(factory.django.DjangoModelFactory):
    name = factory.fuzzy.FuzzyText()
    abbreviation = factory.fuzzy.FuzzyText()
    rapport = factory.fuzzy.FuzzyDecimal(0.0000000001)
    type = factory.SubFactory(UnitTypeFactory)

    class Meta:
        model = Unit
