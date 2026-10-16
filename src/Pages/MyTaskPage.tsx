import type * as React from "react";
import { useState } from "react";
import { FaPlus, FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Link } from "react-router-dom";
import { today } from "../tasks";
import type { Task } from "../tasks";
const MyTaskPage: React.FC<{
  tasks: Task[];
  total: number;
  searching: boolean;
  onClearSearch: () => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ tasks, total, searching, onClearSearch, onToggle, onDelete }) => {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [completionDrafts, setCompletionDrafts] = useState<
    Record<string, boolean>
  >({});

  function cancelUpdate(id: string) {
    setCompletionDrafts((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
  }

  const filtered = tasks;

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
      <p className="mt-5 mb-4 text-xs text-stone-500" aria-live="polite">
        Showing {filtered.length} of {total} tasks
      </p>
      <div className="grid gap-8">
        {filtered.map((task) => {
          const completed = completionDrafts[task.id] ?? task.completed;
          const hasChanges = completed !== task.completed;
          const overdue =
            !task.completed && !!task.dueDate && task.dueDate < today();
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
                  {!task.dueDate
                    ? "No due date"
                    : overdue
                      ? "Overdue · "
                      : "Due "}
                  {task.dueDate &&
                    new Date(task.dueDate + "T00:00:00").toLocaleDateString(
                      undefined,
                      { day: "numeric", month: "short", year: "numeric" },
                    )}
                </span>
                <label className="flex cursor-pointer items-center gap-2 text-stone-500">
                  <input
                    className="size-4.5 shrink-0 cursor-pointer accent-purple-600"
                    type="checkbox"
                    checked={completed}
                    onChange={(event) => {
                      const checked = event.target.checked;

                      setCompletionDrafts((current) => ({
                        ...current,
                        [task.id]: checked,
                      }));
                    }}
                    aria-label={
                      "Mark " +
                      task.title +
                      (completed ? " as pending" : " as completed")
                    }
                  />
                  {completed ? "Completed" : "Mark complete"}
                </label>
              </div>

              {hasChanges && (
                <div
                  className="mt-5 flex flex-wrap items-center gap-3 border-t border-purple-100 pt-5"
                  role="group"
                  aria-label={"Update status of " + task.title}
                >
                  <p className="grow text-sm text-stone-600">
                    Update this task as {completed ? "completed" : "pending"}?
                  </p>

                  <button
                    type="button"
                    className="rounded-lg bg-purple-100 px-6 py-3 text-sm font-semibold text-purple-800"
                    onClick={() => cancelUpdate(task.id)}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-white hover:bg-purple-700"
                    onClick={() => onToggle(task.id)}
                  >
                    Update
                  </button>
                </div>
              )}
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
            {searching ? "No matching tasks" : "No tasks yet"}
          </h2>
          <p className="mt-3 mb-6 text-stone-500">
            {searching
              ? "Try fewer words, remove a filter, or clear the search."
              : "Create your first task and start making progress."}
          </p>
          {searching ? (
            <button
              className="inline-flex min-h-12 items-center justify-center gap-6 rounded-lg px-6 py-3.5 text-sm font-semibold transition hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none bg-purple-100 text-purple-800"
              onClick={onClearSearch}
            >
              Clear search
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
