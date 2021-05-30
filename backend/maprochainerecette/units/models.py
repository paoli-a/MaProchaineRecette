import uuid

from django.db import models
from model_utils.models import TimeStampedModel


class Unit(TimeStampedModel):
    name = models.CharField("Unit name", max_length=255, unique=True)
    abbreviation = models.CharField("Abbréviation", max_length=255, unique=True)
    rapport = models.DecimalField(max_digits=20, decimal_places=10)
    type = models.ForeignKey("UnitType", on_delete=models.CASCADE)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    def __str__(self) -> str:
        return self.abbreviation


class UnitType(TimeStampedModel):
    name = models.CharField(
        "Unit nature (mass, volume ...)", max_length=255, unique=True
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    def __str__(self) -> str:
        return self.name
