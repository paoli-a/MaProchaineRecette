from django.db import models
from model_utils.models import TimeStampedModel

from unites.models import Unite


class Ingredient(TimeStampedModel):
    nom = models.CharField("Nom de l'ingrédient", max_length=255, unique=True)


class Recette(TimeStampedModel):
    titre = models.CharField("Titre de la recette", max_length=255)
    description = models.TextField("Corps de la recette")
    duree = models.DurationField("Temps total de la recette")
    ingredients = models.ManyToManyField("IngredientRecette")
    categories = models.ManyToManyField("Categorie")


class IngredientRecette(TimeStampedModel):
    ingredient = models.ForeignKey(Ingredient, on_delete=models.PROTECT)
    quantite = models.DecimalField(max_digits=10, decimal_places=2)
    unite = models.ForeignKey(Unite, on_delete=models.PROTECT)


class Categorie(TimeStampedModel):
    nom = models.CharField("Nom de la catégorie", max_length=255, unique=True)
