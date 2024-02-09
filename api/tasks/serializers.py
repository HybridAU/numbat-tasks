from rest_framework import serializers
from tasks.models import List, Task


class ListSerializer(serializers.ModelSerializer):
    class Meta:
        model = List
        fields = ["id", "owner", "created", "updated", "name", "active"]

    owner = serializers.HiddenField(default=serializers.CurrentUserDefault())


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ["id", "created", "updated", "text", "complete"]
