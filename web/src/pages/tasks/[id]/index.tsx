import { useGetCategories, useGetTask } from '@/api'
import { TaskForm } from '@/components/templates/TaskForm'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { IconButton, Typography } from '@mui/material'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import { useRouter } from 'next/router'

export default function TaskDetail() {
  const router = useRouter()
  const { id } = router.query
  const taskId = typeof id === "string" ? id : undefined

  const { task, loading, error, refetchTask } = useGetTask(taskId)
  const { categories, refetchCategories } = useGetCategories()
  const taskDetail = task ?? null

  if (loading) return null // todo
  if (error) return null

  const refetch = () => {
    refetchTask()
    refetchCategories()
  }

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      <Stack
        direction='row'
        sx={{
          justifyContent: 'flext-start',
          alignItems: 'center',
          mb: 2
        }}
      >
        <IconButton aria-label="back" onClick={() => router.back()}>
          <ArrowBackIosNewIcon />
        </IconButton>
        <Typography variant="h6" sx={{ cursor: 'default' }}>{task?.name}</Typography>
      </Stack>
      <TaskForm task={taskDetail} categoryData={categories} refetch={refetch} />
    </Container>
  )
}