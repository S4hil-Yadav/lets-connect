import Post from "@/components/Post";
import { useGetPostsQuery } from "@/lib/queries/post.queries";
import { ImSpinner2 } from "react-icons/im";

export default function HomePage() {
  const { data: posts, isLoading, isError } = useGetPostsQuery();

  if (isLoading)
    return (
      <ImSpinner2 className="mt-5 size-7 w-full animate-spin text-violet-700" />
    );
  if (isError) return "error in loading posts";
  if (!posts.length) return "No posts found";

  return (
    <ul className="flex min-h-screen w-full flex-col items-center gap-5 py-5 md:px-10">
      {posts.map((post) => (
        <Post key={post._id} postId={post._id} />
      ))}
    </ul>
  );
}
