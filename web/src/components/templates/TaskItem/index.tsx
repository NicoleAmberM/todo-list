import { Task } from '@/api'
import useToggle from '@/hooks/useToggle'
import { formatDate, PRIORITY } from '@/lib/utils'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import ChecklistIcon from '@mui/icons-material/Checklist'
import DeleteIcon from '@mui/icons-material/Delete'
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule'
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown'
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp'
import { Link } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

interface TaskItemProps {
  task: Task
  onDelete: () => void
}

export const TaskItem = ({ task, onDelete }: TaskItemProps) => {
  const {
    id,
    name,
    priority,
    due_date,
    categories,
    subtasks,
    is_completed: defaultIsCompleted,
  } = task
  const completedSubtasksCount = subtasks?.filter((s) => s.is_completed).length
  const subtaskCount = subtasks?.length
  const dueDate = formatDate(due_date)
  const dateColor = due_date && new Date() >= new Date(due_date) ? 'error' : 'inherit'

  // todo use editApi for toggleChecked
  const { bool: isCompleted, toggle: toggleChecked } =
    useToggle(defaultIsCompleted)

  const handleDelete = () => {
    onDelete()
  }

  const getPriorityIcon = (priority: PRIORITY) => {
    switch (priority) {
      case 'High':
        return <KeyboardDoubleArrowUpIcon color='error' />
      case 'Medium':
        return <HorizontalRuleIcon color='warning' />
      case 'Low':
      default:
        return <KeyboardDoubleArrowDownIcon color='primary' />
    }
  }

  return (
    <Card
      id={`task-${task.id}`}
      elevation={4}
      sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
    >
      <CardContent sx={{ width: '100%' }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent='space-between'
        >
          <Stack
            id='task-detail'
            direction='row'
            alignItems='flex-start'
            spacing={1}
          >
            <Checkbox
            // todo add new toggleChecked API
            />
            <Stack alignItems='flex-start'>
              <Link
                variant='h6'
                pt={0.5}
                sx={{ textDecoration: isCompleted ? 'line-through' : 'none', color: isCompleted ? 'grey' : (theme) => theme.palette.primary.main, cursor: 'pointer' }}
                href={`tasks/${id}/`}
              >
                {name}
              </Link>
              <Stack direction='row' alignItems='flex-start' spacing={1} sx={{ cursor: 'default' }}>
                {!!subtaskCount && (
                  <>
                    <ChecklistIcon fontSize='small' />
                    <Typography variant='subtitle2'>
                      {`${completedSubtasksCount} of ${subtaskCount}`}
                    </Typography>
                  </>
                )}
                {!!dueDate && (
                  <>
                    <CalendarTodayIcon
                      sx={{ fontSize: 16, pl: 1 }}
                      color={dateColor}
                    />
                    <Typography variant='subtitle2' color={dateColor}>
                      {dueDate}
                    </Typography>
                  </>
                )}
              </Stack>
              <Stack direction='row' flexWrap='wrap' spacing={1} sx={{ cursor: 'default' }}>
                {categories?.map((name) => (
                  <Chip
                    key={name}
                    label={name}
                    size='small'
                    sx={{ width: 'auto' }}
                  />
                ))}
              </Stack>
            </Stack>
          </Stack>
          <Stack
            id='task-actions'
            direction='row'
            alignItems='center'
            spacing={1}
            flexWrap='wrap'
            justifyContent={{ xs: 'flex-start', sm: 'flex-end' }}
          >
            {getPriorityIcon(priority)}
            <IconButton sx={{ color: 'grey' }} size='small' onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}