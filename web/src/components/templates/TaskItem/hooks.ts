import { toggleTaskCompletion } from '@/api'
import useToggle from '@/hooks/useToggle'
import { formatDate } from '@/lib/utils'
import { TaskItemProps } from '.'

export const useHooks = ({ task, onDelete }: TaskItemProps) => {
  const {
    due_date,
    categories,
    subtasks,
    is_completed: defaultIsCompleted,
  } = task
  const completedSubtasksCount = subtasks?.filter((s) => s.is_completed).length
  const subtaskCount = subtasks?.length
  const dueDate = formatDate(due_date)
  const dateColor: 'error' | 'inherit' = due_date && new Date() >= new Date(due_date) ? 'error' : 'inherit'

  const { bool: isCompleted, toggle: toggleChecked } =
    useToggle(defaultIsCompleted)

  const handleDelete = () => {
    onDelete()
  }

  const toggleCompleted = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      await toggleTaskCompletion(task.id)
      toggleChecked()
    } catch (e) {
      console.error(e)
    }
  }

  return {
    completedSubtasksCount,
    subtaskCount,
    dueDate,
    dateColor,
    isCompleted,
    categories,
    handleDelete,
    toggleCompleted,
  }

}