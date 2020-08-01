from rest_framework import viewsets, permissions, authentication

from catalogues.models import Ingredient, Recette, Categorie
from catalogues.serializers import IngredientSerializer, RecetteSerializer, CategorieSerializer


class IngredientViewSet(viewsets.ModelViewSet):
    queryset = Ingredient.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    authentication_classes = [
        authentication.TokenAuthentication
    ]
    serializer_class = IngredientSerializer
    lookup_field = 'nom'


class RecetteViewSet(viewsets.ModelViewSet):
    queryset = Recette.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    authentication_classes = [
        authentication.TokenAuthentication
    ]
    serializer_class = RecetteSerializer


class CategorieViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Categorie.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    authentication_classes = [
        authentication.TokenAuthentication
    ]
    serializer_class = CategorieSerializer
