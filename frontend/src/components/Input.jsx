import { useState } from "react";
import { BsAlphabetUppercase } from "react-icons/bs";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { MdOutlineVisibility } from "react-icons/md";
import { MdOutlineVisibilityOff } from "react-icons/md";
import { CgSpinnerTwo } from "react-icons/cg";
import { IoSearch } from "react-icons/io5";
// import { FaSort } from "react-icons/fa";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

export function Input({ value, onChange, field, autoFocus }) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="flex w-auto flex-col items-start border-b-2 border-gray-400 shadow-sm has-[>div>input:focus]:border-blue-600 hover:border-gray-600">
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

export function SearchInput({ onSearchChange }) {
  return (
    <div className="sticky flex w-full justify-center">
      <div className="flex w-fit flex-col items-start overflow-clip rounded-lg border-b-2 shadow-sm has-[>div>input:focus]:border-gray-400 hover:border-gray-400">
        {/* <label><span className="text-sm font-bold capitalize text-gray-400">Search</span></label> */}
        <div className="flex w-full items-center bg-gray-100">
          <input
            className="flex w-full bg-gray-100 p-2.5 font-semibold text-slate-600 placeholder:font-exo placeholder:font-normal placeholder:tracking-normal focus:outline-none"
            placeholder="Search"
            onChange={onSearchChange}
            autoFocus
            required
          />
          <label className="mr-3 cursor-pointer text-gray-500">
            <IoSearch size={20} />
          </label>
        </div>
      </div>
      {/* <DropdownMenu>
        <DropdownMenuTrigger className="px-2">
          <FaSort className="text-gray-600" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" side="right" className="min-w-40">
          <DropdownMenuLabel>Sort by</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Share post</DropdownMenuItem>
          <DropdownMenuItem>Report user</DropdownMenuItem>
          <DropdownMenuItem>Block user</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu> */}
    </div>
  );
}

export function SubmitButton({ type, processing, redirecting, disabled }) {
  return (
    <button
      className={`bg-pos-0 hover:bg-pos-100 flex flex-1 justify-center bg-opacity-100 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 p-3 text-white hover:from-pink-300 hover:via-purple-300 hover:to-indigo-300 hover:shadow-2xl disabled:from-pink-300 disabled:via-purple-300 disabled:to-indigo-300 disabled:shadow-2xl ${disabled && "disabled:cursor-not-allowed"}`}
      disabled={processing || redirecting || disabled}
    >
      <span className="text-lg font-bold lowercase tracking-wider">
        {processing ? "processing..." : redirecting ? "redirecting..." : type}
      </span>
      {(processing || redirecting) && (
        <CgSpinnerTwo className="ml-2 mt-[2px] size-5 animate-spin" />
      )}
    </button>
  );
}

function Icon({ Ico, onClick }) {
  return <Ico className="size-5 transition-none" onClick={onClick}></Ico>;
}
