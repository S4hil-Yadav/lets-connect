import { ImSpinner3 } from "react-icons/im";
import { useHandleFollowingMutation } from "../../lib/mutations/follow.mutations";
import {
  useGetFollowingRequestMapQuery,
  useGetFollowingSetQuery,
} from "@/lib/queries/user.queries";
import { Skeleton } from "../ui/skeleton";
import ConfirmationAlert from "../alerts/ConfirmationAlert";

export default function HandleUserFollowButton({
  isLoadingUser,
  isErrorUser,
  receiver,
}) {
  const {
    data: authFollowingSet,
    isLoading: isLoadingAuthFollowings,
    isError: isErrorAuthFollowings,
  } = useGetFollowingSetQuery();

  const {
    data: followingRequestReceiverMap,
    isLoading: isLoadingFollowingRequests,
    isError: isErrorFollowingRequests,
  } = useGetFollowingRequestMapQuery();

  const { mutate: handleFollowingRequest, isPending } =
    useHandleFollowingMutation();

  const isLoading =
    isLoadingUser || isLoadingAuthFollowings || isLoadingFollowingRequests;
  const isError =
    isErrorUser || isErrorAuthFollowings || isErrorFollowingRequests;

  if (isLoading) return <Skeleton className="h-8 w-28" />;
  if (isError) return null;

  const reqId = followingRequestReceiverMap[receiver._id];

  const action = authFollowingSet.has(receiver._id)
    ? "unfollow"
    : reqId
      ? "cancel"
      : "send";

  return (
    <div className="flex h-8 w-20 items-center justify-center rounded-lg bg-violet-400 font-medium text-white md:text-base">
      {isPending ? (
        <ImSpinner3 className="size-5 animate-spin" />
      ) : action === "send" || action === "cancel" ? (
        <button
          onClick={() => handleFollowingRequest({ action, receiver, reqId })}
          disabled={isPending}
          className="h-full flex-1 rounded-lg hover:bg-violet-300"
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
