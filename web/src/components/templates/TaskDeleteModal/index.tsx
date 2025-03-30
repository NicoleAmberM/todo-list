import { deleteTask, Task } from '@/api'
import { Modal } from '@/components/parts/Modal'

import { Stack, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useState } from 'react'

interface TaskFormProps {
  open: boolean
  task?: Pick<Task, 'id' | 'name'> | null
  handleClose: () => void
  refetch?: () => Promise<void>
}

export const TaskDeleteModal = ({
  open,
  task,
  handleClose,
  refetch
}: TaskFormProps) => {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!task) return
    setIsSubmitting(true)
    try {
      await deleteTask(task.id)
    } catch (e) {
      throw e
    } finally {
      setIsSubmitting(false)
      if (router.pathname === "/tasks") {
        refetch?.()
      } else {
        router.push("/tasks")
      }
      handleClose()
    }
  }

  if (!task) return null

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title='Delete Task'
      submitLabel='Delete'
      submitProps={{ color: 'error' }}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    >
      <Stack spacing={1} alignContent='center'>
        <Typography>Are you sure you want to delete this task?</Typography>
        <Typography pl={1} fontWeight={900}>• {task.name}</Typography>
      </Stack>
    </Modal>
  )
}
