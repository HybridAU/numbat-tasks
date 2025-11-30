from rest_framework import viewsets
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated

from tasks.models import List, SortOrder, Task
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
        list_object = get_object_or_404(
            List,
            id=self.kwargs["list_pk"],
            owner=self.request.user,
        )
        tasks = Task.objects.filter(list=list_object)
        if list_object.sort_order == SortOrder.MANUAL:
            # Not implemented yet
            pass
        else:
            tasks.order_by(list_object.sort_order)

        return tasks
