import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TaskSearch from "./componets/TaskSearch";
import Navbar from "./componets/Navbar";
import HomePage from "./Pages/HomePage";
import MyTaskPage from "./Pages/MyTaskPage";
import NewTask from "./Pages/NewTask";
import EditTaskPage from "./Pages/EditTaskPage";
import LoginPage from "./Pages/loginPage";
import RegisterPage from "./Pages/RegisterPage";
import { fetchTasks, saveTask, removeTask } from "./api/tasks";
import { ApiError } from "./api/http";
import type { Task, TaskInput } from "./tasks";
function storedToken() {
  try {
    return sessionStorage.getItem("taskduty.token");
  } catch {
    return null;
  }
}
export default function App() {
  const [token, setToken] = useState<string | null>(storedToken);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    if (!notice.startsWith("Task ")) return;
    const timer = setTimeout(() => setNotice(""), 10_000);
    return () => clearTimeout(timer);
  }, [notice, revision]);
  function logout() {
    setToken(null);
    setTasks([]);
    setResults([]);
    setSearch("");
    setError("");
    try {
      sessionStorage.removeItem("taskduty.token");
    } catch {}
  }
  function login(value: string) {
    setLoading(true);
    setError("");
    setToken(value);
    try {
      sessionStorage.setItem("taskduty.token", value);
    } catch {}
  }
  function handleError(error: unknown) {
    if (error instanceof ApiError && error.status === 401) {
      logout();
      setNotice("Your session expired. Please log in again.");
    } else
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
  }
  useEffect(() => {
    if (!token) return;
    const controller = new AbortController();
    const timer = setTimeout(
      async () => {
        setLoading(true);
        setError("");
        try {
          const [all, found] = await Promise.all([
            fetchTasks(token, "", controller.signal),
            search.trim()
              ? fetchTasks(token, search, controller.signal)
              : Promise.resolve(null),
          ]);
          if (!controller.signal.aborted) {
            setTasks(all);
            setResults(found || all);
          }
        } catch (err) {
          if (!controller.signal.aborted) {
            if (err instanceof ApiError && err.status === 401) {
              setToken(null);
              setTasks([]);
              setResults([]);
              setNotice("Your session expired. Please log in again.");
              try {
                sessionStorage.removeItem("taskduty.token");
              } catch {
                /* Storage may be disabled. */
              }
            } else
              setError(
                err instanceof Error ? err.message : "Unable to load tasks",
              );
          }
        } finally {
          if (!controller.signal.aborted) setLoading(false);
        }
      },
      search ? 300 : 0,
    );
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [token, search, revision]);
  async function persist(input: TaskInput, id?: string) {
    if (!token) throw new Error("Please log in again.");
    try {
      const saved = await saveTask(token, input, id);
      setTasks((current) =>
        id
          ? current.map((t) => (t.id === id ? saved : t))
          : [saved, ...current],
      );
      setNotice(id ? "Task updated." : "Task created.");
      setRevision((r) => r + 1);
    } catch (err) {
      handleError(err);
      throw err;
    }
  }
  async function act(id: string, remove: boolean) {
    if (!token || busy) return;
    setBusy(true);
    setError("");
    try {
      if (remove) await removeTask(token, id);
      else {
        const task = tasks.find((t) => t.id === id);
        if (!task) return;
        await saveTask(token, { completed: !task.completed }, id);
      }
      setNotice(remove ? "Task deleted." : "Task status updated.");
      setRevision((r) => r + 1);
    } catch (err) {
      handleError(err);
    } finally {
      setBusy(false);
    }
  }
  const protectedPage = (page: React.ReactNode) =>
    token ? page : <Navigate to="/login" replace />;
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-stone-50 text-neutral-800">
        <Navbar authenticated={!!token} onLogout={logout} />
        <main className="mx-auto max-w-6xl px-5 py-9 md:px-8 md:py-12">
          {notice && (
            <div
              role="status"
              className="fixed right-5 top-24 z-50 flex w-[calc(100%-2.5rem)] max-w-sm items-center justify-between gap-4 rounded-xl bg-purple-100 p-4 text-purple-900 shadow-lg"
            >
              {notice}
              <button
                aria-label="Dismiss notification"
                onClick={() => setNotice("")}
              >
                ×
              </button>
            </div>
          )}
          {error && (
            <div
              role="alert"
              className="mb-6 rounded-xl bg-rose-50 p-4 text-rose-800"
            >
              {error}{" "}
              <button
                className="ml-3 underline"
                onClick={() => setRevision((r) => r + 1)}
              >
                Retry
              </button>
            </div>
          )}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/login"
              element={
                token ? (
                  <Navigate to="/MyTask" replace />
                ) : (
                  <LoginPage onLogin={login} />
                )
              }
            />
            <Route
              path="/register"
              element={
                token ? (
                  <Navigate to="/MyTask" replace />
                ) : (
                  <RegisterPage onLogin={login} />
                )
              }
            />
            <Route
              path="/MyTask"
              element={protectedPage(
                <>
                  <div className="mb-8 grid grid-cols-3 gap-3">
                    {[
                      ["Total tasks", tasks.length],
                      ["Completed", tasks.filter((t) => t.completed).length],
                      ["Pending", tasks.filter((t) => !t.completed).length],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="rounded-xl border border-purple-100 bg-white p-4"
                      >
                        <p className="text-xs text-stone-500">{label}</p>
                        <p className="mt-2 text-3xl font-semibold text-purple-700">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                  <TaskSearch
                    value={search}
                    onChange={(value) => {
                      setSearch(value);
                      setLoading(true);
                    }}
                  />
                  {loading ? (
                    <p role="status" className="py-12 text-center">
                      Loading tasks…
                    </p>
                  ) : (
                    !error && (
                      <fieldset
                        disabled={busy}
                        className="min-w-0 disabled:opacity-60"
                      >
                        <MyTaskPage
                          tasks={results}
                          total={tasks.length}
                          searching={!!search.trim()}
                          onClearSearch={() => {
                            setSearch("");
                            setLoading(true);
                          }}
                          onToggle={(id) => {
                            void act(id, false);
                          }}
                          onDelete={(id) => {
                            void act(id, true);
                          }}
                        />
                      </fieldset>
                    )
                  )}
                </>,
              )}
            />
            <Route
              path="/NewTask"
              element={protectedPage(
                <NewTask onSave={(input) => persist(input)} />,
              )}
            />
            <Route
              path="/EditTask/:id"
              element={protectedPage(
                loading ? (
                  <p role="status">Loading task…</p>
                ) : error ? (
                  <p>Unable to load this task. Use Retry above.</p>
                ) : (
                  <EditTaskPage
                    tasks={tasks}
                    onSave={(id, input) => persist(input, id)}
                  />
                ),
              )}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <footer className="border-t border-purple-100 p-6 text-center text-xs text-stone-500">
          TaskDuty · Small steps. Real progress.
        </footer>
      </div>
    </BrowserRouter>
  );
}
