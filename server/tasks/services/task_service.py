from ..models import Subtask, Task
from django.db import transaction


def create_task(validated_data):
    """
    Create a new task with array of subtasks (optional) and array of categories (optional)

    Category retrieval and creation is handled by CategorySerializer
    """
    subtasks = validated_data.pop('subtasks', [])
    categories = validated_data.pop('categories', [])

    with transaction.atomic():
        task = Task.objects.create(**validated_data)
        task.categories.set(categories)

        for subtask in subtasks:
            Subtask.objects.create(task=task, **subtask)

    return task


def update_task(instance, validated_data):
    subtasks_data = validated_data.pop('subtasks', None)
    categories_data = validated_data.pop('categories', None)

    with transaction.atomic():
        # Update task
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Link categories
        if categories_data is not None:
            instance.categories.set(categories_data)

        # Update subtasks
        if subtasks_data is not None:
            # Delete all subtasks if array is empty
            if not subtasks_data:
                Subtask.objects.filter(task=instance).delete()
            else:
                existing_subtasks = {
                    subtask.id: subtask for subtask in instance.subtasks.all()
                }
                updated_ids = set()
                subtasks_to_update = []
                new_subtasks = []

                for subtask_data in subtasks_data:
                    subtask_id = subtask_data.get('id')

                    if subtask_id and subtask_id in existing_subtasks:
                        # Store in to update array
                        subtask = existing_subtasks[subtask_id]
                        for key, value in subtask_data.items():
                            setattr(subtask, key, value)
                        subtask.save()
                        subtasks_to_update.append(subtask)
                        updated_ids.add(subtask_id)
                    else:
                        # Store in new array
                        new_subtasks.append(Subtask(task=instance, **subtask_data))

                # Bulk update
                if subtasks_to_update:
                    Subtask.objects.bulk_update(
                        subtasks_to_update, ['name', 'is_completed']
                    )

                # Bulk create
                if new_subtasks:
                    created_subtasks = Subtask.objects.bulk_create(new_subtasks)
                    updated_ids.update(subtask.id for subtask in created_subtasks)

                # Delete subtasks that were removed from previous data
                if updated_ids:
                    subtasks_to_delete = Subtask.objects.filter(task=instance).exclude(
                        id__in=updated_ids
                    )
                    subtasks_to_delete.delete()

    return instance
