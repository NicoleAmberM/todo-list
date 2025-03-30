import CloseIcon from '@mui/icons-material/Close'
import {
  Button,
  ButtonProps,
  DialogActions,
  DialogContent,
  IconButton,
  Stack,
} from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import { ReactNode } from 'react'

interface ModalProps {
  open: boolean
  title: string
  children: ReactNode
  onClose: () => void
  submitLabel?: string
  isSubmitting?: boolean
  onSubmit?: () => void
  submitProps?: ButtonProps
}
export const Modal = ({
  open,
  title,
  submitLabel,
  isSubmitting = false,
  children,
  onClose,
  onSubmit,
  submitProps,
}: ModalProps) => {
  return (
    <Dialog maxWidth="sm" open={open} sx={{
      '& .MuiDialog-paper': {
        maxHeight: '600px',
        overflowY: 'auto',
      },
    }} fullWidth>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between">
          {title}
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
      {onSubmit ? (
        <DialogActions sx={{ mx: 2 }}>
          <Button variant="contained" sx={{ bgcolor: 'gray' }} onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            type="submit"
            onClick={onSubmit}
            disabled={isSubmitting}
            {...submitProps}
          >
            {submitLabel}
          </Button>
        </DialogActions>
      ) : null}
    </Dialog>
  )
}
