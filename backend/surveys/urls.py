from django.urls import path
from .views import health_check, sign_up, sign_in, logout, get_csrf_token, create_form
from django.contrib.auth import views

urlpatterns = [
    path("signup/", sign_up, name="sign_up"),
    path("signin/", sign_in, name="sign_in"),
    path("logout/", logout, name="logout"),
    path("csrf/", get_csrf_token, name="get_csrf_token"),
    path("health_check/", health_check, name="health_check"),
    path("create_form/", create_form, name="create_form"),
]
