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
    
    authorId = payload['sub']

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


@api_view(['GET'])
def retrieve_form(request):
    payload = check_authorization(request)

    if not payload:
        return Response({"message": "User not authorized"}, status=status.HTTP_401_UNAUTHORIZED)
    
    if not payload.get('sub'):
        return Response({"error": "User is not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)

    form_id = request.query_params.get("form_id")
    if not form_id:
        return Response({"error": "Missing form_id in query parameters"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        table = settings.DYNAMODB.Table('FormulateForms')
        
        response = table.scan(
            FilterExpression=Attr('form_id').eq(form_id)
        )
        
        items = response.get("Items", [])

        return Response({
            "form": items
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


@api_view(['PUT'])
def edit_form(request):
    payload = check_authorization(request)

    if not payload:
        return Response({"message": "User not authorized"}, status=status.HTTP_401_UNAUTHORIZED)
    
    authorId = payload.get('sub')
    
    if not authorId:
        return Response({"error": "User is not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)
    
    print(request.data)
    data = request.data
    form_id = data.get("form_id")

    form_id = request.query_params.get("form_id")
    table = settings.DYNAMODB.Table('FormulateForms')

    try:
        response = table.get_item(Key={'form_id': form_id})
        form = response.get('Item')

        if not form or form.get("authorId") != authorId:
            return Response({"error": "Form not found or unauthorized"}, status=404)

        updated_form = {
            'form_id': form_id,
            'form_name': data.get('form_name'),
            'form_description': data.get('form_description'),
            'questions': data.get('questions'),
            'authorId': authorId,  
            'responses': form.get('responses', {}) 
        }

        table.put_item(Item=updated_form)
        return Response({"message": "Form updated successfully", "form": updated_form}, status=200)

    except Exception as e:
        return Response({"error": str(e)}, status=500)


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
