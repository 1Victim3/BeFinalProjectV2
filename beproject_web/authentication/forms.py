from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import Doctor

class DoctorRegistrationForm(UserCreationForm):
    email = forms.EmailField(required=True, widget=forms.EmailInput(attrs={"placeholder": "Your Email"}))
    username = forms.CharField(widget=forms.TextInput(attrs={"placeholder": "Your actual name"}))

    class Meta:
        model = Doctor
        fields = ["username", "email", "password1", "password2"]  # phone_number removed
