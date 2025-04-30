from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
from django.conf import settings
import uuid
import time
import botocore.exceptions
import jwt
from boto3.dynamodb.conditions import Attr
    
def check_authorization(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        raise AuthenticationFailed('Authorization header is missing or malformed.')

    # Check if the header contains "Bearer"
    if not auth_header.startswith('Bearer '):
        raise AuthenticationFailed('Authorization header has no Bearer prefix.')
    
    token = auth_header.split(' ')[1]
    secret = settings.SUPABASE_JWT_SECRET
    payload = jwt.decode(token, secret, algorithms=["HS256"], audience="authenticated")
    return payload


@api_view(['POST'])
def create_form(request):
    payload = check_authorization(request)

    if not payload:
        return Response({"message": "User not authorized", "response": response}, status=200)

    if not payload['sub']:
        return Response({"error": "User is not authenticated"}, 
                        status=status.HTTP_401_UNAUTHORIZED)
    
    table = settings.DYNAMODB.Table('FormulateForms')
    data = request.data

    try: 
        response = table.put_item(
            Item={
                "form_id": f"{uuid.uuid4()}-{int(time.time())}",
                "form_name": data['form_name'],
                "form_description": data['form_description'],
                "questions": data['questions'],
                'authorId': payload['sub'],
                "responses": {}
            }
        )
        return Response({"message": "Form created successfully", "response": response}, status=200)
    except Exception as e:
        return Response({"message": "What table?", "error": str(e)}, status=400)


@api_view(['POST'])
def retrieve_user_forms(request):
    payload = check_authorization(request)

    if not payload:
        return Response({"message": "User not authorized", "response": response}, status=200)
    
    if not payload['sub']:
        return Response({"error": "User is not authenticated"}, 
                        status=status.HTTP_401_UNAUTHORIZED)
    
    authorId = request.data.get('authorId')

    try:
        table = settings.DYNAMODB.Table('FormulateForms')
        
        response = table.scan(
            FilterExpression=Attr('authorId').eq(authorId)
        )
        
        items = response.get("Items", [])

        return Response({
            "forms": items
        }, status=200)

    except botocore.exceptions.ClientError as e:
        return Response({
            "message": "API is up but DynamoDB check failed",
            "error": str(e)
        }, status=500)

    except Exception as e:
        return Response({
            "message": "Unexpected error during form retrieval",
            "error": str(e)
        }, status=500)


@api_view(["GET"])
def health_check(request):
    try:
        table = settings.DYNAMODB.Table('FormulateForms')
        
        # Perform a lightweight scan (limit to 1 item to reduce read costs)
        response = table.scan(Limit=2)
        items = response.get("Items", [])

        return Response({
            "message": "API is up and running",
            "dynamoDB": "Connected",
            "sample": items
        }, status=200)

    except botocore.exceptions.ClientError as e:
        return Response({
            "message": "API is up but DynamoDB check failed",
            "error": str(e)
        }, status=500)

    except Exception as e:
        return Response({
            "message": "Unexpected error during health check",
            "error": str(e)
        }, status=500)
