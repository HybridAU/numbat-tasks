from django.conf import settings
from drf_spectacular.utils import extend_schema
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from accounts.models import CustomUser
from accounts.permissions import CustomUserPermissions
from accounts.serializers import (
    ChangePasswordSerializer,
    CustomUserSerializer,
    CustomUserSignupSerializer,
)


class CustomUserViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, CustomUserPermissions]
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    # Allow all the methods except "put" because put expects us to replace the whole object including
    # the password (and is_superuser) but we don't want to be able to update passwords directly
    http_method_names = ["get", "post", "patch", "delete", "head", "options"]

    @action(
        detail=False,
        methods=["post"],
        serializer_class=CustomUserSignupSerializer,
        permission_classes=(),
    )
    def signup(self, request):
        """
        Sign up is an unauthenticated endpoint that can be called to create a new user.
        However, it will only allow signups if either there are no existing users (i.e.
        the initial user) or if signups have been enabled.
        """
        is_initial_signup = CustomUser.objects.all().count() == 0
        if not is_initial_signup and not settings.SIGNUP_ENABLED:
            return Response(
                {"Error": "Signup is currently unavailable"},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = CustomUserSignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        new_user = serializer.save()
        # The first user to sign up is automatically a superuser
        new_user.is_superuser = is_initial_signup
        new_user.save()
        return Response(serializer.data)

    @extend_schema(request=ChangePasswordSerializer, responses=CustomUserSerializer)
    @action(detail=True, methods=["post"])
    def change_password(self, request):
        """ """
        pass
