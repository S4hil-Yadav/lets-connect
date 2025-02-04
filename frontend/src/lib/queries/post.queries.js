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
  const queryClient = useQueryClient(),
    authUser = queryClient.getQueryData(["authUser"]);

  return useQuery({
    queryKey: ["posts", authUser?._id],
    queryFn: () =>
      axios.get("/api/v1/posts/get-all-posts").then((res) => res.data),
  });
}

export function useGetPostQuery(postId) {
  return useQuery({
    queryKey: ["post", postId],
    queryFn: () =>
      axios.get(`/api/v1/posts/${postId}/get-post`).then((res) => res.data),
    retry: (_count, error) => error.response?.status === 500,
  });
}

export function useGetSavedPostsQuery() {
  const queryClient = useQueryClient(),
    authUser = queryClient.getQueryData(["authUser"]);

  return useQuery({
    queryKey: ["saved-posts", authUser?._id],
    queryFn: () =>
      axios.get("/api/v1/posts/get-saved-posts").then((res) => res.data),
    enabled: !!authUser,
  });
}

export function useGetLikedPostsQuery() {
  const queryClient = useQueryClient();
  const authUser = queryClient.getQueryData(["authUser"]);

  return useQuery({
    queryKey: ["liked-posts", authUser?._id],
    queryFn: () =>
      axios.get("/api/v1/posts/get-liked-posts").then((res) => res.data),
    enabled: !!authUser,
  });
}

export function useGetDislikedPostsQQuery() {
  const queryClient = useQueryClient();
  const authUser = queryClient.getQueryData(["authUser"]);

  return useQuery({
    queryKey: ["disliked-posts", authUser?._id],
    queryFn: () =>
      axios.get("/api/v1/posts/get-disliked-posts").then((res) => res.data),
    enabled: !!authUser,
  });
}
