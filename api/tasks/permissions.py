from rest_framework import permissions


class IsOwnerOrNone(permissions.BasePermission):
    """
    Is the owner of the object, or no access at all
    """

    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user
