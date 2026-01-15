from django.contrib.auth.hashers import make_password
from rest_framework import serializers

from accounts.models import CustomUser


class CustomUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ["id", "email", "password", "first_name", "last_name", "is_superuser"]

    def update(self, instance, validated_data):
        request = self.context.get("request")

        # Check if user is NOT a superuser
        if (
            request
            and not request.user.is_superuser
            and "is_superuser" in validated_data
        ):
            raise serializers.ValidationError(
                {"is_superuser": "Only superusers can edit this field."}
            )

        if "password" in validated_data:
            validated_data["password"] = make_password(validated_data["password"])

        return super().update(instance, validated_data)


class CustomUserSignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ["id", "email", "password", "first_name", "last_name"]
