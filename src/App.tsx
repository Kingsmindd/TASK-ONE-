import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./componets/Navbar";
import HomePage from "./Pages/HomePage";
import MyTaskPage from "./Pages/MyTaskPage";
import NewTask from "./Pages/NewTask";
import EditTaskPage from "./Pages/EditTaskPage";
import { editTasksInCode, readTasks } from "./tasks";
import type { Task, TaskInput } from "./tasks";

function App() {
  const [tasks, setTasks] = useState<Task[]>(readTasks);
  const [storageError, setStorageError] = useState(false);
  function saveTasks(nextTasks: Task[]) {
    setTasks(nextTasks);
    if (editTasksInCode) return;
    try {
      localStorage.setItem("taskduty.tasks", JSON.stringify(nextTasks));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }

  function addTask(input: TaskInput) {
    saveTasks([...tasks, { ...input, id: crypto.randomUUID() }]);
  }

  function updateTask(id: string, input: TaskInput) {
    saveTasks(
      tasks.map((task) => (task.id === id ? { ...task, ...input } : task)),
    );
  }

  function toggleTask(id: string) {
    saveTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  }

  function deleteTask(id: string) {
    saveTasks(tasks.filter((task) => task.id !== id));
  }

  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-white font-sans text-neutral-800 [&_button]:cursor-pointer [&_a]:touch-manipulation [&_button]:touch-manipulation **:focus-visible:outline-2 **:focus-visible:outline-offset-4 **:focus-visible:outline-purple-500">
        <Navbar />
        {storageError && (
          <p
            className="bg-amber-100 px-6 py-3.5 text-sm text-amber-900"
            role="alert"
          >
            Browser storage is unavailable. Changes will only last until you
            close or refresh this page.
          </p>
        )}
        <main className="mx-auto w-full max-w-6xl flex-1 px-5 pt-9 pb-14 md:px-8 md:pt-14 md:pb-20">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/MyTask"
              element={
                <MyTaskPage
                  tasks={tasks}
                  onToggle={toggleTask}
                  onDelete={deleteTask}
                />
              }
            />
            <Route path="/NewTask" element={<NewTask onSave={addTask} />} />
            <Route
              path="/EditTask/:id?"
              element={<EditTaskPage tasks={tasks} onSave={updateTask} />}
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
