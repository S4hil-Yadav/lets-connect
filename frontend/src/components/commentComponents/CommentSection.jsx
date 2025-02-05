import { MdExpandLess } from "react-icons/md";
import CommentSkeleton from "./CommentSkeleton";
import { useQueryClient } from "@tanstack/react-query";
import { useGetCommentsQuery } from "@/lib/queries/comment.queries";
import { useEffect, useMemo } from "react";
import CommentBody from "./CommentBody";
import { LuSearchX } from "react-icons/lu";
import { MdErrorOutline } from "react-icons/md";

export default function CommentSection({ postId, setCommentsOpen }) {
  const queryClient = useQueryClient(),
    authUser = queryClient.getQueryData(["authUser"]);

  const { data: comments, isFetching, isError } = useGetCommentsQuery(postId);

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

  const sortedComments = useMemo(() => {
    if (!comments || !authUser) return comments;

    const authComments = [],
      remainingComments = [];

    for (const comment of comments) {
      comment.commentor._id === authUser?._id
        ? authComments.push(comment)
        : remainingComments.push(comment);
    }

    return authComments.concat(remainingComments);
  }, [authUser, comments]);

  if (isFetching) return <CommentSkeleton count={3} />;

  if (isError)
    return (
      <span className="flex items-center gap-3 self-center text-lg font-medium">
        Couldn&apos;t load comments
        <MdErrorOutline size={25} />
      </span>
    );
  if (!comments.length)
    return (
      <span className="flex items-center gap-3 self-center text-lg font-medium">
        No comments yet
        <LuSearchX size={25} />
      </span>
    );

  return (
    <ul className="flex flex-col gap-5">
      {sortedComments.map((comment) => (
        <CommentBody key={comment._id} postId={postId} comment={comment} />
      ))}
      {setCommentsOpen && (
        <MdExpandLess
          onClick={() => setCommentsOpen(false)}
          className="size-5 cursor-pointer self-center rounded-full"
        />
      )}
    </ul>
  );
}
