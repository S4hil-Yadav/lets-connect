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
import { useNavigate } from "react-router-dom";

export default function AuthAlertDialog({ children }) {
  const navigate = useNavigate();

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
            <button className="rounded-lg border-2 border-gray-500 border-opacity-40 hover:text-red-800">
              Cancel
            </button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <button
              onClick={() => navigate("/signup")}
              className="rounded-lg bg-violet-500 text-white"
            >
              Signup
            </button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
