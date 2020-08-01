from rest_framework import viewsets, permissions, authentication

from unites.models import Unite
from unites.serializers import UniteSerializer


class UniteViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Unite.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    authentication_classes = [
        authentication.TokenAuthentication
    ]
    serializer_class = UniteSerializer
