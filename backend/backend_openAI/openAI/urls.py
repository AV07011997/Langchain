from django.urls import path
from . import views

urlpatterns = [
    path('',views.Upload,name="Upload"),
    path('agent/',views.Agent,name="Agent"),
    path('reset/',views.reset,name="reset")
]