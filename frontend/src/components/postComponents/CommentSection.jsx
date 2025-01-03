import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function CommentSection({ postId, commentsOpen }) {
  const [comments, setComments] = useState(),
    [loading, setLoading] = useState(true);

  useEffect(() => {
    postId && getComments();
    async function getComments() {
      try {
        setLoading(true);
        const res = await fetch(`/api/v1/posts/${postId}/get-comments`, {
          method: "GET",
        });
        const data = await res.json();
        if (!res.ok || data.success === false) throw new Error(data.message);
        setComments(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }
  }, [postId]);

  return <>{JSON.stringify(comments)}</>;
}
