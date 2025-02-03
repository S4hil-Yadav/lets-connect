import { Link } from "react-router-dom";
import { MdOutlineThumbUp } from "react-icons/md";
import { IoBookmarksOutline } from "react-icons/io5";

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center break-words bg-gray-50 py-10">
      <div className="grid w-full grid-cols-1 gap-5 px-5 md:grid-cols-2">
        <LinkButton dest="likedPosts" />
        <LinkButton dest="savedPosts" />
      </div>
    </div>
  );
}

function LinkButton({ dest }) {
  return (
    <Link
      to={
        dest === "likedPosts"
          ? "/liked-posts"
          : dest === "savedPosts"
            ? "/saved-posts"
            : null
      }
      className="relative flex w-full max-w-3xl items-center justify-between rounded-md bg-white px-3 py-2 shadow-md hover:bg-opacity-35"
    >
      <div className="flex w-full items-center gap-3">
        {dest === "likedPosts" ? (
          <MdOutlineThumbUp size={25} />
        ) : dest === "savedPosts" ? (
          <IoBookmarksOutline size={25} />
        ) : null}
        <div className="h-10 w-1 rounded-lg bg-gray-400" />
        <span className="min-w-fit">
          {dest === "likedPosts"
            ? "View liked posts"
            : dest === "savedPosts"
              ? "View saved posts"
              : null}
        </span>
      </div>
    </Link>
  );
}
