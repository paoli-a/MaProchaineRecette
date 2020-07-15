from rest_framework import routers

from catalogues.api import IngredientViewSet, RecetteViewSet


router = routers.DefaultRouter()
router.register("ingredients", IngredientViewSet, "ingredients")
router.register("recettes", RecetteViewSet, "recettes")

urlpatterns = router.urls
