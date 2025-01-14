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

export function UnfollowConfirmationDialog({ receiver, onConfirm }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger>Unfollow</AlertDialogTrigger>
      <AlertDialogContent className="w-[90%]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">Unfollow?</AlertDialogTitle>
          <AlertDialogDescription className="text-base text-gray-600">
            Are you sure you want to unfollow {receiver.fullname}
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
              onClick={onConfirm}
              className="rounded-lg bg-red-500 text-white hover:bg-red-400"
            >
              Unfollow
            </button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function RemoveConfirmationDialog({ receiver, onConfirm }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger>Remove</AlertDialogTrigger>
      <AlertDialogContent className="w-[90%]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">Remove?</AlertDialogTitle>
          <AlertDialogDescription className="text-base text-gray-600">
            Are you sure you want to remove {receiver.fullname}
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
              onClick={onConfirm}
              className="rounded-lg bg-red-500 text-white hover:bg-red-400"
            >
              Remove
            </button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
