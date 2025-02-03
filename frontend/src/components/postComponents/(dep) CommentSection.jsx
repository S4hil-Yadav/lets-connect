import { useGetCommentsQuery } from "@/lib/queries/comment.queries";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import Avatar from "react-avatar";
import CommentSkeleton from "../commentComponents/CommentSkeleton";
import { MdExpandLess } from "react-icons/md";
import TextWithExpand from "../TextWithExpand";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ImSpinner2 } from "react-icons/im";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdSave } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import {
  useDeleteCommentMutation,
  useEditCommentMutation,
} from "@/lib/mutations/post.mutations";

export default function CommentSection({ postId, setCommentsOpen }) {
  const queryClient = useQueryClient();

  const { data: comments, isFetching, isError } = useGetCommentsQuery(postId);

  useEffect(() => {
    comments &&
      queryClient.setQueryData(
        ["post", postId],
        (post) =>
          post && {
            ...post,
            comments: comments.map((comment) => comment._id),
          },
      );
  }, [comments, postId, queryClient]);

  if (isFetching) return <CommentSkeleton count={3} />;

  if (isError) return "Couldn't load comments";

  if (!comments?.length) return "No comments";

  return (
    <ul className="flex flex-col gap-5">
      {comments.map((comment) => (
        <CommentBody key={comment._id} postId={postId} comment={comment} />
      ))}
      {setCommentsOpen && (
        <MdExpandLess
          onClick={() => setCommentsOpen(false)}
          className="size-5 cursor-pointer self-center rounded-full"
        />
      )}
    </ul>
  );
}

function CommentBody({ postId, comment }) {
  const queryClient = useQueryClient(),
    authUser = queryClient.getQueryData(["authUser"]),
    { mutateAsync: handleEditComment, isPending: isPendingEditComment } =
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
          <div className="flex items-center gap-1">
            <Link to={"/profile/" + comment.commentor._id}>
              <span className="text-sm">{comment.commentor.fullname} </span>
              <span className="text-xs text-gray-700">
                @{comment.commentor.username}
              </span>
            </Link>
            {comment.edited && (
              <span
                onClick={(e) => e.preventDefault()}
                className="max-h-full text-xs text-gray-500"
              >
                (edited)
              </span>
            )}
          </div>
          {isPendingEditComment || isPendingDelete ? (
            <ImSpinner2 className="animate-spin text-violet-700" />
          ) : editComment ? (
            <div className="flex gap-1">
              <MdSave
                onClick={async () => {
                  if (editCommentRef.current.value !== comment.text)
                    await handleEditComment({
                      postId,
                      commentId: comment._id,
                      editedComment: editCommentRef.current.value,
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
            <DropdownMenu>
              <DropdownMenuTrigger>
                <BsThreeDotsVertical size={13} />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                side="left"
                className="min-w-40"
              >
                {authUser?._id === comment.commentor._id ? (
                  <>
                    <DropdownMenuItem
                      onClick={() => {
                        setEditComment(true);
                        setTimeout(() => {
                          editCommentRef.current.focus();
                          editCommentRef.current.style.height = "auto";
                          editCommentRef.current.style.height = `${editCommentRef.current.scrollHeight}px`;
                        });
                      }}
                    >
                      Edit Comment
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => e.preventDefault()}>
                      <AlertDialog>
                        <AlertDialogTrigger>Delete Comment</AlertDialogTrigger>
                        <AlertDialogContent className="w-[90%]">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-xl">
                              Delete?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-base text-gray-600">
                              Are you sure you want to delete this comment?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel asChild>
                              <button className="rounded-lg border-2 border-gray-500">
                                Cancel
                              </button>
                            </AlertDialogCancel>
                            <AlertDialogAction asChild>
                              <button
                                onClick={() =>
                                  handleDelete({
                                    commentId: comment._id,
                                    postId,
                                  })
                                }
                                className="rounded-lg bg-red-500 text-white hover:bg-red-400"
                              >
                                Delete
                              </button>
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem onClick={(e) => e.preventDefault()}>
                      Report user
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => e.preventDefault()}>
                      Block user
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        {editComment ? (
          <textarea
            ref={editCommentRef}
            defaultValue={comment.text}
            onChange={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            className="resize-none text-wrap break-words bg-transparent text-justify"
          />
        ) : (
          <TextWithExpand originalText={comment.text} minHeight={4.5} />
        )}
      </div>
    </li>
  );
}
