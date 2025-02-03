import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Input, SubmitButton } from "../components/Input";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useSignupMutation } from "@/lib/mutations/auth.mutations";

export default function SignupPage() {
  const [userFields, setUserFields] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
  });

  const inputs = useRef(null);

  function handleChange(e) {
    setUserFields({ ...userFields, [e.target.id]: e.target.value.trim() });
  }

  const { mutate: signUp, isPending, isSuccess } = useSignupMutation();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (
        !userFields.fullname ||
        !userFields.username ||
        !userFields.password ||
        !userFields.email
      )
        throw new Error("All fields are required");

      if (!/.+@.+\..+/.test(userFields.email))
        throw new Error("Invalid email address");

      if (userFields.username.length > 20)
        throw new Error("Maximum username length is 20");

      if (userFields.password.length < 6)
        throw new Error("Minimun password length is 6");

      if (userFields.password.length > 30)
        throw new Error("Maximum password length is 30");

      if (
        userFields.fullname.split(" ").length > 5 ||
        userFields.fullname.length > 30
      )
        throw new Error("Only 5 words and max length 30 is allowed");

      signUp(userFields);
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-white bg-[url('../assets/bg-violet.jpg')] md:bg-gray-300 md:py-10">
      <form
        className="flex w-screen flex-col justify-between border-[5px] border-none bg-white px-5 pt-10 md:max-w-xl md:border-slate-800 md:px-20 md:shadow-2xl"
        onSubmit={handleSubmit}
      >
        <div className="mb-5 flex items-center justify-between">
          <div className="h-[6px] flex-1 bg-gray-500" />
          <span className="mx-4 text-5xl font-black">SIGNUP</span>
          <div className="h-[6px] flex-1 bg-gray-500" />
        </div>
        <div className="flex flex-col gap-3" ref={inputs}>
          <Input
            field="full name"
            value={userFields.fullname}
            onChange={handleChange}
          />
          <Input
            field="username"
            value={userFields.username}
            onChange={handleChange}
          />
          <Input
            field="email"
            value={userFields.email}
            onChange={handleChange}
          />
          <Input
            field="password"
            value={userFields.password}
            onChange={handleChange}
          />
        </div>
        <div className="my-12 flex items-center overflow-clip rounded-2xl">
          <SubmitButton
            type="signup"
            processing={isPending}
            redirecting={isSuccess}
          />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center justify-center">
            <div className="h-[1px] flex-1 bg-gray-600" />
            <span className="cursor-default px-3 text-sm font-semibold text-gray-500">
              or signup using
            </span>
            <div className="h-[1px] flex-1 bg-gray-600" />
          </div>
          <div className="mt-4 flex justify-center gap-5">
            <FcGoogle className="size-8 cursor-pointer transition-opacity duration-150 ease-in hover:opacity-70" />
            <FaGithub className="size-8 cursor-pointer transition-opacity duration-150 ease-in hover:opacity-80" />
          </div>
        </div>
        <span className="my-3 py-5 text-sm font-semibold text-gray-600">
          Already have an account?&nbsp;&nbsp;
          <Link
            to="/login"
            className="text-blue-800 hover:text-blue-500"
            disabled={isPending}
          >
            Login
          </Link>
        </span>
      </form>
    </div>
  );
}
