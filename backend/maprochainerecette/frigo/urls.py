from rest_framework import routers

from frigo.api import IngredientFrigoViewSet


router = routers.DefaultRouter()
router.register("ingredients", IngredientFrigoViewSet, "ingredients_frigo")

urlpatterns = router.urls
