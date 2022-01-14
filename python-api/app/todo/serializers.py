from rest_framework import serializers

from core.models import Todo


class TodoSerializer(serializers.ModelSerializer):
    """Serializer for tag objects"""

    class Meta:
        model = Todo
        fields = ('id', 'title')
        read_only_fields = ('id',)

