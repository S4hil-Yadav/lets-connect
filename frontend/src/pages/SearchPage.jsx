import { SearchInput } from "@/components/Input";
import Post from "@/components/Post";
import { useSearchPostsQuery } from "@/lib/queries/post.queries";
import { useSearchUsersQuery } from "@/lib/queries/user.queries";
import { useRef, useState } from "react";
import Avatar from "react-avatar";
import { ImSpinner2 } from "react-icons/im";
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
      <hr className="mt-3 h-[2px] w-full bg-gray-400" />
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
      <div className="w-full">
        {type === "users" ? (
          isFetchingUsers ? (
            <ImSpinner2 className="mt-5 size-7 w-full animate-spin text-violet-700" />
          ) : isErrorUsers ? (
            "error users"
          ) : text !== "" && !users.length ? (
            "No users found"
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
            "error posts"
          ) : text !== "" && !posts.length ? (
            "No posts found"
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
      className="flex w-full items-center justify-between gap-2 overflow-clip rounded-lg border-b border-dashed border-slate-400 px-2 py-2 last:border-none hover:bg-gray-200"
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
