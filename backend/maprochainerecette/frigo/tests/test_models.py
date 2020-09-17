import datetime

import pytest

from units.tests.factories import UnitTypeFactory, UnitFactory
from catalogues.tests.factories import IngredientFactory
from frigo.models import IngredientFrigo
from .factories import IngredientFrigoFactory


pytestmark = pytest.mark.django_db


def test_adding_ingredients_that_can_be_merged_merges_them_into_one():
    """Two ingredients that have the same name, date of expiration and unit type
    should be merged into one instance, which should have its amount equal to
    the sum of the two previous quantities.
    """
    type_mass = UnitTypeFactory(name="masse")
    unit_kg = UnitFactory(type=type_mass, abbreviation="kg", rapport=1000)
    unit_g = UnitFactory(type=type_mass, abbreviation="g", rapport=1)
    ingredient = IngredientFactory()
    IngredientFrigoFactory(ingredient=ingredient,
                           unit=unit_kg, expiration_date=datetime.date(2030, 7, 20))
    IngredientFrigoFactory(ingredient=ingredient,
                           unit=unit_g, expiration_date=datetime.date(2030, 7, 20))
    IngredientFrigoFactory(ingredient=ingredient,
                           unit=unit_kg, expiration_date=datetime.date(2030, 7, 20))
    assert IngredientFrigo.objects.count() == 1


def test_adding_ingredients_that_cannot_be_merged_does_not_merge_them():
    type_mass = UnitTypeFactory(name="masse")
    type_volume = UnitTypeFactory(name="volume")
    unit_kg = UnitFactory(type=type_mass, abbreviation="kg", rapport=1000)
    unit_cl = UnitFactory(type=type_volume, abbreviation="cl", rapport=0.01)
    ingredient = IngredientFactory()
    ingredient2 = IngredientFactory()
    IngredientFrigoFactory(ingredient=ingredient,
                           unit=unit_kg, expiration_date=datetime.date(2030, 7, 20))
    IngredientFrigoFactory(ingredient=ingredient2,
                           unit=unit_kg, expiration_date=datetime.date(2030, 7, 20))
    IngredientFrigoFactory(ingredient=ingredient,
                           unit=unit_cl, expiration_date=datetime.date(2030, 7, 20))
    IngredientFrigoFactory(ingredient=ingredient,
                           unit=unit_kg, expiration_date=datetime.date(2031, 7, 20))
    assert IngredientFrigo.objects.count() == 4


def test_adding_ingredients_that_are_merged_sets_the_amount_to_the_sum_of_all_quantities():
    type_mass = UnitTypeFactory(name="masse")
    unit_kg = UnitFactory(type=type_mass, abbreviation="kg", rapport=1000)
    unit_mg = UnitFactory(type=type_mass, abbreviation="mg", rapport=0.001)
    unit_g = UnitFactory(type=type_mass, abbreviation="g", rapport=1)
    ingredient = IngredientFactory()
    IngredientFrigoFactory(ingredient=ingredient, amount=1250,
                           unit=unit_g, expiration_date=datetime.date(2030, 7, 20))
    IngredientFrigoFactory(ingredient=ingredient, amount=12,
                           unit=unit_kg, expiration_date=datetime.date(2030, 7, 20))
    IngredientFrigoFactory(ingredient=ingredient, amount=290125,
                           unit=unit_mg, expiration_date=datetime.date(2030, 7, 20))
    assert float(IngredientFrigo.objects.first().amount) == 13.54
    assert IngredientFrigo.objects.first().unit.abbreviation == "kg"
