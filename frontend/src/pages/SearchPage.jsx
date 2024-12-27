import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Users } from "../components/Dialogs";
import { fetchUser } from "../redux/user/userSlice";
import { ImSpinner3 } from "react-icons/im";

export default function SearchPage() {
  const dispatch = useDispatch();
  const { authUser } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers();
    async function getUsers() {
      const res = await fetch("/api/v1/users/get-users", { method: "GET" });
      const data = await res.json();
      if (!res.ok || data.success === false)
        return toast.error("Couldn't get users");
      setUsers(data);
    }
  }, []);

  return !authUser ? (
    <ImSpinner3 size={20} className="animate-spin" />
  ) : (
    <Users users={users} />
  );
}
