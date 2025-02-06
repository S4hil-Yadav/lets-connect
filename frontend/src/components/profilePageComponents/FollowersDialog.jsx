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
import AuthAlert from "../alerts/AuthAlert";
import UserCardSkeleton from "./UserCardSkeleton";
import { MdErrorOutline } from "react-icons/md";

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
        <UserCardSkeleton />
      ) : isError ? (
        <span className="flex w-full justify-center gap-3 text-lg font-medium">
          Couldn&apos;t load followers
          <MdErrorOutline size={25} />
        </span>
      ) : !followers?.length ? (
        userId === authUser?._id ? (
          "You don't have any follower"
        ) : (
          "This user doesn't have any follower"
        )
      ) : (
        <ul className="flex w-full flex-col gap-2">
          {followers.map((follower) => (
            <FDialogContent key={follower._id} user={follower}>
              {!authUser ? (
                <AuthAlert>
                  <h1 className="flex h-5 w-fit min-w-20 items-center justify-center rounded-lg bg-violet-400 px-1 py-4 font-medium text-white shadow-md hover:bg-violet-300 disabled:cursor-progress md:px-2 md:text-base">
                    Follow
                  </h1>
                </AuthAlert>
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
