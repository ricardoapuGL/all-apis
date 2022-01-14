from rest_framework import viewsets, mixins
from core.models import Todo, User

from todo import serializers


class TodoViewSet(viewsets.GenericViewSet,
                  mixins.ListModelMixin,
                  mixins.CreateModelMixin):
    """Manage todos in the database"""

    def get_queryset(self):
        """Return objects for the current authenticated user only"""
        return self.queryset.order_by('-title').distinct()

    def perform_create(self, serializer):
        """Create a new object"""
        serializer.save()
    queryset = Todo.objects.all()
    serializer_class = serializers.TodoSerializer
