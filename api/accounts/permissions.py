from rest_framework import permissions
from rest_framework.permissions import SAFE_METHODS


class CustomUserPermissions(permissions.BasePermission):
    """
    TODO another doc string
    """

    # TODO build custom permission class for
    #  * Super user can do anything (e.g manage users)
    #  * Regular user can see themself
    #  * Regular user can update their password (with old one)
    #   * Regular user can't make themself a superuser
    #  * Unauthenticated user can sign up if there are no users (initial setup) or sign ups are enabled.
    #  * Serializer so we don't return the password but it can be set
    #  * Make a bunch of tests so we don't introduce some vulnerability
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
            # regular users can update themselves, as long as they are not trying to change
            # their "is_superuser" status, we also do this check again after the data is validated
            # incase there is any deserialization shenanigans like changing the case or something.
            return "is_superuser" not in request.data

        return request.user.is_superuser
