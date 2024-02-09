from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from tasks.models import Task
from tasks.permissions import IsOwnerOrNone
from tasks.serializers import TaskSerializer


class TaskViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsOwnerOrNone]
    serializer_class = TaskSerializer

    def get_queryset(self):
        return Task.objects.filter(owner=self.request.user)
