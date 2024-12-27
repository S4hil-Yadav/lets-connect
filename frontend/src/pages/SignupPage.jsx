import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Input, SubmitButton } from "../components/Input";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { fetchUser, setUser } from "../redux/user/userSlice";

export default function SignupPage() {
  const dispatch = useDispatch(),
    navigate = useNavigate();

  const [loading, setLoading] = useState(false),
    [userFields, setUserFields] = useState({
      fullname: "Sahil Yadav",
      username: "S4hil",
      email: "sahil@gmail.com",
      password: "123456",
    });

  const inputs = useRef(null);

  function handleChange(e) {
    setUserFields({ ...userFields, [e.target.id]: e.target.value.trim() });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

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

      const res = await fetch("/api/v1/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userFields),
      });

      const data = await res.json();

      if (data.success === false) throw new Error(data.message);

      if (res.ok) {
        dispatch(setUser(data));
        dispatch(fetchUser());
        toast.success("Signup successful");
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-1 justify-center bg-white bg-[url('../assets/bg-violet.jpg')] md:bg-gray-300 md:py-10">
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
            autoFocus={true}
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
        <div className="my-8 flex items-center overflow-clip rounded-2xl bg-gray-200">
          <SubmitButton type="signup" loading={loading} />
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
        <span className="py-8 text-sm font-semibold text-gray-600">
          Already have an account?&nbsp;&nbsp;
          <Link
            to="/login"
            className="text-blue-800 hover:text-blue-500"
            disabled={loading}
          >
            Login
          </Link>
        </span>
      </form>
    </div>
  );
}
