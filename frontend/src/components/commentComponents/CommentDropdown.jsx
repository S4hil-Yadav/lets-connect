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
import { useQueryClient } from "@tanstack/react-query";
import { BsThreeDotsVertical } from "react-icons/bs";

export default function CommentDropdown({
  comment,
  setEditComment,
  editCommentRef,
  postId,
  handleDelete,
}) {
  const queryClient = useQueryClient(),
    authUser = queryClient.getQueryData(["authUser"]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <BsThreeDotsVertical size={13} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="left" className="min-w-40">
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
  );
}
