from rest_framework import routers

from catalogues.api import IngredientViewSet


router = routers.DefaultRouter()
router.register("ingredients", IngredientViewSet, "ingredients")

urlpatterns = router.urls
