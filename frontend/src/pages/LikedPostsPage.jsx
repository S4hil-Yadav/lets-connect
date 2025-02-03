import Posts from "@/components/Posts";
import { useGetLikedPostsQuery } from "@/lib/queries/post.queries";

export default function SavedPostsPage() {
  const { data: posts, isLoading, isError } = useGetLikedPostsQuery();
  return (
    <Posts isLoading={isLoading} isError={isError} posts={posts} type="liked" />
  );
}
