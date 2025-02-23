from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import CustomUser


# TODO make this a viewsets.ModelViewSet and make some tests so we don't introduce some vulnerability
class Signup(APIView):
    """
    View to check if user signup is available
    """

    authentication_classes = ()
    permission_classes = ()

    def post(self, request, format=None):
        """
        Return a list of all users.
        """
        # Just a silly placeholder example
        users = CustomUser.objects.all()
        return Response(users.count())
