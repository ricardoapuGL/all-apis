from django.contrib.auth import get_user_model, authenticate
from django.utils.translation import ugettext_lazy as _

from rest_framework import serializers
from core.models import Todo


class UserSerializer(serializers.ModelSerializer):
    """Serializer for the users object"""
    todos = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Todo.objects.all()
    )

    class Meta:
        model = get_user_model()
        fields = ('email', 'password', 'name', 'todos')
        extra_kwargs = {'password': {'write_only': True, 'min_length': 5}}

    def create(self, validated_data):
        """Create a new user with encrypted password and return it"""
        return get_user_model().objects.create_user(**validated_data)

    def update(self, instance, validated_data):
        """Update a user, setting the password correctly and return it"""
        password = validated_data.pop('password', None)
        user = super().update(instance, validated_data)

        if password:
            user.set_password(password)
            user.save()

        return user
