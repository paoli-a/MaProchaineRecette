from rest_framework import serializers
from units.models import Unit, UnitType


class UnitTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = UnitType
        fields = ["name"]


class UnitSerializer(serializers.ModelSerializer):

    class Meta:
        model = Unit
        fields = ["abbreviation"]

    def to_representation(self, value) -> str:
        return value.abbreviation
