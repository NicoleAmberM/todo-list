from django.shortcuts import render

from django.shortcuts import render
from rest_framework import generics, status, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend

from .models import Task, Category
from .serializers import TaskSerializer, CategorySerializer


class TaskListCreateView(generics.ListCreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['priority', 'is_completed']
    ordering_fields = ['created_at', 'due_date', 'completed_date', 'priority']
    ordering = ['-created_at']


class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class ToggleTaskCompletedView(APIView):
    def patch(self, request, pk, format=None):
        try:
            task = Task.objects.get(pk=pk)

            task.is_completed = not task.is_completed

            if task.is_completed:
                task.completed_date = timezone.now().date()
            else:
                task.completed_date = None

            task.save()
            serializer = TaskSerializer(task)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Task.DoesNotExist:
            return Response(
                {'detail': 'Task not found.'}, status=status.HTTP_404_NOT_FOUND
            )
