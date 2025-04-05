from django.urls import path
from .views import health_check, create_form

urlpatterns = [
    path("health_check/", health_check, name="health_check"),
    path("create_form/", create_form, name="create_form"),
]
