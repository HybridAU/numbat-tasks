from rest_framework import serializers
from tasks.models import Task


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ["id", "owner", "created", "updated", "text", "complete"]

    owner = serializers.ReadOnlyField(source="owner.email")

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
