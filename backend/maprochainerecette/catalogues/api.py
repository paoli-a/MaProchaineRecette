from rest_framework import viewsets, permissions

from catalogues.models import Ingredient, Recette, Categorie
from catalogues.serializers import IngredientSerializer, RecetteSerializer


class IngredientViewSet(viewsets.ModelViewSet):
    queryset = Ingredient.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = IngredientSerializer
    lookup_field = 'nom'


class RecetteViewSet(viewsets.ModelViewSet):
    queryset = Recette.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = RecetteSerializer
