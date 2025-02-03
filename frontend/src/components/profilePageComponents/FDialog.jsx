import { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import Avatar from "react-avatar";
import { Link } from "react-router-dom";
import { ImSpinner3 } from "react-icons/im";
import {
  useHandleFollowingMutation,
  useRemoveFollowerMutation,
} from "@/lib/mutations/follow.mutations";
import ConfirmationAlert from "../alerts/ConfirmationAlert";

export default function FDialog({ userId, type, count, children }) {
  return (
    <Dialog key={userId}>
      <DialogTrigger asChild>
        <button className="flex flex-col items-center">
          <span className="text-sm font-medium capitalize md:text-base">
            {type + "s"}
          </span>
          <span className="text-xs font-bold text-violet-700 md:text-sm">
            {count !== undefined ? count : "_"}
          </span>
        </button>
      </DialogTrigger>
      {useMemo(
        () => (
          <DialogContent
            aria-describedby={undefined}
            className="max-h-[70%] w-auto min-w-80 max-w-lg rounded-md p-3 md:min-w-96"
          >
            <DialogHeader>
              <DialogTitle className="pr-5 text-center text-2xl font-bold capitalize">
                {type + "s"}
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-2">{children}</div>
          </DialogContent>
        ),
        [children, type],
      )}
    </Dialog>
  );
}

export function FDialogContent({ user, children }) {
  return (
    <li className="user-card flex w-full items-center justify-between gap-2 overflow-clip rounded-lg px-2">
      <Link
        to={"/profile/" + user._id}
        className="user-link flex w-full cursor-pointer items-center gap-2 py-2"
      >
        <Avatar
          src={user.profilePic}
          name={user.fullname}
          size="50"
          round={true}
          style={{ cursor: "pointer" }}
        />
        <div className="flex min-h-12 flex-col">
          <span className="cursor-pointer text-wrap break-words font-semibold">
            {user.username}
          </span>
          <span className="cursor-pointer text-wrap break-words text-sm font-medium">
            {user.fullname}
          </span>
        </div>
      </Link>
      {children}
    </li>
  );
}

export function HandleFollowButton({
  receiver,
  authFollowingSet,
  followingRequestReceiverMap,
}) {
  const { mutate: handleFollowingRequest, isPending } =
    useHandleFollowingMutation();

  const reqId = followingRequestReceiverMap[receiver?._id];

  const action = authFollowingSet.has(receiver._id)
    ? "unfollow"
    : reqId
      ? "cancel"
      : "send";

  return (
    <div className="flex h-8 w-20 items-center justify-center rounded-lg bg-violet-300 font-medium text-white md:text-base">
      {isPending ? (
        <ImSpinner3 className="size-5 animate-spin" />
      ) : action === "send" || action === "cancel" ? (
        <button
          onClick={() => handleFollowingRequest({ action, receiver, reqId })}
          disabled={isPending}
          className="h-full flex-1 rounded-lg bg-violet-400 hover:bg-violet-300"
        >
          {action === "send" ? "Follow" : "Cancel"}
        </button>
      ) : action === "unfollow" ? (
        <ConfirmationAlert
          type="unfollow"
          receiver={receiver}
          onConfirm={() => handleFollowingRequest({ action, receiver, reqId })}
        />
      ) : (
        "null"
      )}
    </div>
  );
}

export function RemoveFollowerButton({ follower }) {
  const { mutate: handleRemove, isPending } = useRemoveFollowerMutation();

  return (
    <div className="flex h-8 w-24 items-center justify-center rounded-lg bg-violet-300 font-medium text-white md:text-base">
      {isPending ? (
        <ImSpinner3 className="size-5 animate-spin" />
      ) : (
        <ConfirmationAlert
          type="remove"
          receiver={follower}
          onConfirm={() => handleRemove(follower._id)}
        />
      )}
    </div>
  );
}
