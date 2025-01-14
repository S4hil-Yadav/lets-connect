import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useSearchUsersQuery(text) {
  return useQuery({
    queryKey: ["search-users", text?.toLowerCase()],
    queryFn: () =>
      axios
        .get("/api/v1/users/search-users?search=" + text)
        .then((res) => res.data),
    initialData: [],
    staleTime: 0,
    enabled: !!text,
  });
}

export function useGetUserQuery(userId) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () =>
      axios.get("/api/v1/users/get-user/" + userId).then((res) => res.data),
  });
}

export function useGetFollowerRequestsQuery() {
  return useQuery({
    queryKey: ["follower-requests"],
    queryFn: () =>
      axios.get("/api/v1/follow/get-follower-requests").then((res) => res.data),
    staleTime: 15 * 1000,
  });
}

export function useGetFollowingRequestsQuery() {
  return useQuery({
    queryKey: ["following-requests"],
    queryFn: () =>
      axios
        .get("/api/v1/follow/get-following-requests")
        .then((res) => res.data),
  });
}

export function useGetFollowingRequestMapQuery() {
  const queryClient = useQueryClient();
  const authUser = queryClient.getQueryData(["authUser"]);

  return useQuery({
    queryKey: ["following-requests"],
    queryFn: () =>
      axios
        .get("/api/v1/follow/get-following-requests")
        .then((res) => res.data),
    select: (data) =>
      data.reduce((map, req) => {
        map[req.receiver._id] = req._id;
        return map;
      }, {}),
    enabled: !!authUser,
  });
}

export function useGetFollowersQuery(userId) {
  const queryClient = useQueryClient();
  const authUser = queryClient.getQueryData(["authUser"]);

  return useQuery({
    queryKey: ["followers", userId],
    queryFn: () =>
      axios
        .get("/api/v1/users/get-followers/" + userId)
        .then((res) => res.data),
    staleTime: userId === authUser?._id ? 0 : 5 * 60 * 1000,
    enabled: !!userId,
  });
}

export function useGetFollowerSetQuery(userId) {
  return useQuery({
    queryKey: ["followers", userId],
    queryFn: () =>
      axios
        .get("/api/v1/users/get-followers/" + userId)
        .then((res) => res.data),
    select: (data) => new Set(data.map((follower) => follower._id)),
    enabled: !!userId,
  });
}

export function useGetFollowingsQuery(userId) {
  const queryClient = useQueryClient();
  const authUser = queryClient.getQueryData(["authUser"]);

  return useQuery({
    queryKey: ["followings", userId],
    queryFn: () =>
      axios
        .get("/api/v1/users/get-followings/" + userId)
        .then((res) => res.data),
    staleTime: userId === authUser?._id ? 0 : 5 * 60 * 1000,
    enabled: !!userId,
  });
}

export function useGetFollowingSetQuery() {
  const queryClient = useQueryClient();
  const authUser = queryClient.getQueryData(["authUser"]);

  return useQuery({
    queryKey: ["followings", authUser?._id],
    queryFn: () =>
      axios
        .get("/api/v1/users/get-followings/" + authUser._id)
        .then((res) => res.data),
    select: (data) => new Set(data.map((following) => following._id)),
    enabled: !!authUser,
  });
}
