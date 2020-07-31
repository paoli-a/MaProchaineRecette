from rest_framework import routers

from unites.api import UniteViewSet


router = routers.DefaultRouter()
router.register("unites", UniteViewSet, "unites")

urlpatterns = router.urls
