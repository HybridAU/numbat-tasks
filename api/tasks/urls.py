from django.urls import include, path
from rest_framework_nested import routers

from tasks import views

router = routers.SimpleRouter()
router.register(r"list", views.ListViewSet, basename="list")

list_router = routers.NestedSimpleRouter(router, r"list", lookup="list")
list_router.register(r"task", views.TaskViewSet, basename="task")

urlpatterns = [
    path("", include(router.urls)),
    path("", include(list_router.urls)),
]
