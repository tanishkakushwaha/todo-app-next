'use client'

import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateTask, type Task } from '@/app/actions/task-actions'

interface TaskEditFormProps {
  task: Task
  onCancel: () => void
}

export function TaskEditForm({ task, onCancel }: TaskEditFormProps) {
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description || '')
  const queryClient = useQueryClient()

  useEffect(() => {
    setTitle(task.title)
    setDescription(task.description || '')
  }, [task])

  const mutation = useMutation({
    mutationFn: async (data: { id: string; title: string; description?: string }) => {
      return await updateTask(data.id, data.title, data.description)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      onCancel()
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    mutation.mutate({ id: task.id, title, description })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor={`edit-title-${task.id}`}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Task Title *
        </label>
        <input
          type="text"
          id={`edit-title-${task.id}`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          required
          className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
        />
      </div>
      <div>
        <label
          htmlFor={`edit-description-${task.id}`}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Description
        </label>
        <textarea
          id={`edit-description-${task.id}`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description (optional)"
          rows={3}
          className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none resize-none"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={mutation.isPending || !title.trim()}
          className="flex-1 bg-indigo-600 text-white py-2.5 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {mutation.isPending ? 'Saving...' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={mutation.isPending}
          className="flex-1 bg-gray-200 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          Cancel
        </button>
      </div>
      {mutation.isError && (
        <p className="text-red-600 text-sm">
          {mutation.error instanceof Error
            ? mutation.error.message
            : 'Failed to update task'}
        </p>
      )}
    </form>
  )
}

