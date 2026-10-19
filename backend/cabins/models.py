from django.db import models
from django.utils.text import slugify


class Cabin(models.Model):
    UNIT_TYPE_CHOICES = [
        ('container', 'Container Unit'),
        ('capsule', 'Capsule House'),
    ]

    name = models.CharField(max_length=120)
    slug = models.SlugField(unique=True, blank=True)
    unit_type = models.CharField(
        max_length=20,
        choices=UNIT_TYPE_CHOICES,
        default='capsule',
    )
    description = models.TextField()
    price_per_night = models.DecimalField(max_digits=8, decimal_places=2)
    max_guests = models.PositiveIntegerField(default=2)
    bedrooms = models.PositiveIntegerField(default=1)
    bathrooms = models.PositiveIntegerField(default=1)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']
        verbose_name = 'Unit'
        verbose_name_plural = 'Units'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.get_unit_type_display()})"


class CabinImage(models.Model):
    cabin = models.ForeignKey(Cabin, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='cabins/')
    alt_text = models.CharField(max_length=150, blank=True)
    is_primary = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.cabin.name} — image {self.pk}"


class SiteSettings(models.Model):
    about_heading = models.CharField(max_length=200, default="Our Story")
    about_text = models.TextField(blank=True)
    about_image = models.ImageField(upload_to='site/', blank=True, null=True)
    contact_phone = models.CharField(max_length=30, blank=True)
    contact_email = models.EmailField(blank=True)
    contact_address = models.CharField(max_length=300, blank=True)
    map_embed_url = models.URLField(blank=True, help_text="Google Maps embed URL")

    class Meta:
        verbose_name = "Site Settings"
        verbose_name_plural = "Site Settings"

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def get(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj