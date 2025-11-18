'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getTasks, updateTaskStatus, deleteTask, type Task } from '@/app/actions/task-actions'
import { TaskEditForm } from './task-edit-form'

export function TaskList() {
  const queryClient = useQueryClient()
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)

  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateTaskStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  const handleToggleStatus = (task: Task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed'
    updateMutation.mutate({ id: task.id, status: newStatus })
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteMutation.mutate(id)
    }
  }

  const handleEdit = (id: string) => {
    setEditingTaskId(id)
  }

  const handleCancelEdit = () => {
    setEditingTaskId(null)
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading tasks...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">
          Error loading tasks. Please try again later.
        </p>
      </div>
    )
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No tasks yet. Create your first task above!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Tasks</h2>
      <div className="grid gap-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`p-6 rounded-lg border-2 transition-all ${
              task.status === 'completed'
                ? 'bg-gray-50 border-gray-200 opacity-75'
                : 'bg-white border-gray-300 shadow-sm hover:shadow-md'
            }`}
          >
            {editingTaskId === task.id ? (
              <TaskEditForm task={task} onCancel={handleCancelEdit} />
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3
                    className={`text-lg font-semibold mb-2 ${
                      task.status === 'completed'
                        ? 'line-through text-gray-500'
                        : 'text-gray-800'
                    }`}
                  >
                    {task.title}
                  </h3>
                  {task.description && (
                    <p
                      className={`text-gray-600 mb-3 ${
                        task.status === 'completed' ? 'line-through' : ''
                      }`}
                    >
                      {task.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>
                      Created:{' '}
                      {new Date(task.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        task.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => handleEdit(task.id)}
                    disabled={updateMutation.isPending || deleteMutation.isPending}
                    className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-lg font-medium hover:bg-indigo-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleToggleStatus(task)}
                    disabled={updateMutation.isPending}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      task.status === 'completed'
                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {task.status === 'completed' ? 'Mark Pending' : 'Mark Complete'}
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    disabled={deleteMutation.isPending}
                    className="px-4 py-2 bg-red-100 text-red-800 rounded-lg font-medium hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

