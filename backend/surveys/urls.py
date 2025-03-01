from django.urls import path
from .views import health_check, sign_up, sign_in

urlpatterns = [
    path("signup/", sign_up, name="sign_up"),
    path("signin/", sign_in, name="sign_in"),
    path("health_check/", health_check, name="health_check"),
]
