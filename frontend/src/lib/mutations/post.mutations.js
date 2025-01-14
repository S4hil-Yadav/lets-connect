import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

export function useLikePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId) => axios.patch(`/api/v1/posts/${postId}/like-post`),

    onSuccess: (_data, postId) => {
      const authUser = queryClient.getQueryData(["authUser"]);
      const post = queryClient.getQueryData(["post", postId]);

      if (post.likers.includes(authUser._id)) return;

      queryClient.setQueryData(
        ["liked-posts", authUser._id],
        (likedPosts) => likedPosts && [...likedPosts, postId],
      );
      queryClient.setQueryData(["disliked-posts"], (dislikedPosts) =>
        dislikedPosts?.filter((dislikedPostId) => dislikedPostId !== postId),
      );
      queryClient.setQueryData(["post", postId], (post) => ({
        ...post,
        likers: [...post.likers, authUser._id],
        dislikers: post.dislikers.filter(
          (dislikerId) => dislikerId !== authUser._id,
        ),
      }));
    },
    onError: (err) => {
      if (err.response?.status !== 409)
        toast.error(err.response?.data.message || "Something went wrong");
    },
  });
}

export function useUnlikePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId) => axios.delete(`/api/v1/posts/${postId}/unlike-post`),

    onSuccess: (_data, postId) => {
      const authUser = queryClient.getQueryData(["authUser"]);

      queryClient.setQueryData(["liked-posts"], (likedPosts) =>
        likedPosts?.filter((likedPostId) => likedPostId !== postId),
      );
      queryClient.setQueryData(["post", postId], (post) => ({
        ...post,
        likers: post.likers.filter((likerId) => likerId !== authUser._id),
      }));
    },

    onError: (err) => {
      if (err.response?.status !== 409)
        toast.error(err.response?.data.message || "Something went wrong");
    },
  });
}

export function useDislikePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId) => axios.patch(`/api/v1/posts/${postId}/dislike-post`),

    onSuccess: (_data, postId) => {
      const authUser = queryClient.getQueryData(["authUser"]);
      const post = queryClient.getQueryData(["post", postId]);

      if (post.dislikers.includes(authUser._id)) return;

      queryClient.setQueryData(
        ["disliked-posts"],
        (dislikedPosts) => dislikedPosts && [...dislikedPosts, postId],
      );
      queryClient.setQueryData(["liked-posts", authUser._id], (likedPosts) =>
        likedPosts?.filter((likedPostId) => likedPostId !== postId),
      );
      queryClient.setQueryData(["post", postId], (post) => ({
        ...post,
        likers: post.likers.filter((likerId) => likerId !== authUser._id),
        dislikers: [...post.dislikers, authUser._id],
      }));
    },

    onError: (err) => {
      if (err.response?.status !== 409)
        toast.error(err.response?.data.message || "Something went wrong");
    },
  });
}

export function useUndislikePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId) =>
      axios.delete(`/api/v1/posts/${postId}/undislike-post`),

    onSuccess: (_data, postId) => {
      const authUser = queryClient.getQueryData(["authUser"]);

      queryClient.setQueryData(["disliked-posts"], (dislikedPosts) =>
        dislikedPosts?.filter((dislikedPostId) => dislikedPostId !== postId),
      );
      queryClient.setQueryData(["post", postId], (post) => ({
        ...post,
        dislikers: post.dislikers.filter(
          (disliker) => disliker !== authUser._id,
        ),
      }));
    },

    onError: (err) => {
      if (err.response?.status !== 409)
        toast.error(err.response?.data.message || "Something went wrong");
    },
  });
}

export function useSubmitCommentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ comment, postId }) =>
      axios
        .post(`/api/v1/posts/${postId}/submit-comment`, { comment })
        .then((res) => res.data),

    onSuccess: (newComment, { postId }) => {
      const { _id, username, fullname, profilePic } = queryClient.getQueryData([
        "authUser",
      ]);
      newComment.commentor = { _id, username, fullname, profilePic };

      queryClient.setQueryData(
        ["post", postId],
        (post) =>
          post && {
            ...post,
            comments: [newComment._id, ...post.comments],
          },
      );
      queryClient.setQueryData(
        ["post", postId, "comments"],
        (comments) => comments && [newComment, ...comments],
      );
    },

    // onError: (err) => {
    //   toast.error(err.response?.data.message || "Something went wrong");
    // },

    // throwOnError: true,
  });
}
