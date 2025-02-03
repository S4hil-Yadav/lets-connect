import { clearDraft } from "@/redux/draft/draftSlice";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export function useSignupMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userFields) => axios.post("/api/v1/auth/signup", userFields),
    onSuccess: () => {
      toast.success("Signup successful");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (err) =>
      toast.error(err.response.data.message || "Something went wrong"),
  });
}
export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userFields) => axios.post("/api/v1/auth/login", userFields),
    onSuccess: () => {
      toast.success("Login successful");
      queryClient.invalidateQueries(["authUser"]);
    },
    onError: (err) =>
      toast.error(err.response.data.message || "Something went wrong"),
  });
}

export function useUpdateUserMutation() {
  const queryClient = useQueryClient();
  const authUser = queryClient.getQueryData(["authUser"]);

  return useMutation({
    mutationFn: (data) => axios.put("/api/v1/auth/update-user", data),

    onSuccess: (_resData, data) => {
      queryClient.invalidateQueries("user", authUser._id);
      queryClient.setQueryData(["authUser"], (authUser) => ({
        ...authUser,
        ...data,
      }));

      toast.success("Profile updated");
    },

    onError: (err) =>
      toast.error(err.response?.data.message || "Something went wrong"),
  });
}

export function useUpdateUserBioMutation() {
  const queryClient = useQueryClient();
  const authUser = queryClient.getQueryData(["authUser"]);

  return useMutation({
    mutationFn: (bio) => axios.put("/api/v1/auth/update-user-bio", { bio }),

    onSuccess: (_resData, bio) => {
      queryClient.setQueryData(
        ["user", authUser._id],
        (user) => user && { ...user, bio },
      );

      toast.success("Profile updated");
    },

    onError: (err) =>
      toast.error(err.response?.data.message || "Something went wrong"),
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient(),
    dispatch = useDispatch(),
    navigate = useNavigate();

  return useMutation({
    mutationFn: () => axios.post("/api/v1/auth/logout"),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["authUser"],
      });
      toast.success("Logged out");
      dispatch(clearDraft());
      navigate("/login");
    },
  });
}
