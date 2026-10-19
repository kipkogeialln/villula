from rest_framework import generics
from .models import Cabin
from .serializers import CabinListSerializer, CabinDetailSerializer
from .models import SiteSettings
from .serializers import SiteSettingsSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

class SiteSettingsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        settings_obj = SiteSettings.get()
        return Response(SiteSettingsSerializer(settings_obj, context={'request': request}).data)


class CabinListView(generics.ListAPIView):
    queryset = Cabin.objects.filter(is_active=True)
    serializer_class = CabinListSerializer


class CabinDetailView(generics.RetrieveAPIView):
    queryset = Cabin.objects.filter(is_active=True)
    serializer_class = CabinDetailSerializer
    lookup_field = 'slug'


from rest_framework import generics
from rest_framework.parsers import MultiPartParser, FormParser
from bookings.permissions import IsStaffUser
from .models import Cabin
from .serializers import CabinListSerializer, CabinDetailSerializer, CabinAdminSerializer


class CabinListView(generics.ListAPIView):
    queryset = Cabin.objects.filter(is_active=True)
    serializer_class = CabinListSerializer


class CabinDetailView(generics.RetrieveAPIView):
    queryset = Cabin.objects.filter(is_active=True)
    serializer_class = CabinDetailSerializer
    lookup_field = 'slug'


# ---------- ADMIN ----------

class AdminCabinListCreateView(generics.ListCreateAPIView):
    queryset = Cabin.objects.all()
    serializer_class = CabinAdminSerializer
    permission_classes = [IsStaffUser]
    parser_classes = [MultiPartParser, FormParser]


class AdminCabinDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Cabin.objects.all()
    serializer_class = CabinAdminSerializer
    permission_classes = [IsStaffUser]
    parser_classes = [MultiPartParser, FormParser]