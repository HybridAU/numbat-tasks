from django.contrib import admin

from tasks.models import List, Task


@admin.register(List)
class ListAdmin(admin.ModelAdmin):
    list_display = ["id", "owner", "name", "archived"]


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ["id", "text_summary", "complete"]
