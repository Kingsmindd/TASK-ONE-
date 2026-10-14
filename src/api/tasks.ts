import { request } from "./http";
import type { Task, TaskInput } from "../tasks";
interface ApiTask extends Omit<TaskInput, "heading"> {
  _id: string;
}
export function fromApi(task: ApiTask): Task {
  return {
    ...task,
    id: task._id,
    category: task.category || "Important",
    heading: task.category || "Important",
    dueDate: task.dueDate || "",
  };
}
export async function fetchTasks(
  token: string,
  search = "",
  signal?: AbortSignal,
): Promise<Task[]> {
  const data = await request<{ tasks: ApiTask[] }>(
    "/tasks?search=" + encodeURIComponent(search.trim()),
    token,
    "GET",
    undefined,
    signal,
  );
  return data.tasks.map(fromApi);
}
export async function saveTask(
  token: string,
  input: Partial<TaskInput>,
  id?: string,
): Promise<Task> {
  const { title, description, completed, category, dueDate } = input;
  const data = await request<{ task: ApiTask }>(
    "/tasks" + (id ? "/" + id : ""),
    token,
    id ? "PATCH" : "POST",
    { title, description, completed, category, dueDate },
  );
  return fromApi(data.task);
}
export const removeTask = (token: string, id: string) =>
  request("/tasks/" + id, token, "DELETE");
