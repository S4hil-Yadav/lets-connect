import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import {
  MdOutlineThumbUp,
  MdOutlineThumbDown,
  MdThumbUp,
  MdThumbDown,
} from "react-icons/md";
import { AiOutlineShareAlt, AiOutlineComment } from "react-icons/ai";
import {
  dislikePost,
  likePost,
  undislikePost,
  unlikePost,
} from "@/utils/reqUtils";

export default function PostFooter({ postId, setCommentsOpen }) {
  const { _id: authUserId } = useSelector((state) => state.user?.authUser);
  const [likes, setLikes] = useState();
  const [dislikes, setDislikes] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getLikesDislikes();
    async function getLikesDislikes() {
      try {
        const res = await fetch("/api/v1/posts/get-likes-dislikes/" + postId, {
          method: "GET",
        });
        const data = await res.json();

        if (!res.ok || data.success === false) throw new Error(data.message);
        setLikes(data.likes), setDislikes(data.dislikes);
        setLiked(data.likes?.some((likerId) => likerId === authUserId));
        setDisliked(
          data.dislikes?.some((dislikerId) => dislikerId === authUserId),
        );
      } catch (error) {
        toast.error(error.message);
      }
    }
  }, [authUserId, postId]);

  const [liked, setLiked] = useState(false),
    [disliked, setDisliked] = useState(false);

  async function handleLike() {
    like: try {
      if (disliked && !liked && (await handleDislike()) === "error") break like;
      setLoading(true);
      const data = liked ? await unlikePost(postId) : await likePost(postId);
      setLikes(data?.likes), setLiked((prev) => !prev);
    } catch (error) {
      toast.error(error.message);
      return "error";
    } finally {
      setLoading(false);
    }
  }
  async function handleDislike() {
    dislike: try {
      if (liked && !disliked && (await handleLike()) === "error") break dislike;
      setLoading(true);
      const data = await (disliked
        ? undislikePost(postId)
        : dislikePost(postId));
      setDislikes(data?.dislikes), setDisliked((prev) => !prev);
    } catch (error) {
      toast.error(error.message);
      return "error";
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex w-full justify-between py-6">
      <div className="flex bg-gray-100">
        <LikeButton
          liked={liked}
          handleLike={handleLike}
          loading={loading}
          likesLen={likes?.length}
        />
        <DislikeButton
          disliked={disliked}
          handleDislike={handleDislike}
          loading={loading}
          dislikesLen={dislikes?.length}
        />
      </div>
      <button
        onClick={() => setCommentsOpen((prev) => !prev)}
        className="flex items-center justify-center rounded-lg border border-gray-300 bg-gray-100 px-2 py-1"
      >
        <AiOutlineComment size={20} />
      </button>
      <button className="flex items-center justify-center rounded-lg border border-gray-300 bg-gray-100 px-2 py-1">
        <AiOutlineShareAlt size={20} />
      </button>
    </div>
  );
}

function DislikeButton({ disliked, handleDislike, loading, dislikesLen }) {
  return (
    <button
      onClick={handleDislike}
      disabled={loading}
      className="group flex basis-1/2 items-center gap-1 rounded-r-lg border border-gray-300 px-2 py-1 disabled:cursor-default"
    >
      {disliked ? (
        <MdThumbDown
          size={20}
          className="text-violet-700 group-disabled:cursor-default"
        />
      ) : (
        <MdOutlineThumbDown
          size={20}
          className="group-disabled:cursor-default"
        />
      )}
      <span className="text-xs font-medium text-gray-600">
        {dislikesLen || 0}
      </span>
    </button>
  );
}

function LikeButton({ liked, handleLike, loading, likesLen }) {
  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className="group flex basis-1/2 items-center gap-1 rounded-l-lg border border-r-0 border-gray-300 px-2 py-1 disabled:cursor-default"
    >
      {liked ? (
        <MdThumbUp
          size={20}
          className="text-violet-700 group-disabled:cursor-default"
        />
      ) : (
        <MdOutlineThumbUp size={20} className="group-disabled:cursor-default" />
      )}
      <span className="text-xs font-medium text-gray-600 group-disabled:cursor-default">
        {likesLen || 0}
      </span>
    </button>
  );
}
