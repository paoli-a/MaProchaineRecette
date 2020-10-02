from rest_framework import authentication, permissions, viewsets
from units.models import Unit
from units.serializers import UnitSerializer


class UnitViewSet(viewsets.ModelViewSet):
    queryset = Unit.objects.all()
    permission_classes = [permissions.AllowAny]
    authentication_classes = [authentication.TokenAuthentication]
    serializer_class = UnitSerializer
