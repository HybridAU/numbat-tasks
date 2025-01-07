from django import forms
from django.contrib import admin
from django.forms import TextInput

from accounts.models import CustomUser


class CustomUserAdminForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["password"].widget = TextInput(attrs={"type": "password"})


@admin.register(CustomUser)
class CustomUserAdminAdmin(admin.ModelAdmin):
    form = CustomUserAdminForm
    list_display = [
        "email",
        "first_name",
        "last_name",
        "is_active",
    ]
    fields = [
        "email",
        "password",
        "first_name",
        "last_name",
        "is_superuser",
        "is_staff",
        "is_active",
        "groups",
        "user_permissions",
    ]
    search_fields = ["email"]
