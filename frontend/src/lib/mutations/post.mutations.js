import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

export function useCreatePostMutation() {
  return useMutation({
    mutationFn: (post) => axios.put("/api/v1/posts/create-post", post),
    onSuccess: () => toast.success("Posted"),
    onError: (err) =>
      toast.error(err.response.data.message || "Something went wrong"),
  });
}

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
      queryClient.setQueryData(
        ["post", postId],
        (post) =>
          post && {
            ...post,
            dislikers: post.dislikers.filter(
              (disliker) => disliker !== authUser._id,
            ),
          },
      );
    },

    onError: (err) => {
      if (err.response?.status !== 409)
        toast.error(err.response?.data.message || "Something went wrong");
    },
  });
}

export function useSavePostMutation() {
  const queryClient = useQueryClient(),
    authUser = queryClient.getQueryData(["authUser"]);

  return useMutation({
    mutationFn: (postId) => axios.post(`/api/v1/posts/${postId}/save-post`),
    onSuccess: (_data, postId) => {
      queryClient.setQueryData(
        ["saved-posts", authUser?._id],
        (prev) => prev && [postId, ...prev],
      );
    },
  });
}

export function useUnsavePostMutation() {
  const queryClient = useQueryClient(),
    authUser = queryClient.getQueryData(["authUser"]);

  return useMutation({
    mutationFn: (postId) => axios.delete(`/api/v1/posts/${postId}/unsave-post`),
    onSuccess: (_data, postId) => {
      queryClient.setQueryData(["saved-posts", authUser?._id], (prev) =>
        prev?.filter((savedPostId) => savedPostId !== postId),
      );
    },
  });
}

export function useDeletePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId }) =>
      axios.delete(`/api/v1/posts/${postId}/delete-post`),
    onSuccess: (_data, { postId, publisherId }) => {
      queryClient.setQueryData(
        ["user", publisherId],
        (prev) =>
          prev && {
            ...prev,
            posts: prev.posts.filter((post) => post !== postId),
          },
      );
      queryClient.setQueryData(["post", postId], () => ({ deleted: true }));
      toast.success("Post deleted");
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
  });
}

export function useEditCommentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, editedComment }) =>
      axios.patch("/api/v1/posts/edit-comment/" + commentId, {
        editedComment,
      }),
    onSuccess: (_data, { postId, commentId, editedComment }) => {
      queryClient.setQueryData(["post", postId, "comments"], (comments) =>
        comments?.map((comment) =>
          comment._id === commentId
            ? { ...comment, text: editedComment, edited: true }
            : comment,
        ),
      );
    },
    onError: (err) =>
      toast.error(err.response?.data.message || "Something went wrong"),
  });
}

export function useDeleteCommentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, postId }) =>
      axios.delete(`/api/v1/posts/${postId}/delete-comment/` + commentId),

    onSuccess: (_data, { commentId, postId }) => {
      queryClient.setQueryData(["post", postId, "comments"], (comments) =>
        comments.filter((comment) => comment._id !== commentId),
      );
    },

    onError: (err) => {
      toast.error(err.response?.data.message || "Something went wrong");
    },
  });
}
