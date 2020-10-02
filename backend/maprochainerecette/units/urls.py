from rest_framework import routers
from units.api import UnitViewSet

router = routers.DefaultRouter()
router.register("units", UnitViewSet, "units")

urlpatterns = router.urls
