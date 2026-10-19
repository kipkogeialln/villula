from .views import SiteSettingsView
from django.urls import path
from .views import (
    CabinListView, CabinDetailView,
    AdminCabinListCreateView, AdminCabinDetailView,
)

urlpatterns = [
    path('cabins/', CabinListView.as_view(), name='cabin-list'),
    path('cabins/<slug:slug>/', CabinDetailView.as_view(), name='cabin-detail'),
    # Admin
    path('admin/cabins/', AdminCabinListCreateView.as_view(), name='admin-cabin-list'),
    path('admin/cabins/<int:pk>/', AdminCabinDetailView.as_view(), name='admin-cabin-detail'),
    path('site-settings/', SiteSettingsView.as_view(), name='site-settings'),

]