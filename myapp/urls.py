from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('data-entry/', views.data_entry, name='data_entry'),
    path('delete-entry/<int:entry_id>/', views.delete_entry, name='delete_entry'),
]