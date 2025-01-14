import { useGetCommentsByIdsQuery } from "@/lib/queries/comment.queries";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import Avatar from "react-avatar";
import CommentSkeleton from "./CommentSkeleton";
import { MdExpandLess } from "react-icons/md";
import TextWithExpand from "../TextWithExpand";
import { Link } from "react-router-dom";

export default function CommentSection({ postId, setCommentsOpen }) {
  const queryClient = useQueryClient();

  const {
    data: comments,
    isFetching,
    isError,
  } = useGetCommentsByIdsQuery(postId);

  useEffect(() => {
    comments &&
      queryClient.setQueryData(
        ["post", postId],
        (post) =>
          post && {
            ...post,
            comments: comments.map((comment) => comment._id),
          },
      );
  }, [comments, postId, queryClient]);

  // count={post.comments.length > 3 ? 3 : post.comments.length}
  if (isFetching) return <CommentSkeleton count={3} />;

  if (isError) return "Couldn't load comments";

  if (!comments?.length) return "No comments";

  return (
    <ul className="flex flex-col gap-5">
      {comments.map((comment) => (
        <CommentBody key={comment._id} comment={comment} />
      ))}
      {!!setCommentsOpen && (
        <MdExpandLess
          onClick={() => setCommentsOpen(false)}
          className="size-5 cursor-pointer self-center rounded-full"
        />
      )}
    </ul>
  );
}

function CommentBody({ comment }) {
  return (
    <li
      key={comment._id}
      className="flex w-full gap-2 border-b-2 pb-3 last-of-type:border-b-0"
    >
      <Link to={"/profile/" + comment.commentor._id}>
        <Avatar
          size="40"
          src={comment.commentor.profilePic}
          name={comment.commentor.fullname}
          round
        />
      </Link>
      <div className="flex w-[calc(100%-4rem)] flex-col break-words">
        <Link
          to={"/profile/" + comment.commentor._id}
          className="w-fit text-sm font-semibold"
        >
          {comment.commentor.fullname}{" "}
          <span className="text-xs text-gray-600">
            @{comment.commentor.username}
          </span>
        </Link>
        <TextWithExpand originalText={comment.text} minLen={100} />
      </div>
    </li>
  );
}
