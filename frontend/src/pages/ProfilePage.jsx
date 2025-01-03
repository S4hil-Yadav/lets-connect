import { FollowButton, UnfollowButton } from "../components/Buttons";
import { UsersDialog } from "../components/Dialogs";
import Avatar from "react-avatar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function ProfilePage() {
  const { id: userId } = useParams();
  const queryClient = useQueryClient();

  const authUser = queryClient.getQueryData(["authUser"]);

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () =>
      axios.get("/api/v1/users/get-user/" + userId).then((res) => res.data),
  });

  if (isLoading) return <>Loading user</>;
  if (isError) return <>Could not load user</>;

  return (
    <div className="flex min-h-screen w-full flex-col justify-center bg-yellow-200 lg:flex-row">
      <div className="sticky top-0 flex max-h-screen flex-col gap-5 bg-white lg:order-last lg:max-w-[30%]">
        <div className="flex items-center justify-center gap-1 bg-white px-5 pt-10 lg:flex-col lg:justify-normal lg:gap-3">
          <div className="flex flex-col items-center gap-4">
            <Avatar
              src={user?.profilePic}
              name={user?.fullname}
              size="100"
              round={true}
            />
            {userId !== authUser?._id && (
              <div className="flex flex-col justify-center gap-2 bg-lime-200 md:flex-row lg:hidden">
                <FollowButton />
                <UnfollowButton />
              </div>
            )}
          </div>
          <div className="max-w-20 flex-1 lg:flex-none" />
          <div className="flex max-w-full flex-col items-center gap-5 bg-purple-200">
            <div className="flex w-full flex-1 flex-col bg-pink-200">
              <div className="flex w-auto flex-wrap items-baseline justify-center gap-1">
                <span className="text-wrap text-lg font-semibold">
                  {user.fullname}
                </span>
                <span className="text-sm font-medium">({user.username})</span>
              </div>
              <span className="break-words text-center text-sm font-extrabold">
                {user.email}
              </span>
            </div>
            <div className="flex justify-between gap-3 bg-emerald-200">
              <button className="flex flex-col items-center">
                <span className="text-sm md:text-base">Posts</span>
                <span className="text-xs md:text-sm">{user?.postCount}</span>
              </button>
              <UsersDialog
                userId={userId}
                type="followers"
                count={user?.followerCount}
              />
              <UsersDialog
                userId={userId}
                type="following"
                count={user?.followingCount}
              />
            </div>
            {userId !== authUser?._id && (
              <div className="hidden justify-center gap-10 bg-lime-200 lg:flex">
                <FollowButton />
                <UnfollowButton />
              </div>
            )}
          </div>
        </div>

        <div className="mx-3 bg-blue-200 lg:h-full">
          <h4 className="bg-purple-200 text-lg font-bold">About</h4>
          <p className="break-words bg-slate-200 pl-5 text-justify text-sm">
            {user?.bio +
              "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia sed enim excepturi a adipisci porro, illum harum exercitationem officia officiis explicabo? Hic voluptas omnis itaque sapiente nulla non magni alias."}
          </p>
        </div>
      </div>
      <div className="h-[100rem] flex-1"></div>
    </div>
  );
}
