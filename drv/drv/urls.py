"""
URL configuration for drv project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from home import views
from django.conf import settings
from django.conf.urls.static import static
urlpatterns = [
    path('admin/', admin.site.urls),
    path('',views.home, name='home'),
    path('collections/',views.collections, name='collections'),
    path('gallery/',views.gallery, name='gallery'),
    path('contactus/',views.contactus, name='contactus'),
    path('productdetails/',views.productdetails, name='productdetails'),
    path('aboutus/',views.aboutus, name='aboutus'),
    path('product/<slug:slug>/', views.product_details_view, name='productdetails'),
    path('product/<slug:slug>/variants/', views.product_subproducts_view, name='product_subproducts'),
    path('inquiry/', views.inquiry, name='inquiry'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)