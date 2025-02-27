from django.urls import path
from .views import health_check 

urlpatterns = [
    # path("create/", create_survey, name="create_survey"),
    # path("list/", list_surveys, name="list_surveys"),
    path("health_check/", health_check, name="health_check"),
]
