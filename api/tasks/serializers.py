from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework_nested.serializers import NestedHyperlinkedModelSerializer

from tasks.models import List, SubTask, Task


class ParentListDefault:
    requires_context = True

    def __call__(self, serializer_field):
        list_id = serializer_field.context["view"].kwargs["list_pk"]
        parent_list = List.objects.filter(id=list_id).first()
        if (
            not parent_list
            or parent_list.owner != serializer_field.context["request"].user
        ):
            raise ValidationError()
        return parent_list


class ParentTaskDefault:
    requires_context = True

    def __call__(self, serializer_field):
        list_id = serializer_field.context["view"].kwargs["list_pk"]
        parent_list = List.objects.filter(id=list_id).first()

        task_id = serializer_field.context["view"].kwargs["task_pk"]
        parent_task = Task.objects.filter(id=task_id, list=parent_list).first()
        if (
            not parent_list
            or not parent_task
            or parent_list.owner != serializer_field.context["request"].user
        ):
            raise ValidationError()
        return parent_task


class ListSerializer(serializers.ModelSerializer):
    class Meta:
        model = List
        fields = [
            "id",
            "owner",
            "created",
            "updated",
            "name",
            "pinned",
            "sort_order",
            "manual_order",
            "archived",
        ]

    owner = serializers.HiddenField(default=serializers.CurrentUserDefault())


class EmptySerializer(serializers.Serializer):
    """
    An empty serializer, that can be used for endpoints that take a POST with no data / body
    (e.g. the uncheck_all_tasks endpoint)
    """

    pass


class SubTaskSerializer(NestedHyperlinkedModelSerializer):
    class Meta:
        model = SubTask
        fields = ["id", "created", "updated", "text", "complete", "task"]

    task = serializers.HiddenField(default=ParentTaskDefault())


class TaskSerializer(NestedHyperlinkedModelSerializer):
    class Meta:
        model = Task
        fields = ["id", "list", "created", "updated", "text", "complete", "subtasks"]

    list = serializers.HiddenField(default=ParentListDefault())
    subtasks = SubTaskSerializer(many=True, read_only=True)
