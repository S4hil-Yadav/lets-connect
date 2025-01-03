import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Input, SubmitButton } from "../components/Input";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export default function LoginPage() {
  const queryClient = useQueryClient();

  const [userFields, setUserFields] = useState({
    email: "sahil@gmail.com",
    password: "123456",
  });

  function handleChange(e) {
    setUserFields({ ...userFields, [e.target.id]: e.target.value.trim() });
  }

  const { mutate: loginMutation, isPending } = useMutation({
    mutationFn: (userFields) => axios.post("/api/v1/auth/login", userFields),
    onSuccess: () => {
      toast.success("Login successful");
      queryClient.invalidateQueries(["authUser"]);
    },
    onError: (err) =>
      toast.error(err.response.data.message || "Something went wrong"),
  });

  function handleSubmit(e) {
    e.preventDefault();

    try {
      if (!userFields.email || !userFields.password)
        throw new Error("All fields are necessary");

      if (!/.+@.+\..+/.test(userFields.email))
        throw new Error("Invalid email address");

      loginMutation(userFields);
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-[url('../assets/bg-violet.jpg')] md:bg-gray-300 md:py-10">
      <form
        className="flex w-screen flex-col justify-between border-[5px] border-none bg-white px-5 pt-10 md:max-w-xl md:border-slate-800 md:px-20 md:shadow-2xl"
        onSubmit={handleSubmit}
      >
        <div className="mb-5 flex items-center justify-between">
          <div className="h-[6px] flex-1 bg-gray-500" />
          <span className="mx-4 text-5xl font-black">LOGIN</span>
          <div className="h-[6px] flex-1 bg-gray-500" />
        </div>
        <div className="flex flex-col gap-3">
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
          <SubmitButton type="login" loading={isPending} />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center justify-center">
            <div className="h-[1px] flex-1 bg-gray-600" />
            <span className="px-3 text-sm font-semibold text-gray-500">
              or login using
            </span>
            <div className="h-[1px] flex-1 bg-gray-600" />
          </div>
          <div className="mt-4 flex justify-center gap-5">
            <FcGoogle className="size-8 cursor-pointer transition-opacity duration-150 ease-in hover:opacity-70" />
            <FaGithub className="size-8 cursor-pointer transition-opacity duration-150 ease-in hover:opacity-80" />
          </div>
        </div>
        <span className="my-3 py-5 text-sm font-semibold text-gray-600">
          Don&apos;t have an account?&nbsp;&nbsp;
          <Link
            to="/signup"
            className="text-blue-800 hover:text-blue-500"
            disabled={isPending}
          >
            Signup
          </Link>
        </span>
      </form>
    </div>
  );
}
