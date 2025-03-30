from datetime import date
from rest_framework import serializers

from .models import Category, Priority, Subtask, Task
from .services.task_service import create_task, update_task


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['name']

    def to_internal_value(self, data):
        # Ensure category names are capitalized and created if they don't exist
        capitalized_name = str(data).capitalize()
        category, _ = Category.objects.get_or_create(name=capitalized_name)
        return category

    def to_representation(self, instance):
        return instance.name


class SubtaskSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(required=False, allow_null=True)

    class Meta:
        model = Subtask
        fields = ['id', 'name', 'is_completed']


class TaskSerializer(serializers.ModelSerializer):
    priority = serializers.ChoiceField(
        choices=Priority.choices, default=Priority.MEDIUM
    )
    categories = CategorySerializer(many=True, required=False)
    subtasks = SubtaskSerializer(many=True, required=False)

    class Meta:
        model = Task
        fields = [
            'id',
            'name',
            'description',
            'priority',
            'is_completed',
            'due_date',
            'completed_date',
            'categories',
            'subtasks',
        ]

    def validate_due_date(self, value):
        if value is not None and value < date.today():
            raise serializers.ValidationError('Due date must be today or a later date')
        return value

    def create(self, validated_data):
        return create_task(validated_data)

    def update(self, instance, validated_data):
        return update_task(instance, validated_data)
