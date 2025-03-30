from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login as auth_login
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.template.loader import get_template
from django.views.decorators.csrf import csrf_protect

# Signup View
from django.contrib.auth import login as auth_login  # Rename Django's login function
from django.contrib.auth.models import User
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate

def signup(request):
    if request.method == 'POST':
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        email = request.POST.get('email')
        password = request.POST.get('password')

        if not email:
            return render(request, 'glaucoma/signup.html', {'error': 'Email is required'})

        if User.objects.filter(email=email).exists():
            return render(request, 'glaucoma/signup.html', {'error': 'Email already in use'})

        user = User.objects.create_user(username=email, email=email, password=password)
        user.first_name = first_name
        user.last_name = last_name
        user.save()

        auth_login(request, user)  # Use Django's login function (renamed)
        return redirect('dashboard:dashboard')

    return render(request, 'glaucoma/signup.html')



def new_frontend(request):
      return render(request, 'glaucoma/3d.html')


# Define the index view
def index(request):
    try:
        template = get_template("login.html")  # Try without 'glaucoma/'
        return render(request, "glaucoma/index.html")
    except Exception as e:
        print("not found")
        return render(request, "glaucoma/index.html", {"error": str(e)})

# Define the index view
def about(request):
      return render(request, 'glaucoma/about.html')

# Define the index view
def contact(request):
      return render(request, 'glaucoma/contact.html')

# @login_required(login_url='login')  # Redirects to login page if not authenticated
# def dashboard(request):
#     return render(request, 'glaucoma/dashboard.html')

@csrf_protect
def login(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            auth_login(request, user)
            return redirect('dashboard:dashboard')
        else:
            return render(request, 'glaucoma/login.html', {'error': 'Invalid username or password'})
    return render(request, 'glaucoma/login.html')
