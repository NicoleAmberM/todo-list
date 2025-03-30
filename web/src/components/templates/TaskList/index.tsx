
import AddIcon from '@mui/icons-material/Add'
import { Alert } from '@mui/material'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { TaskItem } from '../TaskItem'
import { Task, useGetCategories, useGetTasks } from '@/api'
import { TaskAddModal } from '../TaskAddModal'
import useToggle from '@/hooks/useToggle'
import { TaskDeleteModal } from '../TaskDeleteModal'
import { useState } from 'react'

export type AlertState = {
  message: string
  severity: "success" | "error"
  open: boolean
}


export const TaskList = () => {
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

  if (loading) return null // todo add loading
  if (error) return <Alert severity="error">{error}</Alert>

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      <Stack
        spacing={2}
        sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          width="100%"
          justifyContent="space-between"
          alignItems={{ xs: 'start', sm: 'center' }}
          spacing={1}
        >
          <Typography variant="h4" sx={{ cursor: 'default' }}>To Do List</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenForm}
          >
            Add Task
          </Button>
        </Stack>
        <Stack width='100%' spacing={2}>
          {!!tasks.length && tasks.map((task: Task) => (
            <TaskItem
              key={task.id}
              task={task}
              onDelete={() => handleOpenDelete(task)}
            />
          ))}
        </Stack>
        <TaskAddModal
          open={openForm}
          handleClose={handleCloseForm}
          refetch={refetchData}
          categoryData={categories}
        />
         <TaskDeleteModal
          open={openDeleteModal}
          handleClose={handleCloseDeleteModal}
          task={selectedTask}
          refetch={refetchTasks} />
      </Stack>
    </Container>
  )
}
