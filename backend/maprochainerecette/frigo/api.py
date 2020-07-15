from rest_framework import viewsets, permissions

from frigo.models import IngredientFrigo
from frigo.serializers import IngredientFrigoSerializer


class IngredientFrigoViewSet(viewsets.ModelViewSet):
    queryset = IngredientFrigo.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = IngredientFrigoSerializer
