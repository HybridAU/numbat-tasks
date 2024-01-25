from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from tasks.models import Task
from tasks.permissions import IsOwnerOrNone
from tasks.serializers import TaskSerializer


class TaskViewSet(viewsets.ModelViewSet):
    """
    TODO
    """

    permission_classes = [IsAuthenticated, IsOwnerOrNone]
    # TODO filter to current user
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
