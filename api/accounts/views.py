from django.conf import settings
from django.contrib.auth.hashers import check_password
from drf_spectacular.utils import extend_schema
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.generics import get_object_or_404
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
                {"error": "Signup is currently unavailable"},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = CustomUserSignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        new_user = serializer.save()
        # The first user to sign up is automatically a superuser
        new_user.is_superuser = is_initial_signup
        new_user.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=["get"], url_path="self")
    def get_self(self, request):
        """
        Get details about yourself when you don't know your ID
        """
        return Response(CustomUserSerializer(request.user).data)

    @extend_schema(request=ChangePasswordSerializer, responses=CustomUserSerializer)
    @action(
        detail=True,
        methods=["post"],
        permission_classes=[permissions.IsAuthenticated],
    )
    def change_password(self, request, pk):
        """
        # There are two flows here;
        #  * A user changing their own password, must validate their old password
        #  * A superuser changing another users password, old password is not required.
        """
        user_object = get_object_or_404(CustomUser, pk=pk)
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if user_object == request.user and not check_password(
            password=serializer.validated_data.get("old_password"),
            encoded=user_object.password,
        ):
            return Response(
                {"old_password": "old_password does not match"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if user_object != request.user and not request.user.is_superuser:
            return Response(
                {"error": "Must be a super user to change another user's password"},
                status=status.HTTP_403_FORBIDDEN,
            )

        user_object.password = serializer.validated_data.get("new_password")
        user_object.save()
        return Response(CustomUserSerializer(user_object).data)
