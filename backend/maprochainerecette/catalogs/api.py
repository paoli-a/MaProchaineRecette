from rest_framework import viewsets, permissions, authentication

from catalogs.models import Ingredient, Recipe, Category
from catalogs.serializers import (
    IngredientSerializer,
    RecipeSerializer,
    CategorySerializer,
)


class IngredientViewSet(viewsets.ModelViewSet):
    queryset = Ingredient.objects.all()
    permission_classes = [permissions.AllowAny]
    authentication_classes = [authentication.TokenAuthentication]
    serializer_class = IngredientSerializer
    lookup_field = "name"


class RecipeViewSet(viewsets.ModelViewSet):
    queryset = Recipe.objects.all()
    permission_classes = [permissions.AllowAny]
    authentication_classes = [authentication.TokenAuthentication]
    serializer_class = RecipeSerializer


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    permission_classes = [permissions.AllowAny]
    authentication_classes = [authentication.TokenAuthentication]
    serializer_class = CategorySerializer
