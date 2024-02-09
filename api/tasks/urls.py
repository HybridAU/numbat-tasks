from django.urls import include, path
from rest_framework.routers import DefaultRouter
from tasks import views

router = DefaultRouter(trailing_slash=False)
router.register(r"", views.TaskViewSet, basename="task")

urlpatterns = [
    path("", include(router.urls)),
]
