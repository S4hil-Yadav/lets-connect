import {
  useGetFollowingRequestMapQuery,
  useGetFollowingSetQuery,
  useGetFollowingsQuery,
} from "@/lib/queries/user.queries";
import FDialog, { FDialogContent, HandleFollowButton } from "./FDialog";
import { useQueryClient } from "@tanstack/react-query";
import AuthAlertDialog from "../AuthAlertDialog";

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
              {!authUser?._id ? (
                <AuthAlertDialog />
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
