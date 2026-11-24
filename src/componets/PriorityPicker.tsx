import { FiCheck, FiFlag, FiZap } from "react-icons/fi";
import { categories } from "../tasks";
import type { Category } from "../tasks";

export default function PriorityPicker({ value, onChange, error }: {
  value: Category | "";
  onChange: (value: Category) => void;
  error?: string;
}) {
  return <fieldset aria-describedby={error ? "category-error" : "category-help"}>
    <legend className="text-sm font-semibold text-stone-700">Priority</legend>
    <p id="category-help" className="mt-1 text-xs leading-5 text-stone-500">Choose how much attention this task needs.</p>
    <div className="mt-3 grid gap-3 sm:grid-cols-2">
      {categories.map((priority, index) => {
        const urgent = priority === "Urgent";
        const selected = value === priority;
        const Icon = urgent ? FiZap : FiFlag;
        return <label key={priority} className="relative min-w-0 cursor-pointer">
          <input id={index === 0 ? "category" : "category-urgent"} type="radio" name="priority" value={priority} checked={selected} onChange={() => onChange(priority)} required aria-invalid={!!error} aria-describedby={error ? "category-error" : "category-help"} className="peer sr-only" />
          <span className={"flex h-full min-h-24 items-center gap-3 rounded-2xl border p-4 transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-purple-500 peer-disabled:cursor-not-allowed peer-disabled:opacity-60 motion-reduce:transition-none " + (selected ? urgent ? "border-rose-400 bg-rose-50 ring-1 ring-rose-400" : "border-purple-400 bg-purple-50 ring-1 ring-purple-400" : "border-stone-200 bg-white hover:border-purple-300 hover:bg-stone-50")}>
            <span className={"flex size-10 shrink-0 items-center justify-center rounded-xl text-lg " + (urgent ? "bg-rose-100 text-rose-700" : "bg-purple-100 text-purple-700")}><Icon aria-hidden="true" /></span>
            <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-stone-900">{priority}</span><span className="mt-1 block text-xs leading-5 text-stone-500">{urgent ? "Time-sensitive. Tackle it soon." : "Meaningful work. Plan time for it."}</span></span>
            <span className={"flex size-5 shrink-0 items-center justify-center rounded-full border " + (selected ? urgent ? "border-rose-600 bg-rose-600 text-white" : "border-purple-600 bg-purple-600 text-white" : "border-stone-300 bg-white")}>{selected && <FiCheck className="size-3.5" aria-hidden="true" />}</span>
          </span>
        </label>;
      })}
    </div>
    {error && <p id="category-error" role="alert" className="mt-2 text-xs text-rose-700">{error}</p>}
  </fieldset>;
}
