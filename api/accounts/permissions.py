from rest_framework import permissions
from rest_framework.permissions import SAFE_METHODS


class CustomUserPermissions(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True

        # Regular users can update themselves (PUT and PATCH), so we allow it.
        # Making sure it's only themselves they can update, and not other uses is done in
        # has_object_permission below.
        if request.method in ("PUT", "PATCH"):
            return True

        # Super
        return request.user.is_superuser

    def has_object_permission(self, request, view, obj):
        if request.user == obj:
            # Users can update themselves, but they can't change their "is_superuser" status,
            # or their password (use the change_password endpoint for that) we also check again after the
            # data is validated incase there is any deserialization shenanigans like changing the case or something
            return "is_superuser" not in request.data and "password" not in request.data

        return request.user.is_superuser
