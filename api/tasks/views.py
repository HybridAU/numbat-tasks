from django.db.models import Case, IntegerField, When
from rest_framework import filters, viewsets
from rest_framework.decorators import action
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from tasks.models import List, SortOrder, SubTask, Task
from tasks.permissions import (
    IsListOwnerOrNone,
    IsSubTaskListOwnerOrNone,
    IsTaskOwnerOrNone,
)
from tasks.serializers import (
    EmptySerializer,
    ListSerializer,
    SubTaskSerializer,
    TaskSerializer,
)


class ListViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsListOwnerOrNone]
    serializer_class = ListSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["name", "tasks__text"]

    def get_queryset(self):
        return List.objects.filter(
            owner=self.request.user,
        ).order_by(
            "-pinned",
            "-created",
        )

    @action(detail=True, methods=["post"], serializer_class=EmptySerializer)
    def uncheck_all_tasks(self, request, pk):
        list_object = get_object_or_404(List, pk=pk, owner=self.request.user)
        all_tasks = list_object.tasks.all()
        all_tasks.update(complete=False)
        return Response({"status": "All tasks unchecked"})


class TaskViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsTaskOwnerOrNone]
    serializer_class = TaskSerializer

    def get_queryset(self):
        list_object = get_object_or_404(
            List.objects.all(),
            id=self.kwargs["list_pk"],
            owner=self.request.user,
        )
        if list_object.sort_order == SortOrder.MANUAL:
            # This essentially creates an ephemeral column called "position"
            # then adds a "when" statement e.g. When(id=5, position=3)
            # for each value in the manual_order list. If the task id is not
            # in the manual_order list, we default to position 0 make it show at the top.
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
                .order_by("position", "-created")
            )
        else:
            tasks = Task.objects.filter(list=list_object).order_by(
                list_object.sort_order
            )

        return tasks


class SubTaskViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsSubTaskListOwnerOrNone]
    serializer_class = SubTaskSerializer

    def get_queryset(self):
        task_object = get_object_or_404(
            Task.objects.all(),
            id=self.kwargs["task_pk"],
            list=self.kwargs["list_pk"],
        )
        subtasks = SubTask.objects.filter(task=task_object)

        return subtasks
