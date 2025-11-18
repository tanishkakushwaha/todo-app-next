'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTask } from '@/app/actions/task-actions'

export function TaskForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (data: { title: string; description?: string }) => {
      return await createTask(data.title, data.description)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      setTitle('')
      setDescription('')
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    mutation.mutate({ title, description })
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 space-y-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Task Title *
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          required
          className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
        />
      </div>
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description (optional)"
          rows={3}
          className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none resize-none"
        />
      </div>
      <button
        type="submit"
        disabled={mutation.isPending || !title.trim()}
        className="w-full bg-indigo-600 text-white py-2.5 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium shadow-sm hover:shadow-md"
      >
        {mutation.isPending ? 'Creating...' : 'Create Task'}
      </button>
      {mutation.isError && (
        <p className="text-red-600 text-sm">
          {mutation.error instanceof Error
            ? mutation.error.message
            : 'Failed to create task'}
        </p>
      )}
    </form>
  )
}

