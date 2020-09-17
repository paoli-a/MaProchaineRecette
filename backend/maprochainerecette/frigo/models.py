from decimal import Decimal

from django.db import models
from model_utils.models import TimeStampedModel

from units.models import Unit
from catalogues.models import Ingredient


class IngredientFrigo(TimeStampedModel):
    ingredient = models.ForeignKey(Ingredient, on_delete=models.PROTECT)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    unit = models.ForeignKey(Unit, on_delete=models.PROTECT)
    expiration_date = models.DateField("Date de péremption")

    def __str__(self) -> str:
        return self.ingredient.name

    def save(self, *args, **kwargs):
        """Save the fridge ingredient or update the corresponding exsisting ingredient.

        Fridge ingredients having the same catalog ingredient, expiration date and unit type
        should be merged together, and their value summed.

        """
        if not self.pk:
            mergeable = IngredientFrigo.objects.filter(ingredient=self.ingredient,
                                                       expiration_date=self.expiration_date,
                                                       unit__type=self.unit.type).first()
            if mergeable:
                self._update_mergeable_with_new_ingredient(mergeable)
            else:
                super(IngredientFrigo, self).save(*args, **kwargs)
        else:
            super(IngredientFrigo, self).save(*args, **kwargs)

    def _update_mergeable_with_new_ingredient(self, mergeable):
        if mergeable.unit.rapport > self.unit.rapport:
            amount = self._compute_amount(mergeable, self)
        else:
            amount = self._compute_amount(self, mergeable)
            mergeable.unit = self.unit
        mergeable.amount = amount
        mergeable.save()

    @staticmethod
    def _compute_amount(big_element, small_element):
        rapport = Decimal(small_element.unit.rapport) / \
            Decimal(big_element.unit.rapport)
        return Decimal(big_element.amount) + Decimal(small_element.amount) * rapport
