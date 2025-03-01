from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('Respondent', 'Respondent'),
        ('Surveyor', 'Surveyor'),
    )
    
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='Respondent')

    def __str__(self):
        return self.username
