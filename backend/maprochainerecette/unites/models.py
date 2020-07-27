from django.db import models
from model_utils.models import TimeStampedModel


class Unite(TimeStampedModel):
    nom = models.CharField("Nom de l'unité", max_length=255, unique=True)
    abbreviation = models.CharField(
        "Abbréviation", max_length=255, unique=True)
    rapport = models.DecimalField(max_digits=20, decimal_places=10)
    type = models.ForeignKey("TypeUnite", on_delete=models.CASCADE)

    def __str__(self) -> str:
        return self.abbreviation


class TypeUnite(TimeStampedModel):
    nom = models.CharField(
        "Nature de l'unité (masse, volume ...)", max_length=255, unique=True)
