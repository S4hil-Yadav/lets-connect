import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CommentSection from "./CommentSection";
import PostContent from "./PostContent";
import CommentInput from "./CommentInput";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

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
        className="max-h-[calc(90vh)] max-w-[calc(83vw)] overflow-y-auto scrollbar-none lg:max-w-[calc(80vw)]"
      >
        <DialogHeader className="hidden">
          <DialogTitle>Post</DialogTitle>
        </DialogHeader>

        <div className="flex w-full max-w-[calc(76vw)] flex-col lg:flex-row lg:gap-10">
          <div className="flex flex-col pr-3 lg:max-h-[calc(80vh)] lg:basis-7/12 lg:overflow-y-auto">
            <PostContent postId={postId} isModal={true} />
          </div>
          <div className="flex max-h-[calc(80vh)] flex-col lg:max-w-[40%] lg:basis-5/12">
            <span className="sticky top-0 w-full text-center text-2xl font-bold">
              Comments
              <hr className="mx-20 mb-6 mt-2 border-b-2" />
            </span>

            <div className="overflow-y-auto pr-3 text-justify">
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
