from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission

class Doctor(AbstractUser):
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    # Add related_name to resolve conflicts
    groups = models.ManyToManyField(Group, related_name="doctor_groups", blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name="doctor_permissions", blank=True)

    def __str__(self):
        return self.username
