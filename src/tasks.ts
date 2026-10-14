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
  return correctFormat && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
}

export function validateTask(task: TaskInput) {
  const errors: FormErrors = {};

  if (!task.heading.trim()) {
    errors.heading = "Give your task a heading.";
  }
  if (!task.title.trim()) {
    errors.title = "Give your task a title.";
  }
  if (task.title.length > 200) errors.title = "Use 200 characters or fewer.";
  if (task.description.length > 5000) errors.description = "Use 5000 characters or fewer.";
  if (!categories.includes(task.category)) {
    errors.category = "Choose a tag.";
  }
  if (!task.dueDate) {
    errors.dueDate = "Choose a due date.";
  } else if (!isValidDate(task.dueDate)) {
    errors.dueDate = "Choose a valid date.";

  }

  return errors;
}
