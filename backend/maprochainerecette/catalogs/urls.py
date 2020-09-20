from catalogs.api import CategoryViewSet, IngredientViewSet, RecipeViewSet
from rest_framework import routers

router = routers.DefaultRouter()
router.register("ingredients", IngredientViewSet, "ingredients")
router.register("recipes", RecipeViewSet, "recipes")
router.register("categories", CategoryViewSet, "categories")

urlpatterns = router.urls
