from rest_framework import serializers
from frigo.models import IngredientFrigo
from catalogues.models import Ingredient, Unite


class IngredientFrigoSerializer(serializers.ModelSerializer):
    ingredient = serializers.SlugRelatedField(
        queryset=Ingredient.objects.all(), slug_field="nom")
    unite = serializers.SlugRelatedField(
        queryset=Unite.objects.all(), slug_field="abbreviation")

    class Meta:
        model = IngredientFrigo
        fields = ["id", "ingredient", "date_peremption", "quantite", "unite"]

    def create(self, validated_data):
        """Create the fridge ingredient and solve the bug when the ingredient is merged.

        When the ingredient is merged (ie. an old instance is updated), the model 
        returns a badly formed object.
        To solve that, we look for the updated ingredient and return it.

        """
        ingredient = IngredientFrigo.objects.create(**validated_data)
        if ingredient.id is None:
            ingredient = IngredientFrigo.objects.filter(
                ingredient=ingredient.ingredient,
                date_peremption=ingredient.date_peremption,
                unite__type=ingredient.unite.type).first()
        return ingredient
