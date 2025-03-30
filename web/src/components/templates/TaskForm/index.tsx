import { createTask, Task, updateTask } from '@/api'
import { TextInputField } from '@/components/parts/TextInputField'
import { formatDate, formatDateToYYYYMMDD, PRIORITY } from '@/lib/utils'
import { yupResolver } from '@hookform/resolvers/yup'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { Checkbox, IconButton } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { useEffect, useMemo, useState } from 'react'
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm
} from 'react-hook-form'
import * as yup from 'yup'

interface TaskFormProps {
  categoryData: string[]
  task?: Task | null
  handleClose?: () => void
  refetch?: () => void
}

export const TaskForm = ({
  task,
  categoryData,
  handleClose,
  refetch,
}: TaskFormProps) => {
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

  return (
    <Stack width='100%'>
      <FormProvider {...formMethods}>
        {isCompleted ?
          <Typography variant='subtitle1' fontWeight={600} color='success'>• Completed on {formatDate(completed_date)} </Typography>
          : null
        }
        <Stack spacing={2} pt={2}>
          <TextInputField
            name='name'
            label='Task Name'
            required
            control={control}
            error={errors?.name?.message}
          />

          <Stack direction='row' spacing={2}>
            <FormControl variant='outlined' fullWidth>
              <InputLabel id='priority-label'>Priority</InputLabel>
              <Controller
                name='priority'
                control={formMethods.control}
                defaultValue={PRIORITY.MEDIUM}
                render={({ field }) => (
                  <Select {...field} labelId='priority-label' label='Priority'>
                    {Object.values(PRIORITY).map((key) => (
                      <MenuItem key={key} value={key}>
                        {key}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>

            <FormControl fullWidth>
              <Controller
                name='due_date'
                control={control}
                render={({ field }) => {
                  const value =
                    field.value instanceof Date
                      ? field.value.toISOString().split('T')[0]
                      : field.value

                  return (
                    <TextField
                      {...field}
                      type='date'
                      label='Due Date'
                      error={!!errors?.due_date?.message}
                      helperText={errors?.due_date?.message ?? ''}
                      value={value}
                      slotProps={{ inputLabel: { shrink: true } }}
                    />
                  )
                }}
              />
            </FormControl>
          </Stack>

          <TextInputField
            name='description'
            label='Description'
            multiline
            rows={3}
            control={control}
            error={errors?.description?.message}
          />

          <FormControl fullWidth>
            <Controller
              name='categories'
              control={formMethods.control}
              render={({ field }) => (
                <Autocomplete
                  multiple
                  id='categories'
                  options={categoryData}
                  freeSolo={true}
                  value={field.value}
                  onChange={(_, data) => field.onChange(data)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label='Categories'
                      placeholder='Type to add'
                      slotProps={{ inputLabel: { shrink: true } }}
                    />
                  )}
                  sx={{ mb: 2 }}
                />
              )}
            />
          </FormControl>
          <Stack direction='row' justifyContent='space-between' spacing={2}>
            <Typography variant='overline'>Subtasks</Typography>
            <Button
              variant='contained'
              size='small'
              startIcon={<AddIcon />}
              onClick={handleAddSubtaskField}
            >
              Add Subtask
            </Button>
          </Stack>
          {fields.map((field, index) => (
            <Stack
              key={field.id}
              direction='row'
              spacing={1}
              alignItems='center'
            >
              {!!taskId ? (
                <Controller
                  name={`subtasks.${index}.is_completed`}
                  control={control}
                  render={({ field }) => <Checkbox {...field} checked={field.value} />}
                />
              ) : null}
              <TextInputField
                name={`subtasks.${index}.name`}
                label={`Subtask ${index + 1}`}
                control={control}
                required
                error={errors?.subtasks?.[index]?.name?.message}
              />
              <IconButton aria-label='delete' onClick={() => remove(index)}>
                <DeleteIcon />
              </IconButton>
            </Stack>
          ))}
        </Stack>
        <Stack direction='row' spacing={1} justifyContent='flex-end' mt={3}>
          <Button
            variant='contained'
            type='submit'
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            color='success'
          >
            {taskId ? 'Save' : 'Add'}
          </Button>
        </Stack>
      </FormProvider>
    </Stack>
  )
}
