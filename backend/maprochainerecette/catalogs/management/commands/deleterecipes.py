from catalogs.models import Category, Ingredient, Recipe, RecipeIngredient
from django.core.management.base import BaseCommand, CommandError
from django.db.models import ProtectedError
from units.models import Unit, UnitType


class Command(BaseCommand):
    help = "Deletes all recipes, categories, ingredients, units "
    "and unit types from the database."

    def handle(self, *args, **options):
        try:
            Recipe.objects.all().delete()
            Category.objects.all().delete()
            RecipeIngredient.objects.all().delete()
            Ingredient.objects.all().delete()
            Unit.objects.all().delete()
            UnitType.objects.all().delete()
        except ProtectedError as e:
            raise CommandError('Exception "%s"' % e)
