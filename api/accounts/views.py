from rest_framework import permissions, viewsets

from accounts.models import CustomUser
from accounts.serializers import CustomUserSerializer


class CustomUserViewSet(viewsets.ModelViewSet):
    """ """

    # TODO build custom permission class for
    #  * Super user can do anything (e.g manage users)
    #  * Regular user can see themself
    #  * Regular user can update their password (with old one)
    #  * Unauthenticated user can sign up if there are no users (initial setup) or sign ups are enabled.
    #  * Serializer so we don't return the password but it can be set
    #  * Make a bunch of tests so we don't introduce some vulnerability
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    serializer_class = CustomUserSerializer
    queryset = CustomUser.objects.all()

    # def get_queryset(self):
    #     CustomUser.objects.all()

    # def create(self, request):
    #     total_users = CustomUser.objects.all().count()
    #     breakpoint()
    #     # if not (settings.SIGNUP_ENABLED or total_users == 0):
    #     #     raise PermissionDenied()
    #     return Response({})
