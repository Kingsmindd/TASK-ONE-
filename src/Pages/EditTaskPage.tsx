import type * as React from "react";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { MdOutlineArrowBackIos } from "react-icons/md";
import { Link, useNavigate, useParams } from "react-router-dom";
import { validateTask } from "../tasks";
import PriorityPicker from "../componets/PriorityPicker";
import DueDatePicker from "../componets/DueDatePicker";
import type { Category, FormErrors, Task, TaskInput } from "../tasks";

const EditTaskPage: React.FC<{
  tasks: Task[];
  onSave: (id: string, input: TaskInput) => Promise<void>;
}> = ({ tasks, onSave }) => {
  const { id } = useParams();
  let task: Task | undefined = tasks[0];
  if (id) {
    task = tasks.find((item) => item.id === id);
  }
  if (!task) {
    return (
      <section className="rounded-xl border border-purple-200 bg-white px-5 py-14 text-center">
        <h1 className="text-4xl font-semibold tracking-tight">
          Task not found
        </h1>
        <p className="mt-3 mb-6 text-stone-500">
          Choose a task from your list to edit it.
        </p>
        <Link className="text-purple-600 underline" to="/MyTask">
          Back to my tasks
        </Link>
      </section>
    );
  }
  return <EditTaskFields key={task.id} task={task} onSave={onSave} />;
};

const EditTaskFields: React.FC<{
  task: Task;
  onSave: (id: string, input: TaskInput) => Promise<void>;
}> = ({ task, onSave }) => {
  const navigate = useNavigate();
  const heading = task.heading;
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [dueDate, setDueDate] = useState(task.dueDate);
  const [category, setCategory] = useState<Category | "">(task.category);
  const [completed, setCompleted] = useState(task.completed);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    function handleOutsideClick(event: PointerEvent) {
      if (!(event.target instanceof Node)) return;

      // Keep the selected values; only remove focus from the native picker.
      for (const id of ["dueDate"]) {
        const field = document.getElementById(id);
        const wrapper = field?.parentElement;
        if (field && wrapper && !wrapper.contains(event.target)) {
          field.blur();
        }
      }
    }

    document.addEventListener("pointerdown", handleOutsideClick, true);
    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick, true);
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    const details: TaskInput = {
      heading: heading.trim(),
      title: title.trim(),
      description: description.trim(),
      dueDate,
      category: category as Category,
      completed,
    };
    const formErrors = validateTask(details);
    setErrors(formErrors);
    const firstError = Object.keys(formErrors)[0];
    if (firstError) {
      document.getElementById(firstError)?.focus();
      return;
    }
    setSaving(true);
    setSaveError("");
    try {
      await onSave(task.id, details);
      navigate("/MyTask");
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : "Unable to save task",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="mx-auto w-full max-w-3xl text-neutral-800">
      <div className="mb-6 flex items-center gap-3">
        <Link
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-purple-100 bg-white text-lg text-purple-700 transition-colors hover:bg-purple-50"
          to="/MyTask"
          aria-label="Back to my tasks"
        >
          <MdOutlineArrowBackIos />
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-purple-950 sm:text-4xl">
          Edit Task
        </h1>
      </div>
      <form className="rounded-3xl border border-purple-100 bg-white p-5 shadow-sm sm:p-8" noValidate onSubmit={handleSubmit} aria-busy={saving}>
        <fieldset disabled={saving} className="min-w-0">
        <p className="mb-7 border-b border-stone-100 pb-5 text-sm leading-6 text-stone-500">
          Choose a title, due date, and tag. Description and completion are
          optional.
        </p>
        <div className="relative mb-6">
          <label
            className="mb-2 block text-sm font-semibold text-stone-700"
            htmlFor="title"
          >
            Task Title
          </label>
          <input
            className="min-h-12 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-base text-neutral-800 placeholder:text-stone-400 focus:border-purple-600 aria-invalid:border-rose-600 disabled:opacity-60"
            id="title"
            maxLength={200}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="E.g. Prepare the portfolio walkthrough"
            required
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? "title-error" : undefined}
          />
          {errors.title && (
            <p
              className="mt-2 text-xs text-rose-700"
              id="title-error"
              role="alert"
            >
              {errors.title}
            </p>
          )}
        </div>
        <div className="relative mb-6">
          <label
            className="mb-2 block text-sm font-semibold text-stone-700"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            className="min-h-12 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-base text-neutral-800 placeholder:text-stone-400 focus:border-purple-600 aria-invalid:border-rose-600 disabled:opacity-60 resize-y leading-relaxed"
            id="description"
            maxLength={5000}
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Briefly describe your task"
            aria-invalid={!!errors.description}
            aria-describedby={
              errors.description ? "description-error" : undefined
            }
          />
          {errors.description && (
            <p
              className="mt-2 text-xs text-rose-700"
              id="description-error"
              role="alert"
            >
              {errors.description}
            </p>
          )}
        </div>
        <div className="grid min-w-0 grid-cols-1 gap-x-5 sm:grid-cols-2">
          <div className="mb-6 sm:col-span-2">
            <DueDatePicker value={dueDate} onChange={setDueDate} error={errors.dueDate} />
          </div>
          <div className="mb-6 sm:col-span-2">
            <PriorityPicker value={category} onChange={setCategory} error={errors.category} />
          </div>
        </div>
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-purple-100 bg-purple-50/50 p-4 text-sm text-stone-700">
          <input
            className="size-4.5 shrink-0 cursor-pointer accent-purple-600"
            type="checkbox"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
          />
          <span>Mark as completed</span>
        </label>
        {saveError && (
          <p role="alert" className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {saveError}
          </p>
        )}
        <div className="mt-7 flex flex-col-reverse gap-3 border-t border-stone-100 pt-6 sm:flex-row-reverse">
          <button
            className="min-h-12 rounded-xl bg-purple-600 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-purple-700 disabled:opacity-60"
            disabled={saving}
            type="submit"
          >
            {saving ? "Saving..." : "Save task"}
          </button>
          <Link
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-stone-200 px-7 py-3 text-sm font-semibold text-stone-600 transition-colors hover:bg-stone-50"
            to="/MyTask"
          >
            Cancel
          </Link>
        </div>
        </fieldset>
      </form>
      <button
        className="mx-auto mt-5 block rounded-lg p-3 text-sm font-semibold text-purple-700 hover:bg-purple-50"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        Back to top
      </button>
    </section>
  );
};

export default EditTaskPage;
