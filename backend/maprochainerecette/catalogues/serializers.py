from django.shortcuts import get_object_or_404
from rest_framework import serializers
from catalogues.models import Ingredient, Recette, IngredientRecette, Categorie
from unites.serializers import UniteSerializer


class IngredientSerializer(serializers.ModelSerializer):

    class Meta:
        model = Ingredient
        fields = ["nom"]


class IngredientNestedSerializer(serializers.ModelSerializer):

    class Meta:
        model = Ingredient
        fields = ["nom"]

    def to_internal_value(self, data):
        return get_object_or_404(Ingredient, nom=data)

    def to_representation(self, value):
        return value.nom


class CategorieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categorie
        fields = ["nom"]

    def to_internal_value(self, data):
        return get_object_or_404(Categorie, nom=data)

    def to_representation(self, value):
        return value.nom


class IngredientRecetteSerializer(serializers.ModelSerializer):
    ingredient = IngredientNestedSerializer()
    unite = UniteSerializer()

    class Meta:
        model = IngredientRecette
        fields = ["ingredient", "quantite",
                  "unite"]


class RecetteSerializer(serializers.ModelSerializer):
    ingredients = IngredientRecetteSerializer(many=True)
    categories = CategorieSerializer(many=True)

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
            ingredient, _ = IngredientRecette.objects.get_or_create(
                ingredient_data)
            recette.ingredients.add(ingredient)
        return recette
