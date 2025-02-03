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
import { useDeletePostMutation } from "@/lib/mutations/post.mutations";

export default function DeletePostAlert({ postId, publisherId }) {
  const { mutate: handleDeletePost, isPending } = useDeletePostMutation();

  return (
    <AlertDialog>
      <AlertDialogTrigger>Delete Post</AlertDialogTrigger>
      <AlertDialogContent className="w-[90%]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">Delete?</AlertDialogTitle>
          <AlertDialogDescription className="text-base text-gray-600">
            Are you sure you want to delete this post
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
              onClick={() => handleDeletePost({ postId, publisherId })}
              disabled={isPending}
              className="rounded-lg bg-red-500 capitalize text-white hover:bg-red-400"
            >
              Delete
            </button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
