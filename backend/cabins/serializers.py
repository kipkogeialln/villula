from rest_framework import serializers
from .models import Cabin, CabinImage, SiteSettings


class CabinImageSerializer(serializers.ModelSerializer):
    image = serializers.ImageField()

    class Meta:
        model = CabinImage
        fields = ('id', 'image', 'alt_text', 'is_primary')


class CabinListSerializer(serializers.ModelSerializer):
    primary_image = serializers.SerializerMethodField()

    class Meta:
        model = Cabin
        fields = ('id', 'name', 'slug', 'unit_type', 'price_per_night', 'max_guests', 'primary_image')

    def get_primary_image(self, obj):
        img = obj.images.filter(is_primary=True).first() or obj.images.first()
        if img:
            request = self.context.get('request')
            return request.build_absolute_uri(img.image.url) if request else img.image.url
        return None


class CabinDetailSerializer(serializers.ModelSerializer):
    images = CabinImageSerializer(many=True, read_only=True)

    class Meta:
        model = Cabin
        fields = '__all__'


class CabinAdminSerializer(serializers.ModelSerializer):
    primary_image = serializers.SerializerMethodField()

    class Meta:
        model = Cabin
        fields = '__all__'
        read_only_fields = ('slug', 'created_at')

    def get_primary_image(self, obj):
        img = obj.images.filter(is_primary=True).first() or obj.images.first()
        if img:
            request = self.context.get('request')
            return request.build_absolute_uri(img.image.url) if request else img.image.url
        return None        


class SiteSettingsSerializer(serializers.ModelSerializer):
    about_image = serializers.SerializerMethodField()

    class Meta:
        model = SiteSettings
        fields = '__all__'

    def get_about_image(self, obj):
        if obj.about_image:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.about_image.url) if request else obj.about_image.url
        return None