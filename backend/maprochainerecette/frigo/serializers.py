from rest_framework import serializers
from frigo.models import IngredientFrigo
from catalogues.models import Ingredient, Unite, Recette, Categorie
from catalogues.serializers import IngredientRecetteSerializer


class IngredientFrigoSerializer(serializers.ModelSerializer):
    ingredient = serializers.SlugRelatedField(
        queryset=Ingredient.objects.all(), slug_field="name")
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


class RecetteFrigoSerializer(serializers.ModelSerializer):
    ingredients = IngredientRecetteSerializer(many=True)
    categories = serializers.SlugRelatedField(many=True,
                                              queryset=Categorie.objects.all(), slug_field="name")
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
        model = Recette
        fields = ["id", "titre", "description",
                  "duree", "ingredients", "categories",
                  "priority_ingredients", "unsure_ingredients"]
