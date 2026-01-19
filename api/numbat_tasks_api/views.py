from django.conf import settings
from drf_spectacular.utils import extend_schema
from rest_framework.response import Response
from rest_framework.views import APIView

import numbat_tasks_api
from accounts.models import CustomUser
from numbat_tasks_api.serializers import ConfigSerializer


class Config(APIView):
    """
    View to check if user signup is available
    """

    authentication_classes = ()
    permission_classes = ()

    @extend_schema(responses=ConfigSerializer)
    def get(self, request):
        """
        API Configuration information
        """
        config = ConfigSerializer(
            instance={
                "version": numbat_tasks_api.__version__,
                "initial_setup": not CustomUser.objects.all().exists(),
                "signup_enabled": settings.SIGNUP_ENABLED,
            }
        )
        return Response(config.data)
