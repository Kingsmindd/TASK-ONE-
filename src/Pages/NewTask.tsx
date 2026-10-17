import type * as React from "react";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { MdOutlineArrowBackIos } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { categories, validateTask } from "../tasks";
import type { Category, FormErrors, TaskInput } from "../tasks";

const NewTask: React.FC<{
  onSave: (input: TaskInput) => Promise<void>;
}> = ({ onSave }) => {
  const navigate = useNavigate();
  const heading = "important";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    function handleOutsideClick(event: PointerEvent) {
      if (!(event.target instanceof Node)) return;

      for (const id of ["dueDate", "category"]) {
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
      await onSave(details);
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
    <section className="mx-auto w-full text-neutral-800">
      <div className="mb-10 flex items-center gap-2 md:gap-4">
        <Link
          className="inline-flex p-2 text-3xl"
          to="/MyTask"
          aria-label="Back to my tasks"
        >
          <MdOutlineArrowBackIos />
        </Link>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
          New Task
        </h1>
      </div>
      <form className="bg-white" noValidate onSubmit={handleSubmit}>
        <p className="mb-9 text-xs text-stone-500">
          Choose a title, due date, and tag. Description and completion are
          optional.
        </p>
        <div className="relative mb-10">
          <label
            className="absolute -top-4 left-4 bg-white px-2 text-lg leading-8 text-stone-500 md:left-6 md:text-xl"
            htmlFor="title"
          >
            Task Title
          </label>
          <input
            className="w-full min-h-18 rounded-lg border border-stone-400 bg-white px-5 py-6 text-lg text-neutral-800 placeholder:text-base placeholder:text-stone-400 focus:border-purple-600 aria-invalid:border-rose-600 md:min-h-20 md:px-6 md:text-xl"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="E.g Project Defense, Assignment..."
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
        <div className="relative mb-10">
          <label
            className="absolute -top-4 left-4 bg-white px-2 text-lg leading-8 text-stone-500 md:left-6 md:text-xl"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            className="w-full min-h-18 rounded-lg border border-stone-400 bg-white px-5 py-6 text-lg text-neutral-800 placeholder:text-base placeholder:text-stone-400 focus:border-purple-600 aria-invalid:border-rose-600 md:min-h-20 md:px-6 md:text-xl resize-y leading-relaxed"
            id="description"
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
        <div className="grid grid-cols-1">
          <div className="relative mb-10">
            <label
              className="absolute -top-4 left-4 bg-white px-2 text-lg leading-8 text-stone-500 md:left-6 md:text-xl"
              htmlFor="dueDate"
            >
              Due date
            </label>
            <input
              className="block w-full min-w-0 max-w-full box-border appearance-none min-h-18 rounded-lg border border-stone-400 bg-white px-5 py-6 text-lg text-neutral-800 placeholder:text-base placeholder:text-stone-400 focus:border-purple-600 aria-invalid:border-rose-600 md:min-h-20 md:px-6 md:text-xl"
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
              aria-invalid={!!errors.dueDate}
              aria-describedby={errors.dueDate ? "date-error" : undefined}
            />
            {errors.dueDate && (
              <p
                className="mt-2 text-xs text-rose-700"
                id="date-error"
                role="alert"
              >
                {errors.dueDate}
              </p>
            )}
          </div>
          <div className="relative mb-10">
            <label
              className="absolute -top-4 left-4 bg-white px-2 text-lg leading-8 text-stone-500 md:left-6 md:text-xl"
              htmlFor="category"
            >
              Tags
            </label>
            <select
              className="w-full min-h-18 rounded-lg border border-stone-400 bg-white px-5 py-6 text-lg text-neutral-800 placeholder:text-base placeholder:text-stone-400 focus:border-purple-600 aria-invalid:border-rose-600 md:min-h-20 md:px-6 md:text-xl"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              required
              aria-invalid={!!errors.category}
              aria-describedby={errors.category ? "category-error" : undefined}
            >
              <option value="">Choose a Tag</option>
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
            {errors.category && (
              <p
                className="mt-2 text-xs text-rose-700"
                id="category-error"
                role="alert"
              >
                {errors.category}
              </p>
            )}
          </div>
        </div>
        <label className="flex cursor-pointer items-center gap-3 text-sm">
          <input
            className="size-4.5 shrink-0 cursor-pointer accent-purple-600"
            type="checkbox"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
          />
          <span>Mark as completed</span>
        </label>
        {saveError && (
          <p role="alert" className="mt-4 text-rose-700">
            {saveError}
          </p>
        )}
        <div className="mt-8 flex flex-col gap-4">
          <button
            className="w-full rounded-lg bg-purple-600 px-5 py-3 text-3xl font-medium text-white hover:bg-purple-700"
            disabled={saving}
            type="submit"
          >
            {saving ? "Saving..." : "Save task"}
          </button>
          <Link className="inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-purple-200 bg-purple-50 px-5 py-3 text-base font-semibold text-purple-700 transition-colors hover:border-purple-300 hover:bg-purple-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 active:bg-purple-200" to="/MyTask">
            Cancel
          </Link>
        </div>
      </form>
      <button
        className="mx-auto mt-8 block bg-transparent p-3 text-xl text-purple-600 underline underline-offset-4"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        Back to top
      </button>
    </section>
  );
};

export default NewTask;
