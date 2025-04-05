from django.db import models
from django.urls import reverse
from django.utils.text import slugify
from django.core.validators import MinValueValidator, MaxValueValidator

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

class GalleryCategory(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True)
    
    class Meta:
        verbose_name_plural = 'Gallery Categories'
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name

class GalleryItem(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to='gallery/')
    category = models.ForeignKey(GalleryCategory, on_delete=models.CASCADE, related_name='gallery_items')
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title

class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to='projects/')
    link = models.URLField(blank=True)
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title

class CompanyStory(models.Model):
    title = models.CharField(max_length=200, default="Our Story")
    content = models.TextField()
    image = models.ImageField(upload_to='about/')
    
    def __str__(self):
        return self.title
    
    class Meta:
        verbose_name_plural = "Company Story"

class Value(models.Model):
    ICON_CHOICES = [
        ('gem', 'Gem'),
        ('pencil-ruler', 'Design'),
        ('leaf', 'Leaf'),
        ('handshake', 'Handshake'),
        ('medal', 'Medal'),
        ('heart', 'Heart'),
        ('lightbulb', 'Lightbulb'),
        ('users', 'Team'),
        ('globe', 'Globe'),
        ('star', 'Star'),
    ]
    
    title = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.CharField(max_length=50, choices=ICON_CHOICES)
    order = models.PositiveIntegerField(default=0)
    
    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ['order']

class ManufacturingStep(models.Model):
    step_number = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    title = models.CharField(max_length=100)
    description = models.TextField()
    
    def __str__(self):
        return f"Step {self.step_number}: {self.title}"
    
    class Meta:
        ordering = ['step_number']

class TeamMember(models.Model):
    name = models.CharField(max_length=100)
    position = models.CharField(max_length=100)
    bio = models.TextField()
    image = models.ImageField(upload_to='team/')
    order = models.PositiveIntegerField(default=0)
    
    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['order']



