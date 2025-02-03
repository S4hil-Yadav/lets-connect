import { SearchInput } from "@/components/Input";
import Post from "@/components/Post";
import { useSearchPostsQuery } from "@/lib/queries/post.queries";
import { useSearchUsersQuery } from "@/lib/queries/user.queries";
import { useRef, useState } from "react";
import Avatar from "react-avatar";
import { ImSpinner2 } from "react-icons/im";
import { LuSearchX } from "react-icons/lu";
import { MdErrorOutline } from "react-icons/md";
import { Link } from "react-router-dom";

export default function SearchPage() {
  const [type, setType] = useState("users"),
    [text, setText] = useState(""),
    timeoutRef = useRef(null);

  const {
    data: users,
    isFetching: isFetchingUsers,
    isError: isErrorUsers,
  } = useSearchUsersQuery(text);

  const {
    data: posts,
    isFetching: isFetchingPosts,
    isError: isErrorPosts,
  } = useSearchPostsQuery(text);

  const handleChange = (e) => {
    const value = e.target.value;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setText(value);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center gap-3 px-0 py-5 md:px-10">
      <SearchInput onSearchChange={handleChange} />
      <hr className="mt-3 h-[2px] w-full bg-gray-400 px-0" />
      <div className="flex w-full gap-6 px-5 text-center text-lg font-semibold text-gray-600">
        <button
          onClick={() => setType("users")}
          className={
            type === "users" ? "text-violet-700" : "hover:text-violet-500"
          }
        >
          People
        </button>
        <button
          onClick={() => setType("posts")}
          className={
            type === "posts" ? "text-violet-700" : "hover:text-violet-500"
          }
        >
          Posts
        </button>
      </div>
      <div className="flex w-full justify-center">
        {type === "users" ? (
          isFetchingUsers ? (
            <ImSpinner2 className="mt-5 size-7 w-full animate-spin text-violet-700" />
          ) : isErrorUsers ? (
            <span className="flex items-center gap-3 self-center text-lg font-medium">
              Couldn&apos;t load users
              <MdErrorOutline size={25} />
            </span>
          ) : text !== "" && !users.length ? (
            <span className="flex items-center gap-3 self-center text-lg font-medium">
              No users found
              <LuSearchX size={25} />
            </span>
          ) : (
            <ul className="flex w-full flex-col">
              {users.map((user) => (
                <User key={user._id} user={user} />
              ))}
            </ul>
          )
        ) : type === "posts" ? (
          isFetchingPosts ? (
            <ImSpinner2 className="mt-5 size-7 w-full animate-spin text-violet-700" />
          ) : isErrorPosts ? (
            <span className="flex items-center gap-3 self-center text-lg font-medium">
              Couldn&apos;t load posts
              <MdErrorOutline size={25} />
            </span>
          ) : text !== "" && !posts.length ? (
            <span className="flex items-center gap-3 self-center text-lg font-medium">
              No posts found
              <LuSearchX size={25} />
            </span>
          ) : (
            <ul className="flex min-h-screen w-full flex-col items-center gap-5 px-0 pt-2 md:px-10">
              {posts.map((post) => (
                <Post key={post._id} postId={post._id} />
              ))}
            </ul>
          )
        ) : null}
      </div>
    </div>
  );
}

function User({ user }) {
  return (
    <li
      key={user._id}
      className="flex w-full items-center justify-between gap-2 overflow-clip rounded-lg px-2 py-2 hover:bg-gray-100"
    >
      <Link
        to={"/profile/" + user._id}
        className="flex w-full cursor-pointer items-center gap-2 py-2"
      >
        <Avatar
          src={user.profilePic}
          name={user.fullname}
          size="50"
          round={true}
          style={{ cursor: "pointer" }}
        />
        <div className="flex min-h-12 flex-col">
          <span className="cursor-pointer text-wrap break-words font-semibold">
            {user.username}
          </span>
          <span className="cursor-pointer text-wrap break-words text-sm font-medium">
            {user.fullname}
          </span>
        </div>
      </Link>
      <button hidden>Follow</button>
    </li>
  );
}
