import { TaskForm } from "@/app/components/task-form";
import { TaskList } from "@/app/components/task-list";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <main className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Task Management
          </h1>
          <p className="text-gray-600 mb-8">
            Organize your tasks efficiently. Create, complete, and delete tasks
            with ease.
          </p>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Create New Task
            </h2>
            <TaskForm />
          </div>

          <TaskList />
        </div>
      </main>
    </div>
  );
}
