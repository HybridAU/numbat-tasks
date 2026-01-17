from rest_framework import serializers

from accounts.models import CustomUser


class CustomUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ["id", "email", "password", "first_name", "last_name", "is_superuser"]

    def update(self, instance, validated_data):
        request = self.context.get("request")

        # Only superusers can modify the "is_superuser" field
        if (
            request
            and not request.user.is_superuser
            and "is_superuser" in validated_data
        ):
            raise serializers.ValidationError(
                {"is_superuser": "Only superusers can edit this field."}
            )

        if request and "password" in validated_data:
            # We also enforce this in the CustomUserPermissions.has_object_permission so in theory
            # we should never hit this block of code, but defensive programming we check here too.
            raise serializers.ValidationError(
                {"password": "Use the change_password endpoint to update passwords"}
            )

        return super().update(instance, validated_data)


class CustomUserSignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    is_superuser = serializers.BooleanField(read_only=True)

    class Meta:
        model = CustomUser
        fields = ["id", "email", "password", "first_name", "last_name", "is_superuser"]


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True, required=False)
    new_password = serializers.CharField(write_only=True)
