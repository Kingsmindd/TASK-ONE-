import { Link } from "react-router-dom";
import { FiArrowRight, FiCheckCircle, FiSearch, FiCalendar } from "react-icons/fi";
import illustration from "../assets/Images/bro.png";
export default function HomePage() {
  return <div>
    <section className="grid items-center gap-10 py-6 md:grid-cols-2 md:gap-14 md:py-14">
      <div>
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-2 text-xs font-semibold text-purple-700"><span className="size-1.5 rounded-full bg-purple-500" /> A little focus goes a long way</span>
        <h1 className="max-w-xl text-5xl leading-[1.12] font-bold tracking-tight text-stone-900 md:text-6xl">Less on your mind.<br /><span className="text-purple-600">More getting done.</span></h1>
        <p className="my-7 max-w-md text-base leading-8 text-stone-500">Give your day a clear direction. Organise your tasks, set priorities, and turn small steps into real progress.</p>
        <Link className="inline-flex min-h-12 items-center justify-center gap-5 rounded-xl bg-purple-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-purple-200 transition hover:bg-purple-700" to="/MyTask">Open my workspace <FiArrowRight aria-hidden="true" /></Link>
        <p className="mt-5 text-xs text-stone-500">Your tasks, saved to your account.</p>
      </div>
      <div className="relative mx-auto w-full max-w-md rounded-3xl border border-purple-100 bg-gradient-to-br from-purple-100 to-white p-7 md:p-10">
        <img className="aspect-square w-full object-contain" src={illustration} alt="Organising tasks at a desk" />
        <div className="flex items-center gap-3 rounded-2xl border border-purple-100 bg-white p-4 shadow-sm"><span className="rounded-xl bg-emerald-50 p-3 text-emerald-600"><FiCheckCircle aria-hidden="true" /></span><div><p className="text-sm font-semibold">One task at a time.</p><p className="mt-1 text-xs text-stone-500">Build a day you feel good about.</p></div></div>
      </div>
    </section>
    <section aria-label="Workspace features" className="grid gap-4 border-t border-purple-100 pt-8 pb-4 md:grid-cols-3">
      {[{icon:FiCheckCircle,title:"Clear priorities",text:"Keep important and urgent work easy to spot."},{icon:FiCalendar,title:"Dates that matter",text:"Set due dates and see what needs your attention."},{icon:FiSearch,title:"Find your focus",text:"Search by title, status, priority, or due date."}].map(({icon:Icon,title,text})=><article key={title} className="rounded-2xl border border-stone-200 bg-white p-6"><Icon className="mb-4 text-xl text-purple-600" aria-hidden="true" /><h2 className="font-semibold">{title}</h2><p className="mt-2 text-sm leading-6 text-stone-500">{text}</p></article>)}
    </section>
  </div>;
}
