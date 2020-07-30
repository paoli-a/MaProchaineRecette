from rest_framework import viewsets, permissions, authentication

from frigo.models import IngredientFrigo
from frigo.serializers import IngredientFrigoSerializer


class IngredientFrigoViewSet(viewsets.ModelViewSet):
    """Provides a CRUD API for fridge ingredients."""
    queryset = IngredientFrigo.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    authentication_classes = [
        authentication.TokenAuthentication
    ]
    serializer_class = IngredientFrigoSerializer
