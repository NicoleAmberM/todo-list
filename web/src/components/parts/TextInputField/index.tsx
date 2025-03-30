import { SxProps } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import TextField, { TextFieldVariants } from '@mui/material/TextField'

import { Controller } from 'react-hook-form'

interface TextInputFieldProps {
  name: string
  label: string
  control: any
  textFieldSx?: SxProps
  key?: string | number
  type?: string
  required?: boolean
  error?: string
  multiline?: boolean
  rows?: number
  variant?: TextFieldVariants
}

export const TextInputField = ({
  name,
  label,
  control,
  key,
  textFieldSx,
  type = 'text',
  required = false,
  multiline = false,
  rows,
  error,
  variant,
}: TextInputFieldProps) => {
  return (
    <FormControl fullWidth>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            key={key ?? name}
            type={type}
            label={label}
            required={required}
            error={!!error}
            helperText={error || ''}
            multiline={multiline}
            rows={rows}
            variant={variant}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ ...textFieldSx }}
          />
        )}
      />
    </FormControl>
  )
}
