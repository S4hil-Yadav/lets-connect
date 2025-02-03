import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CommentInput from "./CommentInput";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import CommentSection from "../commentComponents/CommentSection";
import Post from "../Post";

export default function PostModal() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { postId } = useParams();

  useEffect(() => {
    queryClient.refetchQueries({ queryKey: ["post", postId] });
  }, [postId, queryClient]);

  return (
    <Dialog
      defaultOpen
      onOpenChange={() =>
        navigate(location.state?.backgroundLocation.pathname || "/home")
      }
    >
      <DialogContent
        aria-describedby={undefined}
        className="max-w-screen max-h-screen overflow-y-auto scrollbar-none md:max-h-[calc(90vh)] md:max-w-[calc(83vw)] lg:max-w-[calc(80vw)]"
      >
        <DialogHeader className="hidden">
          <DialogTitle>Post</DialogTitle>
        </DialogHeader>

        <div className="flex w-full flex-col md:max-w-[calc(76vw)] lg:flex-row lg:gap-10">
          <div className="flex flex-col pr-3 lg:max-h-[calc(80vh)] lg:basis-7/12 lg:overflow-y-auto">
            <Post postId={postId} isModal={true} />
          </div>
          <div className="flex max-h-[calc(80vh)] flex-col lg:max-w-[40%] lg:basis-5/12">
            <span className="sticky top-0 w-full text-center text-2xl font-bold">
              Comments
              <hr className="mx-20 mb-6 mt-2 border-b-2" />
            </span>

            <div className="flex h-full flex-col overflow-y-auto pr-3 text-justify">
              <CommentSection postId={postId} />
            </div>
            <div className="-mb-6 mt-5">
              <CommentInput postId={postId} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
