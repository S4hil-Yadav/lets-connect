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
import { useLogoutMutation } from "@/lib/mutations/auth.mutations";
import { MdLogout } from "react-icons/md";
import { Link } from "react-router-dom";

export default function AuthAlert({ children }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle asChild>
            <h1 className="text-xl">Signup?</h1>
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <p className="text-base text-black">
              You must signup to use this feature
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <button className="rounded-lg border-2 border-gray-500 border-opacity-40">
              Cancel
            </button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Link
              to="/signup"
              className="rounded-lg bg-violet-500 text-white hover:bg-violet-400"
            >
              Signup
            </Link>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function LogOutAlert() {
  const { mutate: logout, isPending } = useLogoutMutation();

  return (
    <AlertDialog>
      {isPending ? (
        <MdLogout className="cursor-progress text-gray-600" size={25} />
      ) : (
        <AlertDialogTrigger className="flex w-full items-center gap-2">
          <MdLogout size={15} className="text-red-700" />
          <span>Logout</span>
        </AlertDialogTrigger>
      )}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle asChild>
            <h1 className="text-xl">Logout?</h1>
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <p className="text-base text-black">
              Are you sure you want to logout?
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <button className="rounded-lg border-2 border-gray-500 border-opacity-40">
              Cancel
            </button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <button
              onClick={logout}
              disabled={isPending}
              className="rounded-lg bg-red-500 text-white hover:bg-red-400"
            >
              Logout
            </button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
