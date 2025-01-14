import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

export function useHandleFollowerRequestMutation() {
  const queryClient = useQueryClient();
  const authUser = queryClient.getQueryData(["authUser"]);

  const [action, setAction] = useState();

  const mutation = useMutation({
    onMutate: ({ action }) => setAction(action),

    mutationFn: ({ action, reqId }) =>
      (action === "accept" ? axios.post : axios.delete)(
        `/api/v1/follow/${action}-follow-request/` + reqId,
      ),

    onSuccess: (_data, { action, sender, reqId }) => {
      queryClient.setQueryData(["follower-requests"], (reqs) =>
        reqs?.filter((req) => req._id !== reqId),
      );
      if (action === "accept")
        queryClient.setQueryData(
          ["followers", authUser._id],
          (followers) => followers && [...followers, sender],
        );
    },

    onError: (err) =>
      toast.error(err.response?.data.message || "Something went wrong"),
  });

  mutation.isAccepting = mutation.isPending && action === "accept";
  mutation.isRejecting = mutation.isPending && action === "reject";

  return mutation;
}

export function useHandleFollowingMutation() {
  const queryClient = useQueryClient(),
    authUser = queryClient.getQueryData(["authUser"]);

  return useMutation({
    mutationFn: ({ action, receiver, reqId }) =>
      action === "send"
        ? axios
            .post("/api/v1/follow/send-follow-request/" + receiver._id)
            .then((res) => res.data)
        : action === "cancel"
          ? axios.delete("/api/v1/follow/cancel-follow-request/" + reqId)
          : axios.delete("/api/v1/follow/unfollow/" + receiver._id),

    onSuccess: ({ reqId }, { action, receiver, reqId: reqIdCancel }) => {
      action === "unfollow"
        ? queryClient.setQueryData(
            ["followings", authUser?._id],
            (followings) =>
              followings?.filter((following) => following._id !== receiver._id),
          )
        : queryClient.setQueryData(["following-requests"], (reqs) =>
            reqs && action === "send"
              ? [...reqs, { _id: reqId, receiver }]
              : reqs?.filter((req) => req._id !== reqIdCancel),
          );
    },

    onError: (err) =>
      toast.error(err.response?.data.message || "Something went wrong"),
  });
}

export function useRemoveFollowerMutation() {
  const queryClient = useQueryClient(),
    { _id: authUserId } = queryClient.getQueryData(["authUser"]) || {};

  return useMutation({
    mutationFn: (followerId) =>
      axios.delete("/api/v1/follow/remove-follower/" + followerId),
    onSuccess: (_data, followerId) =>
      queryClient.setQueryData(["followers", authUserId], (followers) =>
        followers?.filter((follower) => follower._id !== followerId),
      ),
    onError: (err) =>
      toast.error(err.response?.data.message || "Something went wrong"),
  });
}
