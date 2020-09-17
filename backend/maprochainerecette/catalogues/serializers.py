from rest_framework import serializers
from catalogues.models import Ingredient, Recette, IngredientRecette, Categorie
from units.models import Unit


class IngredientSerializer(serializers.ModelSerializer):

    class Meta:
        model = Ingredient
        fields = ["name"]


class CategorieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categorie
        fields = ["name"]

    def to_representation(self, value) -> str:
        return value.name


class IngredientRecetteSerializer(serializers.ModelSerializer):
    unit = serializers.SlugRelatedField(
        queryset=Unit.objects.all(), slug_field="abbreviation")
    ingredient = serializers.SlugRelatedField(
        queryset=Ingredient.objects.all(), slug_field="name")

    class Meta:
        model = IngredientRecette
        fields = ["ingredient", "amount",
                  "unit"]


class RecetteSerializer(serializers.ModelSerializer):
    ingredients = IngredientRecetteSerializer(many=True)
    categories = serializers.SlugRelatedField(many=True,
                                              queryset=Categorie.objects.all(), slug_field="name")

    class Meta:
        model = Recette
        fields = ["id", "titre", "description",
                  "duree", "ingredients", "categories"]

    def create(self, validated_data):
        ingredients_data = validated_data.pop('ingredients')
        categories_data = validated_data.pop('categories')
        recette = Recette.objects.create(**validated_data)
        for categorie_data in categories_data:
            recette.categories.add(categorie_data)
        for ingredient_data in ingredients_data:
            ingredient = IngredientRecette.objects.create(
                **ingredient_data)
            recette.ingredients.add(ingredient)
        return recette
