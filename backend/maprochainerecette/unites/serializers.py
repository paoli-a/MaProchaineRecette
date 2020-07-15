from django.shortcuts import get_object_or_404
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

    def to_internal_value(self, data):
        return get_object_or_404(Unite, abbreviation=data)

    def to_representation(self, value):
        return value.abbreviation
