from decimal import Decimal

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

    def save(self, *args, **kwargs):
        """Save the fridge ingredient or update the corresponding exsisting ingredient.

        Fridge ingredients having the same catalog ingredient, expiration date and unit type
        should be merged together, and their value summed.

        """
        if not self.pk:
            mergeable = IngredientFrigo.objects.filter(ingredient=self.ingredient,
                                                       date_peremption=self.date_peremption,
                                                       unite__type=self.unite.type).first()
            if mergeable:
                self._update_mergeable_with_new_ingredient(mergeable)
            else:
                super(IngredientFrigo, self).save(*args, **kwargs)
        else:
            super(IngredientFrigo, self).save(*args, **kwargs)

    def _update_mergeable_with_new_ingredient(self, mergeable):
        if mergeable.unite.rapport > self.unite.rapport:
            quantite = self._compute_quantite(mergeable, self)
        else:
            quantite = self._compute_quantite(self, mergeable)
            mergeable.unite = self.unite
        mergeable.quantite = quantite
        mergeable.save()

    @staticmethod
    def _compute_quantite(big_element, small_element):
        rapport = Decimal(small_element.unite.rapport) / \
            Decimal(big_element.unite.rapport)
        return Decimal(big_element.quantite) + Decimal(small_element.quantite) * rapport
