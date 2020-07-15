from rest_framework import serializers
from frigo.models import IngredientFrigo
from catalogues.serializers import IngredientSerializer


class IngredientFrigoSerializer(serializers.ModelSerializer):
    ingredient = IngredientSerializer()

    class Meta:
        model = IngredientFrigo
        fields = ["id", "ingredient", "date_peremption", "quantite"]
