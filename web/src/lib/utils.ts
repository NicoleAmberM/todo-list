export enum PRIORITY {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
}

export const formatDate = (date?: string | null) => {
  if (!date) return null
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}


export const formatDateToYYYYMMDD = (date?: Date | string | null) => {
  if (!date) return null
  return new Date(date).toISOString().split('T')[0]
}
