from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .serializers import SignUpSerializer, SignInSerializer
from django.contrib.auth import authenticate, login, logout
from django.conf import settings
import uuid
import time
import re

# import psycopg2
# from dotenv import load_dotenv
# import os

# load_dotenv()

# # Fetch variables
# USER = os.getenv("user")
# PASSWORD = os.getenv("password")
# HOST = os.getenv("host")
# PORT = os.getenv("port")
# DBNAME = os.getenv("dbname")

def camel_to_snake(name):
    return re.sub(r'([a-z0-9])([A-Z])', r'\1_\2', name).lower()

def convert_camel_to_snake_case(data):
    if isinstance(data, dict):
        return {camel_to_snake(key): convert_camel_to_snake_case(value) for key, value in data.items()}
    elif isinstance(data, list):
        return [convert_camel_to_snake_case(item) for item in data]
    else:
        return data

@api_view(['POST'])
def sign_in(request):
    serializer = SignInSerializer(data=request.data)
    if serializer.is_valid():
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)  # Log the user in and create a session
            
            # Ensure session key exists
            if not request.session.session_key:
                request.session.create()

            response = Response({'message': 'Sign in successful'}, status=status.HTTP_200_OK)

            response.set_cookie(
                key="sessionid",
                value=request.session.session_key,
                httponly=True,  # Prevents JavaScript access (XSS protection)
                secure=False,  # Set to True in production (HTTPS required)
                samesite="Lax",  # Helps with CSRF protection
            )
            return response
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
def get_csrf_token(request):
    print(request.COOKIES.get('csrftoken'))
    return Response({"csrfToken": request.COOKIES.get('csrftoken')}, status=200)

@api_view(['POST'])
def logout(request):
    try:
        django_request = request._request
        logout(django_request)  # Log the user out using the original request

        response = Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)
        response.delete_cookie("sessionid")  # Delete the session cookie
        response.delete_cookie("csrftoken")  # Delete the CSRF token cookie
        return response
    except Exception as e:
        print(f"Error during logout: {e}")
        return Response({"error": "An error occurred during logout"}, status=500)

@api_view(['POST'])
def create_form(request):
    print(f"User: {request.user}, Authenticated: {request.user.is_authenticated}")
    if not request.user.is_authenticated:
        return Response({"error": "User is not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)
    
    table = settings.DYNAMODB.Table('FormulateForms')
    data = request.data

    response = table.put_item(
		Item={
            "form_id": f"{uuid.uuid4()}-{int(time.time())}",
			"form_name": data['form_name'],
            "form_description": data['form_description'],
			"questions": data['questions'],
            'id': request.user.id,
            "responses": {}
		}
	)
    return Response({"message": "Form created successfully", "response": response}, status=200)

@api_view(["GET"])
def health_check(request):
    return Response({"message": "API is up and running"}, status=200)
