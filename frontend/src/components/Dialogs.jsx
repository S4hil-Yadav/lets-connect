import Avatar from "react-avatar";
import { ImSpinner3 } from "react-icons/im";
import { Link, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function UsersDialog({ userId, type, count }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex flex-col items-center">
          <span className="text-sm capitalize md:text-base">
            {type || "Users"}
          </span>
          <span className="text-xs md:text-sm">{count}</span>
        </button>
      </DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className="max-h-[70%] w-auto max-w-lg rounded-md bg-blue-200 p-3 md:min-w-96"
      >
        <DialogHeader>
          <DialogTitle className="pr-5 text-center text-xl font-bold capitalize">
            {type || "Users"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2 bg-red-200">
          <Users userId={userId} type={type} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function Users({ userId, type }) {
  const {
    data: users,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user", userId, type],
    queryFn: async () => {
      const users = await axios
        .get(`/api/v1/users/${userId}/get-${type}`)
        .then((res) => res.data);
      return users;
    },
  });
  // async function handleFollowingRequest(user) {
  //   try {
  //     setLoadingButtons((prev) => {
  //       return { ...prev, [user._id]: true };
  //     });

  //     if (user._id === authUser._id) {
  //       navigate("/profile/" + authUser._id);
  //     } else if (authUser?.following?.some((usr) => usr._id === user._id)) {
  //       await unFollow(user._id);
  //       toast.success("Unfollowed");
  //     } else if (
  //       authUser?.followingRequests?.some(
  //         (req) => req.receiver._id === user._id,
  //       )
  //     ) {
  //       await cancelFollowRequest(user._id);
  //       toast.success("Follow request cancelled");
  //     } else {
  //       await sendFollowRequest(user._id);
  //       toast.success("Follow request sent");
  //     }
  //     dispatch(setUser(await fetchAuthUser()));
  //   } catch (error) {
  //     toast.error(error.message);
  //   } finally {
  //     setLoadingButtons((prev) => {
  //       return { ...prev, [user._id]: false };
  //     });
  //   }
  // }

  if (isLoading) return <>Loading {type}</>;
  if (isError) return <>Error in loading {type}</>;

  return !users?.length ? (
    "You don't have any " + type
  ) : (
    <ul className="flex w-full flex-col bg-violet-200">
      {users?.map((user) => (
        <li
          key={user._id}
          className="flex w-full items-center justify-between gap-2 border-b border-dashed border-slate-400 last:border-none"
        >
          <DialogClose asChild>
            <Link
              to={"/profile/" + user._id}
              className="flex w-full cursor-pointer items-center gap-2 bg-lime-200 py-2"
            >
              <Avatar
                src={user.profilePic}
                name={user.fullname}
                size="50"
                round={true}
                style={{ cursor: "pointer" }}
              />
              <div className="flex min-h-12 flex-col bg-pink-200">
                <span className="cursor-pointer text-wrap break-words font-semibold">
                  {user.username}
                </span>
                <span className="cursor-pointer text-wrap break-words text-sm font-medium">
                  {user.fullname}
                </span>
              </div>
            </Link>
          </DialogClose>
          {/* <button
            className="flex min-h-5 min-w-16 items-center justify-center rounded-lg bg-violet-400 px-1 py-1 text-sm text-white disabled:cursor-default md:px-2 md:text-base"
            onClick={() => handleFollowingRequest(user)}
            disabled={loadingButtons[user._id]}
          >
            {user._id === authUser._id ? (
              "You"
            ) : loadingButtons[user._id] ? (
              <ImSpinner3 size={20} className="animate-spin cursor-default" />
            ) : authUser?.following?.some((usr) => usr._id === user._id) ? (
              "Unfollow"
            ) : authUser?.followingRequests?.some(
                (req) => req.receiver._id === user._id,
              ) ? (
              "Pending"
            ) : (
              "Follow"
            )}
          </button> */}
        </li>
      ))}
    </ul>
  );
}
