from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth import get_user_model
from .forms import DoctorRegistrationForm

User = get_user_model()

def register(request):
    if request.method == "POST":
        form = DoctorRegistrationForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data["username"]
            email = form.cleaned_data["email"]

            # Check if username or email already exists
            if User.objects.filter(username=username).exists():
                messages.error(request, "Username already taken. Please choose another.")
                return render(request, "authentication/register.html", {"form": form})
            if User.objects.filter(email=email).exists():
                messages.error(request, "Email already registered. Try logging in.")
                return render(request, "authentication/register.html", {"form": form})

            # Create user if no conflicts
            user = form.save(commit=False)
            user.set_password(form.cleaned_data["password1"])  # Hash password correctly
            user.save()
            login(request, user)
            messages.success(request, "Account created successfully!")
            return redirect("dashboard")

        else:
            messages.error(request, "Please correct the errors below.")
            print("Form errors:", form.errors)

    else:
        form = DoctorRegistrationForm()

    return render(request, "authentication/register.html", {"form": form})


def doctor_login(request):
    if request.method == "POST":
        identifier = request.POST["username"]  # Can be username or email
        password = request.POST["password"]

        print(f"Login attempt: Username/Email={identifier}, Password={password}")  # Debugging

        # Authenticate with username
        user = authenticate(request, username=identifier, password=password)
        print(f"User after username authentication: {user}")  # Debugging

        if user is None:  # If username fails, try email
            from django.contrib.auth import get_user_model
            User = get_user_model()
            try:
                user_obj = User.objects.get(email=identifier)
                print(f"User found by email: {user_obj}")  # Debugging
                user = authenticate(request, username=user_obj.username, password=password)
                print(f"User after email authentication: {user}")  # Debugging
            except User.DoesNotExist:
                user = None
                print("No user found with that email.")  # Debugging

        if user:
            login(request, user)
            messages.success(request, "Successfully logged in!")
            return redirect("dashboard")
        else:
            messages.error(request, "Invalid credentials. Please try again.")

    return render(request, "authentication/login.html")


# ✅ Logout View (Redirects to Login After Logout)
def doctor_logout(request):
    logout(request)
    return redirect("login")
