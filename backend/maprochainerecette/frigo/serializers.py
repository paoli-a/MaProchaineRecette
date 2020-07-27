from django.shortcuts import get_object_or_404

from rest_framework import serializers
from frigo.models import IngredientFrigo
from catalogues.models import Ingredient, Unite


class IngredientFrigoSerializer(serializers.ModelSerializer):
    ingredient = serializers.SlugRelatedField(
        queryset=Ingredient.objects.all(), slug_field="nom")
    unite = serializers.SlugRelatedField(
        queryset=Unite.objects.all(), slug_field="abbreviation")

    def get_ingredient(self, obj):
        return obj.ingredient.nom

    def get_unite(self, obj):
        return obj.unite.abbreviation

    class Meta:
        model = IngredientFrigo
        fields = ["id", "ingredient", "date_peremption", "quantite", "unite"]
