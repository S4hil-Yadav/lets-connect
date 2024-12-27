import { useRef, useState } from "react";
import { BsAlphabetUppercase } from "react-icons/bs";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { MdOutlineVisibility } from "react-icons/md";
import { MdOutlineVisibilityOff } from "react-icons/md";
import { CgSpinnerTwo } from "react-icons/cg";

export function Input({ value, onChange, field, autoFocus }) {
  const inputRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="flex w-auto flex-col items-start border-b-2 border-gray-400 shadow-sm hover:border-gray-600 has-[>div>input:focus]:border-blue-600">
      <label htmlFor={field.replace(/ /g, "")}>
        <span className="text-sm font-bold capitalize text-gray-400">
          {field}
        </span>
      </label>
      <div className="flex w-full items-center bg-gray-100">
        <input
          className={`peer flex w-full bg-gray-100 p-2.5 font-semibold text-slate-600 placeholder:font-exo placeholder:font-normal placeholder:tracking-normal focus:outline-none ${field === "password" && !showPassword && "font-['small-caption'] tracking-wider"}`}
          type={
            field === "password" ? (showPassword ? "text" : "password") : "text"
          }
          value={value}
          placeholder={"Enter your " + field}
          id={field.replace(/ /g, "")}
          ref={inputRef}
          onChange={onChange}
          autoFocus={autoFocus}
          required
        />
        <label
          htmlFor={field.replace(/ /g, "")}
          className={`mr-3 cursor-pointer text-slate-500 transition-none peer-focus:text-blue-500 ${field === "password" && (showPassword ? "peer-focus:text-green-600" : "peer-focus:text-red-500")}`}
        >
          {field === "full name" && <BsAlphabetUppercase className="size-6" />}
          {field === "username" && <FaRegUser className="size-4" />}
          {field === "email" && <MdOutlineEmail className="size-5" />}
          {field === "password" && (
            <Icon
              Ico={showPassword ? MdOutlineVisibility : MdOutlineVisibilityOff}
              onClick={() => setShowPassword(!showPassword)}
            />
          )}
        </label>
      </div>
    </div>
  );
}

export function SubmitButton({ type, loading }) {
  return (
    <button
      className="bg-pos-0 hover:bg-pos-100 flex flex-1 justify-center bg-opacity-100 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 p-3 text-white hover:from-pink-300 hover:via-purple-300 hover:to-indigo-300 hover:shadow-2xl disabled:from-pink-300 disabled:via-purple-300 disabled:to-indigo-300 disabled:shadow-2xl"
      disabled={loading}
    >
      <span className="text-lg font-bold lowercase tracking-wider">
        {loading ? "processing..." : type}
      </span>
      {loading && (
        <CgSpinnerTwo className="ml-2 mt-[2px] size-5 animate-spin" />
      )}
    </button>
  );
}

function Icon({ Ico, onClick }) {
  return <Ico className="size-5 transition-none" onClick={onClick}></Ico>;
}
