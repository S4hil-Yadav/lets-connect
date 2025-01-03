import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { UsersDialog } from "../components/Dialogs";
import { fetchUser } from "../redux/user/userSlice";

export default function SearchPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  const [users, setUsers] = useState();

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
  console.log(users);

  return <UsersDialog users={users} type="all users" />;
}
