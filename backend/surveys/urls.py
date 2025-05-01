from django.urls import path
from . import views

urlpatterns = [
    path("health_check/", views.health_check, name="health_check"),
    path("create_form/", views.create_form, name="create_form"),
    path("retrieve_user_forms/", views.retrieve_user_forms, name="retrieve_user_forms"),
    path("forms/retrieve_form/", views.retrieve_form, name="retrieve_form"),
    path("forms/edit_form/", views.edit_form, name="edit_form")
]
