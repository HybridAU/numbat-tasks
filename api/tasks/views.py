from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from tasks.models import List, Task
from tasks.permissions import IsListOwnerOrNone, IsOwnerOrNone
from tasks.serializers import ListSerializer, TaskSerializer


class ListViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsOwnerOrNone]
    serializer_class = ListSerializer

    def get_queryset(self):
        return List.objects.filter(owner=self.request.user)


class TaskViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsListOwnerOrNone]
    serializer_class = TaskSerializer

    def get_queryset(self):
        return Task.objects.filter(list=self.kwargs["list_pk"])
