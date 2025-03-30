import { PRIORITY } from '@/lib/utils'
import axios from 'axios'
import { useCallback, useEffect, useMemo, useState } from 'react'

export type Subtask = {
  id: string
  name: string
  is_completed: boolean
}

export type Task = {
  id: string
  name: string
  priority: PRIORITY
  categories: string[]
  subtasks: Subtask[]
  due_date?: string | null
  description?: string | null
  completed_date?: string | null
  is_completed?: boolean
}

export type TaskForCreate = Omit<Task, 'id' | 'completed_date' | 'is_completed' | 'subtasks' | 'categories'> & {
  subtasks: Omit<Subtask, 'id'>[]
  categories: string[]
}

export type TaskForEdit = Omit<TaskForCreate, 'categories'> & {
  categories: string[]
}

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_DJANGO_API,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const useGetTasks = () => {
  const [data, setData] = useState<Task[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTasks = async () => {
    setLoading(true)
    try {
      const response = await API.get<Task[]>('tasks/')
      setData(response.data)
      setError(null)
    } catch (error: any) {
      setError('Failed to fetch tasks.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const tasks = useMemo(() => data || [], [data])

  return { tasks, loading, error, refetchTasks: fetchTasks }
}

export const useGetTask = (id?: string) => {
  const [task, setTask] = useState<Task>()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTask = useCallback(async () => {
    if (!id) return

    setLoading(true)
    try {
      const response = await API.get<Task>(`tasks/${id}/`);
      setTask(response.data);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to fetch Task.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTask()
  }, [fetchTask])


  return { task, loading, error, refetchTask: fetchTask }
}
