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
      queryClient.setQueryData(["follower-requests", authUser._id], (reqs) =>
        reqs?.filter((req) => req._id !== reqId),
      );
      if (action === "accept")
        queryClient.setQueryData(
          ["followers", authUser._id],
          (followers) => followers && [...followers, sender],
        );
    },
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
      if (action === "unfollow") {
        queryClient.setQueryData(["followings", authUser._id], (followings) =>
          followings?.filter((following) => following._id !== receiver._id),
        );
        queryClient.setQueryData(["followers", receiver._id], (followers) =>
          followers?.filter((follower) => follower._id !== authUser._id),
        );
      } else {
        queryClient.setQueryData(
          ["following-requests", authUser._id],
          (reqs) =>
            reqs && action === "send"
              ? [...reqs, { _id: reqId, receiver }]
              : reqs?.filter((req) => req._id !== reqIdCancel),
        );
      }
    },

    onError: async (err, { receiver }) => {
      toast.error(err.response?.data.message || "Something went wrong");
      await queryClient.invalidateQueries({
        queryKey: ["following-requests", authUser?._id],
      });
      await queryClient.invalidateQueries({
        queryKey: ["followings", authUser?._id],
      });
      await queryClient.invalidateQueries({
        queryKey: ["followers", receiver._id],
      });
    },
  });
}

export function useRemoveFollowerMutation() {
  const queryClient = useQueryClient(),
    authUser = queryClient.getQueryData(["authUser"]);

  return useMutation({
    mutationFn: (followerId) =>
      axios.delete("/api/v1/follow/remove-follower/" + followerId),
    onSuccess: (_data, followerId) =>
      queryClient.setQueryData(["followers", authUser._id], (followers) =>
        followers?.filter((follower) => follower._id !== followerId),
      ),
    onError: (err, followerId) => {
      if (err.response?.status === 404)
        queryClient.setQueryData(["followers", authUser._id], (followers) =>
          followers?.filter((follower) => follower._id !== followerId),
        );
      else toast.error(err.response?.data.message || "Something went wrong");
    },
  });
}
