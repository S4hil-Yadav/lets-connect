import { useGetPostQuery } from "@/lib/queries/post.queries";
import CommentInput from "./CommentInput";
import PostBody from "./PostBody";
import PostFooter from "./PostFooter";
import PostHeader from "./PostHeader";
import PostSkeleton from "./PostSkeleton";

export default function PostContent({
  postId,
  setCommentsOpen,
  isModal = false,
}) {
  const {
    data: post,
    isLoading,
    isFetching,
    isError,
  } = useGetPostQuery(postId);

  if (isLoading || (isModal && isFetching)) return <PostSkeleton />;
  if (isError) return "error in loading post";

  return (
    <>
      <PostHeader publisher={post.publisher} />

      <PostBody post={post} />

      <PostFooter post={post} setCommentsOpen={setCommentsOpen} />

      {!!setCommentsOpen && <CommentInput postId={post._id} />}
    </>
  );
}
