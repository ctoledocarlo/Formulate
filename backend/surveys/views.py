from django.shortcuts import render

from rest_framework.response import Response
from rest_framework.decorators import api_view
# from .models import Survey

# @api_view(["POST"])
# def create_survey(request):
#     survey = Survey()
#     survey_data = request.data
#     survey.create_survey(survey_data)
#     return Response({"message": "Survey created successfully"}, status=201)

# @api_view(["GET"])
# def list_surveys(request):
#     survey = Survey()
#     return Response(survey.list_surveys(), status=200)

@api_view(["GET"])
def health_check(request):
    return Response({"message": "API is up and running"}, status=200)