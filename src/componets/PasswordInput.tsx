import { useState } from "react";
import type { InputHTMLAttributes } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
export default function PasswordInput(props: Omit<InputHTMLAttributes<HTMLInputElement>, "type">) {
  const [visible, setVisible] = useState(false);
  return <div className="relative mt-2">
    <input {...props} type={visible ? "text" : "password"} className="min-h-12 w-full rounded-xl border border-stone-300 bg-white py-3 pr-12 pl-4 text-base text-stone-900 transition-colors placeholder:text-stone-400 focus:border-purple-600 disabled:opacity-60" />
    <button type="button" aria-label={visible ? "Hide password" : "Show password"} aria-pressed={visible} aria-controls={props.id} className="absolute inset-y-1 right-1 flex w-11 items-center justify-center rounded-lg text-stone-500 hover:bg-purple-50 hover:text-purple-700" onClick={() => setVisible(!visible)}>{visible ? <FiEyeOff aria-hidden="true" /> : <FiEye aria-hidden="true" />}</button>
  </div>;
}
