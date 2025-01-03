import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineSend } from "react-icons/ai";

export default function CommentInput({ postId }) {
  const [comment, setComment] = useState(""),
    [loading, setLoading] = useState(false);

  function handleCommentChange(e) {
    setComment(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  }

  async function handleCommentSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(`/api/v1/posts/${postId}/submit-comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Comment submitted");
      setComment("");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleCommentSubmit}
      className="flex w-full items-end gap-3 rounded-lg bg-gray-200 p-3"
    >
      <textarea
        onChange={handleCommentChange}
        placeholder="Write a comment..."
        value={comment}
        className="w-full resize-none bg-gray-200"
        required
      />
      <button disabled={loading} className="disabled:opacity-60">
        <AiOutlineSend size={20} />
      </button>
    </form>
  );
}
