from django.urls import path
from rest_framework import routers

from frigo.api import IngredientFrigoViewSet, RecettesFrigo


router = routers.DefaultRouter()
router.register("ingredients", IngredientFrigoViewSet, "ingredients_frigo")

urlpatterns = router.urls

urlpatterns += [
    path(
        route="recettes",
        view=RecettesFrigo.as_view(),
        name="recettes_frigo_list"
    ),
]
