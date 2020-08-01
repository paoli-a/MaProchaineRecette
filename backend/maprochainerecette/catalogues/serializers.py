from rest_framework import serializers
from catalogues.models import Ingredient, Recette, IngredientRecette, Categorie
from unites.models import Unite


class IngredientSerializer(serializers.ModelSerializer):

    class Meta:
        model = Ingredient
        fields = ["nom"]


class CategorieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categorie
        fields = ["nom"]

    def to_representation(self, value):
        return value.nom


class IngredientRecetteSerializer(serializers.ModelSerializer):
    unite = serializers.SlugRelatedField(
        queryset=Unite.objects.all(), slug_field="abbreviation")
    ingredient = serializers.SlugRelatedField(
        queryset=Ingredient.objects.all(), slug_field="nom")

    class Meta:
        model = IngredientRecette
        fields = ["ingredient", "quantite",
                  "unite"]


class RecetteSerializer(serializers.ModelSerializer):
    ingredients = IngredientRecetteSerializer(many=True)
    categories = serializers.SlugRelatedField(many=True,
                                              queryset=Categorie.objects.all(), slug_field="nom")

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
