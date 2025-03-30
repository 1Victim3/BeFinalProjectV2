from django.shortcuts import render
from django.contrib.auth.decorators import login_required

@login_required(login_url='glaucoma:login')  # Redirects if user is not authenticated
def dashboard(request):
    return render(request, 'dashboard/dashboard.html')  # Make sure this file exists

@login_required(login_url='glaucoma:login')
def profile(request):
    return render(request,'dashboard/profile.html')

@login_required(login_url='glaucoma:login')
def chng_passwd(request):
    return render (request,'dashboard/change_password.html')

@login_required(login_url='glaucoma:login')
def new_tests(request):
    return render(request,'dashboard/new_tests.html')