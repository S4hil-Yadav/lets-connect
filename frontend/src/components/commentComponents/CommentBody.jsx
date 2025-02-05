import {
  useDeleteCommentMutation,
  useEditCommentMutation,
} from "@/lib/mutations/post.mutations";
import { useRef, useState } from "react";
import Avatar from "react-avatar";
import { ImSpinner2 } from "react-icons/im";
import { MdSave } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { Link } from "react-router-dom";
import CommentDropdown from "./CommentDropdown";
import TextWithExpand from "../TextWithExpand";
import moment from "moment";

export default function CommentBody({ postId, comment }) {
  const { mutateAsync: handleEditComment, isPending: isPendingEditComment } =
      useEditCommentMutation(),
    { mutate: handleDelete, isPending: isPendingDelete } =
      useDeleteCommentMutation(),
    [editComment, setEditComment] = useState(false),
    editCommentRef = useRef(null);

  return (
    <li
      className={`flex w-full gap-2 border-b-2 pb-3 last-of-type:border-b-0 ${isPendingDelete && "opacity-60"}`}
    >
      <Link to={"/profile/" + comment.commentor._id}>
        <Avatar
          size="40"
          src={comment.commentor.profilePic}
          name={comment.commentor.fullname}
          round
        />
      </Link>
      <div className="flex w-[calc(100%-4rem)] flex-col break-words">
        <div className="flex items-center justify-between font-semibold">
          <div className="flex flex-wrap items-baseline">
            <Link
              to={"/profile/" + comment.commentor._id}
              className="flex flex-wrap items-baseline gap-1"
            >
              <span className="text-sm">
                {comment.commentor.fullname.replace(/ /g, "\u00A0")}
              </span>
              <span className="text-xs text-gray-700">
                @{comment.commentor.username}
              </span>
            </Link>
            {comment.edited && (
              <span
                onClick={(e) => e.preventDefault()}
                className="max-h-full text-xs text-gray-500"
              >
                &nbsp;(edited)
              </span>
            )}
            <div>
              <span className="text-sm">&nbsp;|&nbsp;</span>
              <span className="text-xs text-gray-800">
                {moment(comment.createdAt).fromNow()}
              </span>
            </div>
          </div>
          {isPendingEditComment || isPendingDelete ? (
            <ImSpinner2 className="animate-spin text-violet-700" />
          ) : editComment ? (
            <div className="flex gap-1">
              <MdSave
                onClick={async () => {
                  const editedComment = editCommentRef.current.value.trim();
                  if (editedComment !== comment.text && editedComment)
                    await handleEditComment({
                      postId,
                      commentId: comment._id,
                      editedComment: editedComment,
                    });
                  setEditComment(false);
                }}
                className="cursor-pointer text-violet-700 hover:text-violet-500"
              />
              <RxCross2
                onClick={() => setEditComment(false)}
                className="cursor-pointer text-red-700 hover:text-red-500"
              />
            </div>
          ) : (
            <CommentDropdown
              comment={comment}
              setEditComment={setEditComment}
              editCommentRef={editCommentRef}
              postId={postId}
              handleDelete={handleDelete}
            />
          )}
        </div>
        {editComment ? (
          <textarea
            ref={editCommentRef}
            defaultValue={comment.text}
            className="resize-none text-wrap break-words bg-transparent text-justify text-sm"
          />
        ) : (
          <TextWithExpand originalText={comment.text} minHeight={4.5} />
        )}
      </div>
    </li>
  );
}
