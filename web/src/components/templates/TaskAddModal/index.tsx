import { Modal } from '@/components/parts/Modal'
import { TaskForm } from '../TaskForm'

interface TaskFormProps {
  open: boolean
  categoryData: string[]
  handleClose: () => void
  refetch: () => void
}

export const TaskAddModal = ({
  open,
  categoryData,
  handleClose,
  refetch
}: TaskFormProps) => {

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title='Add Task'
    >
      <TaskForm categoryData={categoryData} handleClose={handleClose} refetch={refetch} />
    </Modal>
  )
}
