'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export type Task = {
  id: string
  title: string
  description: string | null
  status: string
  createdAt: Date
  updatedAt: Date
}

export async function getTasks(): Promise<Task[]> {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
    return tasks
  } catch (error) {
    console.error('Error fetching tasks:', error)
    throw new Error('Failed to fetch tasks')
  }
}

export async function createTask(
  title: string,
  description?: string
): Promise<Task> {
  try {
    if (!title || title.trim().length === 0) {
      throw new Error('Title is required')
    }

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
      },
    })
    revalidatePath('/')
    return task
  } catch (error) {
    console.error('Error creating task:', error)
    throw new Error('Failed to create task')
  }
}

export async function updateTaskStatus(
  id: string,
  status: string
): Promise<Task> {
  try {
    if (status !== 'pending' && status !== 'completed') {
      throw new Error('Invalid status')
    }

    const task = await prisma.task.update({
      where: { id },
      data: { status },
    })
    revalidatePath('/')
    return task
  } catch (error) {
    console.error('Error updating task:', error)
    throw new Error('Failed to update task')
  }
}

export async function updateTask(
  id: string,
  title: string,
  description?: string
): Promise<Task> {
  try {
    if (!title || title.trim().length === 0) {
      throw new Error('Title is required')
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        title: title.trim(),
        description: description?.trim() || null,
      },
    })
    revalidatePath('/')
    return task
  } catch (error) {
    console.error('Error updating task:', error)
    throw new Error('Failed to update task')
  }
}

export async function deleteTask(id: string): Promise<void> {
  try {
    await prisma.task.delete({
      where: { id },
    })
    revalidatePath('/')
  } catch (error) {
    console.error('Error deleting task:', error)
    throw new Error('Failed to delete task')
  }
}

