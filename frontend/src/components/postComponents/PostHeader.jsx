import Avatar from "react-avatar";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useSavePostMutation,
  useUnsavePostMutation,
} from "@/lib/mutations/post.mutations";
import { useGetSavedPostsQuery } from "@/lib/queries/post.queries";
import moment from "moment";
import {
  MdBookmarkBorder,
  MdBookmark,
  MdOutlineReport,
  MdOutlineBlock,
  MdDeleteOutline,
} from "react-icons/md";
import { useQueryClient } from "@tanstack/react-query";
import DeletePostAlert from "../alerts/DeletePostAlert";
import AuthAlert from "../alerts/AuthAlert";

export default function PostHeader({ post, publisher }) {
  const queryClient = useQueryClient(),
    authUser = queryClient.getQueryData(["authUser"]);

  const { mutate: handleSavePost, isPending: isPendingSave } =
    useSavePostMutation();
  const { mutate: handleUnsavePost, isPending: isPendingUnsave } =
    useUnsavePostMutation();
  const { data: savedPosts, isLoading, isError } = useGetSavedPostsQuery();
  const postSaved = savedPosts?.includes(post._id);

  return (
    <div className="flex w-full items-center justify-between text-wrap border-b border-gray-200 pb-4">
      <Link
        to={"/profile/" + publisher._id}
        className="flex items-center gap-2"
      >
        <div className="rounded-full border border-gray-300">
          <Avatar
            src={publisher.profilePic}
            name={publisher.fullname}
            round
            size="45"
          />
        </div>
        <div className="flex w-[calc(100%-2.5rem)] flex-col text-wrap break-words text-sm">
          <div className="flex flex-wrap items-baseline">
            <span className="font-bold">
              {publisher.fullname.replace(/ /g, "\u00A0")}
            </span>
            <span className="text-xs font-semibold text-gray-800">
              <span className="text-sm">&nbsp;|&nbsp;</span>
              {moment(post.createdAt).fromNow()}
            </span>
          </div>
          <span className="font-semibold text-gray-500">
            {publisher.username}
          </span>
        </div>
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <BsThreeDotsVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" side="left" className="min-w-40">
          <DropdownMenuItem
            asChild
            onClick={(e) => e.preventDefault()}
            className="w-full"
          >
            {!authUser ? (
              <span className="flex items-center gap-2">
                <MdBookmarkBorder className="text-gray-600" />
                <AuthAlert>
                  <h1>Save Post</h1>
                </AuthAlert>
              </span>
            ) : (
              <button
                disabled={
                  isLoading || isError || isPendingSave || isPendingUnsave
                }
                onClick={() =>
                  postSaved
                    ? handleUnsavePost(post._id)
                    : handleSavePost(post._id)
                }
              >
                {postSaved ? (
                  <MdBookmark className="text-gray-600" />
                ) : (
                  <MdBookmarkBorder />
                )}
                {postSaved ? "Unsave Post" : "Save Post"}
              </button>
            )}
          </DropdownMenuItem>
          {publisher._id === authUser?._id ? (
            <>
              <DropdownMenuItem onClick={(e) => e.preventDefault()}>
                <span className="flex w-full items-center gap-2">
                  <MdDeleteOutline size={20} className="text-red-800" />
                  <DeletePostAlert
                    postId={post._id}
                    publisherId={publisher._id}
                  />
                </span>
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
  );
}
