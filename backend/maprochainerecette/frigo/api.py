from rest_framework import viewsets, permissions, authentication
from rest_framework.views import APIView
from rest_framework.response import Response

from frigo.models import IngredientFrigo
from catalogues.models import Recette
from frigo.serializers import IngredientFrigoSerializer
from catalogues.serializers import RecetteSerializer


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


class RecettesFrigo(APIView):
    """View to list feasible recipes according to fridge ingredients."""
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.AllowAny]

    def get(self, request, format="json"):
        # fridge_ingredient = IngredientFrigo.objects.all()
        recipes = Recette.objects.all()
        feasible_recipes = []
        for recipe in recipes:
            feasible_recipes.append(recipe)
        serializer = RecetteSerializer(feasible_recipes, many=True)
        return Response(serializer.data)
