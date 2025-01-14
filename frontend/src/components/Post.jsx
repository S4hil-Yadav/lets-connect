import { useState } from "react";
import CommentSection from "./postComponents/CommentSection";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import PostContent from "./postComponents/PostContent";

export default function Post({ postId }) {
  const [commentsOpen, setCommentsOpen] = useState(false);

  return (
    <li className="flex w-full flex-col border-t-2 border-gray-300 px-3 pt-4 first-of-type:border-t-0 md:max-w-lg">
      <PostContent postId={postId} setCommentsOpen={setCommentsOpen} />

      <Collapsible open={commentsOpen}>
        <CollapsibleContent className="CollapsibleContent">
          <CommentSection postId={postId} setCommentsOpen={setCommentsOpen} />
        </CollapsibleContent>
      </Collapsible>
    </li>
  );
}
