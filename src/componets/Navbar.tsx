import type * as React from "react";
import { NavLink, Link } from "react-router-dom";
import logo from "../assets/Group 1.png";
import profilePicture from "../assets/Ellipse 1.png";
const Navbar: React.FC = () => {
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
            className="rounded-lg border font-medium text-2xl border-purple-200 p-2.5 aria-[current=page]:text-purple-600 md:px-4"
            to="/NewTask"
          >
            + New task
          </NavLink>
          <NavLink
            className="aria-[current=page]:text-purple-600 font-medium text-2xl"
            to="/MyTask"
          >
            All tasks
          </NavLink>

          <img
            className="hidden size-10 rounded-full object-cover md:block"
            src={profilePicture}
            alt="Profile picture"
          />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
