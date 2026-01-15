from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from accounts.models import CustomUser
from accounts.permissions import CustomUserPermissions
from accounts.serializers import CustomUserSerializer, CustomUserSignupSerializer

# TODO Plan:
#  * Work through each of the endpoints in order, think about what they would be used for
#  * Think about each of the use cases (e.g. Signup, password reset, etc...)
#  *


class CustomUserViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, CustomUserPermissions]
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

    # TODO more tests....
    @action(
        detail=False,
        methods=["post"],
        serializer_class=CustomUserSignupSerializer,
        permission_classes=(),
    )
    def signup(self, request):
        # list_object = get_object_or_404(List, pk=pk, owner=self.request.user)
        # all_tasks = list_object.tasks.all()
        # all_tasks.update(complete=False)
        return Response({"foo": "bar"})

    # def get_serializer_class(self):
    #     if self.action in {"list", "retrieve"}:
    #         return CustomUserDetailsSerializer
    #     elif self.action in {"create", "update", "partial_update"}:
    #         return CustomUserCreateSerializer
    #     else:  # Delete
    #         return None

    # def get_queryset(self):
    #     CustomUser.objects.all()

    # def create(self, request):
    #     total_users = CustomUser.objects.all().count()
    #     breakpoint()
    #     # if not (settings.SIGNUP_ENABLED or total_users == 0):
    #     #     raise PermissionDenied()
    #     return Response({})
