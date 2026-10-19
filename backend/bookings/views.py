from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.db.models import Count, Sum, Q
from datetime import date
from .models import Booking
from .serializers import BookingCreateSerializer, BookingAdminSerializer
from .permissions import IsStaffUser


class BookingCreateView(generics.CreateAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingCreateSerializer
    permission_classes = [AllowAny]


class CabinAvailabilityView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, cabin_id):
        bookings = Booking.objects.filter(
            cabin_id=cabin_id,
            status__in=['pending', 'confirmed'],
        ).values('check_in', 'check_out')
        return Response(list(bookings))


# ---------- ADMIN ----------

class AdminBookingListView(generics.ListAPIView):
    """List all bookings, filterable by status and cabin."""
    serializer_class = BookingAdminSerializer
    permission_classes = [IsStaffUser]

    def get_queryset(self):
        qs = Booking.objects.select_related('cabin').all()
        status_filter = self.request.query_params.get('status')
        cabin_filter = self.request.query_params.get('cabin')
        search = self.request.query_params.get('search')

        if status_filter:
            qs = qs.filter(status=status_filter)
        if cabin_filter:
            qs = qs.filter(cabin_id=cabin_filter)
        if search:
            qs = qs.filter(
                Q(guest_name__icontains=search) | Q(guest_email__icontains=search)
            )
        return qs


class AdminBookingDetailView(generics.RetrieveUpdateAPIView):
    """Retrieve or update a single booking (e.g., change status)."""
    queryset = Booking.objects.select_related('cabin').all()
    serializer_class = BookingAdminSerializer
    permission_classes = [IsStaffUser]
    http_method_names = ['get', 'patch', 'head', 'options']


class AdminDashboardStatsView(APIView):
    """Summary numbers for the dashboard top cards."""
    permission_classes = [IsStaffUser]

    def get(self, request):
        today = date.today()
        qs = Booking.objects.all()

        confirmed = qs.filter(status='confirmed')
        revenue = confirmed.aggregate(total=Sum('total_price'))['total'] or 0

        return Response({
            'total_bookings': qs.count(),
            'pending_bookings': qs.filter(status='pending').count(),
            'confirmed_bookings': confirmed.count(),
            'cancelled_bookings': qs.filter(status='cancelled').count(),
            'upcoming_checkins': confirmed.filter(check_in__gte=today).count(),
            'total_revenue': float(revenue),
        })

from rest_framework.permissions import IsAuthenticated

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            'id': request.user.id,
            'username': request.user.username,
            'email': request.user.email,
            'is_staff': request.user.is_staff,
        })        