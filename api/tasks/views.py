from django.db.models import Case, IntegerField, When
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
        if list_object.sort_order == SortOrder.MANUAL:
            # TODO explain what's going on here... and write some unit tests
            when_statements = []
            for position, task_id in enumerate(list_object.manual_order):
                when_statements.append(When(id=task_id, then=position + 1))
            tasks = (
                Task.objects.filter(list=list_object)
                .annotate(
                    position=Case(
                        *when_statements,
                        default=0,
                        output_field=IntegerField(),
                    )
                )
                .order_by("position")
            )
        else:
            tasks = Task.objects.filter(list=list_object).order_by(
                list_object.sort_order
            )

        return tasks
