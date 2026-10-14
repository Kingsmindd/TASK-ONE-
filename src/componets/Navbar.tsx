import type * as React from "react";
import { NavLink, Link } from "react-router-dom";
import logo from "../assets/Group 1.png";

const Navbar: React.FC<{ authenticated: boolean; onLogout: () => void }> = ({authenticated, onLogout}) => {
  return (
    <header className="border-b border-purple-100 bg-white">
      <nav
        className="mx-auto flex min-h-20 max-w-6xl flex-wrap items-center justify-between gap-5 px-5 py-4 md:min-h-24 md:px-8"
        aria-label="Main navigation"
      >
        <Link
          className="flex items-center text-xl font-bold tracking-tight md:text-2xl"
          to="/"
        >
          <img
            className="mr-2 h-10 w-7 object-contain md:mr-2.5 md:w-10"
            src={logo}
            alt=""
          />
          TaskDuty<span className="text-purple-600">.</span>
        </Link>
        <div className="flex items-center gap-4 text-xs font-semibold md:gap-8 md:text-sm">
          <NavLink
            className="rounded-lg border font-medium text-sm border-purple-200 p-2.5 aria-[current=page]:text-purple-600 md:px-4"
            to="/NewTask"
          >
            + New task
          </NavLink>
          <NavLink
            className="aria-[current=page]:text-purple-600 font-medium text-sm"
            to="/MyTask"
          >
            All tasks
          </NavLink>

          {authenticated ? <button className="rounded-lg bg-purple-50 px-4 py-2 text-purple-700" onClick={onLogout}>Log out</button> : <Link to="/login" className="text-purple-700">Log in</Link>}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
