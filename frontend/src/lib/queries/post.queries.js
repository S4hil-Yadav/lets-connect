import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useSearchPostsQuery(text) {
  return useQuery({
    queryKey: ["search-posts", text?.toLowerCase()],
    queryFn: () =>
      axios
        .get("/api/v1/posts/search-posts?search=" + text)
        .then((res) => res.data),
    initialData: [],
    staleTime: 0,
    enabled: !!text,
  });
}

export function useGetPostsQuery() {
  return useQuery({
    queryKey: ["posts"],
    queryFn: () =>
      axios.get("/api/v1/posts/get-all-posts").then((res) => res.data),
  });
}

export function useGetPostQuery(postId) {
  return useQuery({
    queryKey: ["post", postId],
    queryFn: () =>
      axios.get(`/api/v1/posts/${postId}/get-post`).then((res) => res.data),
    retry: (_count, error) => error.response?.status !== 404,
  });
}

export function useGetLikedPostSet() {
  const queryClient = useQueryClient();
  const authUser = queryClient.getQueryData(["authUser"]);

  return useQuery({
    queryKey: ["liked-posts", authUser._id],
    queryFn: () =>
      axios
        .get("/api/v1/posts/get-liked-posts/" + authUser._id)
        .then((res) => res.data),
    select: (likedPosts) => new Set(likedPosts),
    enabled: !!authUser,
  });
}

export function useGetDislikedPostSet() {
  const queryClient = useQueryClient();
  const authUser = queryClient.getQueryData(["authUser"]);

  return useQuery({
    queryKey: ["disliked-posts"],
    queryFn: () =>
      axios.get("/api/v1/posts/get-disliked-posts").then((res) => res.data),
    select: (dislikedPosts) => new Set(dislikedPosts),
    enabled: !!authUser,
  });
}
