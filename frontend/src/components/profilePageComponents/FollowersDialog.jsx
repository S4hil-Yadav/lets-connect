import {
  useGetFollowersQuery,
  useGetFollowingRequestMapQuery,
  useGetFollowingSetQuery,
} from "@/lib/queries/user.queries";
import FDialog, {
  FDialogContent,
  HandleFollowButton,
  RemoveFollowerButton,
} from "./FDialog";
import { useQueryClient } from "@tanstack/react-query";
import AuthAlertDialog from "../AuthAlertDialog";

export default function FollowersDialog({ userId }) {
  const queryClient = useQueryClient();
  const authUser = queryClient.getQueryData(["authUser"]);

  const {
    data: followers,
    isLoading: isLoadingFollowers,
    isError: isErrorFollowers,
  } = useGetFollowersQuery(userId);

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
    isLoadingFollowers || isLoadingAuthFollowings || isLoadingFollowingRequests;

  const isError =
    isErrorFollowers || isErrorAuthFollowings || isErrorFollowingRequests;

  return (
    <FDialog userId={userId} type="follower" count={followers?.length}>
      {isLoading ? (
        "Loading followers..."
      ) : isError ? (
        "Could not load followers..."
      ) : !followers?.length ? (
        userId === authUser?._id ? (
          "You don't have any follower"
        ) : (
          "This user doesn't have any follower"
        )
      ) : (
        <ul className="flex w-full flex-col">
          {followers.map((follower) => (
            <FDialogContent key={follower._id} user={follower}>
              {!authUser?._id ? (
                <AuthAlertDialog />
              ) : userId === authUser._id ? (
                <RemoveFollowerButton follower={follower} />
              ) : (
                <HandleFollowButton
                  receiver={follower}
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
