from rest_framework import routers

from catalogs.api import IngredientViewSet, RecipeViewSet, CategoryViewSet


router = routers.DefaultRouter()
router.register("ingredients", IngredientViewSet, "ingredients")
router.register("recipes", RecipeViewSet, "recipes")
router.register("categories", CategoryViewSet, "categories")

urlpatterns = router.urls
