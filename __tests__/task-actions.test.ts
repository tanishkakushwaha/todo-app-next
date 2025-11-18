import {
  getTasks,
  createTask,
  updateTaskStatus,
  updateTask,
  deleteTask,
} from '@/app/actions/task-actions'
import { prisma } from '@/lib/prisma'

// Mock Prisma client
jest.mock('@/lib/prisma', () => ({
  prisma: {
    task: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}))

// Mock next/cache
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}))

describe('Task Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getTasks', () => {
    it('should fetch all tasks', async () => {
      const mockTasks = [
        {
          id: '1',
          title: 'Test Task',
          description: 'Test Description',
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      ;(prisma.task.findMany as jest.Mock).mockResolvedValue(mockTasks)

      const result = await getTasks()

      expect(result).toEqual(mockTasks)
      expect(prisma.task.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      })
    })

    it('should throw error on database failure', async () => {
      ;(prisma.task.findMany as jest.Mock).mockRejectedValue(
        new Error('Database error')
      )

      await expect(getTasks()).rejects.toThrow('Failed to fetch tasks')
    })
  })

  describe('createTask', () => {
    it('should create a new task with title and description', async () => {
      const mockTask = {
        id: '1',
        title: 'New Task',
        description: 'New Description',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      ;(prisma.task.create as jest.Mock).mockResolvedValue(mockTask)

      const result = await createTask('New Task', 'New Description')

      expect(result).toEqual(mockTask)
      expect(prisma.task.create).toHaveBeenCalledWith({
        data: {
          title: 'New Task',
          description: 'New Description',
        },
      })
    })

    it('should create a task with only title', async () => {
      const mockTask = {
        id: '1',
        title: 'New Task',
        description: null,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      ;(prisma.task.create as jest.Mock).mockResolvedValue(mockTask)

      const result = await createTask('New Task')

      expect(result).toEqual(mockTask)
      expect(prisma.task.create).toHaveBeenCalledWith({
        data: {
          title: 'New Task',
          description: null,
        },
      })
    })

    it('should throw error if title is empty', async () => {
      await expect(createTask('')).rejects.toThrow('Title is required')
      await expect(createTask('   ')).rejects.toThrow('Title is required')
    })

    it('should throw error on database failure', async () => {
      ;(prisma.task.create as jest.Mock).mockRejectedValue(
        new Error('Database error')
      )

      await expect(createTask('Test')).rejects.toThrow('Failed to create task')
    })
  })

  describe('updateTaskStatus', () => {
    it('should update task status to completed', async () => {
      const mockTask = {
        id: '1',
        title: 'Test Task',
        description: null,
        status: 'completed',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      ;(prisma.task.update as jest.Mock).mockResolvedValue(mockTask)

      const result = await updateTaskStatus('1', 'completed')

      expect(result).toEqual(mockTask)
      expect(prisma.task.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { status: 'completed' },
      })
    })

    it('should update task status to pending', async () => {
      const mockTask = {
        id: '1',
        title: 'Test Task',
        description: null,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      ;(prisma.task.update as jest.Mock).mockResolvedValue(mockTask)

      const result = await updateTaskStatus('1', 'pending')

      expect(result).toEqual(mockTask)
      expect(prisma.task.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { status: 'pending' },
      })
    })

    it('should throw error for invalid status', async () => {
      await expect(updateTaskStatus('1', 'invalid')).rejects.toThrow(
        'Invalid status'
      )
    })

    it('should throw error on database failure', async () => {
      ;(prisma.task.update as jest.Mock).mockRejectedValue(
        new Error('Database error')
      )

      await expect(updateTaskStatus('1', 'completed')).rejects.toThrow(
        'Failed to update task'
      )
    })
  })

  describe('updateTask', () => {
    it('should update a task with title and description', async () => {
      const mockTask = {
        id: '1',
        title: 'Updated Task',
        description: 'Updated Description',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      ;(prisma.task.update as jest.Mock).mockResolvedValue(mockTask)

      const result = await updateTask('1', 'Updated Task', 'Updated Description')

      expect(result).toEqual(mockTask)
      expect(prisma.task.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          title: 'Updated Task',
          description: 'Updated Description',
        },
      })
    })

    it('should update a task with only title', async () => {
      const mockTask = {
        id: '1',
        title: 'Updated Task',
        description: null,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      ;(prisma.task.update as jest.Mock).mockResolvedValue(mockTask)

      const result = await updateTask('1', 'Updated Task')

      expect(result).toEqual(mockTask)
      expect(prisma.task.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          title: 'Updated Task',
          description: null,
        },
      })
    })

    it('should throw error if title is empty', async () => {
      await expect(updateTask('1', '')).rejects.toThrow('Title is required')
      await expect(updateTask('1', '   ')).rejects.toThrow('Title is required')
    })

    it('should throw error on database failure', async () => {
      ;(prisma.task.update as jest.Mock).mockRejectedValue(
        new Error('Database error')
      )

      await expect(updateTask('1', 'Test')).rejects.toThrow('Failed to update task')
    })
  })

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      ;(prisma.task.delete as jest.Mock).mockResolvedValue(undefined)

      await deleteTask('1')

      expect(prisma.task.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      })
    })

    it('should throw error on database failure', async () => {
      ;(prisma.task.delete as jest.Mock).mockRejectedValue(
        new Error('Database error')
      )

      await expect(deleteTask('1')).rejects.toThrow('Failed to delete task')
    })
  })
})

