from django.urls import path
from .views import (
    TaskListCreateView,
    TaskDetailView,
    CategoryListView,
    ToggleTaskCompletedView
)

urlpatterns = [
    path("tasks/", TaskListCreateView.as_view(), name="task-list-create"),
    path("tasks/<uuid:pk>/", TaskDetailView.as_view(), name="task-detail"),
    path("categories/", CategoryListView.as_view(), name="category-list"),
    path(
        "tasks/<uuid:pk>/toggle/",
        ToggleTaskCompletedView.as_view(),
        name="toggle-task-completed",
    ),
]
