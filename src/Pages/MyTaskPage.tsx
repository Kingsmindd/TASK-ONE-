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
  onToggle: (id: string) => Promise<boolean>;
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
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-purple-950 sm:text-3xl">
          Your tasks
        </h1>
        <Link
          className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white hover:bg-purple-700"
          to="/NewTask"
        >
          <FaPlus aria-hidden="true" /> New task
        </Link>
      </div>
      <p className="mt-5 mb-4 text-xs text-stone-500" aria-live="polite">
        Showing {filtered.length} of {total} tasks
      </p>
      <div className="grid items-start gap-5 lg:gap-6">
        {filtered.map((task) => {
          const completed = completionDrafts[task.id] ?? task.completed;
          const hasChanges = completed !== task.completed;
          const overdue =
            !task.completed && !!task.dueDate && task.dueDate < today();
          return (
            <article
              id={task.id}
              className="min-w-0 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md motion-reduce:transition-none sm:p-6 lg:rounded-3xl lg:p-8"
              key={task.id}
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <span className={"inline-flex rounded-full px-3 py-1 text-xs font-semibold lg:px-3.5 lg:py-1.5 lg:text-sm " + (task.category === "Urgent" ? "bg-rose-50 text-rose-700" : "bg-purple-50 text-purple-700")}>{task.category}</span>
                <div className="flex shrink-0 items-center gap-2 text-xs font-semibold lg:gap-3 lg:text-sm">
                  <Link
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-purple-200 bg-purple-50 px-3 py-2.5 text-purple-700 transition-colors hover:bg-purple-100 motion-reduce:transition-none lg:min-h-11 lg:min-w-24 lg:gap-2.5 lg:rounded-xl lg:border-purple-600 lg:bg-purple-600 lg:px-4 lg:py-3 lg:text-white lg:shadow-sm lg:hover:border-purple-700 lg:hover:bg-purple-700"
                    to={"/EditTask/" + task.id}
                    aria-label={"Edit " + task.title}
                  >
                    <FaRegEdit aria-hidden="true" className="shrink-0 text-sm lg:text-lg" /> Edit
                  </Link>
                  <button
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-stone-200 px-3 py-2.5 text-stone-500 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 motion-reduce:transition-none lg:min-h-11 lg:min-w-24 lg:gap-2.5 lg:rounded-xl lg:border-rose-200 lg:bg-rose-50 lg:px-4 lg:py-3 lg:text-rose-700 lg:hover:border-rose-300 lg:hover:bg-rose-100"
                    onClick={() => setDeleteId(task.id)}
                    aria-label={"Delete " + task.title}
                  >
                    <RiDeleteBin6Line aria-hidden="true" className="shrink-0 text-sm lg:text-lg" /> Delete
                  </button>
                </div>
              </div>
              <h2
                className={
                  "mt-5 text-xl leading-7 font-semibold wrap-break-word text-stone-900 lg:mt-6 lg:max-w-4xl lg:text-2xl lg:leading-9 lg:tracking-tight " +
                  (task.completed ? " line-through opacity-60" : "")
                }
              >
                {task.title}
              </h2>
              <p className="mt-3 mb-5 text-sm leading-7 whitespace-pre-wrap wrap-break-word text-stone-500 lg:mt-4 lg:mb-7 lg:max-w-3xl lg:text-base lg:leading-8 lg:text-stone-600">
                {task.description}
              </p>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 pt-4 text-xs lg:pt-5 lg:text-sm">
                <span className={overdue ? "rounded-lg bg-rose-50 px-3 py-2 font-medium text-rose-700" : "rounded-lg bg-stone-50 px-3 py-2 font-medium text-stone-600"}>
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
                <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-stone-200 bg-white px-3 py-2 text-stone-600 hover:border-purple-200 hover:bg-purple-50 lg:px-4 lg:py-2.5">
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
                    onClick={async () => { if (await onToggle(task.id)) cancelUpdate(task.id); }}
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
        className="mx-auto mt-8 block bg-transparent p-3 text-sm font-semibold text-purple-700 hover:bg-purple-50"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        Back to top
      </button>
    </section>
  );
};

export default MyTaskPage;
