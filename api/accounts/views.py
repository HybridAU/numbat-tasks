from django.conf import settings
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from accounts.models import CustomUser
from accounts.permissions import CustomUserPermissions
from accounts.serializers import CustomUserSerializer, CustomUserSignupSerializer


class CustomUserViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, CustomUserPermissions]
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

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
