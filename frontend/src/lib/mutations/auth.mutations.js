import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

export function useUpdateUserMutation() {
  const queryClient = useQueryClient();
  const authUser = queryClient.getQueryData(["authUser"]);

  const mutation = useMutation({
    mutationFn: (data) => axios.put("/api/v1/auth/update-user", data),

    onSuccess: (_resData, data) => {
      queryClient.invalidateQueries("user", authUser._id);
      queryClient.setQueryData(["authUser"], (authUser) => ({
        ...authUser,
        ...data,
      }));

      toast.success("Profile updated successfully");
    },

    onError: (err) =>
      toast.error(err.response?.data.message || "Something went wrong"),
  });

  return mutation;
}
