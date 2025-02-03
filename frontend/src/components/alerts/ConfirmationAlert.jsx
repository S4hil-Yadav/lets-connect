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

export default function ConfirmationAlert({ type, receiver, onConfirm }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        className={`h-full flex-1 rounded-lg bg-violet-400 capitalize hover:bg-violet-300 ${type === "unfollow" && "w-20"}`}
      >
        {type}
      </AlertDialogTrigger>
      <AlertDialogContent className="w-[90%]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">Remove?</AlertDialogTitle>
          <AlertDialogDescription className="text-base text-gray-600">
            Are you sure you want to {type} {receiver.fullname}
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
              className="rounded-lg bg-red-500 capitalize text-white hover:bg-red-400"
            >
              {type}
            </button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
