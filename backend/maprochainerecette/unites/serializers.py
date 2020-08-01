from rest_framework import serializers
from unites.models import Unite, TypeUnite


class TypeUniteSerializer(serializers.ModelSerializer):
    class Meta:
        model = TypeUnite
        fields = ["nom"]


class UniteSerializer(serializers.ModelSerializer):

    class Meta:
        model = Unite
        fields = ["abbreviation"]

    def to_representation(self, value) -> str:
        return value.abbreviation
