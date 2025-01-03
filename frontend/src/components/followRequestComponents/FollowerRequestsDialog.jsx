import { TbUsersPlus } from "react-icons/tb";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { IoIosCloseCircleOutline } from "react-icons/io";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import Avatar from "react-avatar";
import { ImSpinner3 } from "react-icons/im";
import { useState } from "react";

export default function FollowerRequestsDialog({ count }) {
  return (
    <Dialog>
      {count ? (
        <DialogTrigger asChild>
          <button className="relative flex items-center gap-2 rounded-md border-2 border-gray-400 bg-gray-200 bg-opacity-50 px-3 py-3 shadow-sm md:mx-5">
            <div className="absolute right-2 top-2 size-[6px] animate-ping rounded-full bg-green-500 shadow-sm shadow-green-300" />
            <TbUsersPlus size={30} className="text-purple-900" />
            <p className="mx-auto text-sm font-medium text-red-800 md:text-base">
              You have&nbsp;
              <span className="font-bold">{count || 0}</span>
              &nbsp;pending follow&nbsp;{count === 1 ? "request" : "requests"}
              &nbsp;&nbsp;
              <span className="hidden text-sm text-gray-600 md:inline">
                (Click here to show)
              </span>
            </p>
          </button>
        </DialogTrigger>
      ) : null}
      <DialogContent
        aria-describedby={undefined}
        className="max-h-[70%] w-auto max-w-lg rounded-md bg-blue-200 p-3 md:min-w-96"
      >
        <DialogHeader>
          <DialogTitle className="pr-5 text-center text-xl font-bold capitalize">
            Follow Requests
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2 bg-red-200">
          <Senders />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Senders() {
  const {
    data: followRequests,
    isLoading: loadingRequests,
    isError,
  } = useQuery({
    queryKey: ["get-follow-requests"],
    queryFn: () =>
      axios.get("/api/v1/follow/get-follow-requests").then((res) => res.data),
  });

  if (loadingRequests) return <>Loading Follow Requests</>;
  if (isError) return <>Failed to load Follow Requests</>;

  return (
    <ul className="flex flex-col bg-violet-200">
      {followRequests?.map((req) => (
        <li
          key={req.sender._id}
          className="flex items-center justify-between border-b border-dashed border-slate-400 last:border-none"
        >
          <DialogClose asChild>
            <Link
              to={"/profile" + req.sender._id}
              className="flex min-w-40 cursor-pointer items-center bg-lime-200 py-2"
            >
              <Avatar
                src={req.sender.profilePic}
                name={req.sender.fullname}
                size={50}
                round={true}
              />
              <div className="flex min-h-12 flex-col bg-pink-200 px-3">
                <span className="cursor-pointer font-semibold">
                  {req.sender.username}
                </span>
                <span className="cursor-pointer text-xs font-medium text-gray-600">
                  {req.sender.fullname}
                </span>
              </div>
            </Link>
          </DialogClose>
          <SenderRequestHandleButtons senderId={req.sender._id} />
        </li>
      ))}
    </ul>
  );
}

function SenderRequestHandleButtons({ senderId }) {
  const queryClient = useQueryClient();

  const [action, setAction] = useState("");

  const {
    mutate: handleRequest,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: (action) =>
      axios
        .post(`/api/v1/follow/${action}-follow-request/` + senderId)
        .then(() => setAction(action)),
    onSuccess: () =>
      queryClient.setQueryData(["notifications"], (prev) => {
        return { ...prev, followerRequestCount: prev.followerRequestCount - 1 };
      }),
    onError: (err) =>
      toast.error(err.response?.data.message || "Something went wrong"),
  });

  if (isSuccess && action === "accept") return <div>approved</div>;
  if (isSuccess && action === "reject") return <div>rejected</div>;

  return (
    <div className="flex justify-center gap-2">
      <button
        className="flex justify-center bg-violet-400 disabled:cursor-default"
        onClick={() => handleRequest("reject")}
        disabled={isPending}
      >
        {isPending && action === "reject" ? (
          <ImSpinner3 size={20} className="animate-spin cursor-default" />
        ) : (
          <IoIosCloseCircleOutline size={35} />
        )}
      </button>
      <button
        className="flex justify-center bg-violet-400 disabled:cursor-default"
        onClick={() => handleRequest("reject")}
        disabled={isPending}
      >
        {isPending && action === "accept" ? (
          <ImSpinner3 size={20} className="animate-spin cursor-default" />
        ) : (
          <IoIosCheckmarkCircleOutline size={35} />
        )}
      </button>
    </div>
  );
}
