import { createTask, updateTask } from '@/api'
import useToggle from '@/hooks/useToggle'
import { formatDate, formatDateToYYYYMMDD, PRIORITY } from '@/lib/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect, useMemo, useState } from 'react'
import {
  useFieldArray,
  useForm
} from 'react-hook-form'
import * as yup from 'yup'
import { TaskFormProps } from '.'

export const useHooks = ({
    task, 
    handleClose, 
    refetch
}: Pick<TaskFormProps, 'task' | 'handleClose' | 'refetch' >
) => {
  const {
    id: taskId,
    name,
    description,
    due_date,
    priority,
    categories,
    subtasks,
    completed_date,
    is_completed: isCompleted
  } = task ?? {}

  const [isSubmitting, setIsSubmitting] = useState(false)
  const { bool: openDeleteModal, on: handleOpenDeleteModal, off: handleCloseDeleteModal } = useToggle()

  const taskSchema = yup.object({
    name: yup.string().required('This field is required.'),
    description: yup.string().nullable(),
    due_date: yup
      .date()
      .min(new Date(), 'Due date must be today or later.')
      .nullable(),
    priority: yup
      .string()
      .oneOf(Object.values(PRIORITY))
      .default(PRIORITY.MEDIUM),
    categories: yup.array().of(yup.string().required()),
    subtasks: yup.array().of(
      yup.object({
        id: yup.string().nullable(),
        name: yup.string().required('This field is required.'),
        is_completed: yup.boolean().default(false),
      }).required(),
    ),
  })
  type TaskFormValues = yup.InferType<typeof taskSchema>

  const defaultValues: TaskFormValues = useMemo(() => ({
    name: name ?? '',
    description: description ?? '',
    due_date: due_date ? new Date(due_date) : null,
    priority: priority ?? PRIORITY.MEDIUM,
    categories: categories ?? [],
    subtasks: subtasks ?? [],
  }), [task])

  const formMethods = useForm<TaskFormValues>({
    resolver: yupResolver(taskSchema),
    defaultValues,
  })

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = formMethods
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'subtasks',
  })

  useEffect(() => {
    if (!task) {
      reset({
        name: '',
        description: '',
        due_date: null,
        priority: PRIORITY.MEDIUM,
        categories: [],
        subtasks: [],
      })
    } else {
      reset(defaultValues)
    }
  }, [task, reset])

  const onSubmit = async (values: TaskFormValues) => {
    setIsSubmitting(true)
    try {
      const formData = {
        ...values,
        due_date: formatDateToYYYYMMDD(values.due_date),
        categories: values.categories
          ?.filter((c: string) => c.trim() !== '') ?? [],
        subtasks: values.subtasks?.map((s) => ({
          id: s?.id || null,
          name: s.name,
          is_completed: s?.is_completed ?? false,
        })) ?? []
      }
      if (taskId) {
        await updateTask(taskId, formData)
      } else {
        await createTask(formData)
      }
      refetch?.()
      handleClose?.()
    } catch (e) {
      console.error('Error', e)
    }
  }

  const handleAddSubtaskField = () => {
    append({ id: null, name: '', is_completed: false })
  }

  return {
    taskId,
    isSubmitting,
    control,
    isCompleted,
    formMethods,
    errors,
    fields,
    openDeleteModal,
    completedDate: formatDate(completed_date),
    remove,
    handleOpenDeleteModal,
    handleCloseDeleteModal,
    handleAddSubtaskField,
    handleSubmit: handleSubmit(onSubmit),
  }
}