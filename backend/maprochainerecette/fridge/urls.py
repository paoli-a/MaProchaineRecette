from django.urls import path
from fridge.api import ConsumeIngredients, FridgeIngredientViewSet, FridgeRecipes
from rest_framework import routers

router = routers.DefaultRouter()
router.register("ingredients", FridgeIngredientViewSet, "ingredients_fridge")

urlpatterns = router.urls

urlpatterns += [
    path(route="recipes/", view=FridgeRecipes.as_view(), name="recipes_fridge_list"),
    path(
        route="recipes/<uuid:recipe_id>/consume/",
        view=ConsumeIngredients.as_view(),
        name="recipes_consume",
    ),
]
