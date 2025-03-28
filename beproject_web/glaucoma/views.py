from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login as auth_login
from django.shortcuts import render, redirect
import openai
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings

# Signup View
def signup(request):
    if request.method == 'POST':
        username = request.POST['username']
        email = request.POST['email']
        password = request.POST['password']
        if User.objects.filter(username=username).exists():
            return render(request, 'glaucoma/signup.html', {'error': 'Username already exists'})
        user = User.objects.create_user(username=username, email=email, password=password)
        return redirect('login')
    return render(request, 'glaucoma/signup.html')


def new_frontend(request):
      return render(request, 'glaucoma/3d.html')


# Define the index view
def index(request):
      return render(request, 'glaucoma/index.html')


# Define the index view
def about(request):
      return render(request, 'glaucoma/about.html')

# Define the index view
def contact(request):
      return render(request, 'glaucoma/contact.html')

# Login View
def login(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            auth_login(request, user)
            return redirect('index')
        else:
            return render(request, 'glaucoma/login.html', {'error': 'Invalid username or password'})
    return render(request, 'glaucoma/login.html')

