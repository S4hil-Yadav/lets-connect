import Posts from "@/components/Posts";
import { useGetSavedPostsQuery } from "@/lib/queries/post.queries";

export default function SavedPostsPage() {
  const { data: posts, isLoading, isError } = useGetSavedPostsQuery();
  return (
    <Posts isLoading={isLoading} isError={isError} posts={posts} type="saved" />
  );
}
