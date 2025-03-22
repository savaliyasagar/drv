from django.db import models
from django.urls import reverse
from django.utils.text import slugify

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True)
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Categories"

class Product(models.Model):
    FINISH_CHOICES = [
        ('matte_black', 'Matte Black'),
        ('brushed_brass', 'Brushed Brass'),
        ('oil_rubbed_bronze', 'Oil Rubbed Bronze'),
        ('brushed_nickel', 'Brushed Nickel'),
    ]
    
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField()
    features = models.TextField(help_text="Enter features separated by newlines")
    rating = models.DecimalField(max_digits=2, decimal_places=1, default=5.0)
    available_finishes = models.CharField(max_length=255, help_text="Comma separated list of finishes")
    is_featured = models.BooleanField(default=False)
    has_subproducts = models.BooleanField(default=False)
    parent_product = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='subproducts')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def get_absolute_url(self):
        if self.has_subproducts:
            return reverse('product_subproducts', args=[self.slug])
        return reverse('productdetails', args=[self.slug])
    
    def get_features_list(self):
        return self.features.split('\n')
    
    def get_finishes_list(self):
        return self.available_finishes.split(',')
    
    def __str__(self):
        return self.name

class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/')
    is_primary = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Image for {self.product.name}"

class ProductSpecification(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='specifications')
    product_code = models.CharField(max_length=50)
    size = models.CharField(max_length=50)
    weight = models.CharField(max_length=50)
    material = models.CharField(max_length=100)
    premium_level = models.CharField(max_length=50)
    
    def __str__(self):
        return f"Spec for {self.product.name} - {self.product_code}"


class ContactUs(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    subject = models.CharField(max_length=200)  # Add this field
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Inquiry from {self.name}"
    
class ProductInquiry(models.Model):
    product = models.ForeignKey('Product', on_delete=models.CASCADE, related_name='inquiries')
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Inquiry from {self.name}"

