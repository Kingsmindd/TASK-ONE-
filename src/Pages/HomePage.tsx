import type * as React from "react";
import { Link } from "react-router-dom";
import illustration from "../assets/Images/bro.png";
const HomePage: React.FC = () => {
  return (
    <section className="grid items-center gap-12 py-3 md:grid-cols-2 md:gap-15 md:py-14">
      <div>
        <h1 className="text-3xl leading-tight font-medium tracking-tight md:text-5xl">
          Manage your Tasks on
          <br />
          <span className="text-purple-600">TaskDuty</span>
        </h1>
        <p className="my-7 max-w-md text-base leading-loose text-stone-500">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Non tellus,
          sapien, morbi ante nunc euismod ac felis ac. Massa et, at platea
          tempus duis non eget. Hendrerit tortor fermentum bibendum mi nisl
          semper porttitor. Nec accumsan.
        </p>
        <Link
          className="inline-flex min-h-12 items-center justify-center gap-6 rounded-lg px-6 py-3.5 text-sm font-semibold transition hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none bg-purple-600 text-white hover:bg-purple-700"
          to="/MyTask"
        >
          Go to my tasks <span aria-hidden="true">→</span>
        </Link>
      </div>
      <div className="mx-auto max-w-sm rounded-[46%_46%_35%_35%] bg-purple-50 px-5 py-9 md:max-w-none">
        <img
          className="w-full object-contain"
          src={illustration}
          alt="An illustration of organising tasks at a desk"
        />
        <div className="mt-5 text-center text-xs tracking-wide text-purple-600">
          Small steps. Real progress.
        </div>
      </div>
    </section>
  );
};

export default HomePage;
