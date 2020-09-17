from django.db import models
from model_utils.models import TimeStampedModel

from units.models import Unit


class Ingredient(TimeStampedModel):
    name = models.CharField("Nom de l'ingrédient", max_length=255, unique=True)

    def __str__(self) -> str:
        return self.name


class Recette(TimeStampedModel):
    titre = models.CharField("Titre de la recette", max_length=255)
    description = models.TextField("Corps de la recette")
    duree = models.DurationField("Temps total de la recette")
    ingredients = models.ManyToManyField("IngredientRecette")
    categories = models.ManyToManyField("Categorie")

    def __str__(self) -> str:
        return self.titre


class IngredientRecette(TimeStampedModel):
    ingredient = models.ForeignKey(Ingredient, on_delete=models.PROTECT)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    unit = models.ForeignKey(Unit, on_delete=models.PROTECT)

    def __str__(self) -> str:
        return self.ingredient.name


class Categorie(TimeStampedModel):
    name = models.CharField("Nom de la catégorie", max_length=255, unique=True)

    def __str__(self) -> str:
        return self.name
