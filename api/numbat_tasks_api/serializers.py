from rest_framework import serializers


class ConfigSerializer(serializers.Serializer):
    version = serializers.CharField()
    initial_setup = serializers.BooleanField()
    signup_enabled = serializers.BooleanField()
