import {
  MdOutlineThumbUp,
  MdOutlineThumbDown,
  MdThumbUp,
  MdThumbDown,
} from "react-icons/md";
import { AiOutlineShareAlt, AiOutlineComment } from "react-icons/ai";
import {
  useDislikePostMutation,
  useLikePostMutation,
  useUndislikePostMutation,
  useUnlikePostMutation,
} from "@/lib/mutations/post.mutations";
import AuthAlert from "../alerts/AuthAlert";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

export default function PostFooter({ post }) {
  return (
    <div className="flex w-full justify-between py-6">
      <div className="flex bg-gray-100">
        <LikeButton post={post} />
        <DislikeButton post={post} />
      </div>
      <CommentButton post={post} />
      <ShareButton postId={post._id} />
    </div>
  );
}

function LikeButton({ post }) {
  const queryClient = useQueryClient();
  const authUser = queryClient.getQueryData(["authUser"]);
  const { mutate: handleLike, isPending: isPendingLike } =
    useLikePostMutation();
  const { mutate: handleUnlike, isPending: isPendingUnlike } =
    useUnlikePostMutation();

  if (!authUser)
    return (
      <AuthAlert>
        <div className="flex basis-1/2 items-center gap-1 rounded-l-lg border border-r-0 border-gray-300 px-2 py-1">
          <MdOutlineThumbUp size={20} />
          <span className="text-xs font-medium text-gray-600">
            {post.likers.length}
          </span>
        </div>
      </AuthAlert>
    );

  const liked = post.likers.includes(authUser._id);

  return (
    <button
      onClick={() => (liked ? handleUnlike(post._id) : handleLike(post._id))}
      disabled={isPendingLike || isPendingUnlike}
      className="group flex basis-1/2 items-center gap-1 rounded-l-lg border border-r-0 border-gray-300 px-2 py-1 disabled:opacity-75"
    >
      {liked ? (
        <MdThumbUp
          size={20}
          className="text-violet-700 group-disabled:opacity-75"
        />
      ) : (
        <MdOutlineThumbUp size={20} className="group-disabled:opacity-75" />
      )}
      <span className="text-xs font-medium text-gray-600 group-disabled:opacity-75">
        {post.likers.length}
      </span>
    </button>
  );
}

function DislikeButton({ post }) {
  const queryClient = useQueryClient();
  const authUser = queryClient.getQueryData(["authUser"]);
  const { mutate: handleDislike, isPending: isPendingDislike } =
    useDislikePostMutation();
  const { mutate: handleUndislike, isPending: isPendingUndislike } =
    useUndislikePostMutation();

  if (!authUser)
    return (
      <AuthAlert>
        <div className="flex basis-1/2 items-center gap-1 rounded-r-lg border border-gray-300 px-2 py-1">
          <MdOutlineThumbDown size={20} />
          <span className="text-xs font-medium text-gray-600">
            {post.dislikers.length}
          </span>
        </div>
      </AuthAlert>
    );

  const disliked = post.dislikers.includes(authUser._id);
  return (
    <button
      onClick={() =>
        disliked ? handleUndislike(post._id) : handleDislike(post._id)
      }
      disabled={isPendingDislike || isPendingUndislike}
      className="group flex basis-1/2 items-center gap-1 rounded-r-lg border border-gray-300 px-2 py-1 disabled:opacity-75"
    >
      {disliked ? (
        <MdThumbDown
          size={20}
          className="text-violet-700 group-disabled:opacity-75"
        />
      ) : (
        <MdOutlineThumbDown size={20} className="group-disabled:opacity-75" />
      )}
      <span className="text-xs font-medium text-gray-600">
        {post.dislikers.length || 0}
      </span>
    </button>
  );
}

function CommentButton({ post }) {
  const location = useLocation();

  return (
    <Link
      to={"/post/" + post._id}
      state={{ backgroundLocation: location }}
      className="flex items-center justify-center gap-1 rounded-lg border border-gray-300 bg-gray-100 px-2 py-1"
    >
      <AiOutlineComment size={20} />
      <span className="text-xs font-medium text-gray-600">
        {post.comments.length || 0}
      </span>
    </Link>
  );
}

function ShareButton({ postId }) {
  return (
    <button
      onClick={() =>
        navigator.clipboard
          .writeText(window.location.origin + "/post/" + postId)
          .then(() => toast.success("Post link copied to clipboard!"))
          .catch(() => toast.error("Failed to copy URL"))
      }
      className="flex items-center justify-center rounded-lg border border-gray-300 bg-gray-100 px-2 py-1"
    >
      <AiOutlineShareAlt size={20} />
    </button>
  );
}
