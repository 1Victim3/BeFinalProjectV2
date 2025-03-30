from django.urls import path
from . import views
from django.contrib.auth.views import LogoutView


app_name = 'dashboard'  # Add this to use namespacing

urlpatterns = [
    path('logout/', LogoutView.as_view(next_page='glaucoma:index'), name='logout'),
    path('', views.dashboard, name='dashboard'),
    path('profile/',views.profile,name='profile'),
    path('change_password/',views.chng_passwd,name='change_password'),
    path('test/',views.new_tests,name='new_tests'),
    
]