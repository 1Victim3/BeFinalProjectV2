from django.shortcuts import render
from django.contrib.auth.decorators import login_required

# 🚀 **Dashboard View**
@login_required(login_url="login")
def dashboard(request):
    print("Current User:", request.user)  # Debugging
    print("User Authenticated:", request.user.is_authenticated)
    return render(request, "dashboard/index.html")