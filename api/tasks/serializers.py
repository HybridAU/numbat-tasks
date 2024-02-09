from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework_nested.serializers import NestedHyperlinkedModelSerializer

from tasks.models import List, Task


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


class ListSerializer(serializers.ModelSerializer):
    class Meta:
        model = List
        fields = ["id", "owner", "created", "updated", "name", "active"]

    owner = serializers.HiddenField(default=serializers.CurrentUserDefault())


class TaskSerializer(NestedHyperlinkedModelSerializer):
    class Meta:
        model = Task
        fields = ["id", "list", "created", "updated", "text", "complete"]

    list = serializers.HiddenField(default=ParentListDefault())
