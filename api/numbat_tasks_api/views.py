from django.conf import settings
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import CustomUser


class Config(APIView):
    """
    View to check if user signup is available
    """

    authentication_classes = ()
    permission_classes = ()

    # TODO extend_schema so there is some docs
    def get(self, request, format=None):
        """
        API Configuration information
        """
        version = "0.3.0"
        initial_setup = CustomUser.objects.all().count() == 0
        signup_enabled = settings.SIGNUP_ENABLED
        return Response(
            {
                "version": version,
                "initial_setup": initial_setup,
                "signup_enabled": signup_enabled,
            }
        )
