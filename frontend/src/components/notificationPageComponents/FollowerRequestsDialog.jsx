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
import { Link } from "react-router-dom";
import Avatar from "react-avatar";
import { ImSpinner3 } from "react-icons/im";
import { useMemo } from "react";
import { useHandleFollowerRequestMutation } from "@/lib/mutations/follow.mutations";
import { useGetFollowerRequestsQuery } from "@/lib/queries/user.queries";

export default function FollowerRequestsDialog() {
  const {
    data: followRequests,
    isLoading,
    isError,
  } = useGetFollowerRequestsQuery();

  return (
    <Dialog>
      {followRequests?.length ? (
        <DialogTrigger asChild>
          <button className="relative mb-8 flex items-center gap-2 rounded-md border-2 border-gray-400 bg-gray-200 bg-opacity-50 px-3 py-3 shadow-sm md:mx-5">
            <div className="absolute right-2 top-2 size-[6px] animate-ping rounded-full bg-green-500 shadow-sm shadow-green-300" />
            <TbUsersPlus size={30} className="text-purple-900" />
            <p className="mx-auto text-sm font-medium text-red-800 md:text-base">
              You have&nbsp;
              <span className="font-bold">{followRequests.length || 0}</span>
              &nbsp;pending follow&nbsp;
              {followRequests.length === 1 ? "request" : "requests"}
              &nbsp;&nbsp;
              <span className="hidden text-sm text-gray-600 md:inline">
                (Click here to show)
              </span>
            </p>
          </button>
        </DialogTrigger>
      ) : null}
      {useMemo(
        () => (
          <DialogContent
            aria-describedby={undefined}
            className="max-h-[70%] w-auto min-w-80 max-w-lg rounded-md p-3 md:min-w-96"
          >
            <DialogHeader>
              <DialogTitle className="pr-5 text-center text-xl font-bold capitalize">
                Follow Requests
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-2">
              <Senders
                followRequests={followRequests}
                isLoading={isLoading}
                isError={isError}
              />
            </div>
          </DialogContent>
        ),
        [followRequests, isError, isLoading],
      )}
    </Dialog>
  );
}

function Senders({ followRequests, isLoading, isError }) {
  if (isLoading) return <>Loading Follow Requests</>;
  if (isError) return <>Failed to load Follow Requests</>;

  return (
    <ul className="flex flex-col gap-2">
      {followRequests?.map((req) => (
        <li
          key={req.sender._id}
          className="user-card flex items-center justify-between rounded-lg border-b border-dashed border-slate-400 last:border-none"
        >
          <DialogClose asChild>
            <Link
              to={"/profile/" + req.sender._id}
              className="user-link flex flex-1 cursor-pointer items-center py-2 pl-2"
            >
              <Avatar
                src={req.sender.profilePic}
                name={req.sender.fullname}
                size={50}
                round={true}
              />
              <div className="flex min-h-12 flex-col px-3">
                <span className="cursor-pointer font-semibold">
                  {req.sender.username}
                </span>
                <span className="cursor-pointer text-xs font-medium text-gray-600">
                  {req.sender.fullname}
                </span>
              </div>
            </Link>
          </DialogClose>
          <SenderRequestHandleButtons reqId={req._id} sender={req.sender} />
        </li>
      ))}
    </ul>
  );
}

function SenderRequestHandleButtons({ reqId, sender }) {
  const {
    mutate: handleRequest,
    isAccepting,
    isRejecting,
  } = useHandleFollowerRequestMutation();

  return (
    <div className="mr-2 flex w-20 justify-center">
      <button
        className="flex flex-1 items-center justify-center disabled:cursor-default"
        onClick={() => handleRequest({ action: "reject", sender, reqId })}
        disabled={isAccepting || isRejecting}
      >
        {isRejecting ? (
          <ImSpinner3 size={20} className="animate-spin cursor-default" />
        ) : (
          <IoIosCloseCircleOutline
            size={35}
            className="text-red-600 hover:text-red-400"
          />
        )}
      </button>
      <button
        className="flex flex-1 items-center justify-center disabled:cursor-default"
        onClick={() => handleRequest({ action: "accept", sender, reqId })}
        disabled={isAccepting || isRejecting}
      >
        {isAccepting ? (
          <ImSpinner3 size={20} className="animate-spin cursor-default" />
        ) : (
          <IoIosCheckmarkCircleOutline
            size={35}
            className="text-green-600 hover:text-green-400"
          />
        )}
      </button>
    </div>
  );
}
