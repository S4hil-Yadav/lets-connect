import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useGetCommentsByIdsQuery(postId) {
  return useQuery({
    queryKey: ["post", postId, "comments"],
    queryFn: () =>
      axios.get(`/api/v1/posts/${postId}/get-comments`).then((res) => res.data),
  });
}
