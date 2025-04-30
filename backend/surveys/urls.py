from django.urls import path
from .views import health_check, create_form, retrieve_user_forms

urlpatterns = [
    path("health_check/", health_check, name="health_check"),
    path("create_form/", create_form, name="create_form"),
    path("retrieve_user_forms/", retrieve_user_forms, name="retrieve_user_forms"),
]
