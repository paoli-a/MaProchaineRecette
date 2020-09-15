from rest_framework import viewsets, permissions, authentication

from units.models import Unit
from units.serializers import UnitSerializer


class UnitViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Unit.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    authentication_classes = [
        authentication.TokenAuthentication
    ]
    serializer_class = UnitSerializer
