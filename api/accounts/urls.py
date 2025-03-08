from django.urls import include, path
from rest_framework_nested import routers

from accounts import views

router = routers.SimpleRouter()
router.register(r"user", views.CustomUserViewSet, basename="user")

urlpatterns = [
    path("", include(router.urls)),
]
