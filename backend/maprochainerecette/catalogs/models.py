from django.db import models
from model_utils.models import TimeStampedModel
from units.models import Unit


class Ingredient(TimeStampedModel):
    name = models.CharField("Ingredient name", max_length=255, unique=True)

    def __str__(self) -> str:
        return self.name


class Recipe(TimeStampedModel):
    title = models.CharField("Title of the recipe", max_length=255)
    description = models.TextField("Body of the recipe")
    duration = models.DurationField("Total duration of the recipe")
    ingredients = models.ManyToManyField("RecipeIngredient")
    categories = models.ManyToManyField("Category")

    def __str__(self) -> str:
        return self.title


class RecipeIngredient(TimeStampedModel):
    ingredient = models.ForeignKey(Ingredient, on_delete=models.PROTECT)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    unit = models.ForeignKey(Unit, on_delete=models.PROTECT)

    def __str__(self) -> str:
        return self.ingredient.name


class Category(TimeStampedModel):
    name = models.CharField("Category name", max_length=255, unique=True)

    def __str__(self) -> str:
        return self.name
