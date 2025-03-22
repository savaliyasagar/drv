from django.contrib import admin
from .models import *

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1

class ProductSpecificationInline(admin.TabularInline):
    model = ProductSpecification
    extra = 1

class SubproductInline(admin.TabularInline):
    model = Product
    fk_name = 'parent_product'
    fields = ('name', 'description', 'category', 'is_featured')
    extra = 1
    verbose_name = "Subproduct"
    verbose_name_plural = "Subproducts"

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'is_featured', 'has_subproducts', 'parent_product')
    list_filter = ('category', 'is_featured', 'has_subproducts')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [ProductImageInline, ProductSpecificationInline, SubproductInline]
    search_fields = ('name', 'description')
    
    def save_model(self, request, obj, form, change):
        # Automatically set has_subproducts to True if this is a parent product
        if obj.parent_product is None:
            # Check if this product has any subproducts
            if change and Product.objects.filter(parent_product=obj).exists():
                obj.has_subproducts = True
        super().save_model(request, obj, form, change)
    
    def save_formset(self, request, form, formset, change):
        instances = formset.save(commit=False)
        
        # Check if any of the formsets are for subproducts
        for instance in instances:
            if isinstance(instance, Product) and instance.parent_product:
                # Set the parent's has_subproducts flag to True
                parent = instance.parent_product
                parent.has_subproducts = True
                parent.save()
            instance.save()
        
        # Also handle deleted instances
        for instance in formset.deleted_objects:
            instance.delete()
        
        formset.save_m2m()

@admin.register(ProductInquiry)
class ProductInquiryAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'product', 'created_at')
    list_filter = ('created_at', 'product')
    search_fields = ('name', 'email', 'phone', 'message', 'product__name')
    readonly_fields = ('created_at',)

@admin.register(ContactUs)
class ContactUsAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'created_at')
    search_fields = ('name', 'email', 'phone', 'message')
    readonly_fields = ('created_at',)


