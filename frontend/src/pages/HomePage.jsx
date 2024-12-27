import { useDispatch } from "react-redux";
import { clearUser } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function HomePage() {
  const dispatch = useDispatch(),
    navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await fetch("/api/v1/auth/logout", { method: "POST" });

      const data = await res.json();

      if (data.success === false) throw new Error(data.message);

      if (res.ok) {
        dispatch(clearUser());
        toast.success("Logout successful");
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="min-h-screen flex-1 bg-white">
      <button
        onClick={handleSubmit}
        className="m-5 w-fit rounded-lg bg-violet-400 p-3 text-white shadow-md"
      >
        Logout
      </button>
    </div>
  );
}
