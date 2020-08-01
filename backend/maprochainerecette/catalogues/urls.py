from rest_framework import routers

from catalogues.api import IngredientViewSet, RecetteViewSet, CategorieViewSet


router = routers.DefaultRouter()
router.register("ingredients", IngredientViewSet, "ingredients")
router.register("recettes", RecetteViewSet, "recettes")
router.register("categories", CategorieViewSet, "categories")

urlpatterns = router.urls
