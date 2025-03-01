from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .serializers import SignUpSerializer, SignInSerializer
from django.contrib.auth import authenticate

import re

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
def sign_up(request):
    converted_data = convert_camel_to_snake_case(request.data)
    serializer = SignUpSerializer(data=converted_data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def sign_in(request):
    serializer = SignInSerializer(data=request.data)
    if serializer.is_valid():
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            # Optionally, you can add login logic here if you want to maintain session
            return Response({'message': 'Sign in successful'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
def health_check(request):
    return Response({"message": "API is up and running"}, status=200)