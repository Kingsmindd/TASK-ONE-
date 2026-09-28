import type * as React from "react";
import { useState } from "react";
import { FaPlus, FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Link } from "react-router-dom";
import { categories, today } from "../tasks";
import type { Task } from "../tasks";
const MyTaskPage: React.FC<{
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ tasks, onToggle, onDelete }) => {
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = tasks.filter((task) => {
    if (category !== "All" && task.category !== category) return false;
    if (status === "Completed" && !task.completed) return false;
    if (status === "Pending" && task.completed) return false;
    return true;
  });

  return (
    <section className="text-neutral-800">
      <div className="mb-9 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
          MyTasks
        </h1>
        <Link
          className="inline-flex items-center gap-2 text-base font-semibold text-purple-600 md:gap-4 md:text-xl"
          to="/NewTask"
        >
          <FaPlus aria-hidden="true" /> Add New Task
        </Link>
      </div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-4">
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter by tag"
        >
          {["All", ...categories].map((item) => (
            <button
              key={item}
              className={
                category === item
                  ? "rounded-lg bg-purple-100 px-3 py-2.5 text-sm font-semibold text-purple-800 md:px-4"
                  : "rounded-lg px-3 py-2.5 text-sm text-stone-500 hover:bg-purple-50 md:px-4"
              }
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
            >
              {item === "All" ? "All tasks" : item}
            </button>
          ))}
        </div>
        <label className="ml-auto flex items-center gap-2.5 text-sm text-stone-500">
          Status
          <select
            className="rounded-lg border border-purple-100 bg-white px-3 py-2 text-stone-700"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option>All</option>
            <option>Pending</option>
            <option>Completed</option>
          </select>
        </label>
      </div>
      <p className="mt-5 mb-4 text-xs text-stone-500" aria-live="polite">
        Showing {filtered.length} of {tasks.length} tasks
      </p>
      <div className="grid gap-8">
        {filtered.map((task) => {
          const overdue = !task.completed && task.dueDate < today();
          return (
            <article
              id={task.id}
              className="rounded-xl border border-purple-100 bg-white px-4 py-5 md:p-7"
              key={task.id}
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h1
                  className={
                    "text-lg font-medium md:text-xl " +
                    (task.headingClass || "font-sans text-red-600")
                  }
                >
                  {task.heading}
                </h1>
                <div className="flex gap-2 text-sm md:gap-3 md:text-lg">
                  <Link
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-3 py-2.5 text-white hover:bg-purple-700 md:px-5"
                    to={"/EditTask/" + task.id}
                    aria-label={"Edit " + task.title}
                  >
                    <FaRegEdit aria-hidden="true" /> Edit
                  </Link>
                  <button
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-purple-600 bg-purple-50 px-3 py-2.5 text-purple-600 md:px-5"
                    onClick={() => setDeleteId(task.id)}
                    aria-label={"Delete " + task.title}
                  >
                    <RiDeleteBin6Line aria-hidden="true" /> Delete
                  </button>
                </div>
              </div>
              <h2
                className={
                  "mt-5 text-2xl font-medium wrap-break-word md:text-4xl " +
                  (task.titleClass || "font-sans text-purple-700") +
                  (task.completed ? " line-through opacity-60" : "")
                }
              >
                {task.title}
              </h2>
              <p className="mt-3 mb-6 text-lg leading-relaxed whitespace-pre-wrap wrap-break-word text-stone-500 md:text-xl">
                {task.description}
              </p>
              <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
                <span className={overdue ? "text-rose-700" : "text-stone-500"}>
                  {overdue ? "Overdue · " : "Due "}
                  {new Date(task.dueDate + "T00:00:00").toLocaleDateString(
                    undefined,
                    { day: "numeric", month: "short", year: "numeric" },
                  )}
                </span>
                <label className="flex cursor-pointer items-center gap-2 text-stone-500">
                  <input
                    className="size-4.5 shrink-0 cursor-pointer accent-purple-600"
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => onToggle(task.id)}
                    aria-label={
                      "Mark " +
                      task.title +
                      (task.completed ? " as pending" : " as completed")
                    }
                  />
                  {task.completed ? "Completed" : "Mark complete"}
                </label>
              </div>
              {deleteId === task.id && (
                <div
                  className="mt-5 flex flex-wrap items-center gap-3 border-t border-purple-100 pt-5"
                  role="group"
                  aria-label={"Confirm deletion of " + task.title}
                >
                  <p className="grow text-sm">
                    Delete this task? This cannot be undone.
                  </p>
                  <button
                    className="inline-flex min-h-12 items-center justify-center gap-6 rounded-lg px-6 py-3.5 text-sm font-semibold transition hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none bg-purple-100 text-purple-800"
                    onClick={() => setDeleteId(null)}
                  >
                    Keep task
                  </button>
                  <button
                    className="inline-flex min-h-12 items-center justify-center gap-6 rounded-lg px-6 py-3.5 text-sm font-semibold transition hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none bg-rose-700 text-white hover:bg-rose-800"
                    onClick={() => {
                      onDelete(task.id);
                      setDeleteId(null);
                    }}
                  >
                    Delete task
                  </button>
                </div>
              )}
            </article>
          );
        })}
      </div>
      {filtered.length === 0 && (
        <div className="rounded-xl border border-purple-200 bg-white px-5 py-14 text-center">
          <div className="hidden" aria-hidden="true">
            ✓
          </div>
          <h2 className="text-2xl font-semibold">
            {tasks.length ? "No tasks match these filters" : "No tasks yet"}
          </h2>
          <p className="mt-3 mb-6 text-stone-500">
            {tasks.length
              ? "Try another tag or completion status."
              : "Add your first task and start making progress."}
          </p>
          {tasks.length ? (
            <button
              className="inline-flex min-h-12 items-center justify-center gap-6 rounded-lg px-6 py-3.5 text-sm font-semibold transition hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none bg-purple-100 text-purple-800"
              onClick={() => {
                setCategory("All");
                setStatus("All");
              }}
            >
              Clear filters
            </button>
          ) : (
            <Link
              className="inline-flex min-h-12 items-center justify-center gap-6 rounded-lg px-6 py-3.5 text-sm font-semibold transition hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none bg-purple-600 text-white hover:bg-purple-700"
              to="/NewTask"
            >
              + Create your first task
            </Link>
          )}
        </div>
      )}
      <button
        className="mx-auto mt-8 block bg-transparent p-3 text-xl text-purple-600 underline underline-offset-4"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        Back to top
      </button>
    </section>
  );
};

export default MyTaskPage;
