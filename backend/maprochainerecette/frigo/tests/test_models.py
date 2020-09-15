import datetime

import pytest

from unites.tests.factories import TypeUniteFactory, UniteFactory
from catalogues.tests.factories import IngredientFactory
from frigo.models import IngredientFrigo
from .factories import IngredientFrigoFactory


pytestmark = pytest.mark.django_db


def test_adding_ingredients_that_can_be_merged_merges_them_into_one():
    """Two ingredients that have the same name, date of expiration and unit type
    should be merged into one instance, which should have its quantity equal to
    the sum of the two previous quantities.
    """
    type_mass = TypeUniteFactory(name="masse")
    unite_kg = UniteFactory(type=type_mass, abbreviation="kg", rapport=1000)
    unite_g = UniteFactory(type=type_mass, abbreviation="g", rapport=1)
    ingredient = IngredientFactory()
    IngredientFrigoFactory(ingredient=ingredient,
                           unite=unite_kg, date_peremption=datetime.date(2030, 7, 20))
    IngredientFrigoFactory(ingredient=ingredient,
                           unite=unite_g, date_peremption=datetime.date(2030, 7, 20))
    IngredientFrigoFactory(ingredient=ingredient,
                           unite=unite_kg, date_peremption=datetime.date(2030, 7, 20))
    assert IngredientFrigo.objects.count() == 1


def test_adding_ingredients_that_cannot_be_merged_does_not_merge_them():
    type_mass = TypeUniteFactory(name="masse")
    type_volume = TypeUniteFactory(name="volume")
    unite_kg = UniteFactory(type=type_mass, abbreviation="kg", rapport=1000)
    unite_cl = UniteFactory(type=type_volume, abbreviation="cl", rapport=0.01)
    ingredient = IngredientFactory()
    ingredient2 = IngredientFactory()
    IngredientFrigoFactory(ingredient=ingredient,
                           unite=unite_kg, date_peremption=datetime.date(2030, 7, 20))
    IngredientFrigoFactory(ingredient=ingredient2,
                           unite=unite_kg, date_peremption=datetime.date(2030, 7, 20))
    IngredientFrigoFactory(ingredient=ingredient,
                           unite=unite_cl, date_peremption=datetime.date(2030, 7, 20))
    IngredientFrigoFactory(ingredient=ingredient,
                           unite=unite_kg, date_peremption=datetime.date(2031, 7, 20))
    assert IngredientFrigo.objects.count() == 4


def test_adding_ingredients_that_are_merged_sets_the_quantity_to_the_sum_of_all_quantities():
    type_mass = TypeUniteFactory(name="masse")
    unite_kg = UniteFactory(type=type_mass, abbreviation="kg", rapport=1000)
    unite_mg = UniteFactory(type=type_mass, abbreviation="mg", rapport=0.001)
    unite_g = UniteFactory(type=type_mass, abbreviation="g", rapport=1)
    ingredient = IngredientFactory()
    IngredientFrigoFactory(ingredient=ingredient, quantite=1250,
                           unite=unite_g, date_peremption=datetime.date(2030, 7, 20))
    IngredientFrigoFactory(ingredient=ingredient, quantite=12,
                           unite=unite_kg, date_peremption=datetime.date(2030, 7, 20))
    IngredientFrigoFactory(ingredient=ingredient, quantite=290125,
                           unite=unite_mg, date_peremption=datetime.date(2030, 7, 20))
    assert float(IngredientFrigo.objects.first().quantite) == 13.54
    assert IngredientFrigo.objects.first().unite.abbreviation == "kg"
