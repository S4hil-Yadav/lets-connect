import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: logout } = useMutation({
    mutationFn: () => axios.post("/api/v1/auth/logout"),
    onSuccess: async () => {
      await queryClient.invalidateQueries(["auth-user"]);
      navigate("/login");
      toast.success("Logged out");
    },
  });

  return (
    <div className="flex min-h-screen w-full flex-col break-words bg-white">
      <button
        onClick={logout}
        className="m-5 w-fit rounded-lg bg-violet-400 p-3 text-white shadow-md"
      >
        Logout
      </button>
    </div>
  );
}
