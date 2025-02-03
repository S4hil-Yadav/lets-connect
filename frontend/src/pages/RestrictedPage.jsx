import { Link } from "react-router-dom";

export default function RestrictedPage() {
  return (
    <div className="mt-10 flex flex-col items-center gap-8">
      <span className="text-center text-lg font-semibold">
        You must login or signup to use this feature
      </span>
      <div className="flex gap-5">
        <Link
          to="/login"
          className="rounded-md border border-gray-400 px-4 py-2 text-gray-700 hover:bg-gray-100"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="rounded-md bg-violet-400 px-4 py-2 text-white hover:bg-violet-300"
        >
          Signup
        </Link>
      </div>
    </div>
  );
}
