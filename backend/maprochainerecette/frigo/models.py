from django.db import models
from model_utils.models import TimeStampedModel

from unites.models import Unite
from catalogues.models import Ingredient


class IngredientFrigo(TimeStampedModel):
    ingredient = models.ForeignKey(Ingredient, on_delete=models.PROTECT)
    quantite = models.DecimalField(max_digits=10, decimal_places=2)
    unite = models.ForeignKey(Unite, on_delete=models.PROTECT)
    date_peremption = models.DateField("Date de péremption")

    def __str__(self) -> str:
        return self.ingredient.nom
