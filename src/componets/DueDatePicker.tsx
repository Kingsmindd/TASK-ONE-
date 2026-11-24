import { useEffect, useRef, useState } from "react";
import { FiCalendar, FiCheck, FiChevronDown, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { today } from "../tasks";

function dateString(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function dateAfter(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return dateString(date);
}

export default function DueDatePicker({ value, onChange, error }: {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(() => {
    const date = value ? new Date(`${value}T00:00:00`) : new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
  });
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const outside = (event: PointerEvent) => {
      if (!container.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, []);
  function choose(date: string) {
    onChange(date);
    setOpen(false);
    trigger.current?.focus();
  }
  function toggle() {
    if (!open) {
      const date = value ? new Date(`${value}T00:00:00`) : new Date();
      setMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    }
    setOpen(!open);
  }
  const choices = [{ label: "Today", date: today() }, { label: "Tomorrow", date: dateAfter(1) }, { label: "Next week", date: dateAfter(7) }];
  const parsed = value ? new Date(`${value}T00:00:00`) : null;
  const formatted = parsed && !Number.isNaN(parsed.getTime()) ? parsed.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "long", year: "numeric" }) : "Choose a day that works for you.";
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const navigationClass = "flex size-10 shrink-0 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-600 hover:bg-purple-50 hover:text-purple-700 disabled:opacity-50";
  return <div ref={container} onKeyDown={(event) => { if (event.key === "Escape" && open) { event.stopPropagation(); setOpen(false); trigger.current?.focus(); } }}>
    <label htmlFor="dueDate" className="block text-sm font-semibold text-stone-700">Due date</label>
    <p id="date-help" className="mt-1 text-xs leading-5 text-stone-500">Set a deadline, or use a quick choice below.</p>
    <div className={"mt-3 rounded-2xl border bg-white p-4 sm:p-5 " + (error ? "border-rose-300" : "border-stone-200")}>
      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-xl text-purple-600"><FiCalendar aria-hidden="true" /></span>
          <div className="min-w-0"><p className="text-sm font-semibold text-stone-800">{value ? "Your deadline" : "Plan your time"}</p><p className="mt-1 text-xs leading-5 text-stone-500">{formatted}</p></div>
        </div>
        <button ref={trigger} id="dueDate" type="button" aria-expanded={open} aria-controls="due-date-calendar" aria-invalid={!!error} aria-describedby={error ? "date-help date-error" : "date-help"} onClick={toggle} className="flex min-h-11 w-full shrink-0 items-center justify-between gap-3 rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm font-semibold text-stone-700 hover:border-purple-300 hover:bg-purple-50 sm:w-auto"><span>{value ? "Change date" : "Choose date"}</span><FiChevronDown aria-hidden="true" className={"transition-transform motion-reduce:transition-none " + (open ? "rotate-180" : "")} /></button>
        <input type="hidden" name="dueDate" value={value} />
      </div>
      {open && <section id="due-date-calendar" aria-label="Choose due date" className="mt-4 w-full rounded-xl border border-purple-100 bg-stone-50/60 p-2.5 sm:rounded-2xl sm:p-4 lg:p-5">
        <div className="mb-2 flex items-center justify-between gap-2">
          <button type="button" aria-label="Previous month" className={navigationClass} onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}><FiChevronLeft aria-hidden="true" /></button>
          <p aria-live="polite" className="text-center text-sm font-semibold text-purple-950">{month.toLocaleDateString(undefined, { month: "long", year: "numeric" })}</p>
          <button type="button" aria-label="Next month" className={navigationClass} onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}><FiChevronRight aria-hidden="true" /></button>
        </div>
        <div className="grid grid-cols-7 text-center text-[10px] sm:text-xs lg:text-sm font-semibold text-stone-400" aria-hidden="true">{["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(day => <span key={day} className="py-2">{day}</span>)}</div>
        <div tabIndex={0} role="group" aria-label="Calendar days, scroll for more dates" className="max-h-40 overflow-y-auto overscroll-contain rounded-lg p-1 focus-visible:outline-2 focus-visible:outline-purple-400 sm:max-h-64 lg:max-h-80">
          <div className="grid grid-cols-7 gap-1 sm:gap-2 lg:gap-3">
            {Array.from({ length: month.getDay() }, (_, index) => <span key={`empty-${index}`} aria-hidden="true" />)}
            {Array.from({ length: days }, (_, index) => {
              const date = dateString(new Date(month.getFullYear(), month.getMonth(), index + 1));
              const selected = value === date;
              return <button key={date} type="button" aria-label={new Date(`${date}T00:00:00`).toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" })} aria-pressed={selected} aria-current={date === today() ? "date" : undefined} onClick={() => choose(date)} className={"flex min-h-10 min-w-0 items-center justify-center rounded-lg text-xs font-semibold sm:min-h-12 sm:text-sm lg:min-h-14 lg:rounded-xl lg:text-base focus-visible:outline-offset-0 " + (selected ? "bg-purple-600 text-white" : date === today() ? "bg-purple-100 text-purple-800 ring-1 ring-inset ring-purple-300" : "text-stone-600 hover:bg-purple-100 hover:text-purple-800")}>{index + 1}</button>;
            })}
          </div>
        </div>
        <p className="mt-2 text-center text-[10px] text-stone-500">Scroll to see more days · Tap a date to select</p>
      </section>}
      <div role="group" aria-label="Quick due dates" className="mt-4 flex flex-wrap gap-2 border-t border-stone-100 pt-4">
        {choices.map(({ label, date }) => <button key={label} type="button" aria-pressed={value === date} onClick={() => choose(date)} className={"inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors disabled:opacity-60 motion-reduce:transition-none " + (value === date ? "border-purple-300 bg-purple-50 text-purple-700" : "border-stone-200 bg-white text-stone-600 hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700")}>{value === date && <FiCheck aria-hidden="true" />}{label}</button>)}
      </div>
    </div>
    {error && <p id="date-error" role="alert" className="mt-2 text-xs text-rose-700">{error}</p>}
  </div>;
}
