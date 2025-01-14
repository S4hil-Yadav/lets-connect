import FollowersDialog from "../components/profilePageComponents/FollowersDialog";
import FollowingDialog from "../components/profilePageComponents/FollowingDialog";
import Avatar from "react-avatar";
import { Link, useLocation, useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetUserQuery } from "@/lib/queries/user.queries";
import { ImSpinner2 } from "react-icons/im";
import Post from "@/components/Post";
import UserFollowButton from "@/components/profilePageComponents/UserFollowButton";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import AuthAlertDialog from "@/components/AuthAlertDialog";
import { MdEdit } from "react-icons/md";

export default function ProfilePage() {
  const location = useLocation();
  const queryClient = useQueryClient();
  const authUser = queryClient.getQueryData(["authUser"]);
  const { id: userId } = useParams();
  const { data: user, isLoading, isError } = useGetUserQuery(userId);

  return (
    <div className="flex min-h-screen w-full flex-col justify-center lg:flex-row">
      <div className="static top-0 z-50 flex max-h-screen flex-col gap-5 border-b-2 bg-gray-100 pb-3 lg:sticky lg:order-last lg:max-w-[30%] lg:border-b-0 lg:border-l-2">
        {userId === authUser?._id && (
          <Link
            to="/edit-profile"
            state={{ backgroundLocation: location }}
            className="absolute right-3 top-2"
          >
            <MdEdit size={25} />
          </Link>
        )}

        <div className="flex items-center justify-around gap-1 px-5 pt-10 lg:flex-col lg:justify-normal lg:gap-3">
          <div className="flex flex-col items-center gap-4">
            {isLoading ? (
              <Skeleton className="size-32 rounded-full bg-gray-500" />
            ) : isError ? (
              <>
                <div className="size-20 lg:hidden">
                  <Avatar name="!" size="80" round={true} />
                </div>
                <div className="group hidden size-[6.25rem] lg:block">
                  <Avatar name="!" size="100" round={true} />
                </div>
              </>
            ) : (
              <>
                <div className="size-20 rounded-full lg:size-[6.25rem]">
                  <Avatar
                    src={user.profilePic}
                    name={user.fullname}
                    size="80"
                    round={true}
                    className="absolute lg:hidden"
                  />
                  <Avatar
                    src={user.profilePic}
                    name={user.fullname}
                    size="100"
                    round={true}
                    className="absolute hidden lg:block"
                  />
                </div>
              </>
            )}
            <div className="flex lg:hidden">
              {!authUser ? (
                <AuthAlertDialog>
                  <h1 className="flex h-5 w-fit min-w-20 items-center justify-center rounded-lg bg-violet-400 px-1 py-4 font-medium text-white shadow-md disabled:cursor-progress md:px-2 md:text-base">
                    Follow
                  </h1>
                </AuthAlertDialog>
              ) : userId !== authUser._id ? (
                <UserFollowButton
                  isLoadingUser={isLoading}
                  isErrorUser={isError}
                  receiver={
                    isLoading || isError
                      ? null
                      : {
                          _id: user._id,
                          username: user.username,
                          fullname: user.fullname,
                          profilePic: user.profilePic,
                        }
                  }
                />
              ) : null}
            </div>
          </div>
          <div className="flex max-w-full flex-col items-center gap-5">
            {isLoading ? (
              <div className="flex w-full flex-col gap-2">
                <Skeleton className="h-4" />
                <Skeleton className="mx-auto h-4 w-[80%]" />
              </div>
            ) : isError ? (
              "error in loading user"
            ) : (
              <div className="flex w-full flex-1 flex-col">
                <div className="flex w-auto flex-wrap items-baseline justify-center gap-1">
                  <span className="text-wrap text-lg font-semibold">
                    {user.fullname}
                  </span>
                  <span className="text-sm font-medium">
                    {!!user && "@" + user.username}
                  </span>
                </div>
                <span className="break-words text-center text-sm font-extrabold">
                  {user.email}
                </span>
              </div>
            )}
            <div className="flex justify-between gap-3 rounded-lg bg-gray-200 p-2">
              <div className="flex flex-col items-center">
                <span className="text-sm font-medium md:text-base">Posts</span>
                <span className="text-xs font-bold text-violet-700 md:text-sm">
                  {isLoading || isError ? "_" : user.postCount}
                </span>
              </div>

              {useMemo(
                () => (
                  <>
                    <FollowersDialog userId={userId} />
                    <FollowingDialog userId={userId} />
                  </>
                ),
                [userId],
              )}
            </div>
            <div className="hidden lg:flex">
              {!authUser ? (
                <AuthAlertDialog>
                  <h1 className="flex h-5 w-fit min-w-20 items-center justify-center rounded-lg bg-violet-400 px-1 py-4 font-medium text-white shadow-md disabled:cursor-progress md:px-2 md:text-base">
                    Follow
                  </h1>
                </AuthAlertDialog>
              ) : userId !== authUser._id ? (
                <UserFollowButton
                  isLoadingUser={isLoading}
                  isErrorUser={isError}
                  receiver={
                    isLoading || isError
                      ? null
                      : {
                          _id: user._id,
                          username: user.username,
                          fullname: user.fullname,
                          profilePic: user.profilePic,
                        }
                  }
                />
              ) : null}
            </div>
          </div>
        </div>

        <div className="mx-3 pl-2 lg:h-full">
          <h4 className="pb-1 text-lg font-bold">About</h4>
          {isLoading ? (
            <Skeleton className="h-52" />
          ) : isError ? (
            "error in loading user"
          ) : (
            <p className="break-words pl-3 text-justify text-sm">
              {user.bio +
                "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia sed enim excepturi a adipisci porro, illum harum exercitationem officia officiis explicabo? Hic voluptas omnis itaque sapiente nulla non magni alias."}
            </p>
          )}
        </div>
      </div>
      {isLoading ? (
        <ImSpinner2 className="mt-5 size-7 w-full animate-spin text-violet-700" />
      ) : isError ? (
        "Error in loading user"
      ) : (
        <ul className="flex min-h-screen w-full flex-col items-center gap-5 px-0 py-10 md:px-10">
          <h1 className="text-center text-4xl font-bold text-gray-700">
            Posts
          </h1>
          {user.posts.length
            ? user.posts.map((postId) => <Post key={postId} postId={postId} />)
            : "This user has no posts"}
        </ul>
      )}
    </div>
  );
}
