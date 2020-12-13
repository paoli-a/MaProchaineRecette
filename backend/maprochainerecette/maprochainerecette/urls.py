"""maprochainerecette URL Configuration."""

from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/catalogs/", include("catalogs.urls")),
    path("api/fridge/", include("fridge.urls")),
    path("api/units/", include("units.urls")),
]
