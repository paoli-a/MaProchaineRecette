from catalogs.models import Category, Ingredient, Recipe, Unit
from catalogs.serializers import RecipeIngredientSerializer
from fridge.models import FridgeIngredient
from rest_framework import serializers


class FridgeIngredientSerializer(serializers.ModelSerializer):
    ingredient = serializers.SlugRelatedField(
        queryset=Ingredient.objects.all(), slug_field="name"
    )
    unit = serializers.SlugRelatedField(
        queryset=Unit.objects.all(), slug_field="abbreviation"
    )

    class Meta:
        model = FridgeIngredient
        fields = ["id", "ingredient", "expiration_date", "amount", "unit"]

    def create(self, validated_data):
        """Create the fridge ingredient and solve the bug when the ingredient is merged.

        When the ingredient is merged (ie. an old instance is updated), the model
        returns a badly formed object.
        To solve that, we look for the updated ingredient and return it.

        """
        ingredient = FridgeIngredient.objects.create(**validated_data)
        if ingredient.id is None:
            ingredient = FridgeIngredient.objects.filter(
                ingredient=ingredient.ingredient,
                expiration_date=ingredient.expiration_date,
                unit__type=ingredient.unit.type,
            ).first()
        return ingredient


class RecipeFridgeSerializer(serializers.ModelSerializer):
    ingredients = RecipeIngredientSerializer(many=True)
    categories = serializers.SlugRelatedField(
        many=True, queryset=Category.objects.all(), slug_field="name"
    )
    unsure_ingredients = serializers.SerializerMethodField()
    priority_ingredients = serializers.SerializerMethodField()

    def get_unsure_ingredients(self, obj):
        if "unsure_ingredients" in self.context:
            return self.context["unsure_ingredients"][obj.id]
        return None

    def get_priority_ingredients(self, obj):
        if "priority_ingredients" in self.context:
            return [self.context["priority_ingredients"][obj.id]["name"]]
        return None

    class Meta:
        model = Recipe
        fields = [
            "id",
            "title",
            "description",
            "duration",
            "ingredients",
            "categories",
            "priority_ingredients",
            "unsure_ingredients",
        ]
