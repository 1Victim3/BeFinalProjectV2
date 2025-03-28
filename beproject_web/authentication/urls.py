from django.urls import path
from .views import register, doctor_login, doctor_logout

urlpatterns = [
    path("register/", register, name="register"),
    path("login/", doctor_login, name="login"),
    path("logout/", doctor_logout, name="logout"),
]
