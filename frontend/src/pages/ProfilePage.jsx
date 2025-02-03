import FollowersDialog from "../components/profilePageComponents/FollowersDialog";
import FollowingDialog from "../components/profilePageComponents/FollowingDialog";
import Avatar from "react-avatar";
import { Link, useLocation, useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetUserQuery } from "@/lib/queries/user.queries";
import UserFollowButton from "@/components/profilePageComponents/UserFollowButton";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useRef, useState } from "react";
import AuthAlert from "@/components/alerts/AuthAlert";
import { LogOutAlert } from "@/components/alerts/AuthAlert";
import { useUpdateUserBioMutation } from "@/lib/mutations/auth.mutations";
import Posts from "@/components/Posts";
import toast from "react-hot-toast";
import { ImSpinner2 } from "react-icons/im";
import {
  MdEdit,
  MdSave,
  MdOutlineLink,
  MdOutlineReport,
  MdOutlineBlock,
} from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ProfilePage() {
  const location = useLocation(),
    queryClient = useQueryClient(),
    authUser = queryClient.getQueryData(["authUser"]),
    { id: userId } = useParams(),
    { data: user, isLoading, isError } = useGetUserQuery(userId),
    { mutateAsync: handleUpdateBio, isPending } = useUpdateUserBioMutation(),
    [editBio, setEditBio] = useState(false),
    bioRef = useRef(null);

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      <div className="relative top-0 z-50 flex max-h-screen w-full flex-col gap-5 overflow-y-auto border-b-2 bg-gray-100 pb-3 scrollbar-thin lg:sticky lg:order-last lg:max-w-[30%] lg:border-b-0 lg:border-l-2">
        <div className="absolute right-3 top-3">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <BsThreeDotsVertical />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              side="left"
              className="min-w-40 font-medium text-gray-700"
            >
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard
                    .writeText(window.location.origin + "/profile/" + userId)
                    .then(() => toast.success("Post link copied to clipboard!"))
                    .catch(() => toast.error("Failed to copy URL"))
                }
              >
                <span className="flex w-full items-center gap-2 font-medium text-gray-700">
                  <MdOutlineLink size={20} className="text-blue-800" />
                  Copy profile link
                </span>
              </DropdownMenuItem>
              {userId === authUser?._id ? (
                <>
                  <DropdownMenuItem>
                    <Link
                      to="/edit-profile"
                      state={{ backgroundLocation: location }}
                      className="flex w-full items-center gap-2"
                    >
                      <MdEdit size={15} className="text-violet-800" />
                      <span>Edit Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => e.preventDefault()}>
                    <LogOutAlert />
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem>
                    <span className="flex w-full items-center gap-2">
                      <MdOutlineReport size={20} className="text-red-800" />
                      Report User
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span className="flex w-full items-center gap-2">
                      <MdOutlineBlock size={20} className="text-red-800" />
                      Block User
                    </span>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center justify-around gap-1 px-5 pt-10 lg:flex-col lg:justify-normal lg:gap-3">
          <div className="flex flex-col items-center gap-4">
            {isLoading ? (
              <Skeleton className="size-24 rounded-full bg-gray-500 lg:size-[7.25rem]" />
            ) : isError ? (
              <div className="size-24 rounded-full border-8 border-double border-gray-600 lg:size-[7.25rem]">
                <Avatar
                  name="!"
                  size="80"
                  round={true}
                  className="lg:absolute lg:hidden"
                />
                <Avatar
                  name="!"
                  size="100"
                  round={true}
                  className="hidden lg:block"
                />
              </div>
            ) : (
              <div className="size-24 rounded-full border-8 border-double border-gray-600 lg:size-[7.25rem]">
                <Avatar
                  src={user.profilePic}
                  name={user.fullname}
                  size="80"
                  round={true}
                  className="lg:absolute lg:hidden"
                />
                <Avatar
                  src={user.profilePic}
                  name={user.fullname}
                  size="100"
                  round={true}
                  className="hidden lg:block"
                />
              </div>
            )}
            <div className="flex lg:hidden">
              {!authUser ? (
                <AuthAlert>
                  <h1 className="flex h-5 w-fit min-w-20 items-center justify-center rounded-lg bg-violet-400 px-1 py-4 font-medium text-white shadow-md hover:bg-violet-300 disabled:cursor-progress md:px-2 md:text-base">
                    Follow
                  </h1>
                </AuthAlert>
              ) : userId !== authUser?._id ? (
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
              ""
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
                  {isLoading || isError ? "_" : user.posts.length}
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
                <AuthAlert>
                  <h1 className="flex h-5 w-fit min-w-20 items-center justify-center rounded-lg bg-violet-400 px-1 py-4 font-medium text-white shadow-md hover:bg-violet-300 disabled:cursor-progress md:px-2 md:text-base">
                    Follow
                  </h1>
                </AuthAlert>
              ) : userId !== authUser?._id ? (
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

        <div className="mx-3 mb-2 pl-2 lg:h-full">
          <h4 className="flex items-center gap-2 pb-1 text-lg font-bold">
            About
            {userId !== authUser?._id ? null : isPending ? (
              <ImSpinner2 className="animate-spin text-violet-700" />
            ) : editBio ? (
              <div className="flex gap-1">
                <MdSave
                  onClick={async () => {
                    await handleUpdateBio(bioRef.current.value);
                    setEditBio(false);
                  }}
                  className="cursor-pointer text-violet-700 hover:text-violet-500"
                />
                <RxCross2
                  onClick={() => setEditBio(false)}
                  className="cursor-pointer text-red-700 hover:text-red-500"
                />
              </div>
            ) : (
              <MdEdit
                onClick={() => {
                  setEditBio(true);
                  setTimeout(() => {
                    bioRef.current.focus();
                    bioRef.current.style.height = "auto";
                    bioRef.current.style.height = `${bioRef.current.scrollHeight}px`;
                  });
                }}
                className="cursor-pointer hover:text-gray-500"
              />
            )}
          </h4>
          {isLoading ? (
            <Skeleton className="h-20 lg:h-52" />
          ) : isError ? (
            ""
          ) : user._id !== authUser?._id || !editBio ? (
            <pre className="max-h-40 w-full resize-none text-wrap break-words px-2 text-justify font-exo text-sm">
              {user.bio}
            </pre>
          ) : (
            <textarea
              ref={bioRef}
              defaultValue={user.bio}
              onChange={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              className="w-full resize-none text-wrap break-words bg-gray-100 px-2 pb-2 text-justify text-sm"
            />
          )}
        </div>
      </div>
      <Posts isLoading={isLoading} isError={isError} posts={user?.posts} />
      {/* {isLoading ? (
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
      )} */}
    </div>
  );
}
