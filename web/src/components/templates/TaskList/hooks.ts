import { Task, useGetCategories, useGetTasks } from '@/api'
import useToggle from '@/hooks/useToggle'
import { useState } from 'react'

export const useHooks = () => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  
    const { tasks, loading, error, refetchTasks } = useGetTasks()
    const { categories, refetchCategories } = useGetCategories()
  
    const { bool: openForm, on: handleOpenForm, off: handleCloseForm } = useToggle()
    const { bool: openDeleteModal, on: handleOpenDeleteModal, off: handleCloseDeleteModal } = useToggle()
  
    const refetchData = () => {
      refetchTasks()
      refetchCategories()
    }
  
    const handleOpenDelete = (task: Task) => {
      setSelectedTask(task)
      handleOpenDeleteModal()
    }

    return {
      selectedTask,
      setSelectedTask,
      tasks,
      loading,
      error,
      refetchTasks,
      categories,
      refetchCategories,
      handleOpenForm,
      handleCloseForm,
      openForm,
      handleOpenDelete,
      handleCloseDeleteModal,
      openDeleteModal,
      refetchData,
    }
}