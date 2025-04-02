# serializers.py in your app directory
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class SignInSerializer(serializers.Serializer):
    username = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)