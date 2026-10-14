import { useState } from "react";
import { FiSearch, FiSliders, FiX } from "react-icons/fi";
function searchTokens(query: string): string[] {
  return query.match(/-?(?:[a-z]+:)?(?:"[^"]*"|\S+)/gi) || [];
}
function replaceFilter(query: string, key: string, value: string) {
  const rest = searchTokens(query).filter(
    (token) => !token.toLowerCase().startsWith(key + ":"),
  );
  return [...rest, ...(value ? [key + ":" + value] : [])].join(" ");
}
interface Props {
  value: string;
  onChange: (value: string) => void;
}
export default function TaskSearch({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [words, setWords] = useState("");
  const [status, setStatus] = useState("");
  const [tag, setTag] = useState("");
  const [before, setBefore] = useState("");
  const [after, setAfter] = useState("");
  const [error, setError] = useState("");
  const tokens = searchTokens(value);
  function showFilters() {
    if (open) {
      setOpen(false);
      return;
    }
    const filterValue = (key: string) =>
      tokens
        .find((t) => t.toLowerCase().startsWith(key + ":"))
        ?.slice(key.length + 1)
        .replace(/^"|"$/g, "") || "";
    setStatus(filterValue("is").toLowerCase());
    setTag(filterValue("tag").toLowerCase());
    setBefore(filterValue("before"));
    setAfter(filterValue("after"));
    setWords(
      tokens.filter((t) => !/^(is|tag|before|after):/i.test(t)).join(" "),
    );
    setError("");
    setOpen(true);
  }
  function apply(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (before && after && after >= before) {
      setError("The after date must be earlier than the before date.");
      return;
    }
    let next = words.trim();
    for (const [key, val] of [
      ["is", status],
      ["tag", tag],
      ["after", after],
      ["before", before],
    ])
      next = replaceFilter(next, key!, val!);
    if (next.length > 200) {
      setError("Keep the search within 200 characters.");
      return;
    }
    onChange(next);
    setOpen(false);
  }
  const field =
    "mt-2 w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm focus:border-purple-500 focus:outline-2 focus:outline-purple-200";
  return (
    <section aria-label="Task search" className="mb-8">
      <div className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 shadow-sm focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-100">
        <FiSearch
          aria-hidden="true"
          className="ml-1 shrink-0 text-xl text-purple-500"
        />
        <label htmlFor="task-search" className="sr-only">
          Search tasks
        </label>
        <input
          id="task-search"
          type="search"
          maxLength={200}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              onChange("");
              setOpen(false);
            }
          }}
          placeholder="Search tasks…"
          className="min-w-0 flex-1 bg-transparent py-4 text-sm outline-none md:text-base [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-cancel-button]:hidden"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Clear search"
            className="rounded-full p-2 text-stone-500 hover:bg-stone-100"
          >
            <FiX aria-hidden="true" />
          </button>
        )}
        <button
          type="button"
          onClick={showFilters}
          aria-expanded={open}
          aria-controls="task-search-filters"
          className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-medium text-stone-600 hover:bg-purple-50 hover:text-purple-700"
        >
          <FiSliders aria-hidden="true" />
          <span className="hidden sm:inline">Filters</span>
          <span className="sr-only sm:hidden">Search filters</span>
        </button>
      </div>
      {open && (
        <form
          id="task-search-filters"
          aria-label="Advanced search filters"
          onSubmit={apply}
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
          }}
          className="mt-4 rounded-xl border border-stone-200 bg-white p-5 shadow-sm md:p-6"
        >
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-semibold">Filter tasks</h2>
            <button
              type="button"
              aria-label="Close filters"
              className="rounded-full p-2 hover:bg-stone-100"
              onClick={() => setOpen(false)}
            >
              <FiX />
            </button>
          </div>
          <label className="block text-sm font-medium">
            Keywords
            <input
              className={field}
              value={words}
              onChange={(e) => setWords(e.target.value)}
              placeholder="Search titles or descriptions"
            />
          </label>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium">
              Status
              <select
                className={field}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">Any status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </label>
            <label className="text-sm font-medium">
              Tag
              <select
                className={field}
                value={tag}
                onChange={(e) => setTag(e.target.value)}
              >
                <option value="">Any tag</option>
                <option value="urgent">Urgent</option>
                <option value="important">Important</option>
              </select>
            </label>
            <label className="text-sm font-medium">
              Due after
              <input
                type="date"
                className={field}
                value={after}
                onChange={(e) => setAfter(e.target.value)}
              />
            </label>
            <label className="text-sm font-medium">
              Due before
              <input
                type="date"
                className={field}
                value={before}
                onChange={(e) => setBefore(e.target.value)}
              />
            </label>
          </div>
          <p className="mt-3 text-xs text-stone-500">
            Dates filter the task’s due date. Before and after exclude the
            selected day.
          </p>
          {error && (
            <p role="alert" className="mt-3 text-sm text-rose-700">
              {error}
            </p>
          )}
          <div className="mt-5 flex justify-end gap-3">
            <button
              type="button"
              className="rounded-lg px-4 py-2.5 text-sm text-purple-700 hover:bg-purple-50"
              onClick={() => {
                setWords("");
                setStatus("");
                setTag("");
                setBefore("");
                setAfter("");
                setError("");
                onChange("");
              }}
            >
              Reset
            </button>
            <button
              className="rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-700"
              type="submit"
            >
              Apply filters
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
