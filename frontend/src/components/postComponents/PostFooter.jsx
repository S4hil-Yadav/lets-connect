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
import { useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "react-router-dom";

export default function PostFooter({ post, setCommentsOpen }) {
  return (
    <div className="flex w-full justify-between py-6">
      <div className="flex bg-gray-100">
        <LikeButton post={post} />
        <DislikeButton post={post} />
      </div>
      {setCommentsOpen ? (
        <CommentButton setCommentsOpen={setCommentsOpen} post={post} />
      ) : (
        <button className="flex items-center justify-center gap-1 rounded-lg border border-gray-300 bg-gray-100 px-2 py-1">
          <AiOutlineComment size={20} />
          <span className="text-xs font-medium text-gray-600">
            {post.comments.length}
          </span>
        </button>
      )}
      <ShareButton />
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

  const liked = post.likers.includes(authUser?._id);

  return (
    <button
      onClick={() => (liked ? handleUnlike(post._id) : handleLike(post._id))}
      disabled={isPendingLike || isPendingUnlike}
      className="group flex basis-1/2 items-center gap-1 rounded-l-lg border border-r-0 border-gray-300 px-2 py-1 disabled:cursor-progress"
    >
      {liked ? (
        <MdThumbUp
          size={20}
          className="text-violet-700 group-disabled:cursor-progress"
        />
      ) : (
        <MdOutlineThumbUp
          size={20}
          className="group-disabled:cursor-progress"
        />
      )}
      <span className="text-xs font-medium text-gray-600 group-disabled:cursor-progress">
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

  const disliked = post.dislikers.includes(authUser?._id);

  return (
    <button
      onClick={() =>
        disliked ? handleUndislike(post._id) : handleDislike(post._id)
      }
      disabled={isPendingDislike || isPendingUndislike}
      className="group flex basis-1/2 items-center gap-1 rounded-r-lg border border-gray-300 px-2 py-1 disabled:cursor-progress"
    >
      {disliked ? (
        <MdThumbDown
          size={20}
          className="text-violet-700 group-disabled:cursor-progress"
        />
      ) : (
        <MdOutlineThumbDown
          size={20}
          className="group-disabled:cursor-progress"
        />
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

function ShareButton() {
  return (
    <button className="flex items-center justify-center rounded-lg border border-gray-300 bg-gray-100 px-2 py-1">
      <AiOutlineShareAlt size={20} />
    </button>
  );
}
