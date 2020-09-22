from catalogs.models import Category, Ingredient, Recipe, RecipeIngredient
from rest_framework import serializers
from units.models import Unit


class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ["name"]


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["name"]

    def to_representation(self, value) -> str:
        return value.name


class RecipeIngredientSerializer(serializers.ModelSerializer):
    unit = serializers.SlugRelatedField(
        queryset=Unit.objects.all(), slug_field="abbreviation"
    )
    ingredient = serializers.SlugRelatedField(
        queryset=Ingredient.objects.all(), slug_field="name"
    )

    class Meta:
        model = RecipeIngredient
        fields = ["ingredient", "amount", "unit"]


class RecipeSerializer(serializers.ModelSerializer):
    ingredients = RecipeIngredientSerializer(many=True)
    categories = serializers.SlugRelatedField(
        many=True, queryset=Category.objects.all(), slug_field="name"
    )

    class Meta:
        model = Recipe
        fields = ["id", "title", "description", "duration", "ingredients", "categories"]

    def create(self, validated_data):
        ingredients_data = validated_data.pop("ingredients")
        categories_data = validated_data.pop("categories")
        recipe = Recipe.objects.create(**validated_data)
        for categorie_data in categories_data:
            recipe.categories.add(categorie_data)
        for ingredient_data in ingredients_data:
            ingredient = RecipeIngredient.objects.create(**ingredient_data)
            recipe.ingredients.add(ingredient)
        return recipe
