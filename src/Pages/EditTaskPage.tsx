import type * as React from "react";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { MdOutlineArrowBackIos } from "react-icons/md";
import { Link, useNavigate, useParams } from "react-router-dom";
import { categories, today, validateTask } from "../tasks";
import type { Category, FormErrors, Task, TaskInput } from "../tasks";

const EditTaskPage: React.FC<{
  tasks: Task[];
  onSave: (id: string, input: TaskInput) => void;
}> = ({
  tasks,
  onSave,
}) => {
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
  onSave: (id: string, input: TaskInput) => void;
}> = ({
  task,
  onSave,
}) => {
  const navigate = useNavigate();
  const heading = task.heading;
  const [title, setTitle] = useState("urgent");
  const [description, setDescription] = useState(task.description);
  const [dueDate, setDueDate] = useState(task.dueDate);
  const [category, setCategory] = useState<Category | "">(task.category);
  const [completed, setCompleted] = useState(task.completed);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    function handleOutsideClick(event: PointerEvent) {
      if (!(event.target instanceof Node)) return;

      // Keep the selected values; only remove focus from the native picker.
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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
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
    onSave(task.id, details);
    navigate("/MyTask");
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
          Edit Task
        </h1>
      </div>
      <form className="bg-white" noValidate onSubmit={handleSubmit}>
        <p className="mb-9 text-xs text-stone-500">
          All task details are required. Completion is optional.
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
            required
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
              className="w-full min-h-18 rounded-lg border border-stone-400 bg-white px-5 py-6 text-lg text-neutral-800 placeholder:text-base placeholder:text-stone-400 focus:border-purple-600 aria-invalid:border-rose-600 md:min-h-20 md:px-6 md:text-xl"
              id="dueDate"
              type="date"
              min={today()}
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
              Tags / Category
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
              <option value="">Choose a category</option>
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
        <div className="mt-8 flex flex-col gap-4">
          <button
            className="w-full rounded-lg bg-purple-600 px-5 py-3 text-3xl font-medium text-white hover:bg-purple-700"
            type="submit"
          >
            Done
          </button>
          <Link className="text-center text-sm text-stone-500" to="/MyTask">
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

export default EditTaskPage;
