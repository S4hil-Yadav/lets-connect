import { useSubmitCommentMutation } from "@/lib/mutations/post.mutations";
import { useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineSend } from "react-icons/ai";
import AuthAlertDialog from "../AuthAlertDialog";

export default function CommentInput({ postId }) {
  const queryClient = useQueryClient(),
    authUser = queryClient.getQueryData(["authUser"]);

  const [comment, setComment] = useState("");

  const { mutateAsync: commentSubmit, isPending } = useSubmitCommentMutation();

  const inputRef = useRef();

  function handleCommentChange(e) {
    setComment(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  }

  async function handleCommentSubmit(e) {
    e.preventDefault();
    try {
      await commentSubmit({ comment, postId });
      setComment("");
      inputRef.current.style.height = "3rem";
    } catch (err) {
      toast.error(err.response?.data.message || "Something went wrong");
    }
  }

  return (
    <form
      onSubmit={handleCommentSubmit}
      className="mb-7 flex w-full items-end gap-3 rounded-lg bg-gray-200 p-3"
    >
      <textarea
        ref={inputRef}
        onChange={handleCommentChange}
        placeholder="Write a comment..."
        value={comment}
        className="max-h-40 w-full resize-none bg-gray-200 scrollbar-thin"
        required
      />
      <button
        type={!authUser ? "button" : "submit"}
        disabled={isPending}
        className="group disabled:cursor-progress disabled:opacity-60"
      >
        {!authUser ? (
          <AuthAlertDialog>
            <AiOutlineSend size={20} />
          </AuthAlertDialog>
        ) : (
          <AiOutlineSend size={20} className="group-disabled:cursor-progress" />
        )}
      </button>
    </form>
  );
}
