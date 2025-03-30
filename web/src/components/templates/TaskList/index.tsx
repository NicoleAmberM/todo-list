
import { Task } from '@/api'
import AddIcon from '@mui/icons-material/Add'
import { Alert } from '@mui/material'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { TaskAddModal } from '../TaskAddModal'
import { TaskDeleteModal } from '../TaskDeleteModal'
import { TaskItem } from '../TaskItem'
import { useHooks } from './hooks'

export type AlertState = {
  message: string
  severity: "success" | "error"
  open: boolean
}


export const TaskList = () => {
  const {
    selectedTask,
    tasks,
    loading,
    error,
    refetchTasks,
    categories,
    handleOpenForm,
    handleCloseForm,
    openForm,
    handleOpenDelete,
    handleCloseDeleteModal,
    openDeleteModal,
    refetchData,
  } = useHooks()

  if (loading) return null
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
