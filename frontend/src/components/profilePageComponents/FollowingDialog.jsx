import {
  useGetFollowingRequestMapQuery,
  useGetFollowingSetQuery,
  useGetFollowingsQuery,
} from "@/lib/queries/user.queries";
import FDialog, { FDialogContent, HandleFollowButton } from "./FDialog";
import { useQueryClient } from "@tanstack/react-query";
import AuthAlert from "../alerts/AuthAlert";

export default function FollowingDialog({ userId }) {
  const queryClient = useQueryClient();
  const authUser = queryClient.getQueryData(["authUser"]);

  const {
    data: followings,
    isLoading: isLoadingFollowings,
    isError: isErrorFollowing,
  } = useGetFollowingsQuery(userId);

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

  const isLoading =
    isLoadingFollowings ||
    isLoadingAuthFollowings ||
    isLoadingFollowingRequests;

  const isError =
    isErrorFollowing || isErrorAuthFollowings || isErrorFollowingRequests;

  return (
    <FDialog userId={userId} type="following" count={followings?.length}>
      {isLoading ? (
        "Loading followings"
      ) : isError ? (
        "Error in loading followings"
      ) : !followings?.length ? (
        userId === authUser?._id ? (
          "You don't follow anyone"
        ) : (
          "This user doesn't follow anyone"
        )
      ) : (
        <ul className="flex w-full flex-col">
          {followings.map((following) => (
            <FDialogContent key={following._id} user={following}>
              {!authUser ? (
                <AuthAlert>
                  <h1 className="flex h-5 w-fit min-w-20 items-center justify-center rounded-lg bg-violet-400 px-1 py-4 font-medium text-white shadow-md hover:bg-violet-300 disabled:cursor-progress md:px-2 md:text-base">
                    Follow
                  </h1>
                </AuthAlert>
              ) : (
                <HandleFollowButton
                  receiver={following}
                  authFollowingSet={authFollowingSet}
                  followingRequestReceiverMap={followingRequestReceiverMap}
                />
              )}
            </FDialogContent>
          ))}
        </ul>
      )}
    </FDialog>
  );
}
