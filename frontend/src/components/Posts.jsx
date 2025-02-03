import { ImSpinner2 } from "react-icons/im";
import Post from "./Post";
import { MdErrorOutline } from "react-icons/md";
import { useLocation } from "react-router-dom";
import { LuSearchX } from "react-icons/lu";

export default function Posts({ isLoading, isError, posts, type }) {
  const location = useLocation();

  if (isLoading)
    return (
      <span className="mt-10 flex min-h-screen w-full justify-center gap-3 text-lg font-medium">
        <ImSpinner2 className="mt-5 size-7 w-full animate-spin text-violet-700" />
      </span>
    );
  if (isError)
    return (
      <span className="mt-10 flex w-full justify-center gap-3 text-lg font-medium">
        Couldn&apos;t load posts
        <MdErrorOutline size={25} />
      </span>
    );
  if (!posts.length)
    return (
      <span className="mt-10 flex w-full justify-center gap-3 text-lg font-medium">
        No posts found
        <LuSearchX size={25} />
      </span>
    );

  return (
    <div className="flex min-h-screen w-full flex-col items-center gap-5 px-0 py-10 md:px-10">
      {location.pathname !== "/home" && (
        <h1 className="text-center text-4xl font-bold capitalize text-gray-700">
          {type} posts
        </h1>
      )}
      <ul className="flex min-h-screen w-full flex-col items-center gap-5">
        {posts.map((postId) => (
          <Post key={postId} postId={postId} />
        ))}
      </ul>
    </div>
  );
}
