from rest_framework import routers

from unites.api import UniteViewSet


router = routers.DefaultRouter()
router.register("", UniteViewSet, "unites")

urlpatterns = router.urls
