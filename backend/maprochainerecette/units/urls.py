from rest_framework import routers
from units.api import UnitTypeViewSet, UnitViewSet

router = routers.DefaultRouter()
router.register("units", UnitViewSet, "units")
router.register("types", UnitTypeViewSet, "types")

urlpatterns = router.urls
