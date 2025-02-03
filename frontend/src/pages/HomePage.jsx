import Posts from "@/components/Posts";
import { useGetPostsQuery } from "@/lib/queries/post.queries";
import { RiSettings4Line } from "react-icons/ri";
import { Link } from "react-router-dom";

export default function HomePage() {
  const { data: posts, isLoading, isError } = useGetPostsQuery();
  return (
    <>
      <div className="flex h-12 items-center justify-around border-b-2 border-gray-600 bg-gray-100 md:hidden">
        <h1 className="bg-gradient-to-r from-pink-600 via-purple-600 to-violet-600 bg-clip-text text-xl font-bold text-transparent">
          BuzzVib
        </h1>
        <Link to="/settings">
          <RiSettings4Line size={25} className="text-gray-500" />
        </Link>
      </div>

      <Posts isLoading={isLoading} isError={isError} posts={posts} heading="" />
    </>
  );
}
