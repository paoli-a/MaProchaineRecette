import pytest
from catalogs.models import Category, Ingredient, Recipe, RecipeIngredient
from django.core.management import call_command
from django.core.management.base import CommandError
from units.models import Unit, UnitType

pytestmark = pytest.mark.django_db


def test_createrecipesfortest_create_correct_elements():
    assert len(Category.objects.all()) == 0
    assert len(Recipe.objects.all()) == 0
    assert len(RecipeIngredient.objects.all()) == 0
    assert len(Ingredient.objects.all()) == 0
    assert len(Unit.objects.all()) == 0
    assert len(UnitType.objects.all()) == 0
    call_command("createrecipesfortest")
    assert len(Category.objects.all()) == 3
    assert len(Recipe.objects.all()) == 0
    assert len(RecipeIngredient.objects.all()) == 0
    assert len(Ingredient.objects.all()) == 6
    assert len(Unit.objects.all()) == 4
    assert len(UnitType.objects.all()) == 2


def test_createrecipesfortest_raises_exception_when_called_on_non_empty_database():
    call_command("createrecipesfortest")
    with pytest.raises(CommandError):
        call_command("createrecipesfortest")


def test_deleterecipes_deletes_all_elements_linked_to_recipes():
    call_command("createrecipesfortest")
    assert len(Category.objects.all()) == 3
    assert len(Recipe.objects.all()) == 0
    assert len(Ingredient.objects.all()) == 6
    assert len(Unit.objects.all()) == 4
    assert len(UnitType.objects.all()) == 2
    call_command("deleterecipes")
    assert len(Category.objects.all()) == 0
    assert len(Recipe.objects.all()) == 0
    assert len(RecipeIngredient.objects.all()) == 0
    assert len(Ingredient.objects.all()) == 0
    assert len(Unit.objects.all()) == 0
    assert len(UnitType.objects.all()) == 0
