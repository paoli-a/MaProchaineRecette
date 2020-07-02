from rest_framework import viewsets, permissions

from catalogues.models import Ingredient
from catalogues.serializers import IngredientSerializer


class IngredientViewSet(viewsets.ModelViewSet):
    queryset = Ingredient.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = IngredientSerializer
