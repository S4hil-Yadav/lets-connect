import { useEffect, useState } from "react";
import Post from "../components/Post";
import toast from "react-hot-toast";

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    getPosts();
    async function getPosts() {
      try {
        const res = await fetch("/api/v1/posts/get-all-posts", {
          method: "GET",
        });
        res.ok && setPosts(await res.json());
      } catch (error) {
        toast.error(error.message);
      }
    }
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col items-center gap-5 bg-gray-50 px-0 py-10 md:px-10">
      {/* {posts.map((post, i) => (
        <Post key={i} post={post} />
      ))} */}
    </div>
  );
}
