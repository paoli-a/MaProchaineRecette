from catalogs.models import Category, Ingredient
from django.core.management.base import BaseCommand, CommandError
from units.models import Unit, UnitType


class Command(BaseCommand):
    help = "Creates a set of test objects needed to create recipes, including "
    "units, unit types, recipe categories and ingredients."

    def handle(self, *args, **options):
        try:
            masse = UnitType.objects.create(name="masse")
            pieces_type = UnitType.objects.create(name="pièce(s)")
            Unit.objects.create(name="gramme", abbreviation="g", rapport=1, type=masse)
            Unit.objects.create(
                name="pièce(s)", abbreviation="pièce(s)", rapport=1, type=pieces_type
            )
            Unit.objects.create(
                name="Cuillère à soupe",
                abbreviation="cas",
                rapport=1,
                type=pieces_type,
            )
            Category.objects.create(name="Entrée")
            Category.objects.create(name="Plat")
            Category.objects.create(name="Dessert")
            Ingredient.objects.create(name="saumon fumé")
            Ingredient.objects.create(name="citon vert")
            Ingredient.objects.create(name="vinaigre balsamique")
            Ingredient.objects.create(name="huile d'olive")
            Ingredient.objects.create(name="échalotte")
            Ingredient.objects.create(name="herbes fraiches")
        except Exception as e:
            raise CommandError('Exception "%s"' % e)
