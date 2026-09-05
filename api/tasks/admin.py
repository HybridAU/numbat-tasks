from django.contrib import admin

from tasks.models import List, SubTask, Task


@admin.register(List)
class ListAdmin(admin.ModelAdmin):
    list_display = ["id", "owner", "name", "archived"]


class SubTaskTabularInline(admin.TabularInline):
    model = SubTask
    extra = 1  # Number of empty placeholder rows to display by default


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ["id", "text_summary", "complete"]
    inlines = [SubTaskTabularInline]


@admin.register(SubTask)
class TaskAdmin(admin.ModelAdmin):
    list_display = ["id", "text_summary", "complete"]
