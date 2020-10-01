from catalogs.models import Category, Ingredient, Recipe
from catalogs.serializers import (
    CategorySerializer,
    IngredientSerializer,
    RecipeSerializer,
)
from rest_framework import authentication, permissions, viewsets


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


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    permission_classes = [permissions.AllowAny]
    authentication_classes = [authentication.TokenAuthentication]
    serializer_class = CategorySerializer
