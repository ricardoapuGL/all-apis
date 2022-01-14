from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets, mixins, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from core.models import Todo, User

from todo import serializers


class TodoViewSet(viewsets.GenericViewSet,
                  mixins.ListModelMixin,
                  mixins.CreateModelMixin):
    """Manage todos in the database"""
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    
    def get_queryset(self):
        """Return objects for the current authenticated user only"""
        return queryset.filter(
            user=self.request.user
        ).order_by('-title').distinct()

    def perform_create(self, serializer):
        """Create a new object"""
        serializer.save(user=self.request.user)
    queryset = Todo.objects.all()
    serializer_class = serializers.TodoSerializer