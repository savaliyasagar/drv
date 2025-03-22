from django.shortcuts import render
from django.shortcuts import render, get_object_or_404
from .models import *
from django.http import JsonResponse

# Create your views here.
def home(request):
    categories = Category.objects.all()[:5]  # Limit to 5 categories for the category grid
    
    # Get featured products for the product grid section
    featured_grid_products = Product.objects.filter(is_featured=True)[:3]
    
    # Get all products for the featured products section
    all_products = Product.objects.filter(parent_product=None).order_by('-created_at')
    
    # Split products into visible and hidden
    visible_products = all_products[:10]  # First 10 products are visible
    hidden_products = all_products[10:]   # Rest are hidden (shown after "Load More")
    
    context = {
        'categories': categories,
        'featured_grid_products': featured_grid_products,
        'visible_products': visible_products,
        'hidden_products': hidden_products,
    }
    return render(request, 'index.html', context)
def collections(request):
    categories = Category.objects.all()
    products = Product.objects.filter(parent_product=None)  # Only top-level products
    featured_products = Product.objects.filter(is_featured=True)[:3]
    
    context = {
        'categories': categories,
        'products': products,
        'featured_products': featured_products,
    }
    return render(request, 'collections.html', context)

def product_details_view(request, slug):
    product = get_object_or_404(Product, slug=slug)
    related_products = Product.objects.filter(category=product.category).exclude(id=product.id)[:3]
    
    context = {
        'product': product,
        'related_products': related_products,
    }
    return render(request, 'productdetails.html', context)

def product_subproducts_view(request, slug):
    product = get_object_or_404(Product, slug=slug)
    subproducts = product.subproducts.all()
    
    context = {
        'product': product,
        'subproducts': subproducts,
    }
    return render(request, 'subproducts.html', context)





def gallery(request):
    return render(request, 'gallery.html')
def contactus(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        email = request.POST.get('email')
        phone = request.POST.get('phone')
        subject = request.POST.get('subject')
        message = request.POST.get('message')   
        
        try:
            contact = ContactUs.objects.create(
                name=name,
                email=email,
                phone=phone,
                subject=subject,
                message=message
            )
            contact.save()
            
            # If it's an AJAX request, return JSON
            if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                return JsonResponse({
                    'status': 'success',
                    'message': 'Thank you for your inquiry. We will get back to you soon!'
                })
            
            # For regular form submission, redirect with a message
            messages.success(request, 'Thank you for your inquiry. We will get back to you soon!')
            return redirect('contactus')
            
        except Exception as e:
            print(f"Error saving contact form: {e}")
            if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                return JsonResponse({
                    'status': 'error',
                    'message': 'There was an error processing your request. Please try again.'
                })
            
            messages.error(request, 'There was an error processing your request. Please try again.')
    
    return render(request, 'contactus.html')

def inquiry(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        email = request.POST.get('email')
        phone = request.POST.get('phone')
        message = request.POST.get('message')      
        product_id = request.POST.get('product_id')

        try:
            data = ProductInquiry.objects.create(
                name=name,
                email=email,
                phone=phone,
                message=message,
                product_id=product_id
            )
            data.save()
            
            # If it's an AJAX request, return JSON
            if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                return JsonResponse({
                    'status': 'success',
                    'message': 'Thank you for your inquiry. We will get back to you soon!'
                })
            
            # For regular form submission, redirect with a message
            messages.success(request, 'Thank you for your inquiry. We will get back to you soon!')
            return redirect('contactus')
            
        except Exception as e:
            print(f"Error saving contact form: {e}")
            if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                return JsonResponse({
                    'status': 'error',
                    'message': 'There was an error processing your request. Please try again.'
                })
            
            messages.error(request, 'There was an error processing your request. Please try again.')
    
def productdetails(request):
    return render(request, 'productdetails.html')
def aboutus(request):
    return render(request, 'aboutus.html')
