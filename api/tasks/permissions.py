from rest_framework import permissions


class IsListOwnerOrNone(permissions.BasePermission):
    """
    Is the owner of the object, or no access at all
    """

    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user


class IsTaskOwnerOrNone(permissions.BasePermission):
    """
    Is the owner of the parent list associated with a task, or no access at all
    """

    def has_object_permission(self, request, view, obj):
        return obj.list.owner == request.user


class IsSubTaskListOwnerOrNone(permissions.BasePermission):
    """
    Is the owner of the parent list associated with a subtask, or no access at all
    """

    def has_object_permission(self, request, view, obj):
        return obj.task.list.owner == request.user
