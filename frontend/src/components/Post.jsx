import { useGetPostQuery } from "@/lib/queries/post.queries";
import PostSkeleton from "./postComponents/PostSkeleton";
import PostHeader from "./postComponents/PostHeader";
import PostBody from "./postComponents/PostBody";
import PostFooter from "./postComponents/PostFooter";
import CommentInput from "./postComponents/CommentInput";
import { MdErrorOutline } from "react-icons/md";
import { useDeletePostMutation } from "@/lib/mutations/post.mutations";

export default function Post({ postId, isModal = false }) {
  const {
      data: post,
      isLoading,
      isFetching,
      refetch,
      isError,
    } = useGetPostQuery(postId),
    { mutate: handleDeletePost, isPending } = useDeletePostMutation();

  if (isLoading || (isModal && isFetching)) return <PostSkeleton />;

  if (isError)
    return (
      <span className="flex items-center gap-3 self-center text-lg font-medium">
        Couldn&apos;t load this post <MdErrorOutline size={25} />
        &nbsp;
        <button
          onClick={refetch}
          className="text-base font-semibold text-violet-800"
        >
          refetch
        </button>
      </span>
    );

  if (post.deleted) return null;

  return (
    <li
      className={`flex w-full flex-col border-t-2 border-gray-300 px-3 pt-4 first-of-type:border-t-0 ${!isModal && "md:max-w-lg"} ${isPending && "opacity-75"}`}
    >
      <PostHeader
        post={post}
        publisher={post.publisher}
        handleDeletePost={handleDeletePost}
        loading={isPending}
      />
      <PostBody post={post} isModal={isModal} />
      <PostFooter post={post} />
      {!isModal && <CommentInput postId={postId} />}
    </li>
  );
}
