export const editTasksInCode = true;

export type Category = "Urgent" | "Important";
export const categories: Category[] = ["Urgent", "Important"];

export interface TaskInput {
  heading: string;
  title: string;
  description: string;
  dueDate: string;
  category: Category;
  completed: boolean;
}

export interface Task extends TaskInput {
  headingClass?: string;
  titleClass?: string;
  id: string;
}

export interface FormErrors {
  heading?: string;
  title?: string;
  description?: string;
  dueDate?: string;
  category?: string;
}

export function today() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isValidDate(value: string) {
  const correctFormat = /^\d{4}-\d{2}-\d{2}$/.test(value);
  return correctFormat && !Number.isNaN(Date.parse(value));
}

export function validateTask(task: TaskInput) {
  const errors: FormErrors = {};

  if (!task.heading.trim()) {
    errors.heading = "Give your task a heading.";
  }
  if (!task.title.trim()) {
    errors.title = "Give your task a title.";
  }
  if (!task.description.trim()) {
    errors.description = "Add a short description.";
  }
  if (!categories.includes(task.category)) {
    errors.category = "Choose a tag.";
  }
  if (!task.dueDate) {
    errors.dueDate = "Choose a due date.";
  } else if (!isValidDate(task.dueDate)) {
    errors.dueDate = "Choose a valid date.";
  } else if (task.dueDate < today()) {
    errors.dueDate = "The due date cannot be in the past.";
  }

  return errors;
}

function createStartingTasks(): Task[] {
  return [
    {
      id: "Agro-website-update",
      headingClass: "text-[#F38383] font-sans",
      titleClass: "text-[#292929]  font-sans",
      heading: "Urgent",
      title: "Agro Website Update",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Amet quis nibh posuere non tempor. Erat mattis gravida pulvinar nibh aliquam faucibus et magna. Interdum eu tempus ultricies cras neque mi. Eget tellus suspendisse et viverra.",
      dueDate: today(),
      category: "Urgent",
      completed: false,
    },

    {
      id: "FinTech-Website-Update",
      headingClass: "text-[#73C3A6] font-sans",
      titleClass: "text-[#292929]  font-sans",
      heading: "Important",
      title: "FinTech Website Update",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Amet quis nibh posuere non tempor. Erat mattis gravida pulvinar nibh aliquam faucibus et magna. Interdum eu tempus ultricies cras neque mi. Eget tellus suspendisse et viverra.",
      dueDate: today(),
      category: "Urgent",
      completed: false,
    },

    {
      id: "Agro-website-update",
      headingClass: "text-[#F38383]  font-sans",
      titleClass: "text-[#292929]  font-sans",
      heading: "Urgent",
      title: "Agro Website Update",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Amet quis nibh posuere non tempor. Erat mattis gravida pulvinar nibh aliquam faucibus et magna. Interdum eu tempus ultricies cras neque mi. Eget tellus suspendisse et viverra.",
      dueDate: today(),
      category: "Urgent",
      completed: false,
    },

    {
      id: "FinTech-Website-Update",
      headingClass: "text-[#73C3A6] font-sans",
      titleClass: "text-[#292929]  font-sans",
      heading: "Important",
      title: "FinTech Website Update",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Amet quis nibh posuere non tempor. Erat mattis gravida pulvinar nibh aliquam faucibus et magna. Interdum eu tempus ultricies cras neque mi. Eget tellus suspendisse et viverra.",
      dueDate: today(),
      category: "Urgent",
      completed: false,
    },
  ];
}

function isSavedTask(value: unknown): value is Task {
  if (!value || typeof value !== "object") return false;
  const task = value as Task;

  return (
    typeof task.id === "string" &&
    typeof task.title === "string" &&
    typeof task.description === "string" &&
    typeof task.dueDate === "string" &&
    isValidDate(task.dueDate) &&
    categories.includes(task.category) &&
    typeof task.completed === "boolean"
  );
}

export function readTasks(): Task[] {
  if (editTasksInCode) return createStartingTasks();
  try {
    const saved = localStorage.getItem("taskduty.tasks");

    if (saved !== null) {
      const tasks: unknown = JSON.parse(saved);
      if (Array.isArray(tasks)) {
        return tasks.filter(isSavedTask).map((task) => ({
          ...task,
          heading: typeof task.heading === "string" ? task.heading : "impotart",
        }));
      }
    }
  } catch {}

  const tasks = createStartingTasks();
  try {
    localStorage.setItem("taskduty.tasks", JSON.stringify(tasks));
  } catch {}
  return tasks;
}
