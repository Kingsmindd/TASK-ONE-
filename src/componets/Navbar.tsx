import { useEffect, useRef, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { FiMenu, FiX, FiPlus, FiList, FiLogOut } from "react-icons/fi";
import logo from "../assets/Group 1.png";

export default function Navbar({ authenticated, onLogout }: { authenticated: boolean; onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const location = useLocation();
  useEffect(() => {
    const close = (event: PointerEvent) => { if (!header.current?.contains(event.target as Node)) setOpen(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", close); document.removeEventListener("keydown", escape); };
  }, []);
  const [menuPath, setMenuPath] = useState(location.pathname + location.search);
  if (menuPath !== location.pathname + location.search) { setMenuPath(location.pathname + location.search); setOpen(false); }
  const itemClass = "flex min-h-[46px] items-center gap-[9px] rounded-[10px] border border-transparent px-4 py-[11px] text-left text-[13px] font-semibold text-[#575161] transition-colors duration-200 hover:bg-purple-50 hover:text-purple-700 aria-[current=page]:bg-purple-100 aria-[current=page]:text-purple-700 motion-reduce:transition-none";
  const navigation = <>
    {authenticated && <>
      <NavLink className={itemClass} to="/MyTask" end onClick={() => setOpen(false)}><FiList aria-hidden="true" /> My tasks</NavLink>
      <NavLink className={itemClass} to="/NewTask" onClick={() => setOpen(false)}><FiPlus aria-hidden="true" /> New task</NavLink>
    </>}
    {authenticated ? <button className={itemClass} onClick={() => { setOpen(false); onLogout(); }}><FiLogOut aria-hidden="true" /> Log out</button> : <>
      <NavLink className={itemClass} to="/login" onClick={() => setOpen(false)}>Log in</NavLink>
      <NavLink className="flex min-h-[46px] items-center rounded-[10px] border border-transparent bg-purple-600 px-4 py-[11px] text-[13px] font-semibold text-white transition-colors duration-200 hover:bg-purple-700 motion-reduce:transition-none" to="/register" onClick={() => setOpen(false)}>Get started</NavLink>
    </>}
  </>;
  return <header ref={header} className="relative z-30 border-b border-[#ede9f2] bg-white">
    <nav className="mx-auto flex min-h-20 max-w-6xl items-center justify-between gap-4 px-5 md:px-8" aria-label="Main navigation">
      <Link className="flex items-center text-2xl font-bold tracking-tight" to="/" onClick={() => setOpen(false)}>
        <img className="mr-2 h-9 w-7 object-contain" src={logo} alt="" />TaskDuty<span className="text-purple-600">.</span>
      </Link>
      <div className="hidden items-center gap-1 md:gap-3 sm:flex">{navigation}</div>
      <button className="flex size-[42px] items-center justify-center rounded-xl border border-purple-200 bg-purple-50 text-[21px] text-purple-700 sm:hidden" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="task-mobile-nav" onClick={() => setOpen(!open)}>{open ? <FiX /> : <FiMenu />}</button>
    </nav>
    <nav id="task-mobile-nav" aria-label="Mobile navigation" aria-hidden={!open} inert={!open} className={"absolute right-5 top-[calc(100%+8px)] flex max-h-56 w-[min(268px,calc(100vw-40px))] flex-col gap-1 overflow-y-auto overscroll-contain rounded-2xl border border-purple-200 bg-white p-2.5 shadow-[0_16px_40px_#3b076420] transition-[opacity,translate,visibility] duration-200 ease-out motion-reduce:transition-none sm:hidden " + (open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1.5 opacity-0")}>{navigation}</nav>
  </header>;
}
