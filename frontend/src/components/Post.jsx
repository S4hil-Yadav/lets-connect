import { useState } from "react";
import PostHeader from "./postComponents/PostHeader";
import PostBody from "./postComponents/PostBody";
import PostFooter from "./postComponents/PostFooter";
import CommentInput from "./postComponents/CommentInput";
import CommentSection from "./postComponents/CommentSection";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";

export default function Post({ post }) {
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [openedOnce, setOpenedOnce] = useState(false);

  return (
    <div className="flex w-full flex-col border-t-2 border-gray-300 px-6 pb-10 pt-4 hover:bg-gray-100 md:max-w-lg">
      <PostHeader publisher={post.publisher} />

      <PostBody title={post.title} body={post.body} images={post.images} />

      <PostFooter postId={post._id} setCommentsOpen={setCommentsOpen} />

      <CommentInput postId={post._id} />

      <Collapsible open={commentsOpen}>
        <CollapsibleContent className="CollapsibleContent">
          <CommentSection postId={post._id} commentsOpen={commentsOpen} />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
